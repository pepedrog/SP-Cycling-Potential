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

var dist_mean_ans = []
var incl_mean_ans = []
var final_mean_ans = []

var answers_dist = []
var answers_incl = []
var answers_incl_pot = []
var answers_dist_pot = []
function get_answers() {
    for (const key of regions) {
        for (const route of routes_per_region[key]) {
            means = iter_answers(route.id)
            dist_mean_ans.push(means[0])
            incl_mean_ans.push(means[1])
            final_mean_ans.push(means[2])
        }
    }
}

function iter_answers(id) {
    let sum_dist = 0
    let sum_incl = 0
    let sum_final = 0
    let count = 0
    let index = 0
    for (const answer of answers) {
        for (const a of answer.avaliacoes) {
            if (a.id == id) {
                count++
                sum_dist += parseInt(a.dist);
                sum_incl += parseInt(a.incl);
                sum_final += parseInt(a.final);

                answers_dist.push(parseInt(a.dist))
                answers_incl.push(parseInt(a.incl))
                index = ids_regions.indexOf(parseInt(a.id))
                answers_dist_pot.push(dist_potentials[index])
                answers_incl_pot.push(incl_potentials[index])
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

function get_endpoints(m, f_0) {
    let p0 = [0, f_0]
    let p1 = [5, 5 * m + f_0]
    return [p0, p1]
}

function plot_scatter(x, y, title, element,
    range_x = [0, 1.1], title_x = 'potencial',
    range_y = [0, 6], title_y = 'respostas') {
    let trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: 'Outras',
        marker: { size: 10 }
    };
    let trace2 = {
        x: [x[10], x[11], x[12], x[13], x[14]],
        y: [y[10], y[11], y[12], y[13], y[14]],
        mode: 'markers',
        type: 'scatter',
        name: 'Oeste',
        marker: { size: 13 }
    };

    let line = linear_approx(x, y, x.length)
    let point = get_endpoints(line[0], line[1])
    let trace3 = {
        x: [point[0][0], point[1][0]],
        y: [point[0][1], point[1][1]],
        mode: 'lines',
        type: 'scatter',
        name: 'LSM: ' + (Math.round(line[0] * 100) / 100)
    };
    let data = [trace1, trace2, trace3];


    let layout = {
        xaxis: {
            range: range_x,
            title: title_x
        },
        yaxis: {
            range: range_y,
            title: title_y
        },
        title: title
    };


    Plotly.newPlot(element, data, layout);
}

function linear_approx(x, y, n) {
    let x_bar = 0, y_bar = 0, count = 0
    for (let i = 0; i < n; i++) {
        if (isNaN(x[i]) || isNaN(y[i])) continue
        x_bar += x[i]
        y_bar += y[i]
        count++
    }
    x_bar = x_bar / count
    y_bar = y_bar / count

    let numerator = 0, denumerator = 0
    for (let i = 0; i < n; i++) {
        if (isNaN(x[i]) || isNaN(y[i])) continue
        numerator += (x[i] - x_bar) * (y[i] - y_bar)
        denumerator += (x[i] - x_bar) * (x[i] - x_bar)

    }
    let slope = numerator / denumerator
    let f_0 = y_bar - slope * x_bar
    return [slope, f_0]
}

function csv_headers(only_users) {
    let headers = 
    "ordem_resposta;" +
    "data_hora;" +
    "cod_origem;" +
    "idade;" +
    "genero;" +
    "frequencia;" +
    "anos_exp;" +
    "motivos;" +
    "regiao;"

    if (!only_users)
        headers += 
        "id_rota;" +
        "nota_distancia;" +
        "nota_inclinacao;" +
        "nota_chance_bici;" +
        "comentario;"
    
    return headers + "\n"
}


function csv_content(only_users) {
    let content = ""
    
    for (let i = 0; i < length(answers); i++) {
        content += i + ";" +
        answers[i]['data_hora'] + ";" +
        answers[i]['origem'] + ";" + 
        answers[i]['idade'] + ";" + 
        answers[i]['genero'] + ";" +
        answers[i]['frequencia'] + ";" +
        answers[i]['tempo'] + ";"
        for (const m of answers[i]['motivos'])
            content += m + " - ";
        content += ";" +
        answers[i]['regiao'] + ";";

        if (!only_users) {
            for (const a of answers[i]['avaliacoes']) {
                content += a['id'] + ";"
                content += a['dist'] + ";"
                content += a['incl'] + ";"
                content += a['final'] + ";"
                content += a['coment'].replace(";", ",")
                content += "\n"
            }
        }
        else content += "\n"
        return content
    }
}

function answers_to_csv (only_users) {
    let csv = csv_headers(only_users)
    csv += csv_content(only_users)
    csv = encodeURIComponent("\uFEFF" + csv)
    csv = "data:text/csv;charset=utf-8," + csv

    let a = window.document.createElement('a');
    a.setAttribute('href', csv);
    a.setAttribute('download', only_users ? "usuarios.csv" : "respostas.csv");
    window.document.body.appendChild(a);
    a.click();
}

function plot_heatmaps() {
    get_potentials()
    get_answers()
    
    plot_scatter(dist_potentials, dist_mean_ans, 'distância', 'dist_mean_answers_chart')
    plot_scatter(incl_potentials, incl_mean_ans, 'inclinação', 'incl_mean_answers_chart')
    //plot_scatter(answers_dist_pot, answers_dist, 'geral', 'dist_answers_chart')
    //plot_scatter(answers_incl_pot, answers_incl, 'geral', 'incl_answers_chart')
    plot_scatter(final_mean_ans, dist_mean_ans, 'distância', 'dist_answers_chart',
        range_x = [0, 5.2], title_x = 'Propensão de usar a bicicleta',
        range_y = [0, 5.2], title_y = 'Resposta Distância')
    plot_scatter(final_mean_ans, incl_mean_ans, 'inclinação', 'incl_answers_chart',
        range_x = [0, 5.2], title_x = 'Propensão de usar a bicicleta',
        range_y = [0, 5.2], title_y = 'Resposta Inclinação')
    //plot_scatter(final_pontentials, final_mean_ans, 'geral', 'final_answers_chart')
}