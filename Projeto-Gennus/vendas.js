document.addEventListener("DOMContentLoaded", () => {
    const formVenda = document.getElementById("venda-form");
    const selectProd = document.getElementById("venda-produto");
    const listaVendasHtml = document.getElementById("lista-vendas-dia");

    let produtos = JSON.parse(localStorage.getItem("gennus_prods")) || [];
    let vendas = JSON.parse(localStorage.getItem("gennus_vendas")) || [];

    function atualizarSelect() {
        if (!selectProd) return;
        selectProd.innerHTML = '<option value="">Selecione um produto</option>';
        produtos.forEach((p, index) => {
            if (p.estoque > 0) {
                selectProd.innerHTML += `<option value="${index}">${p.nome} (Disp: ${p.estoque} ${p.unidade})</option>`;
            }
        });
    }

    formVenda.addEventListener("submit", (e) => {
        e.preventDefault();
        const indexProd = selectProd.value;
        const qtdVendida = parseFloat(document.getElementById("venda-qtd").value);
        
        if (indexProd === "") return alert("Selecione um produto!");

        const produto = produtos[indexProd];

        if (qtdVendida > produto.estoque) {
            alert("Erro: Estoque insuficiente!");
            return;
        }

        // DESCONTO NO ESTOQUE
        produto.estoque = (parseFloat(produto.estoque) - qtdVendida).toFixed(2);
        
        // REGISTRO DA VENDA COM CUSTO PARA O DASHBOARD
        const novaVenda = {
            produto: produto.nome,
            qtd: qtdVendida,
            unidade: produto.unidade,
            valorTotal: (qtdVendida * parseFloat(produto.preco)),
            custoTotal: (qtdVendida * parseFloat(produto.custo || 0)), // AQUI ESTÁ A CORREÇÃO
            data: new Date().toLocaleString()
        };

        vendas.push(novaVenda);
        
        localStorage.setItem("gennus_prods", JSON.stringify(produtos));
        localStorage.setItem("gennus_vendas", JSON.stringify(vendas));

        alert("Venda realizada! O Dashboard foi atualizado.");
        location.reload(); 
    });

    function renderVendas() {
        if (!listaVendasHtml) return;
        listaVendasHtml.innerHTML = "";
        vendas.slice(-5).reverse().forEach(v => {
            listaVendasHtml.innerHTML += `
                <tr>
                    <td>${v.produto}</td>
                    <td>${v.qtd} ${v.unidade}</td>
                    <td>R$ ${v.valorTotal.toFixed(2)}</td>
                    <td>${v.data}</td>
                </tr>
            `;
        });
    }

    atualizarSelect();
    renderVendas();
});