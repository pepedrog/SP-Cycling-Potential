<?php
    $filename = "respostas/" . date("Y_m_d_His");
    $myfile = fopen($filename, "w") or die("Unable to open file!");
    $body = file_get_contents('php://input');
    fwrite($myfile, $body);
    fclose($myfile);

    chmod($filename, 0600);

    <?php
    $to      = 'gigeck.pedro@usp.br';
    $subject = 'Resposta Formulário Potencial Ciclável';
    $message = $body;
    $headers = 'From: gigeck.pedro@usp.br'       . "\r\n" .
                 'Reply-To: gigeck.pedro@usp.br' . "\r\n" .
                 'X-Mailer: PHP/' . phpversion();

    mail($to, $subject, $message, $headers);
?>
?> 