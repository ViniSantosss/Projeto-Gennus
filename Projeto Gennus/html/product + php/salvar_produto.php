<?php
// o php precisa do xampp instalado para funcionar e tambem t6em que estar dentro da pasta htdocs. porem farei a conexao.
// define que este arquivo vai devolver uma resposta no formatop JSON(sexta feira 13)
header('Content-Type: application/json');

// Pega os dados que o JavaScript enviou
$dadosBrutos = file_get_contents("php://input");
$produto = json_decode($dadosBrutos, true);

if ($produto) {
    // Nome do nosso arquivo de texto que vai fingir ser o banco de dados
    $nomeDoArquivo = 'banco_falso.json';
    
    // Começamos com uma lista vazia
    $listaDeProdutos = array();

    // 1. Verifica se o arquivo já existe no computador
    if (file_exists($nomeDoArquivo)) {
        // Se existe, lê o que está escrito lá dentro
        $conteudo = file_get_contents($nomeDoArquivo);
        
        // Se o arquivo não estiver vazio, decodifica os dados
        if (!empty($conteudo)) {
            $listaDeProdutos = json_decode($conteudo, true);
        }
    }

    // 2. Adiciona o produto novo que acabou de chegar do formulário
    $listaDeProdutos[] = $produto;

    // 3. Salva a lista atualizada de volta no arquivo de texto
    file_put_contents($nomeDoArquivo, json_encode($listaDeProdutos, JSON_PRETTY_PRINT));

    // Avisa o JavaScript que deu tudo certo
    http_response_code(200);
    echo json_encode([
        "mensagem" => "Sucesso! Produto recebido e salvo no nosso banco de mentirinha."
    ]);

} else {
    // Se der erro ou chegar vazio
    http_response_code(400);
    echo json_encode([
        "mensagem" => "Erro: Nenhum dado chegou no PHP."
    ]);
}
?>