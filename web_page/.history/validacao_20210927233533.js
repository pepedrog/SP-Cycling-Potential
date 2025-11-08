//document.getElementById('pagina_2').style.display = "none"
document.getElementById('btn_voltar').style.display = "none"

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
          $(this).append('<span class="help">' + $(this).attr("title") + '</span>');
        } else {
          title.remove();
        }
    }
});