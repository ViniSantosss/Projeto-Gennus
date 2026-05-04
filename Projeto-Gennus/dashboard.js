document.addEventListener("DOMContentLoaded", () => {
    // 1. CARREGAR DADOS DO USUÁRIO
    const user = JSON.parse(localStorage.getItem("gennus_usuario_logado"));
    if (user) {
        document.getElementById("side-user-name").textContent = user.nome;
        document.getElementById("user-initials").textContent = user.nome.charAt(0).toUpperCase();
        document.getElementById("welcome-title").textContent = `Dashboard — ${user.nome}`;
    }

    // 2. BUSCAR DADOS REAIS
    const vendas = JSON.parse(localStorage.getItem("gennus_vendas")) || [];
    const funcs = JSON.parse(localStorage.getItem("gennus_funcs")) || [];
    const manuais = JSON.parse(localStorage.getItem("gennus_gastos_manuais")) || [];

    // 3. CÁLCULOS
    const receitaTotal = vendas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
    const custoEstoque = vendas.reduce((acc, v) => acc + (v.custoTotal || 0), 0);
    const totalSalarios = funcs.reduce((acc, f) => acc + (parseFloat(f.salario) || 0), 0);
    const outrosGastos = manuais.reduce((acc, g) => acc + (parseFloat(g.valor) || 0), 0);

    const despesasTotais = custoEstoque + totalSalarios + outrosGastos;
    const lucroLiquido = receitaTotal - despesasTotais;

    const fmt = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    document.getElementById("dash-bruta").textContent = fmt(receitaTotal);
    document.getElementById("dash-despesa").textContent = fmt(despesasTotais);
    document.getElementById("dash-liquida").textContent = fmt(lucroLiquido);

    // 4. GRÁFICO DE PIZZA (SAÍDAS)
    const ctxPizza = document.getElementById('chartPizza');
    if (ctxPizza) {
        new Chart(ctxPizza, {
            type: 'doughnut',
            data: {
                labels: ['Estoque', 'Equipe', 'Manuais'],
                datasets: [{
                    data: [custoEstoque || 1, totalSalarios || 1, outrosGastos || 1],
                    backgroundColor: ['#a855f7', '#7e22ce', '#3b0764'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#666', font: { size: 10 } } }
                }
            }
        });
    }

    // 5. GRÁFICO DE LINHA (PERFORMANCE)
    const ctxLinha = document.getElementById('chartLinha');
    if (ctxLinha) {
        new Chart(ctxLinha, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Vendas (R$)',
                    data: [0, 0, 0, 0, 0, 0, receitaTotal],
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
                    x: { grid: { display: false }, ticks: { color: '#666' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});