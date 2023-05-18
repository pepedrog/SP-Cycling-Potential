import pyproj
import json

#define projections
wgs84 = Proj('epsg:4326')
IrishGrid = Proj('epsg:29902')

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
            lat_grid, lon_grid = numpy.meshgrid(x1, y1)
            #do transformation
            coordPair[0],coordPair[1] = pyproj.transform(IrishGrid,wgs84,lat_grid, long_grid)

#write reprojected json to new file
with open('path_to_new_file.json', 'w') as f:
    f.write(json.dumps(data))