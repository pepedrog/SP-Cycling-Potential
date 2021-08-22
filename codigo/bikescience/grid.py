import numpy as np
from shapely.geometry import box
import geopandas as gpd
import folium
from geopy.distance import distance

GRID_SIZE = 20 # this way, each cell is a square of side ~900m (~2953ft). 
               # Approximately the maximum one would happily walk to get to a dock station.

default_west_limit = -71.166491 - 0.0014
default_east_limit = -71.006098 + 0.0000
default_north_limit = 42.406302 + 0.009
default_south_limit = 42.30     - 0.0048

class Grid():
    """
    Manages grid generation and processing. A grid is a delimited rectangular area on a map, divided into cells of same size.
    Constructor parameters:
      n - creates an nxn grid (default n=20)
      west_limit - longitude for rectangle left
      east_limit - longitude for rectangle right
      north_limit - latitude for rectangle top
      south_limit - latitude for rectangle bottom
    (the grid limits default to an area around Boston)
    """
    
    def __init__(self, n=GRID_SIZE, west_limit=None, east_limit=None, north_limit=None, south_limit=None):
        self.n = n
        self.east_limit = east_limit if east_limit != None else default_east_limit
        self.west_limit = west_limit if west_limit != None else default_west_limit
        self.north_limit = north_limit if north_limit != None else default_north_limit
        self.south_limit = south_limit if south_limit != None else default_south_limit
        self.grid = None

    def geodataframe(self):
        """
        Returns a GeoDataframe (GeoPandas library), the data structure that enables geospatial and Pandas standard processing.
        Each record in the GeoDataframe represents a grid cell.
        """
        if self.grid is not None: return self.grid
        latitudes = np.linspace(self.south_limit, self.north_limit, num=self.n+1)
        longitudes = np.linspace(self.west_limit, self.east_limit, num=self.n+1)
        rectangles = []
        i_column = []
        j_column = []
        for i in range(latitudes.size - 1):
            for j in range(longitudes.size - 1):
                i_column.append(i)
                j_column.append(j)
                rectangles.append(box(longitudes[j], latitudes[i], longitudes[j+1], latitudes[i+1]))

        self.grid = gpd.GeoDataFrame(data={'i': i_column, 'j': j_column}, geometry=rectangles, crs={'init': 'epsg:4326'})
        return self.grid
    
    def map_around(self, 
                   zoom=12, 
                   plot_grid=True, 
                   style=lambda x: {'color': 'black', 'weight': 0.5, 'opacity': 0.3, 'fillOpacity': 0.0}):
        """
        Creates and returns a Folium map displaying the grid area.
        Parameters:
          zoom - zoom level of the map
          plot_grid - determines whether the grid must be plotted on the map
          style - a Folium style function for the grid look (see Folium docs)
        """
        folium_map = folium.Map([(self.north_limit + self.south_limit) / 2, 
                                 (self.west_limit + self.east_limit) / 2], 
                                 control_scale = True,
                                 zoom_start=zoom, tiles='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
                                 attr='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>')
        
        if plot_grid:
            folium.GeoJson(self.geodataframe().to_json(), name='grid', style_function=style).add_to(folium_map)
        return folium_map
        
    def rect_dimensions_in_meters(self):
        """
        Calculates the cell size in meters. Returns the (width, height) pair.
        """
        rectangle = self.geodataframe()['geometry'][0]
        arr_x, arr_y = rectangle.exterior.coords.xy
        width = distance((arr_y[1], arr_x[1]), (arr_y[2], arr_x[2]))
        height = distance((arr_y[1], arr_x[1]), (arr_y[0], arr_x[0]))
        return width.m, height.m
