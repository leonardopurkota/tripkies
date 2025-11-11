<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nome = strip_tags(trim($_POST["nome"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $mensagem = trim($_POST["mensagem"] ?? '');

    if (empty($nome) || empty($mensagem) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Preencha todos os campos corretamente."]);
        exit;
    }

    $to = "contato@tripkies.com";
    $subject = "📩 Nova mensagem do site Tripkies";
    $body = "Nome: $nome\nEmail: $email\n\nMensagem:\n$mensagem";

    $headers = "From: Tripkies Site <contato@tripkies.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $body, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Mensagem enviada com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Erro ao enviar a mensagem. Tente novamente."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método não permitido."]);
}
?>
