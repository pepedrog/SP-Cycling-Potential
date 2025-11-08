var mymap = L.map('mapid').setView([-23.55, -46.63], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGVwZWRyb2ciLCJhIjoiY2t0bThzZDcxMjMzYTMwbjRldTVzbmhzYyJ9.yladg5juUZmO9y8RZJNYvg'
}).addTo(mymap);


var rota = 
{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "color": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "LineString",
        "coordinates": 
        [
        [-46.641905, -23.56707],
[-46.641802, -23.567115],
[-46.641721, -23.567176],
[-46.641638, -23.567291],
[-46.641515, -23.56741],
[-46.641446, -23.567503],
[-46.641249370469076, -23.5678014847173],
]
}
}

L.geoJSON(rota).addTo(mymap)