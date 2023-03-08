const checkbox_satelite = document.getElementById('check_satelite')
const route_data = document.getElementById('info_rota')
const route_eval = document.getElementById('avaliacao')
const span_dist = document.getElementById('dist_rota_span')
const img_topo = document.getElementById('topografia_fig')
const img_incl = document.getElementById('inclinacao_fig')
const img_topo_modal = document.getElementById('topografia_fig')
const img_incl_modal = document.getElementById('inclinacao_fig')

// esconde página final
document.getElementById('pagina_1').style.display = "none"
document.getElementById('btn_voltar').style.display = "none"
route_data.style.display = 'none'
route_eval.style.display = 'none'

configure_form()
configure_map()

var page = 1

function configure_map() {
    var mymap = L.map('mapa').setView([-23.57, -46.59], 11);
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

function change_page(direction = 1) {
    let html_page = document.getElementById("pagina_" + page)
    // dinâmica para sumir lentamente
    html_page.style.opacity = '0';
    setTimeout(function () {
        html_page.style.display = 'none';
        page += direction
        html_page = document.getElementById("pagina_" + page)
        html_page.style.display = 'block'
        html_page.style.opacity = '1';
        if (page == 1)
            document.getElementById('btn_voltar').style.display = "none"
        else {
            document.getElementById('btn_voltar').style.display = "block"
            mymap.invalidateSize()
        }
    }, 300);
}

function configure_form() {
    var tooltips_regions = document.getElementsByClassName("more_info");
    [].forEach.call(tooltips_regions, function (el) {
        el.onclick = function () {
            var title = $(this).find(".help");
            if (!title.length) {
                $(this).append('<span class="help">' + $(this).attr("help") + '</span>');
            } else {
                title.remove();
            }
        }
    });
}

var start_flag = null, finish_flag = null;

// evento onclick para rotas no mapa
function whenClicked(trip) {
    return function (_) {
        id = trip.id
        distance = trip.distance
        route_data.style.display = 'block'
        route_eval.style.display = 'block'

        //span_id.innerHTML = id
        span_dist.innerHTML = parseFloat(distance / 1000).toFixed(2) + ' km'
        img_topo.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_topo_modal.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_incl.src = './images/inclinacao_' + id.substring(1, id.length - 1) + '.png'
        img_incl_modal.src = './images/inclinacao_' + id.substring(1, id.length - 1) + '.png'

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
}

function onEachFeature(trip) {
    return function (_, layer) {
        //bind click
        layer.on({
            click: whenClicked(trip)
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
                onEachFeature: onEachFeature(trip)
            }).addTo(mymap)
        }
    }
}

function zoom(el) {
    if (el.style.width == "500%")
        el.style.width = "150%";
    else
        el.style.width = "500%";
}