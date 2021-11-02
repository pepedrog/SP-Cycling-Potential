const checkbox_satelite = document.getElementById('check_satelite')
const route_eval = document.getElementById('avaliacao')
const img_topo = document.getElementById('topografia_fig')
const text_topo = document.getElementById('topografia_text')
const close_topo = document.getElementById('topografia_x')
const table_dist = document.getElementById('distancias')
const topografia = document.getElementById('topografia')
const btn_save_trip = document.getElementById('btn_avaliar')

const dist_total = document.getElementById('dist_total')
const dist_0 = document.getElementById('dist_0')
const dist_3 = document.getElementById('dist_3')
const dist_5 = document.getElementById('dist_5')
const dist_7 = document.getElementById('dist_7')
const dist_8 = document.getElementById('dist_8')
const dist_up = document.getElementById('dist_subidas')

var page = 1
var already_loaded = false
var selected_regions = []
var selected_reasons = []
var routes_evaluation = []

// document.ready
document.addEventListener("DOMContentLoaded", function () {
    configure_map()
    configure_inclination_legend()

    configure_form()
    hide_map_page()
    document.getElementById("avaliadas").innerText = "0 / " + routes.length
});

function hide_map_page() {
    document.getElementById('pagina_2').style.display = "none"
    document.getElementById('btn_voltar').style.display = "none"
    table_dist.style.display = 'none'
    btn_save_trip.style.display = 'none'
    route_eval.style.display = 'none'
    topografia.style.display = 'none'
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
}

function change_page(direction = 1) {

    const form = document.getElementById("formulario_dados_pessoais")

    if (page == 1) {
        selected_reasons = get_checkbox_value("motivo")
        selected_regions = get_checkbox_value("regiao")
        if (!(form.checkValidity() && validate_reasons() && validate_regions())) {
            form.classList.add("was-validated")
            return
        }
    }

    let html_page = document.getElementById("pagina_" + page)

    // dinâmica para sumir lentamente
    html_page.style.opacity = '0';
    setTimeout(function () {
        page += direction
        html_page.style.display = 'none';
        html_page = document.getElementById("pagina_" + page)
        html_page.style.display = 'block'
        html_page.style.opacity = '1'
        if (page == 1) {
            document.getElementById('btn_voltar').style.display = "none"
            document.getElementById('btn_avancar').style.display = "block"
            hide_route_details()
        }
        else {
            document.getElementById('btn_voltar').style.display = "block"
            document.getElementById('btn_avancar').style.display = "none"
            mymap.invalidateSize()
            window.scrollTo(0, 0)

            if (!already_loaded) {
                load_sao_paulo()
                for (let r of selected_regions)
                    for (let i of routes_per_region[r]) routes.push(i)
                load_routes(routes)

                document.getElementById("avaliadas").innerText = routes_evaluation.length + " / " + routes.length
                disable_regions_checkbox() // desabilita porque se trocar as regiões depois não vai refletir no mapa
                already_loaded = true
            }

        }
    }, 300);
}

function disable_regions_checkbox() {
    const check = document.getElementsByName("regiao");
    for (const el of check) el.disabled = true
}

function get_checkbox_value(name) {
    let selected = []
    const check = document.getElementsByName(name);
    for (const el of check) {
        if (el.checked) selected.push(el.value)
    }
    return selected

}

function validate_regions() {
    document.getElementById('validacao_regiao_0').style.display = 'none'
    if (selected_regions.length == 0) {
        document.getElementById('validacao_regiao_0').style.display = 'block'
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

function reset_radio(name) {
    const radio = document.getElementsByName(name);
    for (const el of radio)
        el.checked = false
}

function reset_eval() {
    reset_radio('dist')
    reset_radio('incl')
    reset_radio('final_eval')
    document.getElementById('comentarios').value = ""
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
            'id': current_route.id,
            'dist': get_radio_value('dist'),
            'incl': get_radio_value('incl'),
            'final': get_radio_value('final_eval'),
            'coment': document.getElementById('comentarios').value
        }
    )
}

function save_evaluation() {
    if (!validate_evaluation()) return
    register_evaluation()
    mark_route()
    hide_route_details()

    document.getElementById("avaliadas").innerText = routes_evaluation.length + " / " + routes.length

    if (routes_evaluation.length == routes.length - 1) {
        btn_save_trip.innerText = "salvar e finalizar"
    }

    if (routes_evaluation.length == routes.length) {
        submit_form()
    }
}

function redirect_final() {
    const endereco = window.location.href
    const index = endereco.indexOf("mac0499/")
    window.location.href = endereco.substr(0, index) + "mac0499/formulario/formulario_fim.html"
}

function submit_form() {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(get_form())
    };

    fetch('submit_form.php', options)
        .then(response => console.log(response))
        .then(_ => send_email())
}

function send_email() {

    const api_key = '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'.replace('5', 'a');

    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'api-key': api_key.replace('a', '5')
        },
        body: JSON.stringify({
            sender: { name: 'Formulário Potencial Ciclavel', email: 'gigeck.pedro@usp.br' },
            to: [{ email: 'gigeck.pedro@usp.br', name: 'Pedro' }],
            htmlContent: '<!DOCTYPE html> <html> <body> ' + JSON.stringify(get_form()) + '</body> </html>',
            //textContent:  JSON.stringify(routes_evaluation),
            subject: 'Resposta formulario TCC',


            tags: ['resposta_formulario']
        })
    };

    fetch('https://api.sendinblue.com/v3/smtp/email', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .then(_ => redirect_final())
        .catch(err => console.error(err));
}

function get_form() {
    form =
    {
        'email': document.getElementById("txt_email").value,
        'idade': document.getElementById("txt_idade").value,
        'genero': document.getElementById('select_genero').value,
        'frequencia': document.getElementById('select_frequencia').value,
        'tempo': document.getElementById('select_tempo').value,
        'motivos': selected_reasons,
        'regioes': selected_regions,
        'avaliacoes': routes_evaluation
    }
    return form
}
