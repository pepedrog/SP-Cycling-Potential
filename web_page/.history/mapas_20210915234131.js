var mymap = L.map('mapid').setView([-23.55, -46.63], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGVwZWRyb2ciLCJhIjoiY2t0bThzZDcxMjMzYTMwbjRldTVzbmhzYyJ9.yladg5juUZmO9y8RZJNYvg'
}).addTo(mymap);


var rota = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "LINESTRING",
        "coordinates": [
        [-46.641905, -23.56707, 825.01],
        [-46.641802, -23.567115, 824.37],
        [-46.641721, -23.567176, 824.41],
        [-46.641638, -23.567291, 824.42],
        [ -46.641515, -23.56741, 823.39],
        [ -46.641446, -23.567503, 822.37],
        [ -46.641085, -23.568051, 815.13],
        [-46.641053, -23.568221, 815.37],
        [-46.641273, -23.570241, 811.92],
        [-46.641332, -23.570484, 813.53],
        [-46.641423, -23.570644, 815.25],
        [-46.641526, -23.570638, 818.85],
        [-46.642038, -23.570665, 823.91],
        [-46.642087, -23.570154, 824.08],
        [-46.642186, -23.568534, 827.13],
        [-46.642204, -23.567985, 828.17],
        [-46.642188, -23.567036, 828.35],
        [-46.641661, -23.565644, 810.61],
        [-46.641372, -23.564786, 804.3200000000001],
        [-46.641024, -23.563652, 792.53],
        [-46.640797, -23.56276, 783.84],
        [-46.640762, -23.562742, 782.88],
        [-46.640733, -23.562701, 782.75],
        [-46.640719, -23.562585, 781.8],
        [-46.640589 -23.562633, 780.99],
        [-46.639972, -23.562774, 777.79],
        [-46.639733, -23.562851, 777.1],
        [-46.639637, -23.56188, 773.1900000000001],
        [-46.639583, -23.561186, 774.64],
        [-46.639531, -23.560894, 775.59],
        [-46.639473, -23.560723, 775.1],
        [-46.639253, -23.560255, 773.63],
        [-46.63868, -23.559354, 772.78],
        [-46.638584, -23.559162, 772.9299999999999],
        [-46.638553, -23.559027, 773.05],
        [-46.638541, -23.55889, 773.5],
        [-46.637233, -23.555692, 762.9400000000001],
        [-46.636751, -23.554388, 762.9299999999999],
        [-46.636641, -23.554007, 763.8200000000001],
        [-46.636577, -23.553647, 764.4400000000001],
        [-46.636538, -23.553306, 764.52],
        [-46.636547, -23.552999, 764.64],
        [-46.636587, -23.552771, 764.5599999999999],
        [-46.636658, -23.552512, 764.45],
        [-46.636732, -23.552321, 764.37],
        [-46.636911, -23.55195, 764.04],
        [-46.637202, -23.5515, 763.24],
        [-46.637854, -23.550622, 760.83],
        [-46.638698, -23.549322, 752.45],
        [-46.638808, -23.54907, 753.12],
        [-46.638848, -23.548931, 756.34],
        [-46.638873, -23.548708, 756.92],
        [-46.638827, -23.548532, 759.5],
        [-46.638664, -23.548269, 759.96],
        [-46.637874, -23.547094, 764.51],
        [-46.637709, -23.546888, 764.3],
        [-46.63729 ,-23.54631, 763.35],
        [-46.635337, -23.543399, 758.6900000000001],
        [-46.63448 ,-23.541995, 751.14],
        [-46.634182,-23.541479, 745.51],
        [-46.634039, -23.541002, 747.15],
        [-46.634009, -23.540856, 749.52],
        [-46.633855, -23.539545, 756.9299999999999],
        [-46.633807, -23.53892, 764.15],
        [-46.633555, -23.536874, 751.65],
        [-46.633512, -23.535748, 744.0700000000001],
        [-46.63348 ,-23.535538, 745.13],
        [-46.633228, -23.534618, 747.12],
        [-46.632578, -23.532471, 742.35],
        [-46.633841, -23.532158, 745.23],
        [-46.634231, -23.53214, 745.28],
        [-46.634539, -23.532073, 745.37],
        [-46.63474 ,-23.531995, 745.37],
        [-46.634842, -23.53188, 745.72],
        [-46.63812 ,-23.531041, 741.61],
        [-46.638195, -23.531019, 741.2],
        [-46.638211, -23.531001, 741.09],
        [-46.639017, -23.528803, 738.62],
        [-46.639082, -23.528729, 739.16],
        [-46.639273, -23.528649, 739.73],
        [-46.640109, -23.529045, 741.6],
        [-46.641103, -23.527257, 736.05],
        [-46.640092, -23.526774, 740.26],
        [-46.639815, -23.527271, 739.75]]
    }
}
L.geoJSON(rota).addTo(mymap)
/*
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(mymap);*/