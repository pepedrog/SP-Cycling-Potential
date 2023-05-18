const checkbox_satelite = document.getElementById('check_satelite')
const img_topo = document.getElementById('topografia_fig')
const text_topo = document.getElementById('topografia_text')
const close_topo = document.getElementById('topografia_x')
const table_dist = document.getElementById('distancias')
const topografia = document.getElementById('topografia')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')
const dist_up = document.getElementById('dist_subidas')
var routes_evaluation = []

const english = document.title == 'Cycling Potential - Generic Route'

// document.ready
document.addEventListener("DOMContentLoaded", function () {
    configure_map()
    configure_inclination_legend()

    document.getElementsByClassName("leaflet-control-zoom-out").style.display = 'none'
    document.getElementsByClassName("leaflet-control-zoom-in").style.display = 'none'

    table_dist.style.display = 'none'
    topografia.style.display = 'none'


    load_regions()
    routes = []
    for (const [_, region] of Object.entries(routes_per_region))
        for (let route of region) routes.push(route)
    load_routes(routes)

});

function show_route_details(e, trip) {
    show_topography()
    id = trip.id
    current_route_id = id
    distance = trip.distance

    add_flag_markers(trip)
    fill_ditances(trip)

    fill_potential(trip)

    mymap.flyTo([e.latlng.lat + 0.02, e.latlng.lng + 0.02], 13, {
        animate: true,
        duration: 1 // in seconds
    })
    setTimeout(function () {
        table_dist.style.display = 'block'
        topografia.style.display = 'block'
        img_topo.src = './../images/altitude_0000.png'
        if (english) {
            img_topo.src = './../images/en_altitude_0000.png'
        }
        img_topo.style.backgroundColor = 'white';
        img_topo.style.width = mymap._container.offsetWidth - 10 - table_dist.offsetWidth + "px"
        img_topo.style.height = table_dist.offsetHeight - 20 + "px"
        img_topo.style.maxHeight = mymap._container.offsetHeight / 2 + "px"
    }, 1000)
}

function fill_potential(trip) {
    document.getElementById("pot_dist").innerText = trip.dist_pot
    document.getElementById("pot_incl").innerText = trip.incl_pot
    document.getElementById("pot_final").innerText = trip.final_pot
}

var regions = ['rota_generica']
var ids_regions = []
var dist_potentials = []
var incl_potentials = []
var final_pontentials = []
function get_potentials() {
    for (const key of regions) {
        for (const route of routes_per_region[key]) {
            ids_regions.push(Number(route.id))
            dist_potentials.push(Number(route.dist_pot))
            incl_potentials.push(Number(route.incl_pot))
            final_pontentials.push((parseFloat(route.dist_pot) + parseFloat(route.incl_pot)) / 2)
        }
    }
}

