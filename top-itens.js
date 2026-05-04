/* ================================================
   top-itens.js — Top Itens — Gennus
================================================ */

/* ================================================
   DADOS MOCK
================================================ */
const produtos = [
  { id:1,  nome:"Tênis Runner Pro",     cat:"Calçados",    emoji:"👟", vendas:847, receita:84623, var:+28, estoque:12,  status:"out"  },
  { id:2,  nome:"Mochila Urbana XL",    cat:"Acessórios",  emoji:"🎒", vendas:634, receita:47550, var:+14, estoque:38,  status:"low"  },
  { id:3,  nome:"Camiseta Basic (M)",   cat:"Vestuário",   emoji:"👕", vendas:598, receita:17940, var:+67, estoque:74,  status:"low"  },
  { id:4,  nome:"Palmilha Gel Pro",     cat:"Calçados",    emoji:"🦶", vendas:512, receita:32256, var:+9,  estoque:210, status:"ok"   },
  { id:5,  nome:"Boné Aba Reta",        cat:"Acessórios",  emoji:"🧢", vendas:476, receita:14280, var:-3,  estoque:183, status:"ok"   },
  { id:6,  nome:"Shorts Run (P)",       cat:"Vestuário",   emoji:"🩳", vendas:423, receita:21150, var:+22, estoque:95,  status:"ok"   },
  { id:7,  nome:"Bota Trail",           cat:"Calçados",    emoji:"🥾", vendas:318, receita:38160, var:-11, estoque:0,   status:"out"  },
  { id:8,  nome:"Meia Compressão",      cat:"Acessórios",  emoji:"🧦", vendas:291, receita:5820,  var:+5,  estoque:640, status:"ok"   },
  { id:9,  nome:"Jaqueta Corta Vento",  cat:"Vestuário",   emoji:"🧥", vendas:247, receita:49400, var:-8,  estoque:57,  status:"ok"   },
  { id:10, nome:"Garrafa Inox 750ml",   cat:"Acessórios",  emoji:"🍶", vendas:234, receita:14040, var:+1,  estoque:312, status:"ok"   },
  { id:11, nome:"Legging Feminina",     cat:"Vestuário",   emoji:"👖", vendas:198, receita:17820, var:-4,  estoque:88,  status:"ok"   },
  { id:12, nome:"Tênis Casual Slim",    cat:"Calçados",    emoji:"👞", vendas:145, receita:15950, var:-18, estoque:124, status:"ok"   },
  { id:13, nome:"Toalha Microfibra",    cat:"Acessórios",  emoji:"🏳️", vendas:87,  receita:3045,  var:-22, estoque:450, status:"ok"   },
  { id:14, nome:"Cinto Elástico",       cat:"Acessórios",  emoji:"🔗", vendas:42,  receita:2100,  var:-35, estoque:230, status:"ok"   },
  { id:15, nome:"Bolsa Couro V2",       cat:"Acessórios",  emoji:"👜", vendas:3,   receita:1197,  var:-72, estoque:142, status:"ok"   },
];

/* Multiplicadores por período */
const periodos = {
  "7d":  [1.0, 0.24, 0.22, 0.19, 0.18, 0.16, 0.12, 0.11, 0.09, 0.09, 0.07, 0.05, 0.03, 0.015, 0.001],
  "30d": [1.0, 0.75, 0.71, 0.60, 0.56, 0.50, 0.38, 0.34, 0.29, 0.28, 0.23, 0.17, 0.10, 0.05,  0.003],
  "90d": [1.0, 0.88, 0.85, 0.72, 0.68, 0.60, 0.46, 0.41, 0.35, 0.33, 0.28, 0.20, 0.12, 0.07,  0.005],
  "12m": [1.0, 0.92, 0.90, 0.78, 0.73, 0.65, 0.52, 0.47, 0.41, 0.38, 0.32, 0.24, 0.14, 0.09,  0.007],
};

/* ================================================
   ESTADO
================================================ */
let currentPeriod = "30d";
let currentTab    = "top";   // "top" | "bot"
let currentView   = "todos"; // "todos" | "top" | "baixo"
let sortCol       = "vendas";
let sortDir       = -1;      // -1 desc, 1 asc
let searchQ       = "";

/* ================================================
   CHART.JS — Barras horizontais
================================================ */
let chartInstance = null;

function getChartData(tab, period) {
  const factor = periodos[period];
  const base = produtos.map((p, i) => ({
    ...p,
    vendasPeriod: Math.round(p.vendas * factor[i])
  }));

  if (tab === "top") {
    return [...base].sort((a, b) => b.vendasPeriod - a.vendasPeriod).slice(0, 10);
  }
  return [...base].sort((a, b) => a.vendasPeriod - b.vendasPeriod).slice(0, 10);
}

function buildChart(tab, period) {
  const data   = getChartData(tab, period);
  const labels = data.map(p => p.nome.length > 18 ? p.nome.slice(0, 17) + '…' : p.nome);
  const values = data.map(p => p.vendasPeriod);
  const isTop  = tab === "top";

  const colors = isTop
    ? values.map((_, i) => i === 0 ? 'rgba(168,85,247,0.9)' : `rgba(168,85,247,${0.55 - i * 0.04})`)
    : values.map((_, i) => i === 0 ? 'rgba(248,113,113,0.9)' : `rgba(248,113,113,${0.55 + i * 0.04})`);

  const hoverColors = isTop
    ? values.map(() => 'rgba(168,85,247,1)')
    : values.map(() => 'rgba(248,113,113,1)');

  const cfg = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: hoverColors,
      }]
    },
    options: {
      indexAxis: 'y',
      animation: { duration: 550, easing: 'easeOutQuart' },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111117',
          borderColor: 'rgba(255,255,255,0.07)',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#6b7280',
          titleFont: { family: 'Space Grotesk', weight: '600', size: 12 },
          bodyFont:  { family: 'Space Grotesk', size: 11 },
          callbacks: {
            label: ctx => ` ${ctx.parsed.x.toLocaleString('pt-BR')} unidades`,
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#444',
            font: { family: 'Space Grotesk', size: 10 },
            callback: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v,
          },
          border: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: '#6b7280',
            font: { family: 'Space Grotesk', size: 11, weight: '500' },
          },
          border: { display: false },
        }
      }
    }
  };

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = values;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.data.datasets[0].hoverBackgroundColor = hoverColors;
    chartInstance.update('active');
  } else {
    chartInstance = new Chart(document.getElementById('barChart'), cfg);
  }
}

/* ================================================
   RANKING LATERAL
================================================ */
function buildRanking(tab, period) {
  const data  = getChartData(tab, period);
  const isTop = tab === "top";
  const top5  = isTop
    ? data.slice(0, 5)
    : [...data].sort((a, b) => a.vendasPeriod - b.vendasPeriod).slice(0, 5);

  const maxV = Math.max(...top5.map(p => p.vendasPeriod));

  document.getElementById('rankTitle').textContent = isTop ? "Mais vendidos"      : "Menor giro";
  document.getElementById('rankSub').textContent   = isTop ? "Top 5 em unidades"  : "Piores 5 em unidades";
  document.getElementById('rankBadge').textContent = isTop ? "↑ Alta"             : "↓ Baixo";
  document.getElementById('rankBadge').className   = 'g-badge ' + (isTop ? 'badge-ok' : 'badge-critico');

  const ul = document.getElementById('rankingList');
  ul.innerHTML = top5.map((p, i) => {
    const pct     = maxV > 0 ? Math.round(p.vendasPeriod / maxV * 100) : 0;
    const idx     = produtos.findIndex(x => x.id === p.id);
    const receita = 'R$ ' + (p.receita * periodos[period][idx]).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    return `
      <li class="ranking-item ${!isTop ? 'danger' : ''}">
        <span class="ranking-pos">${i + 1}</span>
        <div class="ranking-info">
          <span class="ranking-nome">${p.nome}</span>
          <div class="ranking-bar-track">
            <div class="ranking-bar ${isTop ? 'bar-top' : 'bar-bot'}" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="ranking-vals">
          <span class="ranking-valor">${p.vendasPeriod.toLocaleString('pt-BR')} un.</span>
          <span class="ranking-qtd">${receita}</span>
        </div>
      </li>`;
  }).join('');
}

/* ================================================
   TABELA
================================================ */
function statusChip(status, estoque) {
  if (status === "out") return `<span class="status-chip chip-out"><span class="chip-dot"></span>Sem estoque</span>`;
  if (status === "low") return `<span class="status-chip chip-low"><span class="chip-dot"></span>Baixo</span>`;
  return `<span class="status-chip chip-ok"><span class="chip-dot"></span>OK (${estoque})</span>`;
}

function varCell(v) {
  const w = Math.min(Math.abs(v), 100);
  if (v > 0) return `<div class="mini-bar-wrap"><div class="mini-track"><div class="mini-fill fill-up"   style="width:${w}%"></div></div><span class="mini-pct up">+${v}%</span></div>`;
  if (v < 0) return `<div class="mini-bar-wrap"><div class="mini-track"><div class="mini-fill fill-down" style="width:${w}%"></div></div><span class="mini-pct down">${v}%</span></div>`;
  return `<div class="mini-bar-wrap"><div class="mini-track"><div class="mini-fill fill-neu" style="width:5%"></div></div><span class="mini-pct neu">0%</span></div>`;
}

function buildTable() {
  let data = [...produtos];

  if (currentView === "top")   data = data.filter(p => p.vendas >= 200);
  if (currentView === "baixo") data = data.filter(p => p.vendas < 100);

  if (searchQ) {
    const q = searchQ.toLowerCase();
    data = data.filter(p => p.nome.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  }

  data.sort((a, b) => {
    const key = sortCol === 'variacao' ? 'var' : sortCol;
    const va  = a[key];
    const vb  = b[key];
    if (typeof va === 'string') return sortDir * va.localeCompare(vb);
    return sortDir * (vb - va);
  });

  document.getElementById('tableCount').textContent = data.length;

  const maxV  = Math.max(...data.map(p => p.vendas));
  const tbody = document.getElementById('tableBody');

  tbody.innerHTML = data.map(p => {
    const barW   = maxV > 0 ? Math.round(p.vendas / maxV * 100) : 0;
    const rec    = 'R$ ' + p.receita.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
    const iconBg = p.status === 'out'
      ? 'rgba(248,113,113,0.08)'
      : p.status === 'low'
        ? 'rgba(251,191,36,0.08)'
        : 'rgba(168,85,247,0.08)';

    return `
      <tr>
        <td>
          <div class="prod-cell">
            <div class="prod-icon" style="background:${iconBg}">${p.emoji}</div>
            <div>
              <div class="prod-name">${p.nome}</div>
              <div class="prod-sku">SKU-${String(p.id).padStart(4, '0')}</div>
            </div>
          </div>
        </td>
        <td style="color:var(--texto-muted)">${p.cat}</td>
        <td>
          <div class="mini-bar-wrap">
            <div class="mini-track" style="min-width:60px">
              <div class="mini-fill fill-up" style="width:${barW}%"></div>
            </div>
            <span style="font-size:0.82rem;font-weight:600;color:var(--texto)">${p.vendas.toLocaleString('pt-BR')}</span>
          </div>
        </td>
        <td style="color:var(--verde);font-weight:600">${rec}</td>
        <td>${varCell(p.var)}</td>
        <td>${statusChip(p.status, p.estoque)}</td>
      </tr>`;
  }).join('');
}

/* ================================================
   EVENT LISTENERS
================================================ */

/* Período */
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPeriod = btn.dataset.period;
    buildChart(currentTab, currentPeriod);
    buildRanking(currentTab, currentPeriod);
  });
});

/* Chart tabs */
document.querySelectorAll('#chartTabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#chartTabs .tab-btn').forEach(b => b.classList.remove('active-top', 'active-bot'));
    currentTab = btn.dataset.tab;
    btn.classList.add(currentTab === 'top' ? 'active-top' : 'active-bot');
    buildChart(currentTab, currentPeriod);
    buildRanking(currentTab, currentPeriod);
  });
});

/* Toggle tabela */
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    buildTable();
  });
});

/* Ordenação de colunas */
document.querySelectorAll('.g-table th').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (!col) return;
    if (sortCol === col) { sortDir *= -1; }
    else { sortCol = col; sortDir = -1; }
    document.querySelectorAll('.g-table th').forEach(h => {
      h.classList.remove('sorted');
      const icon = h.querySelector('.sort-icon');
      if (icon) icon.textContent = '↕';
    });
    th.classList.add('sorted');
    const icon = th.querySelector('.sort-icon');
    if (icon) icon.textContent = sortDir === -1 ? '↓' : '↑';
    buildTable();
  });
});

/* Busca */
document.getElementById('searchInput').addEventListener('input', e => {
  searchQ = e.target.value.trim();
  buildTable();
});

/* ================================================
   INIT
================================================ */
buildChart(currentTab, currentPeriod);
buildRanking(currentTab, currentPeriod);
buildTable();