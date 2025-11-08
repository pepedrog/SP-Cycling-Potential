<?php
    $total = 0;
    $avaliacoes = 0;
    $last_answer = '2021_09_30';

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

    $estudo = 0;
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

                    if (strcmp($last_answer, $file) < 0) $last_answer = $file;

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

                    foreach ($answer['motivos'] as $motivo) {
                        if ($motivo == 'Estudo') $estudo++;
                        else if ($motivo == 'Trabalho') $trabalho++;
                        else if ($motivo == 'Ferramenta') $ferramenta++;
                        else if ($motivo == 'Lazer') $lazer++;
                        else $outros++;
                    }

                    foreach ($answer['regioes'] as $regiao) {
                        if ($regiao == 'sul1') $sul1++;
                        else if ($regiao == 'sul2') $sul2++;
                        else if ($regiao == 'centro') $centro++;
                        else if ($regiao == 'oeste') $oeste++;
                        else if ($regiao == 'leste1') $leste1++;
                        else if ($regiao == 'leste2') $leste2++;
                        else if ($regiao == 'norte1') $norte1++;
                        else $norte2++;
                    }

                    $avaliacoes += count($answer['avaliacoes']);
                }
            }
            closedir($dh);
        }
    }

    echo '<p><b>Total de respostas:</b> &nbsp;&nbsp;' . $total . '</p>';
    echo '<p><b>Rotas Avaliadas:</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $avaliacoes . '</p>';
    echo '<p><b>Última respostas:</b> &nbsp;&nbsp;' . substr($last_answer, 0, 10) . ' ';
    echo substr($last_answer, 11, 2) . ':' .  str_replace("_", "/", substr($last_answer, 13, 2)) . '</p> <hr>';

    echo '<p><b>Gênero:</b></p><p>Masculino: &nbsp; ' . $male . '<br>Feminino: &nbsp;';
    echo $female . '<br>Outros / Prefiro não dizer: &nbsp;' . $others . '</p> <hr>';

    echo '<p><b>Idade:</b></p><p>&lt; 20: &nbsp;' . $idade20 . '<br>&lt; 30: &nbsp;';
    echo $idade30 . '<br>&lt; 40: &nbsp;' . $idade40 . '<br>&lt; 50: &nbsp;';
    echo $idade50 . '<br>&GreaterEqual; 50: &nbsp;' . $idade51 .  '</p> <hr>';

    echo '<p><b>Frequência:</b></p><p><table><tr><td>Diariamente: &nbsp;</td><td>' . $diariamente . '</td></tr><tr><td>Frequentemente: &nbsp;</td><td>';
    echo $frequentemente . '</td></tr><tr><td>Eventualmente: &nbsp;</td><td>' . $eventualmente . '</td></tr><tr><td>Raramente: &nbsp;</td><td>';
    echo $raramente . '</td></tr><tr><td>Nunca: &nbsp;</td><td>' . $nunca .  '</td></tr></table></p> <hr>';

    echo '<p><b>Tempo:</b></p><p><table><tr><td>Não usa: &nbsp;</td><td>' . $naousa . '</td></tr><tr><td>Menos de 1 ano: &nbsp;</td><td>';
    echo $ano0 . '</td></tr><tr><td>1 a 2 anos: &nbsp;</td><td>' . $ano1 . '</td></tr><tr><td>3 a 4 anos: &nbsp;</td><td>';
    echo $ano3 . '</td></tr><tr><td>5 anos ou mais: &nbsp;</td><td>' . $ano5 .  '</td></tr></table></p> <hr>';

    echo '<p><b>Motivos:</b></p><p><table><tr><td>Chegar à escola ou faculdade: &nbsp;</td><td>' . $estudo . '</td></tr><tr><td>Chegar ao trabalho: &nbsp;</td><td>';
    echo $trabalho . '</td></tr><tr><td>Ferramenta de trabalho: &nbsp;</td><td>' . $ferramenta . '</td></tr><tr><td>Lazer: &nbsp;</td><td>';
    echo $lazer . '</td></tr><tr><td>Outros: &nbsp;</td><td>' . $outros .  '</td></tr></table></p> <hr>';

    echo '<p><b>Regiões:</b></p><p><table><tr><td>Norte 1: &nbsp;</td><td>' . $norte1 . '</td></tr><tr><td>Norte 2: &nbsp;</td><td>';
    echo $norte2 . '</td></tr><tr><td>Oeste: &nbsp;</td><td>' . $oeste . '</td></tr><tr><td>Centro: &nbsp;</td><td>';
    echo $centro . '</td></tr><tr><td>Leste 1: &nbsp;</td><td>' . $leste1 . '</td></tr><tr><td>Leste 2: &nbsp;</td><td>';
    echo $leste2 . '</td></tr><tr><td>Sul 1: &nbsp;</td><td>' . $sul1 . '</td></tr><tr><td>Sul 2: &nbsp;</td><td>';
    echo $sul2 . '</td></tr></table></p> <hr>';

?>