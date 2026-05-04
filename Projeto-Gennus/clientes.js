document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cliente-form");
    const listaHtml = document.getElementById("lista-clientes");
    const btnSalvar = document.getElementById("btn-salvar");
    
    // Carrega clientes do LocalStorage
    let clientes = JSON.parse(localStorage.getItem("gennus_clientes")) || [];

    function renderizarClientes() {
        listaHtml.innerHTML = "";
        clientes.forEach((cli, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cli.nome}</td>
                <td>${cli.email}</td>
                <td>${cli.telefone}</td>
                <td>${cli.documento}</td>
                <td>
                    <button class="btn-edit" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-delete" onclick="excluirCliente(${index})">Excluir</button>
                </td>
            `;
            listaHtml.appendChild(tr);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const id = document.getElementById("cliente-id").value;
        const novoCliente = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            documento: document.getElementById("documento").value
        };

        if (id === "") {
            // Adicionar novo
            clientes.push(novoCliente);
        } else {
            // Editar existente
            clientes[id] = novoCliente;
            document.getElementById("cliente-id").value = "";
            btnSalvar.textContent = "Cadastrar Cliente";
        }

        localStorage.setItem("gennus_clientes", JSON.stringify(clientes));
        form.reset();
        renderizarClientes();
    });

    window.editarCliente = (index) => {
        const cli = clientes[index];
        document.getElementById("nome").value = cli.nome;
        document.getElementById("email").value = cli.email;
        document.getElementById("telefone").value = cli.telefone;
        document.getElementById("documento").value = cli.documento;
        document.getElementById("cliente-id").value = index;
        
        btnSalvar.textContent = "Atualizar Cliente";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.excluirCliente = (index) => {
        if (confirm("Deseja realmente excluir este cliente?")) {
            clientes.splice(index, 1);
            localStorage.setItem("gennus_clientes", JSON.stringify(clientes));
            renderizarClientes();
        }
    };

    renderizarClientes();
});