const checkbox_satelite = document.getElementById('check_satelite')
const route_eval = document.getElementById('avaliacao')
const img_topo = document.getElementById('topografia_fig')
const table_dist = document.getElementById('distancias')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')

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
var selected_regions = []

// esconde página final
document.getElementById('pagina_1').style.display = "none"
document.getElementById('btn_voltar').style.display = "none"
table_dist.style.display = 'none'
route_eval.style.display = 'none'

configure_form()
configure_map()


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

    const checkboxs_regions = document.getElementsByName('regiao')
    for (let region of checkboxs_regions) {
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
}

function validate_form() {
    const idade = document.getElementById("txt_idade").value
    const genero = document.getElementById("select_genero").value
    const motivo = document.getElementById("select_motivo").value
    const frequencia = document.getElementById("select_frequencia").value
    const tempo = document.getElementById("select_tempo").value

    //if (idade == "")

}

function change_page(direction = 1) {

    const form = document.getElementById("formulario_dados_pessoais")

    if (page == 1 && !(form.checkValidity() && validade_regions())) {
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
        if (page == 1)
            document.getElementById('btn_voltar').style.display = "none"
        else {
            document.getElementById('btn_voltar').style.display = "block"
            mymap.invalidateSize()
        }
    }, 300);
}

function validade_regions() {
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
    dist_0.innerHTML = '&nbsp; ' + trip.distance_0 + ' m &nbsp;'
    dist_3.innerHTML = '&nbsp; ' + trip.distance_1 + ' m &nbsp;'
    dist_5.innerHTML = '&nbsp; ' + trip.distance_2 + ' m &nbsp;'
    dist_7.innerHTML = '&nbsp; ' + trip.distance_3 + ' m &nbsp;'
    dist_8.innerHTML = '&nbsp; ' + trip.distance_4 + ' m &nbsp;'
}

// evento onclick para rotas no mapa
function when_clicked(trip) {
    return function (e) {
        id = trip.id
        distance = trip.distance
        route_eval.style.display = 'block'


        add_flag_markers(trip)
        fill_ditances(trip)
        console.log(e)
        mymap.flyTo([e.latlng.lat, e.latlng.lng + 0.03], 13, {
            animate: true,
            duration: 1 // in seconds
        })
        setTimeout(function () { 
            img_topo.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
            img_topo.style.height = mymap._container.offsetWidth - 65 - table_dist.offsetWidth - 10 + "px"
            table_dist.style.display = 'block' 
        }, 1000)


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