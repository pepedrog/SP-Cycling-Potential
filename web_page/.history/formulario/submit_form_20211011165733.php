<?php
    $myfile = fopen("respostas/" . date("Y_m_d_His") , "w") or die("Unable to open file!");
    $body = file_get_contents('php://input');
    fwrite($myfile, $body);
    fclose($myfile);

    mail("gigeck.pedro@usp.br", "Resposta Formulário Ciclabilidade", $body,)
?> 