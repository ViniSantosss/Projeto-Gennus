document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("func-form");
    const listaHtml = document.getElementById("lista-func");
    const tipoContrato = document.getElementById("tipo-contrato");
    const labelDoc = document.getElementById("label-doc");
    const documentoInput = document.getElementById("documento");
    const btnAddBenefit = document.getElementById("add-benefit");
    const extraBenefitsContainer = document.getElementById("extra-benefits-container");

    let funcionarios = JSON.parse(localStorage.getItem("gennus_funcs")) || [];

    // Alternar entre CPF e CNPJ
    tipoContrato.addEventListener("change", () => {
        if (tipoContrato.value === "PJ") {
            labelDoc.textContent = "CNPJ";
            documentoInput.placeholder = "00.000.000/0001-00";
        } else {
            labelDoc.textContent = "CPF";
            documentoInput.placeholder = "000.000.000-00";
        }
    });

    // Função para criar a linha de benefício com botão de excluir
    function criarLinhaBeneficio(valor = "") {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.gap = "10px";
        div.style.marginTop = "10px";
        div.style.alignItems = "center";
        
        div.innerHTML = `
            <div style="flex: 1;">
                <input type="text" class="extra-benefit" value="${valor}" placeholder="Ex: Gympass: R$ 50,00" style="width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; color: #fff;">
            </div>
            <button type="button" class="btn-remove" style="background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); padding: 10px; border-radius: 8px; cursor: pointer;">✕</button>
        `;

        div.querySelector(".btn-remove").addEventListener("click", () => div.remove());
        extraBenefitsContainer.appendChild(div);
    }

    // Botão Adicionar Benefício
    btnAddBenefit.addEventListener("click", () => criarLinhaBeneficio());

    function renderizar() {
        if (!listaHtml) return;
        listaHtml.innerHTML = "";
        funcionarios.forEach((f, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${f.nome}</td>
                <td>${f.tipo}</td>
                <td>${f.doc}</td>
                <td><span class="status-${f.status.toLowerCase()}" style="color: ${f.status === 'Ativo' ? '#22c55e' : '#f87171'}; font-weight: bold;">${f.status}</span></td>
                <td>
                    <button onclick="editar(${i})" style="background:none; border:none; color:var(--roxo); cursor:pointer; font-weight:600;">Editar</button>
                    <button onclick="excluir(${i})" style="background:none; border:none; color:var(--vermelho); cursor:pointer; font-weight:600; margin-left:10px;">Excluir</button>
                </td>
            `;
            listaHtml.appendChild(tr);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("func-id").value;
        
        // Coleta benefícios extras ativos na tela
        const extras = Array.from(document.querySelectorAll(".extra-benefit")).map(input => input.value);

        const dados = {
            nome: document.getElementById("nome").value,
            tipo: tipoContrato.value,
            doc: documentoInput.value,
            salario: parseFloat(document.getElementById("salario").value) || 0, // Salva como número para o cálculo do dashboard
            status: document.getElementById("status").value,
            vt: document.getElementById("vt").value,
            vr: document.getElementById("vr").value,
            extras: extras
        };

        if (id === "") {
            funcionarios.push(dados);
        } else {
            funcionarios[id] = dados;
            document.getElementById("func-id").value = "";
        }

        localStorage.setItem("gennus_funcs", JSON.stringify(funcionarios));
        
        // Alerta e recarregamento para limpar tudo
        alert("Dados salvos com sucesso! As despesas foram atualizadas.");
        location.reload(); 
    });

    window.excluir = (i) => {
        if(confirm("Deseja realmente excluir este funcionário?")) {
            funcionarios.splice(i, 1);
            localStorage.setItem("gennus_funcs", JSON.stringify(funcionarios));
            renderizar();
        }
    };

    window.editar = (i) => {
        const f = funcionarios[i];
        document.getElementById("func-id").value = i;
        document.getElementById("nome").value = f.nome;
        document.getElementById("tipo-contrato").value = f.tipo;
        document.getElementById("documento").value = f.doc;
        document.getElementById("salario").value = f.salario;
        document.getElementById("status").value = f.status;
        document.getElementById("vt").value = f.vt;
        document.getElementById("vr").value = f.vr;

        // Limpa benefícios extras atuais da tela e carrega os do funcionário
        extraBenefitsContainer.innerHTML = "";
        if (f.extras) {
            f.extras.forEach(beneficio => criarLinhaBeneficio(beneficio));
        }

        document.getElementById("btn-salvar").textContent = "Atualizar Cadastro";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    renderizar();
});