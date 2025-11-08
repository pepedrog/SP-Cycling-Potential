const checkbox_color_map = document.getElementById('mapa_colorido')
const route_data = document.getElementById('info_rota')
const route_eval = document.getElementById('avaliacao')
const span_id = document.getElementById('id_rota_span')
const span_dist = document.getElementById('dist_rota_span')
const img_topo = document.getElementById('topografia_fig')
const img_incl = document.getElementById('inclinacao_fig')
document.getElementById('pagina_2').style.display = "none"
document.getElementById('pagina_3').style.display = "none"

var page = 1

route_data.style.display = 'none'
route_eval.style.display = 'none'

var mymap = L.map('mapid').setView([-23.55, -46.63], 11);

checkbox_color_map.addEventListener('change', (event) => {
    let id;
    if (event.currentTarget.checked)
        //id = 'mapbox/streets-v11'
        //id = 'pepedrog/cktnipyf30bt217lmvodlclza'
        id = 'pepedrog/cktnin8bl0bq517lmm71u9ndt'
    else
        id = 'pepedrog/cktnitzoe0bxd17swrndlt2gx'
    map_style.options.id = id
    map_style.setUrl(map_style._url, false)
})

map_style =
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'pepedrog/cktnitzoe0bxd17swrndlt2gx',
            //id: mapbox/streets-v11,
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicGVwZWRyb2ciLCJhIjoiY2t0bThzZDcxMjMzYTMwbjRldTVzbmhzYyJ9.yladg5juUZmO9y8RZJNYvg'
        })
map_style.addTo(mymap)


function whenClicked(id, distance) {
    return function (_) {
        route_data.style.display = 'block'
        route_eval.style.display = 'block'

        span_id.innerHTML = id
        span_dist.innerHTML = distance + ' m'
        img_topo.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_incl.src = './images/inclinacao_' + id.substring(1, id.length - 1) + '.png'
    }
}

function onEachFeature(id, distance) {
    return function (_, layer) {
        //bind click
        layer.on({
            click: whenClicked(id, distance)
        });
    }
}

function load_routes(routes) {
    for (trip of routes) {
        for (r of trip.route) {
            var myStyle = {
                "color": r['properties']['color'],
                "weight": 5,
                "opacity": 0.9
            };
            L.geoJSON(r, {
                style: myStyle,
                onEachFeature: onEachFeature(trip.id, trip.distance)
            }).addTo(mymap)
        }
    }
}

function change_page(direction = 1) {
    let html_page = document.getElementById("pagina_" + page)
    html_page.style.display = 'none'
    html_page.style.opacity='0';
    page += direction
    html_page = document.getElementById("pagina_" + page)
    html_page.style.display = 'block'
    html_page.style.opacity='100';
}