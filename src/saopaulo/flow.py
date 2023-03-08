import numpy as np
import geopandas as gpd
from shapely.geometry import Point
import folium
import math
from collections import namedtuple
import pandas as pd
import shapely.wkt
from bikescience.grid import Grid
from bikescience.arrow import draw_arrow
from bikescience.stations import draw_stations


# Cache variables
last_grid = None
last_stations = None
grid_and_stations = None


def merge_grid_and_stations(grid, stations):
    """
    ** Internal use function **
    
    Performs a spatial join between grid and stations GeoDataFrames. 
    Result is cached in flow.grid_and_stations module variable and reused for subsequent calls for the same grid and stations
    objects.
    Parameters:
      grid - A bikescience.grid.Grid or geopandas.GeoDataFrame object.
             If Grid, GeoDataframe is obtained from some_grid.geodataframe() method call.
      stations - a stations list with their location points. Obtained from stations.from_trips(trips) function call.
    """
    global last_grid, last_stations, grid_and_stations
    if grid_and_stations is None or grid is not last_grid or stations is not last_stations:
        if grid.__class__ == Grid: grid = grid.geodataframe()
        grid_and_stations = gpd.sjoin(grid, stations, op='contains')
        grid_and_stations.rename(columns={'index_right': 'station id'}, inplace=True)
        last_grid = grid
        last_stations = stations


def normalize(group):
    """
    ** Internal use function **
    
    Normalizes numerical data between 0 and 1, but avoiding zero value for mathematical reasons (minimum is transformed to 1e-10).
    """
    return np.interp(group, (group.min(), group.max()), (1e-10, 1))


def merge_trips_and_cells(trips, grid, stations, cell_identifier, cell_start_ids, cell_end_ids,
                          station_index='station id', start_station_index='start station id', end_station_index='end station id'):
    # caching for multiple calls on the same datasets
    merge_grid_and_stations(grid, stations)
    
    # total count per (origin, destination) pair of stations 
#    od_station_counts = trips.groupby([start_station_index, end_station_index], as_index=False) \
#                                     .agg({'ID_ORDEM_O': 'count'})
    od_station_counts = trips.groupby([start_station_index, end_station_index], as_index=False) \
                                     .agg({'trip counts': 'sum'})
    
    # origin cells, given the stations
#    with_origin_cells = od_station_counts.merge(grid_and_stations, left_on=start_station_index, right_on=station_index) \
#                        [cell_identifier + ['ID_ORDEM_O', start_station_index, end_station_index, 'lat', 'lon']]
    with_origin_cells = od_station_counts.merge(grid_and_stations, left_on=start_station_index, right_on=station_index) \
                        [cell_identifier + ['trip counts', start_station_index, end_station_index, 'lat', 'lon']]
    with_origin_cells.columns = cell_start_ids + ['trip counts', start_station_index, end_station_index,
                                 'start_lat', 'start_lon']

    # destination cells, given the stations
    with_od_cells = with_origin_cells.merge(grid_and_stations, left_on=end_station_index, right_on=station_index) \
                      [cell_start_ids + cell_identifier + [start_station_index, end_station_index, 'trip counts',
                        'start_lat', 'start_lon', 'lat', 'lon']]
    with_od_cells.columns = cell_start_ids + cell_end_ids + [start_station_index, end_station_index, 
                             'trip counts', 'start_lat', 'start_lon', 'end_lat', 'end_lon']
    
    return with_od_cells

    
def weighted_counts(with_od_cells, cell_identifier):
    # normalizing trip counts as weights between 0 and 1
    per_od_cells = with_od_cells.groupby(cell_identifier)
    normalized = with_od_cells
    normalized['normalized_counts'] = per_od_cells['trip counts'].transform(normalize)
    
    # ponderate coordinates by normalized weights
    normalized['start_lat'] = normalized['start_lat'] * normalized['normalized_counts']
    normalized['start_lon'] = normalized['start_lon'] * normalized['normalized_counts']
    normalized['end_lat'] = normalized['end_lat'] * normalized['normalized_counts']
    normalized['end_lon'] = normalized['end_lon'] * normalized['normalized_counts']
    
    # totals per (origin, destination) pair of grid cells 
    od_counts = normalized.groupby(cell_identifier, as_index=False) \
                          .agg({'trip counts': 'sum', 'normalized_counts': 'sum',
                                'start_lat': 'sum', 'start_lon': 'sum',
                                'end_lat': 'sum', 'end_lon': 'sum'})
    # center of mass
    od_counts['origin'] = od_counts.apply(
            lambda row: Point(row['start_lon'] / row['normalized_counts'], 
                              row['start_lat'] / row['normalized_counts']),
            axis=1)
    od_counts['destination'] = od_counts.apply(
            lambda row: Point(row['end_lon'] / row['normalized_counts'], 
                              row['end_lat'] / row['normalized_counts']),
            axis=1)
    
    od_counts = od_counts[cell_identifier + ['trip counts', 'origin', 'destination']]
    return od_counts


def od_countings(trips, grid, stations, cell_identifier=['i', 'j'], 
                 cell_start_ids=['i_start', 'j_start'], cell_end_ids=['i_end', 'j_end'],
                 station_index='station id', start_station_index='start station id', end_station_index='end station id'):
    """
    Calculation of the Origin-Destination matrix.
    For each (A, B) pair of cells in the grid, counts the trips from A to B (flow count) and determines the "mass center" points
    of the stations in A and in B, based on the weighted average use of the stations, for arrow drawing purposes.
    """
    with_od_cells = merge_trips_and_cells(trips, grid, stations, cell_identifier, cell_start_ids, cell_end_ids,
                                          station_index, start_station_index, end_station_index)
    return weighted_counts(with_od_cells, cell_start_ids + cell_end_ids)
    

def od_countings_simple(trips, grid, stations):
    """
    Calculation of the Origin-Destination matrix.
    For each (A, B) pair of cells in the grid, counts the trips from A to B (flow count).
    """
    
    merge_grid_and_stations(grid, stations)

    trips['start geometry'] = trips.apply(lambda row: Point(row['start station longitude'], row['start station latitude']), axis=1)
    trips_geoframe = gpd.GeoDataFrame(trips, crs={'init': 'epsg:4326'})

    # total count per (origin, destination) pair of stations 
    od_station_counts = trips.groupby(['start station id', 'end station id'], as_index=False) \
                                     .agg({'tripduration': 'count'})
    # origin cells, given the stations
    with_origin_cells = od_station_counts.merge(grid_and_stations, left_on='start station id', right_on='station id') \
                        [['i', 'j', 'tripduration', 'end station id']]
    with_origin_cells.columns = ['i_start', 'j_start', 'trip counts', 'end station id']

    # destination cells, given the stations
    with_dest_cells = with_origin_cells.merge(grid_and_stations, left_on='end station id', right_on='station id') \
                      [['i_start', 'j_start', 'i', 'j', 'trip counts']]
    with_dest_cells.columns = ['i_start', 'j_start', 'i_end', 'j_end', 'trip counts']

    # total count per (origin, destination) pair of grid cells 
    od_cell_counts = with_dest_cells.groupby(['i_start', 'j_start', 'i_end', 'j_end'], as_index=False) \
                                    .agg({'trip counts': 'sum'})
    # geometries (for plotting)
    od_counts = od_cell_counts.merge(grid.geodataframe(), left_on=['i_start', 'j_start'], right_on=['i', 'j']) \
                              .merge(grid.geodataframe(), left_on=['i_end', 'j_end'], right_on=['i', 'j']) \
                            [['i_start', 'j_start', 'geometry_x', 'i_end', 'j_end', 'geometry_y', 'trip counts']]
    od_counts.columns = ['i_start', 'j_start', 'origin', 'i_end', 'j_end', 'destination', 'trip counts']
    od_counts['origin'] = od_counts['origin'].apply(lambda cell: Point(cell.centroid.x, cell.centroid.y))
    od_counts['destination'] = od_counts['destination'].apply(lambda cell: Point(cell.centroid.x, cell.centroid.y))
    
    return od_counts


POPUP_NUM_TRIPS = 0
POPUP_FLOW_ID = 1

def flow_map(fmap, od_df, grid, stations, minimum=-1, maximum=-1, show=4, radius=1.0, text=POPUP_NUM_TRIPS,
             start_cell_identifier=['i_start', 'j_start'], end_cell_identifier=['i_end', 'j_end'], language_en=True):
    '''
    Creates a flow map based on the given list of trips.
    
    Parameters
    fmap: a Folium map
    od_df: origin-destination countings dataframe for the regions of the city, calculated by od_* functions in this module
    grid: a Grid object
    stations: a GeoDataframe with Point objects representing stations
    minimum: only draw arrows for the flows that are larger than this minimum number of trips
    maximum: only draw arrows for the flows that are smaller than this maximum number of trips
    show: a measure of the portion of flows to show. Typically between 2 and 5. 
    '''

    # eliminate round-trips to the same station, which are not considering in this analysis
    i = 1
    the_filter = od_df[start_cell_identifier[0]] == od_df[end_cell_identifier[0]]
    while i < len(start_cell_identifier):
        the_filter = the_filter & (od_df[start_cell_identifier[i]] == od_df[end_cell_identifier[i]])
        i += 1
    filtered = od_df[~the_filter]

    if maximum == -1:
        maximum = filtered['trip counts'].max()
    if minimum == -1:
        minimum = maximum / show
        
    total_trips = filtered['trip counts'].sum()

    filtered = filtered[((filtered['trip counts'] >= minimum) & (filtered['trip counts'] <= maximum))]

    shown_trips = 0
    
    for idx, row in filtered.iterrows():
        num_trips = row['trip counts']
        
        shown_trips += num_trips
        weight = math.ceil( (num_trips-minimum)/maximum * 10)
        if weight == 0: weight = 1
        
        o1 = row['origin'].y
        o2 = row['origin'].x
        d1 = row['destination'].y
        d2 = row['destination'].x
        
        if language_en:
            text_plot = str(round(num_trips)) + ' bike trips'
            if text == POPUP_FLOW_ID:
                text_plot += ' / Start: (i=' + str(row['i_start']) + ', j=' + str(row['j_start']) + ') / ' + \
                             'End: (i=' + str(row['i_end']) + ', j=' + str(row['j_end']) + ')'
        else:
            text_plot = str(round(num_trips)) + ' viagens'
            if text == POPUP_FLOW_ID:
                text_plot += ' / Origem: (l=' + str(row['i_start']) + ', c=' + str(row['j_start']) + ') / ' + \
                             'Destino: (l=' + str(row['i_end']) + ', c=' + str(row['j_end']) + ')'

        try:
            draw_arrow(fmap, o1, o2, d1, d2, 
                   text=text_plot,
                   weight=weight,
                   radius_fac=radius)
        except Exception as e:
            print(row)
            raise e

    geodf = grid.geodataframe()
    geodf = geodf[(geodf['i'] == grid.n // 5) & (geodf['j'] == grid.n // 5)]
    cell = geodf['geometry'].iloc[0]

def flow_map_zones(fmap, od_df, minimum=-1, maximum=-1, show=4, radius=1.0, text=POPUP_NUM_TRIPS,
             start_zone_identifier='ZONA_O', end_zone_identifier='ZONA_D', language_en=True):
    '''
    Creates a flow map based on the given list of trips for the centroid coordinates of a polygon.
    
    Parameters
    fmap: a Folium map
    od_df: origin-destination countings dataframe for the regions of the city
    minimum: only draw arrows for the flows that are larger than this minimum number of trips
    maximum: only draw arrows for the flows that are smaller than this maximum number of trips
    show: a measure of the portion of flows to show. Typically between 2 and 5. 
    '''

    # eliminate round-trips to the same station, which are not considering in this analysis
    no_rounding_trips = od_df[od_df[start_zone_identifier]!=od_df[end_zone_identifier]]

    if maximum == -1:
        maximum = no_rounding_trips['trip counts'].max()
    if minimum == -1:
        minimum = maximum / show
        
    total_trips = no_rounding_trips['trip counts'].sum()

    no_rounding_trips = no_rounding_trips[((no_rounding_trips['trip counts'] >= minimum) & (no_rounding_trips['trip counts'] <= maximum))]

    shown_trips = 0
    
    for idx, row in no_rounding_trips.iterrows():
        num_trips = row['trip counts']
        
        shown_trips += num_trips
        weight = math.ceil( (num_trips-minimum)/maximum * 10)
        if weight == 0: weight = 1
        
        o1 = row['origin'].y
        o2 = row['origin'].x
        d1 = row['destination'].y
        d2 = row['destination'].x
        
        if language_en:
            text_plot = str(round(num_trips)) + ' bike trips'
            if text == POPUP_FLOW_ID:
                text_plot += ' / Start: (o=' + str(row[start_zone_identifier]) + ') / ' + \
                             'End: (d=' + str(row[end_zone_identifier]) + ')'
        else:
            text_plot = str(round(num_trips)) + ' viagens'
            if text == POPUP_FLOW_ID:
                text_plot += ' / Origem: (o=' + str(row[start_zone_identifier]) + ') / ' + \
                             'Destino: (d=' + str(row[end_zone_identifier]) + ')'

        try:
            draw_arrow(fmap, o1, o2, d1, d2, 
                   text=text_plot,
                   weight=weight,
                   radius_fac=radius)
        except Exception as e:
            print(row)
            raise e

    #geodf = grid.geodataframe()
    #geodf = geodf[(geodf['i'] == grid.n // 5) & (geodf['j'] == grid.n // 5)]
    #cell = geodf['geometry'].iloc[0]

def show_flow_map(od, grid, stations):
    """
    Convenience function to quickly create and show a flow map given OD, grid and stations dataframes.
    """
    fmap = grid.map_around(zoom=13, plot_grid=True)
    flow_map(fmap, od, grid, stations, show=5, radius=2.0)
    draw_stations(fmap, stations)
    return fmap


def load_flow_file(file):
    od = pd.read_csv(file)
    od.origin = od.origin.apply(shapely.wkt.loads)
    od.destination = od.destination.apply(shapely.wkt.loads)
    return od