const checkbox_satelite = document.getElementById('check_satelite')
const route_eval = document.getElementById('avaliacao')
const img_topo = document.getElementById('topografia_fig')
const table_dist = document.getElementById('distancias')
const legend = document.getElementById('legend_inclinacao')
const legend_img = document.getElementById('legend_img')
const topografia = document.getElementById('topografia')
const btn_save_trip = document.getElementById('btn_avaliar')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')
const dist_up = document.getElementById('dist_subidas')

var mymap = L.map('mapa').setView([-23.57, -46.59], 11);
var page = 1
var start_flag = null, finish_flag = null;
var finishIcon = L.icon({
    iconUrl: 'images/finish_flag.png',
    iconSize: [22, 28], // size of the icon
    iconAnchor: [11, 26], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var startIcon = L.icon({
    iconUrl: 'images/bike.png',
    iconSize: [22, 28], // size of the icon
    iconAnchor: [11, 26], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var checkedIcon = L.icon({
    iconUrl: 'images/check_icon.png',
    iconSize: [20, 20], // size of the icon
    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var selected_regions = []
var selected_reasons = []
var current_trip = null

var routes_evaluation = []

configure_form()
configure_map()

// document.ready
document.addEventListener("DOMContentLoaded", function () {
    new_top = legend.offsetHeight - legend_img.offsetHeight - 20
    legend.style.height = legend_img.offsetHeight + 20 + "px"
    legend.style.top = 340 + new_top + "px"
    legend.style.display = "none"

    // esconde página final
    document.getElementById('pagina_1').style.display = "none"
    document.getElementById('btn_voltar').style.display = "none"
    table_dist.style.display = 'none'
    btn_save_trip.style.display = 'none'
    route_eval.style.display = 'none'
    topografia.style.display = 'none'
});

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

function configure_form() {
    // tooltip das regiões
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

    // on change das regiões registra as registradas
    const checkbox_regions = document.getElementsByName('regiao')
    for (let region of checkbox_regions) {
        region.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                selected_regions.push(region.value);
            } else {
                const index = selected_regions.indexOf(region.value);
                if (index > -1) {
                    selected_regions.splice(index, 1);
                }
            }
        })
    }

    // on change dos motivos
    const checkbox_reasons = document.getElementsByName('motivo')
    for (let reason of checkbox_reasons) {
        reason.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                selected_reasons.push(reason.value);
            } else {
                const index = selected_reasons.indexOf(reason.value);
                if (index > -1) {
                    selected_reasons.splice(index, 1);
                }
            }
        })
    }
}

function change_page(direction = 1) {

    const form = document.getElementById("formulario_dados_pessoais")

    if (page == 1 && !(form.checkValidity() && validate_reasons() && validate_regions())) {
        form.classList.add("was-validated")
        return
    }

    let html_page = document.getElementById("pagina_" + page)
    // dinâmica para sumir lentamente
    html_page.style.opacity = '0';
    setTimeout(function () {
        html_page.style.display = 'none';
        page += direction
        html_page = document.getElementById("pagina_" + page)
        html_page.style.display = 'block'
        html_page.style.opacity = '1'
        if (page == 1) {
            document.getElementById('btn_voltar').style.display = "none"
            document.getElementById('btn_avancar').style.display = "block"
        }
        else {
            document.getElementById('btn_voltar').style.display = "block"
            document.getElementById('btn_avancar').style.display = "none"
            mymap.invalidateSize()
        }
    }, 300);
}

function validate_regions() {
    document.getElementById('validacao_regiao_0').style.display = 'none'
    document.getElementById('validacao_regiao_2').style.display = 'none'
    if (selected_regions.length == 0) {
        document.getElementById('validacao_regiao_0').style.display = 'block'
        return false
    }
    if (selected_regions.length > 2) {
        document.getElementById('validacao_regiao_2').style.display = 'block'
        return false
    }
    return true
}

function validate_reasons() {
    document.getElementById('validacao_motivo').style.display = 'none'
    if (selected_reasons.length == 0) {
        document.getElementById('validacao_motivo').style.display = 'block'
        return false
    }
    return true
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

function show_route_details(e, trip) {
    id = trip.id
    current_trip_id = id
    distance = trip.distance
    route_eval.style.display = 'block'
    btn_save_trip.style.display = 'block'

    add_flag_markers(trip)
    fill_ditances(trip)

    mymap.flyTo([e.latlng.lat + 0.02, e.latlng.lng + 0.02], 13, {
        animate: true,
        duration: 1 // in seconds
    })
    setTimeout(function () {
        table_dist.style.display = 'block'
        topografia.style.display = 'block'
        img_topo.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_topo.style.backgroundColor = 'white';
        img_topo.style.width = mymap._container.offsetWidth - 10 - table_dist.offsetWidth + "px"
        img_topo.style.height = table_dist.offsetHeight - 20 + "px"
        img_topo.style.maxHeight = mymap._container.offsetHeight / 2 + "px"
    }, 1000)
}

function hide_route_details() {
    current_trip = null

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

function reset_eval() {
    reset_radio('dist')
    reset_radio('incl')
    reset_radio('final_eval')
    document.getElementById('comentarios').value = ""
}

// evento onclick para rotas no mapa
function when_clicked(trip) {
    return function (e) {
        reset_eval()
        if (topografia.style.display == 'none' || current_trip.id != trip.id) {
            show_route_details(e, trip)
        }
        else {
            hide_route_details()
        }
        current_trip = trip
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

function zoom() {
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

function reset_radio(name) {
    const radio = document.getElementsByName(name);
    for (const el of radio)
        el.checked = false
} 

function get_radio_value(name) {
    const radio = document.getElementsByName(name);
    for (const el of radio)
        if (el.checked) return el.value
    return null
}

function validate_evaluation() {
    const distance = get_radio_value('dist')
    const incl = get_radio_value('incl')
    const final_eval = get_radio_value('final_eval')

    if (!!distance && !!incl && !!final_eval) {
        document.getElementById('valida_avaliacao').style.display = "none"
        return true
    }
    document.getElementById('valida_avaliacao').style.display = "block"
    return false
}

function register_evaluation() {
    routes_evaluation.push(
        {
            'id': current_trip.id,
            'dist': get_radio_value('dist'),
            'incl': get_radio_value('incl'),
            'final': get_radio_value('final_eval'),
            'coment': document.getElementById('comentarios').value
        }
    )
    console.log(routes_evaluation)
}

function mark_route() {
    first_line = current_trip.route[0]
    coords = first_line.geometry.coordinates[0]
    coords = [coords[1], coords[0]]
    let checked = L.marker(coords, { icon: checkedIcon })
    checked.bindPopup("Rota já avaliada")
    checked.addTo(mymap)
}

function save_evaluation() {
    if (!validate_evaluation()) return
    register_evaluation()
    mark_route()
    hide_route_details()
}