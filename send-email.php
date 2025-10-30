<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $mensagem = trim($_POST["mensagem"]);

    if (empty($nome) || empty($mensagem) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Preencha todos os campos corretamente!";
        exit;
    }

    $to = "contato@tripkies.com";
    $subject = "Nova mensagem do site Tripkies";
    $body = "Nome: $nome\nEmail: $email\nMensagem:\n$mensagem";
    $headers = "From: $nome <$email>";

    if (mail($to, $subject, $body, $headers)) {
        http_response_code(200);
        echo "Mensagem enviada com sucesso!";
    } else {
        http_response_code(500);
        echo "Erro ao enviar a mensagem, tente novamente.";
    }
} else {
    http_response_code(403);
    echo "Método inválido.";
}
?>
