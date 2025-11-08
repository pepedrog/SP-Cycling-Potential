<?php
    $to      = 'gigeck.pedro@usp.br';
    $subject = 'Resposta Formulário Potencial Ciclável';
    $message = 'tesste';
    $headers = 'From: gigeck.pedro@usp.br'       . "\r\n" .
                 'Reply-To: gigeck.pedro@usp.br' . "\r\n" .
                 'X-Mailer: PHP/' . phpversion();

    mail($to, $subject, $message, $headers);
?>