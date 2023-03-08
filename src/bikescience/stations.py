import pandas as pd
from shapely.geometry import Point
import geopandas as gpd
import folium


def from_trips(trips):
    """
    Extracts a bike stations list from the trips dataframe. Returns a GeoDataframe containing the station location points.
    """
    start_stations = trips[['start station id', 'start station name', 'start station latitude', 'start station longitude']]
    start_stations.columns = ['id', 'sname', 'lat', 'lon']

    end_stations = trips[['end station id', 'end station name', 'end station latitude', 'end station longitude']]
    end_stations.columns = ['id', 'sname', 'lat', 'lon']

    stations = pd.concat([start_stations, end_stations])

    stations.drop_duplicates(subset='id', inplace=True)
    stations.set_index('id', inplace=True)
    stations.sort_index(inplace=True)

    stations['sname'] = stations['sname'].str.replace("'", "&#8217;")
    stations['geometry'] = stations.apply(lambda row: Point(row['lon'], row['lat']), axis=1)
    return gpd.GeoDataFrame(stations, crs={'init': 'epsg:4326'})


def save(stations_df, filename):
    """Saves a stations dataframe"""
    stations_df.reset_index(inplace=False).to_file(filename, driver="GeoJSON")


def load(filename):
    """Load a previously saved stations file"""
    stations = gpd.read_file(filename)
    stations.set_index('id', inplace=True)
    return stations
    

def distances(file):
    """
    Loads and prepares the stations_distances.csv file, previously created by Stations-Distances.ipynb notebook 
    using GraphHopper API calls.
    """
    return pd.read_csv(file, index_col=['id_x', 'id_y'])


def draw_stations(folium_map, stations, name_column='sname'):
    """
    Plots the station points on a Folium map.
    """
    for index, row in stations.iterrows():
        folium.CircleMarker(location=[row.lat, row.lon], radius=1,
                            popup=row[name_column], color='black').add_to(folium_map)
