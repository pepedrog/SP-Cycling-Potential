<?php
    ini_set('display_errors', true); 
    error_reporting(E_ALL);
    $to      = 'gigeck.pedro@hotmail.com';
    $subject = 'Resposta Formulário Potencial Ciclável';
    $message = 'tesste';
    $headers = 'From: gigeck.pedro@usp.br'       . "\r\n" .
                 'Reply-To: gigeck.pedro@usp.br' . "\r\n" .
                 'X-Mailer: PHP/' . phpversion() . "\r\n" .
                 "MIME-Version: 1.0" . "\r\n" .
                 "Content-type: text/plain; charset=UTF-8";
    echo 'help';
    if(mail($to, $subject, $message, $headers, '-r '.'gigeck.pedro@usp.br'))
        echo 'aqui';
    else {
        echo error_get_last();
        echo "\n" . 'erro aaaaaa';
    }
?>