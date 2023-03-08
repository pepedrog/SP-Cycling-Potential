<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../mac0499.css" runat="server" type="text/css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!--Leaflet-->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
    <link rel="stylesheet" href="mapas.css" runat="server" type="text/css">
    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>


    <title>Resultados - Avaliação de Ciclabilidade</title>
</head>


<body>
    <div class='language float-right'>
        <a target="blank" href="plano.html">🇧🇷</a>
        <a target="blank" href="en/plan.html">🇬🇧</a>
    </div>
    <div class="main">
        <header class="row justify-content-center">
            <nav class="navbar navbar-expand-lg text links">
                🚴
                <a class="nav-link" href="../index.html">Início</a>
                🚴
                <a class="nav-link" href="../proposta.html">Proposta</a>
                🚴
                <a class="nav-link" href="../plano.html">Plano de Trabalho</a>
                🚴
                <a class="nav-link" href="../material.html">Material</a>
                🚴
            </nav>
        </header>
        <div>
            <main role="main" class="content">
                <hr />
                <br />
                <h2 class="subtitle text-center">Resultados da Pesquisa</h2>
                <h3 class="subtitle text-center">Respostas e Comparação com o Modelo</h3>
                <br />
                <div>
                    <div class="row text-center">
                        <div class="col-12">
                            <button id="btn_show_route" style="width:28%;" class="btn"
                                onclick="show_results_div(1)">Rotas 
                                <button style="width:5%;" class="btn" onclick="answers_to_csv(false)">
                                <i class="fa fa-download"></i>
                                </button> 
                            </button>
                            <button id="btn_show_user" style="width:28%;" class="btn"
                                onclick="show_results_div(0)">Usuários
                                <button style="width:5%;" class="btn" onclick="answers_to_csv(true)">
                                <i class="fa fa-download"></i>
                                </button> 
                            </button>
                            <button id="btn_show_final" style="width:33%;" class="btn"
                                onclick="show_results_div(2)">Validação
                                do Modelo</button>
                        </div>
                    </div>
                    <br />
                    <div class="paginas">
                        <div class="pagina" id="results_user">
                            <div class="row" style="height: 300px;">
                                <span id="total_answers" style="width: 100%"></span>
                            </div>
                            <div class="row" style="height: 400px; margin-top: -60px;">
                                <span id="gender_chart" style="width:45%;"></span>
                                <span style="width:10%;"></span>
                                <span id="age_chart" style="width:40%;"></span>
                            </div>
                            <div class="row" style="height: 400px;">
                                <span id="frequency_chart" style="width:45%;"></span>
                                <span style="width:10%;"></span>
                                <span id="time_chart" style="width:40%;"></span>
                            </div>
                            <div class="row" style="height: 400px;">
                                <span id="reason_chart" style="width:45%;"></span>
                                <span style="width:10%;"></span>
                                <span id="region_chart" style="width:40%;"></span>
                            </div>
                        </div>
                        <div class="pagina" id="results_route">
                            <div class="row">
                                <div class="col-12" style="padding: 0 0 0 0">
                                    <div id="mapa"></div>
                                    <div id="topografia">
                                        <span id="topografia_text" style="display: none; padding: 5px; cursor: pointer;"
                                            onclick="show_topography()">
                                            <b>Mostrar Perfil Topográfico</b></span>
                                        <img id="topografia_fig" title="Perfil Topográfico" onclick='zoom_topography()'>
                                        <span onclick="hide_topography()" id="topografia_x">X</span>

                                    </div>
                                    <div id="distancias" style="background-color: transparent;">
                                        <table class="table table-sm table-bordered"
                                            style="width: auto; margin-bottom: 0; background-color: white;">
                                            <tbody>
                                                <tr style="border: solid black 2px;">
                                                    <td><b>Distância total</b></td>
                                                    <td style="text-align: right;" id="dist_total"></td>
                                                </tr>
                                                <tr style="border: #94c280 2px solid;">
                                                    <td>Plano ou descidas &nbsp;&nbsp; </td>
                                                    <td style="text-align: right;" id="dist_0"></td>
                                                </tr>
                                                <tr style="border: 2px #D03F2E solid; border-bottom-width: 0px;">
                                                    <td>Subidas </td>
                                                    <td style="text-align: right;" id="dist_subidas"></td>
                                                </tr>
                                                <tr
                                                    style=" border-top: 2px dotted #F1C359; border-left: 2px solid #D03F2E; border-right: 2px solid #D03F2E; line-height: 1.2; ">
                                                    <td style="padding-left: 5%;">- Até 3% </td>
                                                    <td style="text-align: right;" id="dist_3"></td>
                                                </tr>
                                                <tr
                                                    style=" border: 2px solid #D03F2E;line-height: 1.2; border-top-style: dotted; border-bottom-width: 0px;">
                                                    <td style="padding-left: 5%;">- Entre 3% e 5% </td>
                                                    <td style="text-align: right; line-height: 1.2; " id="dist_5"></td>
                                                </tr>
                                                <tr
                                                    style="border-top: 2px dotted #982123; border-left: 2px solid #D03F2E; border-right: 2px solid #D03F2E; line-height: 1.2; ">
                                                    <td style="padding-left: 5%;">- Entre 5% e 7% </td>
                                                    <td style="text-align: right;" id="dist_7"></td>
                                                </tr>
                                                <tr
                                                    style="border: 2px solid #D03F2E; border-top: 2px dotted black; line-height: 1.2; ">
                                                    <td style="padding-left: 5%;">- Maior que 7% </td>
                                                    <td style="text-align: right;" id="dist_8"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="satelite">
                                        <input type="checkbox" id="check_satelite">&nbsp;&nbsp; <label
                                            for="check_satelite">Visão
                                            Satélite</label>
                                    </div>
                                    <div id="legend">
                                        <span>Inclinações
                                            <span id="help_inclinacao" style="cursor: pointer;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-question-circle"
                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path
                                                        d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                                </svg>
                                            </span><br /></span>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#025189;" />
                                        </svg>&nbsp;&lt; -5%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#0C9CB4;" />
                                        </svg>&nbsp;-5% a -3%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#94C280;" />
                                        </svg>&nbsp;-3% a -1%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:yellow;" />
                                        </svg>&nbsp;-1% a 1%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#F1C359;" />
                                        </svg>&nbsp; 1% a 3%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#D03F2E;" />
                                        </svg>&nbsp; 3% a 5%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:#982123;" />
                                        </svg>&nbsp; 5% a 7%<br>
                                        <svg width="10px" height="10px">
                                            <rect width="100%" height="100%" style="fill:black;" />
                                        </svg>&nbsp;> 7%<br>
                                    </div>
                                    <div id="legend_inclinacao">
                                        <img id="legend_img" src="../images/legenda.png"
                                            style="width: 100%; height: auto;">
                                    </div>
                                </div>
                            </div>
                            <br>
                            <br>
                            <div id="avaliacao">
                                <b>ID:</b><span id="id_rota"></span><br><br>

                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b></b></label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b>Distância</b></label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b>Inclinação</b></label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b>Idade</b></label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b>Final</b></label>
                                    </div>
                                </div>
                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label><b>Potencial</b></label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="pot_dist">0</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="pot_incl">0</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="pot_age">0</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="pot_final">0</label>
                                    </div>
                                </div>
                                <br><br />
                                <b>Avaliações dessa rota:</b> <br /><br />



                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label style="color: rgb(185, 0, 0);">1 (ruim)</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label style="color: rgb(163, 60, 0);">2</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label style="color: rgb(106, 114, 0);">3</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label style="color: rgb(77, 136, 0);">4</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label style="color: rgb(0, 129, 39);">5 (boa)</label>
                                    </div>
                                </div>
                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <b>Distância</b>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="dist1" style="color: rgb(185, 0, 0);">1</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="dist2" style="color: rgb(163, 60, 0);"
                                            style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">2</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="dist3" style="color: rgb(106, 114, 0);">3</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="dist4" style="color: rgb(77, 136, 0);">4</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="dist5" style="color: rgb(0, 129, 39);">5</label>
                                    </div>
                                </div>
                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <b>Inclinação</b>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="incl1" style="color: rgb(185, 0, 0);">1</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="incl2" style="color: rgb(163, 60, 0);"
                                            style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">2</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="incl3" style="color: rgb(106, 114, 0);">3</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="incl4" style="color: rgb(77, 136, 0);">4</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="incl5" style="color: rgb(0, 129, 39);">5</label>
                                    </div>
                                </div>
                                <div class="row" style="padding-top: 2px; padding-bottom: 2px;">
                                    <div class="col-2"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <b>Geral</b>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="final1" style="color: rgb(185, 0, 0);">1</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="final2" style="color: rgb(163, 60, 0);"
                                            style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">2</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="final3" style="color: rgb(106, 114, 0);">3</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="final4" style="color: rgb(77, 136, 0);">4</label>
                                    </div>
                                    <div class="col-2 text-center"
                                        style="border-bottom: solid lightgray 1px; border-right: solid lightgray 1px;">
                                        <label id="final5" style="color: rgb(0, 129, 39);">5</label>
                                    </div>
                                </div>
                                <br>
                                <b>Comentários:</b>
                                <div class="row" id="comments">
                                </div>
                            </div>
                            <span id="btn_avaliar">
                        </div>
                        <div class="pagina" id="results_final">
                            <hr>
                            <p><b>Distância</b> - média<p>
                            <div class="row">
                                <div class="col-10">
                                    <span id="dist_mean_answers_chart"></span>
                                </div>
                                <div class="col-2">
                                    <select class="form-control form-select" name="genero" id="select_tempo" required>
                                        <option selected disabled value="">Selecione</option>
                                        <option value="0">Geral</option>
                                        <option value="1">Diariamente</option>
                                        <option value="3">Frequentemente</option>
                                        <option value="5">Eventualmente</option>
                                        <option value="5">Raramente</option>
                                        <option value="5">Nunca</option>
                                        <option value="5">Todos</option>
                                    </select>
                                </div>
                            </div>
                            <hr>
                            <p><b>Inclinação</b> - média<p>
                            <div class="row">
                                <span id="incl_mean_answers_chart"></span>
                            </div>
                            <!--
                            <hr>
                            <p><b>Geral</b><p>
                            <div class="row">
                                <span id="final_answers_chart"></span>
                                <span id="final_potential_chart"></span>
                            </div>-->
                            <hr>
                            <p><b>Resposta final (x) vs Resposta Distância (y)</b><p>
                            <div class="row">
                                <span id="dist_answers_chart"></span>
                            </div>
                            <hr>
                            <p><b>Resposta final (x) vs Resposta Inclinação (y)</b><p>
                            <div class="row">
                                <span id="incl_answers_chart"></span>
                            </div>
                            <hr>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>

</html>

<?php

$answers = [];
$total = 0;
$total_trips = 0;
$age_m = [];
$age_f = [];
$age_o = [];
$gender = [];
$frequency = [];
$time = [];
$reason = [];
$region = [];

$hash_time = 
[ 
    'N' => 'Não utiliza',
    '0' => 'Menos de 1 ano',
    '1' => 'Entre 1 e 2 anos',
    '3' => 'Entre 3 e 4 anos',
    '5' => '5 anos ou mais',
];

$dir = './respostas';
$filter_frequency = $_GET['filtro'];
$filter_age_max = $_GET['idade_max'];
$filter_age_min = $_GET['idade_min'];
if (is_dir($dir)) {
    $newFiles = scandir($dir, 0); 
    foreach($newFiles as $file)
    {
        if($file != '.' && $file != '..') {
            
            $json =  file_get_contents($dir . '/' . $file);
            $answer = json_decode($json, true);
            $answer['data_hora'] = $file;
            unset($answer['email']); // privacy

            if ($filter_frequency != '' && 
                $answer['frequencia'] != $filter_frequency)
                continue;

            if ($filter_age_max != '' && 
            $answer['idade'] >= $filter_age_max)
            continue;
            if ($filter_age_min != '' && 
            $answer['idade'] <= $filter_age_min)
            continue;

            $total++;
            $total_trips += count($answer['avaliacoes']);
            
            array_push($answers, $answer);

            if ($answer['genero'] == 'M')
                array_push($age_m, $answer['idade']);
            else if ($answer['genero'] == 'F')
                array_push($age_f, $answer['idade']);
            else 
                array_push($age_o, $answer['idade']);

            array_push($frequency, $answer['frequencia']);
            array_push($time, $hash_time[$answer['tempo']]);

            foreach ($answer['motivos'] as $motivo) 
                array_push($reason, $motivo);

            foreach ($answer['regioes'] as $motivo) 
                array_push($region, $motivo);

            $gender[$answer['genero']]++;
        }
    }
}

?>

<script src="https://cdn.plot.ly/plotly-2.6.3.min.js"></script>
<script src="rotas/centro.js"></script>
<script src="rotas/leste1.js"></script>
<script src="rotas/leste2.js"></script>
<script src="rotas/norte1.js"></script>
<script src="rotas/norte2.js"></script>
<script src="rotas/oeste.js"></script>
<script src="rotas/sul1.js"></script>
<script src="rotas/sul2.js"></script>
<script src="rotas/sp_limits.js"></script>
<script src="mapa.js"></script>
<script src="resultados.js"></script>

<script type="text/javascript">
    var answers = <?php echo(json_encode($answers)); ?>;
    console.log(answers);
    plot_big_numbers (<?php echo($total . ',' . $total_trips); ?>);
    plot_age (<?php echo(json_encode($age_m) . ',' . json_encode($age_f) . ',' . json_encode($age_o)); ?>);
    plot_gender ([<?php echo($gender['F'] . ',' . $gender['M'] . ',' . ($gender['O'] + $gender['N']))?>]);
    plot_histogram (<?php echo(json_encode($frequency));?>, 'Frequência', 'frequency_chart');
    plot_histogram (<?php echo(json_encode($time));?>, 'Tempo de uso', 'time_chart');
    plot_histogram (<?php echo(json_encode($region));?>, 'Região', 'region_chart');
    plot_histogram (<?php echo(json_encode($reason));?>, 'Motivo', 'reason_chart');

    plot_heatmaps()
</script>