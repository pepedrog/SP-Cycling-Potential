<?php
    $dir = './respostas';
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                echo "filename: $file : filetype: " . filetype($dir . $file) . "\n";
            }
            closedir($dh);
        }
    }
?>