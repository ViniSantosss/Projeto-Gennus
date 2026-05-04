document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("produto-form");
    const listaHtml = document.getElementById("lista-produtos");
    let produtos = JSON.parse(localStorage.getItem("gennus_prods")) || [];

    function renderizar() {
        if (!listaHtml) return;
        listaHtml.innerHTML = "";
        produtos.forEach((p, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.nome}</td>
                <td>R$ ${parseFloat(p.custo).toFixed(2)}</td>
                <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
                <td>${p.estoque} ${p.unidade}</td>
                <td>
                    <button onclick="editarProd(${i})" style="color:var(--roxo); background:none; border:none; cursor:pointer;">Editar</button>
                    <button onclick="excluirProd(${i})" style="color:var(--vermelho); background:none; border:none; cursor:pointer; margin-left:10px;">Excluir</button>
                </td>
            `;
            listaHtml.appendChild(tr);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("prod-id").value;
        const dados = {
            nome: document.getElementById("prod-nome").value,
            categoria: document.getElementById("prod-categoria").value,
            unidade: document.getElementById("prod-unidade").value,
            custo: parseFloat(document.getElementById("prod-custo").value) || 0,
            preco: parseFloat(document.getElementById("prod-preco").value) || 0,
            estoque: parseFloat(document.getElementById("prod-estoque").value) || 0
        };

        if (id === "") produtos.push(dados);
        else { produtos[id] = dados; document.getElementById("prod-id").value = ""; }

        localStorage.setItem("gennus_prods", JSON.stringify(produtos));
        form.reset();
        renderizar();
        alert("Produto salvo!");
    });

    window.editarProd = (i) => {
        const p = produtos[i];
        document.getElementById("prod-id").value = i;
        document.getElementById("prod-nome").value = p.nome;
        document.getElementById("prod-custo").value = p.custo;
        document.getElementById("prod-preco").value = p.preco;
        document.getElementById("prod-estoque").value = p.estoque;
        document.getElementById("prod-unidade").value = p.unidade;
    };

    window.excluirProd = (i) => {
        if(confirm("Excluir?")) {
            produtos.splice(i, 1);
            localStorage.setItem("gennus_prods", JSON.stringify(produtos));
            renderizar();
        }
    };

    renderizar();
});