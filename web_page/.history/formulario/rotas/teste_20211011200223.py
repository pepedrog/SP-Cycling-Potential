from pyproj import Proj
import pyproj
import json
import numpy

#define projections
wgs84 = Proj('epsg:31983')
IrishGrid = Proj('epsg:4326')

#load in data
with open(r'teste.json', 'r') as f:
    data = json.load(f)

#traverse data in json string
for feature in data['features']:
     #print feature['geometry']['type']
     #print feature['geometry']['coordinates']

    #all coordinates
    coords = feature['geometry']['coordinates']

    #coordList is for each individual polygon
    for coordList in coords:

        #each point in list
        for coordPair in coordList:
            print(coordPair)
            x1 = coordPair[0]
            y1 = coordPair[1]
            lat_grid, long_grid = numpy.meshgrid(x1, y1)
            print(lat_grid, long_grid)
            #do transformation
            coordPair[0],coordPair[1] = pyproj.transform(IrishGrid,wgs84,lat_grid, long_grid)
            print(coordPair)
            print("--------")

#write reprojected json to new file
with open('path_to_new_file.json', 'w') as f:
    f.write(json.dumps(data))