from bikescience import grid
import folium

SP_LAT = -23.5589
SP_LON = -46.6388

def create(n=40, west_offset=-.3, east_offset=.3, north_offset=.3, south_offset=-.3):
    return grid.Grid(n, 
                     west_limit=SP_LON + west_offset,
                     east_limit=SP_LON + east_offset,
                     north_limit=SP_LAT + north_offset,
                     south_limit=SP_LAT + south_offset)

def map_around_sp(the_grid,zoom=12, plot_grid=True, 
                  style=lambda x: {'color': 'black', 'weight': 0.5, 'opacity': 0.3, 'fillOpacity': 0.0}, 
                  west_offset=-.3, east_offset=.3, north_offset=.3, south_offset=-.3):
    """
    Creates and returns a Folium map displaying the grid area.
    Parameters:
    zoom - zoom level of the map
    plot_grid - determines whether the grid must be plotted on the map
    style - a Folium style function for the grid look (see Folium docs)
    *_offset - map limits 
    """
    west_limit=SP_LON + west_offset
    east_limit=SP_LON + east_offset
    north_limit=SP_LAT + north_offset
    south_limit=SP_LAT + south_offset
    
    folium_map = folium.Map([(north_limit + south_limit) / 2, 
                             (west_limit + east_limit) / 2], 
                             control_scale = True,
                             zoom_start=zoom, tiles='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
                             attr='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>')
        
    if plot_grid:
        folium.GeoJson(the_grid.geodataframe().to_json(), name='grid', style_function=style).add_to(folium_map)
    return folium_map
