document.getElementById('pagina_1').style.display = "none"
document.getElementById('btn_voltar').style.display = "none"

const checkbox_color_map = document.getElementById('check_satelite')
const route_data = document.getElementById('info_rota')
const route_eval = document.getElementById('avaliacao')
const span_dist = document.getElementById('dist_rota_span')
const img_topo = document.getElementById('topografia_fig')
const img_incl = document.getElementById('inclinacao_fig')
const img_topo_modal = document.getElementById('topografia_fig')
const img_incl_modal = document.getElementById('inclinacao_fig')

var page = 1

route_data.style.display = 'none'
route_eval.style.display = 'none'

var mymap = L.map('mapa').setView([-23.57, -46.59], 11);

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



var page = 1



function change_page(direction = 1) {
    let html_page = document.getElementById("pagina_" + page)
    html_page.style.opacity='0';
    setTimeout( function(){ 
        html_page.style.display = 'none'; 
        page += direction
        if (page == 1)
        {
            html_page = document.getElementById("pagina_1")
            html_page.style.display = 'block'
            html_page.style.opacity = '1';
            document.getElementById('btn_voltar').style.display = "none"
        }
        else if (page == 2) 
        {
            html_page = document.getElementById("pagina_2")
            html_page.style.display = 'block'
            html_page.style.opacity = '1';
            document.getElementById('btn_voltar').style.display = "block"
            mymap.invalidateSize()
        }
        else if (page == 3)
        {
            window.location.href='./validacao_rotas.html'
        }

    }, 300 );
}

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

function whenClicked(id, distance) {
    return function (_) {
        route_data.style.display = 'block'
        route_eval.style.display = 'block'

        //span_id.innerHTML = id
        span_dist.innerHTML = parseFloat(distance/1000).toFixed(2) + ' km'
        img_topo.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_topo_modal.src = './images/altitude_' + id.substring(1, id.length - 1) + '.png'
        img_incl.src = './images/inclinacao_' + id.substring(1, id.length - 1) + '.png'
        img_incl_modal.src = './images/inclinacao_' + id.substring(1, id.length - 1) + '.png'
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
        last_line = trip.route[trip.route.length - 1]
        coords = last_line.geometry.coordinates
        L.marker(coords[coords.length - 1], {icon: finishIcon}).addTo(mymap);
    }
    var greenIcon = L.icon({
        iconUrl: 'leaf-green.png',
    
        iconSize:     [38, 95], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.marker([51.5, -0.09], {icon: greenIcon}).addTo(mymap);
    
}

function zoom (el)
{
    if (el.style.width == "500%")
        el.style.width = "150%";
    else 
        el.style.width = "500%";
}