const formProduto = document.getElementById('form-produto');

formProduto.addEventListener('submit', function(evento){
    evento.preventDefault();

    const formData = new FormData(formProduto);

    const dadosDoProduto = {
        nome: formData.get('product-name'),
        descricao: formData.get('product-description'),
        preco:  formData.get('product-price'),
        estoque:  formData.get('product-stock'),
        status:  formData.get('product-status')
    };

    fetch('salvar_produto.php',{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(dadosDoProduto)
    })
    .then(resposta => resposta.json())
    .then(dados =>{
        alert('produto salvo com sucesso');
        formProduto.reset();
    })
    .catch(erro =>{
        console.error('erro ao salvar o produto:', erro);
        alert('erro ao connectar com o servidor');
    });
});