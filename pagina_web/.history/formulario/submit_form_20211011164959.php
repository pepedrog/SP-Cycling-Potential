<?php
    echo(getdate())
    $myfile = fopen("respostas/" . date("Y_m_d_His") , "w") or die("Unable to open file!");
    $entityBody = file_get_contents('php://input');
    fwrite($myfile, $entityBody);
    fclose($myfile);
?> 