var mymap = L.map('mapa').setView([-23.57, -46.59], 11);
var routes = []
var current_route = null

var routes_per_region = {
    "leste1": routes_leste1,
    "leste2": routes_leste2,
    "sul1": routes_sul1,
    "sul2": routes_sul2,
    "centro": routes_centro,
    "oeste": routes_oeste,
    "norte1": routes_norte1,
    "norte2": routes_norte2,
}

// icons
var start_flag = null, finish_flag = null;
var finishIcon = L.icon({
    iconUrl: '../images/finish_flag.png',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [-3, -76]
});
var startIcon = L.icon({
    iconUrl: '../images/bike.png',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [-3, -76]
});
var checkedIcon = L.icon({
    iconUrl: '../images/check_icon.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, 0]
});

function configure_map() {
    map_style =
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
            {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'pepedrog/cktnitzoe0bxd17swrndlt2gx',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoicGVwZWRyb2ciLCJhIjoiY2t0bThzZDcxMjMzYTMwbjRldTVzbmhzYyJ9.yladg5juUZmO9y8RZJNYvg'
            })
    map_style.addTo(mymap)

    checkbox_satelite.addEventListener('change', (event) => {
        let id;
        if (event.currentTarget.checked)
            id = 'pepedrog/cktnin8bl0bq517lmm71u9ndt'
        else
            id = 'pepedrog/cktnitzoe0bxd17swrndlt2gx'
        map_style.options.id = id
        map_style.setUrl(map_style._url, false)
    })
}

function configure_inclination_legend() {
    const legend = document.getElementById('legend_inclinacao')
    const legend_img = document.getElementById('legend_img')

    new_top = legend.offsetHeight - legend_img.offsetHeight - 20
    legend.style.height = legend_img.offsetHeight + 20 + "px"
    legend.style.top = 340 + new_top + "px"
    legend.style.display = "none"

    document.getElementById('help_inclinacao').onclick = function () {
        if (legend.style.display == "none")
            legend.style.display = "block"
        else
            legend.style.display = "none"
    }
    legend.onclick = function () {
        if (legend.style.display == "none")
            legend.style.display = "block"
        else
            legend.style.display = "none"
    }
}

function add_flag_markers(trip) {
    if (start_flag != null) {
        mymap.removeLayer(start_flag)
        mymap.removeLayer(finish_flag)
    }

    first_line = trip.route[0]
    coords = first_line.geometry.coordinates[0]
    coords = [coords[1], coords[0]]
    finish_flag = L.marker(coords, { icon: startIcon })
    finish_flag.addTo(mymap)

    last_line = trip.route[trip.route.length - 1]
    coords = last_line.geometry.coordinates
    coords = coords[coords.length - 1]
    coords = [coords[1], coords[0]]
    start_flag = L.marker(coords, { icon: finishIcon })
    start_flag.addTo(mymap)
}

function is_already_evalued(trip_id) {
    for (const eval of routes_evaluation)
        if (eval.id == trip_id) return true
    return false
}

function show_route_details(e, trip) {
    id = trip.id
    current_route_id = id
    distance = trip.distance
    if (!is_already_evalued(trip.id)) {
        route_eval.style.display = 'block'
        btn_save_trip.style.display = 'block'
    }

    add_flag_markers(trip)
    fill_ditances(trip)

    mymap.flyTo([e.latlng.lat + 0.02, e.latlng.lng + 0.02], 13, {
        animate: true,
        duration: 1 // in seconds
    })
    setTimeout(function () {
        table_dist.style.display = 'block'
        topografia.style.display = 'block'
        img_topo.src = './../images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_topo.style.backgroundColor = 'white';
        img_topo.style.width = mymap._container.offsetWidth - 10 - table_dist.offsetWidth + "px"
        img_topo.style.height = table_dist.offsetHeight - 20 + "px"
        img_topo.style.maxHeight = mymap._container.offsetHeight / 2 + "px"
    }, 1000)
}

function hide_route_details() {
    current_route = null

    document.getElementById('mapa').scrollIntoView(
        { behavior: "smooth", block: "center", inline: "nearest" });

    setTimeout(function () {
        btn_save_trip.style.display = 'none'
        route_eval.style.display = 'none'

    }, 500)

    topografia.style.display = 'none'
    table_dist.style.display = 'none'
    mymap.removeLayer(start_flag)
    mymap.removeLayer(finish_flag)
    mymap.flyTo([-23.57, -46.59], 11, {
        animate: true,
        duration: 1 // in seconds
    })
}

function fill_ditances(trip) {
    dist_total.innerHTML = '&nbsp; ' + parseFloat(trip.distance / 1000).toFixed(2) + ' km &nbsp;'
    dist_0.innerHTML = '&nbsp; ' + parseFloat(trip.distance_0 / 1000).toFixed(2) + ' km &nbsp;'
    dist_3.innerHTML = '&nbsp; ' + trip.distance_1 + ' m &nbsp;'
    dist_5.innerHTML = '&nbsp; ' + trip.distance_2 + ' m &nbsp;'
    dist_7.innerHTML = '&nbsp; ' + trip.distance_3 + ' m &nbsp;'
    dist_8.innerHTML = '&nbsp; ' + trip.distance_4 + ' m &nbsp;'
    const total = parseInt(trip.distance_1) + parseInt(trip.distance_2) + parseInt(trip.distance_3) + parseInt(trip.distance_4)
    dist_up.innerHTML = '&nbsp; ' + parseFloat(total / 1000).toFixed(2) + ' km &nbsp;'
}

// evento onclick para rotas no mapa
function when_clicked(trip) {
    return function (e) {
        reset_eval()
        if (topografia.style.display == 'none' || current_route.id != trip.id) {
            show_route_details(e, trip)
        }
        else {
            hide_route_details()
        }
        current_route = trip
    }
}
function on_each_feature(trip) {
    return function (_, layer) {
        //bind click
        layer.on({
            click: when_clicked(trip)
        });
    }
}

function load_routes(routes) {
    for (trip of routes) {
        for (r of trip.route) {
            let myStyle = {
                "color": r['properties']['color'],
                "weight": 6,
                "opacity": 0.9
            };
            L.geoJSON(r, {
                style: myStyle,
                onEachFeature: on_each_feature(trip)
            }).addTo(mymap);
        }
    }
}

function zoom_topography() {
    if (img_topo.style.height == table_dist.offsetHeight - 20 + "px") {
        img_topo.style.width = (mymap._container.offsetWidth - 4) + "px"
        img_topo.style.height = "auto"
        topografia.style.cursor = "zoom-out"
    }
    else {
        img_topo.style.width = mymap._container.offsetWidth - 10 - table_dist.offsetWidth + "px"
        img_topo.style.height = table_dist.offsetHeight - 20 + "px"
        topografia.style.cursor = "zoom-in"
    }
}

function mark_route() {
    first_line = current_route.route[0]
    coords = first_line.geometry.coordinates[0]
    coords = [coords[1], coords[0]]
    let checked = L.marker(coords, { icon: checkedIcon })
    checked.bindPopup("Rota já avaliada")
    checked.addTo(mymap)
}
