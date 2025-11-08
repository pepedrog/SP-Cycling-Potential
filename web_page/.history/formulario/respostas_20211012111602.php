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
                }
            }
            closedir($dh);
        }
    }

    echo '<p><b>Total de respostas:</b> &nbsp;&nbsp;' . $total . '</p> <hr>';
    echo '<p><b>Gênero:</b><br>Masc: &nbsp; ' . $male . '<br>Fem: &nbsp;' . $female . '<br>Outros / Prefiro não dizer: &nbsp;' . $others . '</p> <hr>';
    echo '<p><b>Idade:</b><br>&lt; 20: &nbsp; ' . $idade20 . '<br>&lt; 30: &nbsp;' . $idade30 . '<br>&lt; 40: &nbsp;' . $idade40;
    echo '<br>&lt; 50: &nbsp;' . $idade50 . '<br>&gteq; 50: &nbsp;' . $idade51 .  '</p> <hr>';
    echo '<p><b>Total de respostas:</b> &nbsp;&nbsp;' . $total . '</p>';
?>