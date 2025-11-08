const checkbox_satelite = document.getElementById('check_satelite')
const img_topo = document.getElementById('topografia_fig')
const text_topo = document.getElementById('topografia_text')
const close_topo = document.getElementById('topografia_x')
const table_dist = document.getElementById('distancias')
const topografia = document.getElementById('topografia')
const span_id_route = document.getElementById('id_rota')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')
const dist_up = document.getElementById('dist_subidas')
var routes_evaluation = []

// document.ready
document.addEventListener("DOMContentLoaded", function () {
    configure_map()
    configure_inclination_legend()

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
    span_id_route.innerText = id
    current_route_id = id
    distance = trip.distance

    route_eval.style.display = 'block'
    btn_save_trip.style.display = 'block'

    add_flag_markers(trip)
    fill_ditances(trip)

    fill_potential(trip)
    fill_eval(id)

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

function fill_potential(trip) {
    document.getElementById("pot_dist").innerText = trip.dist_pot
    document.getElementById("pot_incl").innerText = trip.incl_pot
    document.getElementById("pot_final").innerText = trip.final_pot
}

function fill_eval(id) {
    dist_eval = [0, 0, 0, 0, 0]
    incl_eval = [0, 0, 0, 0, 0]
    final_eval = [0, 0, 0, 0, 0]
    comments = []

    for (const answer of answers) {
        for (const a of answer.avaliacoes) {
            if (a.id == id) {
                dist_eval[a.dist - 1]++;
                incl_eval[a.incl - 1]++;
                final_eval[a.final - 1]++;
                comments.push(a.coment)
            }
        }
    }

    write_eval(dist_eval, 'dist')
    write_eval(incl_eval, 'incl')
    write_eval(final_eval, 'final')
    write_comments(comments)
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

