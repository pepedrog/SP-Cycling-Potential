const route_data = document.getElementById('info_rota')
const checkbox_color_map = document.getElementById('mapa_colorido')
route_data.style.display = 'none'
var mymap = L.map('mapid').setView([-23.55, -46.63], 11);

checkbox_color_map.addEventListener('change', (event) => {
    let id;
    if (event.currentTarget.checked)
        id = 'mapbox/streets-v11'
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

var route = {
    "id": " 1700 ",
    "distance": " 603.3262381793866 ",
    "geometries":
        [
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.641905, -23.56707],
                            [-46.641802, -23.567115],
                            [-46.641721, -23.567176],
                            [-46.641638, -23.567291],
                            [-46.641515, -23.56741],
                            [-46.641446, -23.567503],
                            [-46.641249370469076, -23.5678014847173],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.641249370469076, -23.5678014847173],
                            [-46.641085, -23.568051],
                            [-46.641053, -23.568221],
                            [-46.64111019119504, -23.5687461191545],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64111019119504, -23.5687461191545],
                            [-46.64121846184847, -23.569740240608652],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #D03F2E "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64121846184847, -23.569740240608652],
                            [-46.641273, -23.570241],
                            [-46.641332, -23.570484],
                            [-46.641423, -23.570644],
                            [-46.64148504636613, -23.570640385648574],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " black "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64148504636613, -23.570640385648574],
                            [-46.641526, -23.570638],
                            [-46.642038, -23.570665],
                            [-46.64208059719229, -23.570220772137546],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64208059719229, -23.570220772137546],
                            [-46.642087, -23.570154],
                            [-46.64214390571429, -23.56922281558436],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64214390571429, -23.56922281558436],
                            [-46.642186, -23.568534],
                            [-46.64219615517923, -23.56822426703365],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64219615517923, -23.56822426703365],
                            [-46.642204, -23.567985],
                            [-46.64219117814427, -23.56722450368234],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64219117814427, -23.56722450368234],
                            [-46.642188, -23.567036],
                            [-46.64190068556785, -23.56627709736328],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64190068556785, -23.56627709736328],
                            [-46.641661, -23.565644],
                            [-46.64155787975054, -23.565337850608877],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64155787975054, -23.565337850608877],
                            [-46.641372, -23.564786],
                            [-46.6412494616138, -23.564386693879477],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.6412494616138, -23.564386693879477],
                            [-46.641024, -23.563652],
                            [-46.64096690916364, -23.56342766067827],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64096690916364, -23.56342766067827],
                            [-46.640797, -23.56276],
                            [-46.640762, -23.562742],
                            [-46.640733, -23.562701],
                            [-46.640719, -23.562585],
                            [-46.6406208373754, -23.562621244661393],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.6406208373754, -23.562621244661393],
                            [-46.640589, -23.562633],
                            [-46.639972, -23.562774],
                            [-46.639733, -23.562851],
                            [-46.63972492650797, -23.56276933999203],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63972492650797, -23.56276933999203],
                            [-46.639637, -23.56188],
                            [-46.63962875187752, -23.56177399635177],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63962875187752, -23.56177399635177],
                            [-46.639583, -23.561186],
                            [-46.639531, -23.560894],
                            [-46.639494500414614, -23.56078638915344],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.639494500414614, -23.56078638915344],
                            [-46.639473, -23.560723],
                            [-46.639253, -23.560255],
                            [-46.63902979644965, -23.559904028972305],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63902979644965, -23.559904028972305],
                            [-46.63868, -23.559354],
                            [-46.638584, -23.559162],
                            [-46.638554121596194, -23.55903188437052],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.638554121596194, -23.55903188437052],
                            [-46.638553, -23.559027],
                            [-46.638541, -23.55889],
                            [-46.638216393959326, -23.558096353120742],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.638216393959326, -23.558096353120742],
                            [-46.63783782873202, -23.557170778505345],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63783782873202, -23.557170778505345],
                            [-46.63745926350471, -23.556245203889944],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63745926350471, -23.556245203889944],
                            [-46.637233, -23.555692],
                            [-46.637093515992554, -23.55531464077652],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.637093515992554, -23.55531464077652],
                            [-46.636751, -23.554388],
                            [-46.636747648410264, -23.554376391311948],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.636747648410264, -23.554376391311948],
                            [-46.636641, -23.554007],
                            [-46.636577, -23.553647],
                            [-46.63654860681724, -23.553398741658413],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63654860681724, -23.553398741658413],
                            [-46.636538, -23.553306],
                            [-46.636547, -23.552999],
                            [-46.636587, -23.552771],
                            [-46.636658, -23.552512],
                            [-46.63669394049323, -23.55241923467287],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63669394049323, -23.55241923467287],
                            [-46.636732, -23.552321],
                            [-46.636911, -23.55195],
                            [-46.63717312916693, -23.551544645618154],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63717312916693, -23.551544645618154],
                            [-46.637202, -23.5515],
                            [-46.63776649156534, -23.55073984111293],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63776649156534, -23.55073984111293],
                            [-46.637854, -23.550622],
                            [-46.63831860812161, -23.549906371376665],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63831860812161, -23.549906371376665],
                            [-46.638698, -23.549322],
                            [-46.638808, -23.54907],
                            [-46.63881582945111, -23.549042792657385],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " black "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63881582945111, -23.549042792657385],
                            [-46.638848, -23.548931],
                            [-46.638873, -23.548708],
                            [-46.638827, -23.548532],
                            [-46.638664, -23.548269],
                            [-46.63857029361822, -23.548129626584068],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #D03F2E "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63857029361822, -23.548129626584068],
                            [-46.63801233795739, -23.547299755822714],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63801233795739, -23.547299755822714],
                            [-46.637874, -23.547094],
                            [-46.637709, -23.546888],
                            [-46.6374225064521, -23.546492789330102],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.6374225064521, -23.546492789330102],
                            [-46.63729, -23.54631],
                            [-46.63685864775223, -23.54566705765834],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63685864775223, -23.54566705765834],
                            [-46.63630151416034, -23.544836634777642],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63630151416034, -23.544836634777642],
                            [-46.63574438056844, -23.544006211896946],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63574438056844, -23.544006211896946],
                            [-46.635337, -23.543399],
                            [-46.63519695743238, -23.54316957203624],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63519695743238, -23.54316957203624],
                            [-46.634675950130365, -23.542316019816838],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.634675950130365, -23.542316019816838],
                            [-46.63448, -23.541995],
                            [-46.634182, -23.541479],
                            [-46.634173950153695, -23.541452148414763],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #982123 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.634173950153695, -23.541452148414763],
                            [-46.634039, -23.541002],
                            [-46.634009, -23.540856],
                            [-46.63396454953406, -23.5404775937608],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #982123 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63396454953406, -23.5404775937608],
                            [-46.633855, -23.539545],
                            [-46.63385032941283, -23.539484185062935],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #D03F2E "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63385032941283, -23.539484185062935],
                            [-46.633807, -23.53892],
                            [-46.63375392758715, -23.538489102552866],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63375392758715, -23.538489102552866],
                            [-46.633631684167014, -23.53749660240363],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #025189 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.633631684167014, -23.53749660240363],
                            [-46.633555, -23.536874],
                            [-46.63354077786739, -23.536501578573798],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #0C9CB4 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63354077786739, -23.536501578573798],
                            [-46.633512, -23.535748],
                            [-46.63348, -23.535538],
                            [-46.633471163641126, -23.53550574027711],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.633471163641126, -23.53550574027711],
                            [-46.633228, -23.534618],
                            [-46.633204946945426, -23.534541853987434],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.633204946945426, -23.534541853987434],
                            [-46.632915187009615, -23.533584754630212],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.632915187009615, -23.533584754630212],
                            [-46.6326254270738, -23.53262765527299],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.6326254270738, -23.53262765527299],
                            [-46.632578, -23.532471],
                            [-46.633389766540986, -23.5322698258691],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.633389766540986, -23.5322698258691],
                            [-46.633841, -23.532158],
                            [-46.634231, -23.53214],
                            [-46.63437239459067, -23.532109242085795],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63437239459067, -23.532109242085795],
                            [-46.634539, -23.532073],
                            [-46.63474, -23.531995],
                            [-46.634842, -23.53188],
                            [-46.635287806445895, -23.531765896397772],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.635287806445895, -23.531765896397772],
                            [-46.63625657778866, -23.531517940584294],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63625657778866, -23.531517940584294],
                            [-46.63722534913142, -23.531269984770816],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63722534913142, -23.531269984770816],
                            [-46.63812, -23.531041],
                            [-46.63819341640364, -23.531019464521602],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63819341640364, -23.531019464521602],
                            [-46.638195, -23.531019],
                            [-46.638211, -23.531001],
                            [-46.63854642022438, -23.53008629323427],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63854642022438, -23.53008629323427],
                            [-46.63889069997505, -23.52914742612265],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #F1C359 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63889069997505, -23.52914742612265],
                            [-46.639017, -23.528803],
                            [-46.639082, -23.528729],
                            [-46.639273, -23.528649],
                            [-46.63956904297551, -23.528789230883135],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.63956904297551, -23.528789230883135],
                            [-46.640109, -23.529045],
                            [-46.64030458566256, -23.528693181926915],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #94C280 "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64030458566256, -23.528693181926915],
                            [-46.64079047759803, -23.527819163032927],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64079047759803, -23.527819163032927],
                            [-46.641103, -23.527257],
                            [-46.64078104775831, -23.527103188988388],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " #D03F2E "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.64078104775831, -23.527103188988388],
                            [-46.640092, -23.526774],
                            [-46.639976933339966, -23.52698045534309],
                        ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "color": " yellow "
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates":
                        [
                            [-46.639976933339966, -23.52698045534309],
                            [-46.639815, -23.527271],
                        ]
                }
            },
        ]
}


function whenClicked(route) {
    return function (e) {
        // e = event
        console.log(route)
        route_data.style.display = 'block'
    }
}

function onEachFeature(id, distance) {
    return function (_, layer)
    {
        //bind click
        layer.on({
            click: whenClicked(id, distance)
        });
    }
}

for (r of route.geometries) {
    var myStyle = {
        "color": r['properties']['color'],
        "weight": 5,
        "opacity": 0.9
    };
    L.geoJSON(r, {
        style: myStyle,
        onEachFeature: onEachFeature(route.id, route.distance)
    }).addTo(mymap)
}