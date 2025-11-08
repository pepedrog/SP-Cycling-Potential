<?php
    $total = 0;
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
                    echo $json;
                    $answer = json_decode($json, true);
                    echo $answer;
                }
            }
            closedir($dh);
        }
    }
?>