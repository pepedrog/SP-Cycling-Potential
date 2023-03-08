<?php
    ini_set('display_errors', true); 
    error_reporting(E_ALL);
    $to      = 'gigeck.pedro@hotmail.com';
    $subject = 'Resposta Formulário Potencial Ciclável';
    $message = 'tesste';
    $headers = 'From: gigeck.pedro@usp.br'       . "\r\n" .
                 'Reply-To: gigeck.pedro@usp.br' . "\r\n" .
                 'X-Mailer: PHP/' . phpversion() .
                 "MIME-Version: 1.0" . "\r\n" .
                 "Content-type: text/plain; charset=UTF-8" . "\r\n";
    echo 'help';
    if(mail($to, $subject, $message, $headers, '-r'.$sender))
        echo 'aqui';
    else {
        echo error_get_last();
        echo '\n aaaaa';
    }
?>