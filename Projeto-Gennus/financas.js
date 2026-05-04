document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("gasto-form");
    const listaHtml = document.getElementById("lista-despesas-total");
    const totalGeralHtml = document.getElementById("total-geral-despesas");

    // Bancos de dados existentes
    let gastosManuais = JSON.parse(localStorage.getItem("gennus_gastos_manuais")) || [];
    let funcionarios = JSON.parse(localStorage.getItem("gennus_funcs")) || [];
    let vendas = JSON.parse(localStorage.getItem("gennus_vendas")) || [];

    function renderizar() {
        listaHtml.innerHTML = "";
        let somaTotal = 0;

        // 1. ADICIONAR CUSTO DE FUNCIONÁRIOS (Automático - Não editável)
        funcionarios.forEach(f => {
            const valor = parseFloat(f.salario) || 0;
            somaTotal += valor;
            listaHtml.innerHTML += `
                <tr>
                    <td>Salário: ${f.nome}</td>
                    <td style="color: #666">Automático (Equipe)</td>
                    <td class="txt-vermelho">R$ ${valor.toFixed(2)}</td>
                    <td><small>Não editável</small></td>
                </tr>
            `;
        });

        // 2. ADICIONAR CUSTO DE PRODUTOS VENDIDOS (Automático - Não editável)
        const custoProdTotal = vendas.reduce((acc, v) => acc + (parseFloat(v.custoTotal) || 0), 0);
        somaTotal += custoProdTotal;
        if(custoProdTotal > 0) {
            listaHtml.innerHTML += `
                <tr>
                    <td>Custo de Mercadorias Vendidas</td>
                    <td style="color: #666">Automático (Estoque)</td>
                    <td class="txt-vermelho">R$ ${custoProdTotal.toFixed(2)}</td>
                    <td><small>Não editável</small></td>
                </tr>
            `;
        }

        // 3. ADICIONAR GASTOS MANUAIS (CRUD - Editável)
        gastosManuais.forEach((g, i) => {
            somaTotal += parseFloat(g.valor);
            listaHtml.innerHTML += `
                <tr>
                    <td>${g.descricao}</td>
                    <td style="color: var(--roxo)">Manual</td>
                    <td class="txt-vermelho">R$ ${parseFloat(g.valor).toFixed(2)}</td>
                    <td>
                        <button onclick="editarGasto(${i})" style="background:none; border:none; color:var(--roxo); cursor:pointer;">Editar</button>
                        <button onclick="excluirGasto(${i})" style="background:none; border:none; color:var(--vermelho); cursor:pointer; margin-left:10px;">Excluir</button>
                    </td>
                </tr>
            `;
        });

        totalGeralHtml.textContent = somaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        // Atualiza o dashboard indiretamente salvando o total de gastos manuais
        localStorage.setItem("total_gastos_manuais_valor", somaTotal);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("gasto-id").value;
        const novoGasto = {
            descricao: document.getElementById("gasto-desc").value,
            valor: parseFloat(document.getElementById("gasto-valor").value)
        };

        if (id === "") {
            gastosManuais.push(novoGasto);
        } else {
            gastosManuais[id] = novoGasto;
            document.getElementById("gasto-id").value = "";
            document.getElementById("btn-salvar-gasto").textContent = "Salvar Gasto";
        }

        localStorage.setItem("gennus_gastos_manuais", JSON.stringify(gastosManuais));
        form.reset();
        renderizar();
    });

    window.editarGasto = (i) => {
        const g = gastosManuais[i];
        document.getElementById("gasto-id").value = i;
        document.getElementById("gasto-desc").value = g.descricao;
        document.getElementById("gasto-valor").value = g.valor;
        document.getElementById("btn-salvar-gasto").textContent = "Atualizar Gasto";
    };

    window.excluirGasto = (i) => {
        if(confirm("Remover esta despesa?")) {
            gastosManuais.splice(i, 1);
            localStorage.setItem("gennus_gastos_manuais", JSON.stringify(gastosManuais));
            renderizar();
        }
    };

    renderizar();
});