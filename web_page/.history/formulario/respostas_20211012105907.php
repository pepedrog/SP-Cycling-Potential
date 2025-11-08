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
                    echo 'teste';
                    echo file_get_contents($dir . '/' . $file) . '<br>';
                }
            }
            closedir($dh);
        }
    }
?>