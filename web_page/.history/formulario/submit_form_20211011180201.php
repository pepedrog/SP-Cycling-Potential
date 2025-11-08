<?php
    $filename = "respostas/" . date("Y_m_d_His")
    $myfile = fopen($filename, "w") or die("Unable to open file!");
    $body = file_get_contents('php://input');
    fwrite($myfile, $body);
    fclose($myfile);

    chmod($filename, 0600);
?> 