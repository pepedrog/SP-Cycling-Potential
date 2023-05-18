var mymap = L.map('mapid').setView([-23.55, -46.63], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGVwZWRyb2ciLCJhIjoiY2t0bThzZDcxMjMzYTMwbjRldTVzbmhzYyJ9.yladg5juUZmO9y8RZJNYvg'
}).addTo(mymap);

let xhr = new XMLHttpRequest();
xhr.open('GET', 'maps/distritos.geojson');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.responseType = 'json';
xhr.onload = function() {
    if (xhr.status !== 200) return
    L.geoJSON(xhr.response).addTo(mymap);
};
xhr.send();