/**
 * charts.js — Gráficos do Gennus
 * Usa Chart.js 4.x via CDN.
 * Todos os dados são simulados (fake) para visualização.
 */
 
'use strict';
 
/* ================================================
   1. DADOS SIMULADOS POR PERÍODO
   Cada chave corresponde ao data-period dos botões.
   Em produção: substituir por chamadas fetch() à API.
================================================ */
const DATA = {
  '7d': {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    receita:   [4200, 3800, 5100, 4700, 6200, 7100, 5500],
    despesas:  [2100, 2400, 2700, 2200, 3100, 2800, 2500],
    lucro:     [2100, 4000, 6400, 8900, 12000, 16300, 19300], // acumulado
    vendas:    [18, 14, 22, 19, 27, 31, 24],
    clientes:  [3, 2, 5, 4, 7, 8, 5],
  },
  '30d': {
    labels: ['S1', 'S2', 'S3', 'S4'],
    receita:   [22000, 27500, 31000, 28400],
    despesas:  [13000, 15200, 14800, 16100],
    lucro:     [9000, 21300, 37500, 49800],
    vendas:    [95, 118, 134, 121],
    clientes:  [18, 24, 31, 27],
  },
  '90d': {
    labels: ['Jan', 'Fev', 'Mar'],
    receita:   [88000, 102000, 97500],
    despesas:  [54000, 61000, 58000],
    lucro:     [34000, 75000, 114500],
    vendas:    [380, 441, 412],
    clientes:  [72, 89, 81],
  },
  '1y': {
    labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    receita:   [71000,88000,102000,97500,115000,128000,119000,132000,141000,138000,152000,168000],
    despesas:  [44000,54000,61000,58000,67000,72000,65000,76000,81000,78000,86000,93000],
    lucro:     [27000,61000,102000,141500,189500,245500,299500,355500,415500,475500,541500,616500],
    vendas:    [290,380,441,412,490,541,510,568,602,588,631,694],
    clientes:  [52,72,89,81,98,111,104,119,127,123,138,151],
  },
};
 
/* Dados fixos do donut (Top Produtos) — independentes do período */
const TOP_PRODUTOS = [
  { nome: 'Produto Alpha',  pct: 32, cor: '#a855f7' },
  { nome: 'Produto Beta',   pct: 25, cor: '#60a5fa' },
  { nome: 'Produto Gamma',  pct: 18, cor: '#22c55e' },
  { nome: 'Produto Delta',  pct: 14, cor: '#fb923c' },
  { nome: 'Outros',         pct: 11, cor: '#444' },
];
 
/* ================================================
   2. CONFIGURAÇÃO GLOBAL DO CHART.JS
   Defaults aplicados a todos os gráficos.
================================================ */
Chart.defaults.color = '#555';
Chart.defaults.font.family = "'Space Grotesk', 'Inter', sans-serif";
Chart.defaults.font.size = 11;
 
/* Grade padrão reutilizável */
const GRID = {
  color: 'rgba(255,255,255,0.05)',
  drawBorder: false,
};
 
/* Ticks padrão */
const TICK = {
  color: '#444',
  padding: 8,
};
 
/* ================================================
   3. HELPERS
================================================ */
 
/** Cria gradiente vertical dentro de um canvas */
function makeGradient(ctx, top, bottom) {
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  return grad;
}
 
/** Formata número em BRL abreviado: 120000 → "R$120k" */
function fmt(n) {
  if (n >= 1_000_000) return 'R$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1000)      return 'R$' + (n / 1000).toFixed(0) + 'k';
  return 'R$' + n;
}
 
/** Tooltip customizado compartilhado */
const TOOLTIP = {
  backgroundColor: '#0d0d0d',
  borderColor: 'rgba(168,85,247,0.3)',
  borderWidth: 1,
  padding: 12,
  titleColor: '#888',
  bodyColor: '#fff',
  titleFont: { size: 10, weight: '600' },
  bodyFont: { size: 13, weight: '700', family: "'Space Grotesk', sans-serif" },
  cornerRadius: 8,
  displayColors: true,
  boxWidth: 8,
  boxHeight: 8,
  boxPadding: 4,
};
 
/* ================================================
   4. INSTÂNCIAS DOS GRÁFICOS
================================================ */
let charts = {}; // guarda referências para poder destruir e recriar
 
function buildAll(period) {
  // Destrói instâncias anteriores antes de recriar
  Object.values(charts).forEach(c => c && c.destroy());
  charts = {};
 
  const d = DATA[period];
 
  /* ------ GRÁFICO 1: Receita × Despesas (linha) ------ */
  {
    const ctx = document.getElementById('chart-receita-despesas').getContext('2d');
    charts.receitaDespesas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'Receita',
            data: d.receita,
            borderColor: '#22c55e',
            backgroundColor: makeGradient(ctx, 'rgba(34,197,94,0.18)', 'rgba(34,197,94,0)'),
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#22c55e',
            pointBorderWidth: 0,
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Despesas',
            data: d.despesas,
            borderColor: '#f87171',
            backgroundColor: makeGradient(ctx, 'rgba(248,113,113,0.12)', 'rgba(248,113,113,0)'),
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#f87171',
            pointBorderWidth: 0,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: { grid: GRID, ticks: TICK, border: { display: false } },
          y: {
            grid: GRID,
            ticks: { ...TICK, callback: fmt },
            border: { display: false },
          },
        },
      },
    });
  }
 
  /* ------ GRÁFICO 2: Lucro Acumulado (área) ------ */
  {
    const ctx = document.getElementById('chart-lucro').getContext('2d');
    charts.lucro = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Lucro acumulado',
          data: d.lucro,
          borderColor: '#a855f7',
          backgroundColor: makeGradient(ctx, 'rgba(168,85,247,0.25)', 'rgba(168,85,247,0)'),
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#0d0d0d',
          pointBorderWidth: 2,
          tension: 0.45,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP,
            callbacks: {
              label: ctx => ` Lucro acumulado: ${fmt(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: { grid: GRID, ticks: TICK, border: { display: false } },
          y: {
            grid: GRID,
            ticks: { ...TICK, callback: fmt },
            border: { display: false },
          },
        },
      },
    });
  }
 
  /* ------ GRÁFICO 3: Vendas por Período (barras) ------ */
  {
    const ctx = document.getElementById('chart-vendas').getContext('2d');
    charts.vendas = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Vendas',
          data: d.vendas,
          backgroundColor: d.vendas.map(() =>
            makeGradient(ctx, 'rgba(192,132,252,0.85)', 'rgba(126,34,206,0.4)')
          ),
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: '#c084fc',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP,
            callbacks: {
              label: ctx => ` Vendas: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: TICK, border: { display: false } },
          y: {
            grid: GRID,
            ticks: TICK,
            border: { display: false },
          },
        },
      },
    });
  }
 
  /* ------ GRÁFICO 4: Crescimento de Clientes (linha) ------ */
  {
    const ctx = document.getElementById('chart-clientes').getContext('2d');
    charts.clientes = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Novos clientes',
          data: d.clientes,
          borderColor: '#60a5fa',
          backgroundColor: makeGradient(ctx, 'rgba(96,165,250,0.2)', 'rgba(96,165,250,0)'),
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#0d0d0d',
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP,
            callbacks: {
              label: ctx => ` Novos clientes: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: { grid: GRID, ticks: TICK, border: { display: false } },
          y: {
            grid: GRID,
            ticks: TICK,
            border: { display: false },
          },
        },
      },
    });
  }
 
  /* ------ GRÁFICO 5: Top Produtos (donut) ------ */
  {
    const ctx = document.getElementById('chart-produtos').getContext('2d');
    charts.produtos = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: TOP_PRODUTOS.map(p => p.nome),
        datasets: [{
          data: TOP_PRODUTOS.map(p => p.pct),
          backgroundColor: TOP_PRODUTOS.map(p => p.cor),
          hoverBackgroundColor: TOP_PRODUTOS.map(p => p.cor),
          borderWidth: 3,
          borderColor: '#080808',
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
 
    /* Popula a legenda HTML do donut */
    buildDonutLegend();
  }
}
 
/* ================================================
   5. LEGENDA DO DONUT — construída em HTML
   (mais controle visual do que a legenda nativa)
================================================ */
function buildDonutLegend() {
  const ul = document.getElementById('donut-legend');
  if (!ul) return;
  ul.innerHTML = '';
  TOP_PRODUTOS.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="dot" style="background:${p.cor};box-shadow:0 0 8px ${p.cor}55;"></span>
      <span class="nome">${p.nome}</span>
      <span class="pct">${p.pct}%</span>
    `;
    ul.appendChild(li);
  });
}
 
/* ================================================
   6. FILTRO DE PERÍODO
   Troca os dados de todos os gráficos ao clicar.
================================================ */
function initPeriodFilter() {
  const container = document.getElementById('period-filter');
  if (!container) return;
 
  container.addEventListener('click', e => {
    const btn = e.target.closest('.period-btn');
    if (!btn) return;
 
    // Atualiza botão ativo
    container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
 
    const period = btn.dataset.period;
 
    // Feedback visual de carregamento (fade dos canvas)
    document.querySelectorAll('.chart-canvas-wrapper').forEach(w => w.classList.add('updating'));
 
    setTimeout(() => {
      buildAll(period);
      document.querySelectorAll('.chart-canvas-wrapper').forEach(w => w.classList.remove('updating'));
    }, 220); // pequeno delay para o fade acontecer
  });
}
 
/* ================================================
   7. INIT
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildAll('7d');     // carrega com o período padrão
  initPeriodFilter(); // ativa os botões
});
 