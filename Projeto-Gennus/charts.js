document.addEventListener("DOMContentLoaded", () => {
    // RECUPERAÇÃO DE DADOS
    const vendas = JSON.parse(localStorage.getItem("gennus_vendas")) || [];
    const funcs = JSON.parse(localStorage.getItem("gennus_funcs")) || [];
    const gastosManuais = JSON.parse(localStorage.getItem("gennus_gastos_manuais")) || [];
    const produtos = JSON.parse(localStorage.getItem("gennus_prods")) || [];

    const totalVendas = vendas.reduce((acc, v) => acc + (v.valorTotal || 0), 0);
    const custoProd = vendas.reduce((acc, v) => acc + (v.custoTotal || 0), 0);
    const salarios = funcs.reduce((acc, f) => acc + (parseFloat(f.salario) || 0), 0);
    const manuais = gastosManuais.reduce((acc, g) => acc + (parseFloat(g.valor) || 0), 0);

    // 1. GRÁFICO DOUGHNUT (CUSTOS)
    new Chart(document.getElementById('chartCustos'), {
        type: 'doughnut',
        data: {
            labels: ['Estoque', 'Salários', 'Manuais'],
            datasets: [{
                data: [custoProd, salarios, manuais],
                backgroundColor: ['#a855f7', '#7e22ce', '#3b0764'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: { plugins: { legend: { position: 'bottom', labels: { color: '#666' } } } }
    });

    // 2. GRÁFICO DE LINHA (FLUXO)
    const ultimos7Dias = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        ultimos7Dias[d.toLocaleDateString('pt-BR')] = 0;
    }
    vendas.forEach(v => {
        const dV = v.data.split(',')[0];
        if (ultimos7Dias.hasOwnProperty(dV)) ultimos7Dias[dV] += v.valorTotal;
    });

    new Chart(document.getElementById('chartFluxo'), {
        type: 'line',
        data: {
            labels: Object.keys(ultimos7Dias),
            datasets: [{
                label: 'Vendas (R$)',
                data: Object.values(ultimos7Dias),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
    });

    // 3. GRÁFICO DE BARRAS (CATEGORIAS)
    const catMap = {};
    vendas.forEach(v => {
        // Buscamos a categoria do produto nos dados originais
        const pOriginal = produtos.find(p => p.nome === v.produto);
        const cat = pOriginal ? pOriginal.categoria : 'Outros';
        catMap[cat] = (catMap[cat] || 0) + v.valorTotal;
    });

    new Chart(document.getElementById('chartCategorias'), {
        type: 'bar',
        data: {
            labels: Object.keys(catMap),
            datasets: [{
                data: Object.values(catMap),
                backgroundColor: '#a855f7',
                borderRadius: 5
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });

    // 4. GRÁFICO RADAR (SAÚDE OPERACIONAL)
    // Compara Vendas, Diversidade de Produtos, Equipe e Lucratividade
    const scoreVendas = Math.min(100, (totalVendas / 5000) * 100);
    const scoreEquipe = Math.min(100, (funcs.length / 5) * 100);
    const scoreEstoque = Math.min(100, (produtos.length / 10) * 100);
    const scoreMargem = totalVendas > 0 ? ((totalVendas - (custoProd + salarios + manuais)) / totalVendas) * 100 : 0;

    new Chart(document.getElementById('chartRadar'), {
        type: 'radar',
        data: {
            labels: ['Vendas', 'Equipe', 'Estoque', 'Margem', 'Manuais'],
            datasets: [{
                label: 'Score Operacional',
                data: [scoreVendas, scoreEquipe, scoreEstoque, scoreMargem, 50],
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: '#a855f7',
                pointBackgroundColor: '#a855f7'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.05)' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    pointLabels: { color: '#666' },
                    ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // ATUALIZAR INSIGHTS
    document.getElementById('proj-lucro').textContent = `R$ ${(totalVendas * 1.2).toFixed(2)}`; // Projeção +20%
});