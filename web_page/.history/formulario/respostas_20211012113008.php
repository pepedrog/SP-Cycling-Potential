<?php
    $total = 0;

    $idade20 = 0;
    $idade30 = 0;
    $idade40 = 0;
    $idade50 = 0;
    $idade51 = 0;

    $male = 0;
    $female = 0;
    $others = 0;

    $diariamente = 0;
    $frequentemente = 0;
    $eventualmente = 0;
    $raramente = 0;
    $nunca = 0;

    $naousa = 0;
    $ano0 = 0;
    $ano1 = 0;
    $ano3 = 0;
    $ano5 = 0;

    $escola = 0;
    $trabalho = 0;
    $ferramenta = 0;
    $lazer = 0;
    $outros = 0;

    $norte1 = 0;
    $norte2 = 0;
    $centro = 0;
    $oeste = 0;
    $leste1 = 0;
    $leste2 = 0;
    $sul1 = 0;
    $sul2 = 0;



    $dir = './respostas';
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if($file != '.' && $file != '..') {
                    $total++;
                    $json =  file_get_contents($dir . '/' . $file);
                    $answer = json_decode($json, true);

                    if ($answer['genero'] == 'M') $male++;
                    else if ($answer['genero'] == 'F') $female++;
                    else $others++;

                    if ($answer['idade'] < 20) $idade20++;
                    else if ($answer['idade'] < 30) $idade30++;
                    else if ($answer['idade'] < 40) $idade40++;
                    else if ($answer['idade'] < 50) $idade50++;
                    else $idade51++;

                    if ($answer['frequencia'] == 'Diariamente') $diariamente++;
                    else if ($answer['frequencia'] == 'Frequentemente') $frequentemente++;
                    else if ($answer['frequencia'] == 'Eventualmente') $eventualmente++;
                    else if ($answer['frequencia'] == 'Raramente') $raramente++;
                    else $nunca++;

                    if ($answer['tempo'] == 'N') $naousa++;
                    else if ($answer['tempo'] == 0) $ano0++;
                    else if ($answer['tempo'] == 1) $ano1++;
                    else if ($answer['tempo'] == 3) $ano3++;
                    else $ano5++;
                }
            }
            closedir($dh);
        }
    }

    echo '<p><b>Total de respostas:</b> &nbsp;&nbsp;' . $total . '</p> <hr>';

    echo '<p><b>Gênero:</b><br>Masc: &nbsp; ' . $male . '<br>Fem: &nbsp;';
    echo $female . '<br>Outros / Prefiro não dizer: &nbsp;' . $others . '</p> <hr>';

    echo '<p><b>Idade:</b><br>&lt; 20: &nbsp;' . $idade20 . '<br>&lt; 30: &nbsp;';
    echo $idade30 . '<br>&lt; 40: &nbsp;' . $idade40 . '<br>&lt; 50: &nbsp;';
    echo $idade50 . '<br>&GreaterEqual; 50: &nbsp;' . $idade51 .  '</p> <hr>';

    echo '<p><b>Frequência:</b><br>Diariamente: &nbsp;' . $dirariamente . '<br>Frequentemente: &nbsp;';
    echo $frequentemente . '<br>Eventualmente: &nbsp;' . $eventualmente . '<br>Raramente: &nbsp;';
    echo $raramente . '<br>Nunca: &nbsp;' . $nunca .  '</p> <hr>';

    echo '<p><b>Tempo:</b><br>Não usa: &nbsp;' . $naousa . '<br>Menos de 1 ano: &nbsp;';
    echo $ano0 . '<br>1 a 2 anos: &nbsp;' . $ano1 . '<br>3 a 4 anos: &nbsp;';
    echo $ano3 . '<br>5 anos ou mais: &nbsp;' . $ano5 .  '</p> <hr>';

?>