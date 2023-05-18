
configure_map()
configure_inclination_legend()

// icons
var start_flag = null, finish_flag = null;
var finishIcon = L.icon({
    iconUrl: '../images/finish_flag.png',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [-3, -76]
});
var startIcon = L.icon({
    iconUrl: '../images/bike.png',
    iconSize: [22, 28],
    iconAnchor: [11, 26],
    popupAnchor: [-3, -76]
});
var checkedIcon = L.icon({
    iconUrl: '../images/check_icon.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, 0]
});

function configure_inclination_legend() {
    const legend = document.getElementById('legend_inclinacao')
    const legend_img = document.getElementById('legend_img')
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
}


var mymap = L.map('mapa').setView([-23.57, -46.59], 11);

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