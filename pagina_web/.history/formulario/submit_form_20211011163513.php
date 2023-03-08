<?php
    $myfile = fopen("respostas/" + getdate() , "w") or die("Unable to open file!");
    $txt = "John Doe testando\n";
    fwrite($myfile, $txt);
    $entityBody = file_get_contents('php://input');
    fwrite($myfile, $entityBody);
    fclose($myfile);
?> 