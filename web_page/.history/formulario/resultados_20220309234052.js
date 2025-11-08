const checkbox_satelite = document.getElementById('check_satelite')
const route_eval = document.getElementById('avaliacao')
const img_topo = document.getElementById('topografia_fig')
const text_topo = document.getElementById('topografia_text')
const close_topo = document.getElementById('topografia_x')
const table_dist = document.getElementById('distancias')
const topografia = document.getElementById('topografia')
const btn_save_trip = document.getElementById('btn_avaliar')
const span_id_route = document.getElementById('id_rota')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')
const dist_up = document.getElementById('dist_subidas')
var routes_evaluation = []

function plot_age(age_m, age_f, age_o) {
    let data_m = {
        x: age_m,
        type: 'histogram',
        name: 'homens',
        xbins: { size: 5 },
        marker: { color: '#1f77b4' }
    }
    let data_f = {
        x: age_f,
        type: 'histogram',
        name: 'mulheres',
        xbins: { size: 5 },
        marker: { color: 'magenta' }
    }
    let data_o = {
        x: age_o,
        type: 'histogram',
        name: 'outros',
        xbins: { size: 5 },
        marker: { color: 'orange' }
    }
    let layout = {
        title: 'Idade',
        showlegend: true,
        barmode: 'stack',
        xaxis: { title: "Idade" },
        yaxis: { title: "Quantidade de Pessoas" }
    };
    let data = [data_m, data_f, data_o]
    Plotly.newPlot('age_chart', data, layout, { displayModeBar: false, responsive: true });
}

function plot_big_numbers(total_answers, total_trips) {
    let data = [
        {
            type: "indicator",
            mode: "number",
            value: total_answers,
            delta: { reference: 400, relative: true },
            domain: { x: [0, 0.5] },
            title: "Total de Respostas",
        },
        {
            type: "indicator",
            mode: "number",
            value: total_trips,
            domain: { x: [0.5, 1] },
            title: "Rotas Avaliadas",
        },
    ];
    Plotly.newPlot('total_answers', data, {}, { displayModeBar: false, responsive: true });
}

function plot_histogram(values, title, div) {
    let data = [
        {
            x: values,
            type: "histogram",
        }
    ];
    Plotly.newPlot(div, data, { title: title }, { displayModeBar: false, responsive: true });
}

function plot_gender(values) {
    let data = [
        {
            values: values,
            labels: ['Feminino', 'Masculino', 'Outros'],
            marker: {
                colors: ['magenta', '#1f77b4', 'orange']
            },
            title: 'Gênero',
            type: 'pie'
        }]
    Plotly.newPlot('gender_chart', data, {}, { displayModeBar: false, responsive: true });
}

const resut_divs = ['results_user', 'results_route', 'results_final']
function show_results_div(div_id) {
    for (let id in resut_divs) {
        let div = document.getElementById(resut_divs[id])
        if (id == div_id) div.style.display = 'block'
        else div.style.display = 'none'
        mymap.invalidateSize()
    }
}

// document.ready
document.addEventListener("DOMContentLoaded", function () {
    configure_map()
    configure_inclination_legend()
    show_results_div(1)

    table_dist.style.display = 'none'
    btn_save_trip.style.display = 'none'
    route_eval.style.display = 'none'
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

function reset_eval() {
}

function fill_potential(trip) {
    document.getElementById("pot_dist").innerText = trip.dist_pot
    document.getElementById("pot_incl").innerText = trip.incl_pot
    document.getElementById("pot_age").innerText = trip.age_pot
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

function write_eval(eval, id) {
    for (let i = 1; i <= 5; i++) {
        const col = document.getElementById(id + i)
        col.innerText = eval[i - 1]
    }
}

function write_comments(comments) {
    const div = document.getElementById("comments")
    let topics = "<ul>"
    for (const c of comments) {
        if (c != "")
            topics += "<li>" + c + "</li>"
    }
    topics += "</ul>"
    div.innerHTML = topics
}

function plot_heatmap(values, colors, title, div) {
    var data = [
        {
            z: values,
            x: ['Norte 1', 'Norte 2', 'Oeste', 'Centro', 'Leste 1', 'Leste 2', 'Sul 1', 'Sul 2'],
            y: ['Rota 5', 'Rota 4', 'Rota 3', 'Rota 2', 'Rota 1'],
            type: 'heatmap',
            hoverongaps: false,
            colorscale: colors,
            reversescale: true
        }
    ];

    let layout = {
        title: title,
        width: 400
    };
    Plotly.newPlot(div, data, layout, { displayModeBar: false, responsive: true });
}

var regions = ['norte1', 'norte2', 'oeste', 'centro', 'leste1', 'leste2', 'sul1', 'sul2']
var ids_regions = [[], [], [], [], []]
var dist_pontentials = [[], [], [], [], []]
var incl_pontentials = [[], [], [], [], []]
var final_pontentials = [[], [], [], [], []]
function get_potentials() {
    let i = 0
    for (const key of regions) {
        for (const route of routes_per_region[key]) {
            ids_regions[i].push(route.id)
            dist_pontentials[i].push(route.dist_pot)
            incl_pontentials[i].push(route.incl_pot)
            final_pontentials[i].push((parseFloat(route.dist_pot) + parseFloat(route.incl_pot)) / 2)
            i++
        }
        i = 0
    }
    console.log(ids_regions)
}

var dist_mean_ans = [[], [], [], [], []]
var incl_mean_ans = [[], [], [], [], []]
var final_mean_ans = [[], [], [], [], []]
function get_mean_answers() {
    let i = 0
    for (const key of regions) {
        for (const route of routes_per_region[key]) {
            means = get_means(route.id)
            dist_mean_ans[i].push(means[0])
            incl_mean_ans[i].push(means[1])
            final_mean_ans[i].push(means[2])
            i++
        }
        i = 0
    }
}

function get_means(id) {
    let sum_dist = 0
    let sum_incl = 0
    let sum_final = 0
    let count = 0
    for (const answer of answers) {
        for (const a of answer.avaliacoes) {
            if (a.id == id) {
                count++
                sum_dist += parseInt(a.dist);
                sum_incl += parseInt(a.incl);
                sum_final += parseInt(a.final);
            }
        }
    }
    return [sum_dist / count, sum_incl / count, sum_final / count]
}
/*
plot_distance_potential([[1, null, 30, 50, 1, 1, 3, 4],
    [10, 50, 40, 50, 1, 1, 3, 4],
    [30, 7, 10, 20, 1, 1, 3, 4],
    [20, 1, 60, 80, 30, 50, 40, 8],
    [7, 9, 50, 30, 60, 1, -10, 20]], 'Potencial - Distância', 'dist_potential_chart')*/

function transpose_array (matrix) {
    let output = [
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0], 
        [0,0,0,0,0]
    ]
    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 8; j++)
            output[j][i] = matrix[i][j]
    return output
}

function join_array (matrix) {
    output = []
    for (x of matrix)
        for (y of x) 
            output.push(y)
    return output            
}

function plot_scatter(x, y, title, element) {
    x = transpose_array(x)
    y = transpose_array(y)

    var trace1 = {
        x: join_array(x),
        y: join_array(y),
        mode: 'markers',
        type: 'scatter',
        name: 'Outras',
        marker: { size: 5 }
    };
    var trace2 = {
        x: x[2],
        y: y[2],
        mode: 'markers',
        type: 'scatter',
        name: 'Oeste',
        marker: { size: 10 }
    };

    var data = [trace1, trace2];


    var layout = {
        xaxis: {
            range: [0, 1],
            label: 'potencial'
        },
        yaxis: {
            range: [0, 6],
            label: 'respostas'
        },
        title: title
    };


    Plotly.newPlot(element, data, layout);
}

function plot_heatmaps() {

    get_potentials()
    get_mean_answers()

    /*
    plot_heatmap(dist_pontentials, 'Portland', 'Potencial', 'dist_potential_chart')
    plot_heatmap(dist_mean_ans, 'Portland', 'Média das Respostas', 'dist_answers_chart')

    plot_heatmap(incl_pontentials, 'Portland', 'Potencial', 'incl_potential_chart')
    plot_heatmap(incl_mean_ans, 'Portland', 'Média das Respostas', 'incl_answers_chart')

    plot_heatmap(final_pontentials, 'Portland', 'Potencial', 'final_potential_chart')
    plot_heatmap(final_mean_ans, 'Portland', 'Média das Respostas', 'final_answers_chart')
*/
    plot_scatter(dist_pontentials, dist_mean_ans, 'distância', 'dist_answers_chart')
    plot_scatter(incl_pontentials, incl_mean_ans, 'inclinação', 'incl_answers_chart')
    plot_scatter(final_pontentials, final_mean_ans, 'geral', 'final_answers_chart')
}


