/**
 * resumo.js — Resumo do Período — Gennus
 * Dados simulados, JS interativo completo.
 * Sem localStorage / backend.
 */

'use strict';

/* ================================================
   1. DADOS SIMULADOS
================================================ */
const DATA = {
  '7d': {
    label:      '7 dias',
    vendas:     41800,
    ticket:     348,
    conversao:  0.214,
    clientes:   120,
    pedidos:    124,
    anterior:   { vendas: 37200, ticket: 311, clientes: 108 },
    meta:       { alvo: 50000, clientes: 150, pedidos: 150 },
    canais: [
      { nome: 'Loja Online',  pct: 0.48, cor: '#a855f7' },
      { nome: 'WhatsApp',     pct: 0.27, cor: '#22c55e' },
      { nome: 'Presencial',   pct: 0.16, cor: '#60a5fa' },
      { nome: 'Marketplace',  pct: 0.09, cor: '#fbbf24' },
    ],
    destaques: {
      melhorDia:   { valor: 'Sexta-feira', sub: 'R$ 8.400 em vendas' },
      piorDia:     { valor: 'Segunda-feira', sub: 'R$ 3.100 em vendas' },
      melhorProd:  { valor: 'Produto Alpha', sub: '31% do faturamento' },
      picoHorario: { valor: '19h – 21h', sub: 'maior volume de pedidos' },
    },
    heatmapDias: 7,
    heatmapVals: [42, 55, 78, 61, 95, 100, 38],
    ranking: [
      { nome: 'Produto Alpha',  valor: 12900, qtd: 37, pct: 1.00 },
      { nome: 'Produto Beta',   valor:  9700, qtd: 28, pct: 0.75 },
      { nome: 'Produto Gamma',  valor:  7400, qtd: 21, pct: 0.57 },
      { nome: 'Produto Delta',  valor:  5200, qtd: 15, pct: 0.40 },
      { nome: 'Outros',         valor:  6600, qtd: 23, pct: 0.51 },
    ],
  },
  '30d': {
    label:     '30 dias',
    vendas:    109300,
    ticket:    382,
    conversao: 0.231,
    clientes:  286,
    pedidos:   387,
    anterior:  { vendas: 94800, ticket: 355, clientes: 251 },
    meta:      { alvo: 120000, clientes: 310, pedidos: 420 },
    canais: [
      { nome: 'Loja Online', pct: 0.51, cor: '#a855f7' },
      { nome: 'WhatsApp',    pct: 0.24, cor: '#22c55e' },
      { nome: 'Presencial',  pct: 0.14, cor: '#60a5fa' },
      { nome: 'Marketplace', pct: 0.11, cor: '#fbbf24' },
    ],
    destaques: {
      melhorDia:   { valor: '14 de Março', sub: 'R$ 5.800 em vendas' },
      piorDia:     { valor: '3 de Março', sub: 'R$ 1.200 em vendas' },
      melhorProd:  { valor: 'Produto Alpha', sub: '29% do faturamento' },
      picoHorario: { valor: '20h – 22h', sub: 'maior volume de pedidos' },
    },
    heatmapDias: 30,
    heatmapVals: Array.from({length: 30}, () => Math.floor(Math.random() * 100)),
    ranking: [
      { nome: 'Produto Alpha', valor: 31700, qtd: 83,  pct: 1.00 },
      { nome: 'Produto Beta',  valor: 24800, qtd: 65,  pct: 0.78 },
      { nome: 'Produto Gamma', valor: 19100, qtd: 50,  pct: 0.60 },
      { nome: 'Produto Delta', valor: 14200, qtd: 37,  pct: 0.45 },
      { nome: 'Outros',        valor: 19500, qtd: 152, pct: 0.62 },
    ],
  },
  '90d': {
    label:     '3 meses',
    vendas:    287500,
    ticket:    401,
    conversao: 0.247,
    clientes:  716,
    pedidos:   902,
    anterior:  { vendas: 251000, ticket: 374, clientes: 640 },
    meta:      { alvo: 300000, clientes: 750, pedidos: 950 },
    canais: [
      { nome: 'Loja Online', pct: 0.54, cor: '#a855f7' },
      { nome: 'WhatsApp',    pct: 0.22, cor: '#22c55e' },
      { nome: 'Presencial',  pct: 0.13, cor: '#60a5fa' },
      { nome: 'Marketplace', pct: 0.11, cor: '#fbbf24' },
    ],
    destaques: {
      melhorDia:   { valor: '7 de Março', sub: 'R$ 6.100 em vendas' },
      piorDia:     { valor: '2 de Janeiro', sub: 'R$ 890 em vendas' },
      melhorProd:  { valor: 'Produto Alpha', sub: '28% do faturamento' },
      picoHorario: { valor: '19h – 21h', sub: 'maior volume de pedidos' },
    },
    heatmapDias: 90,
    heatmapVals: Array.from({length: 90}, () => Math.floor(Math.random() * 100)),
    ranking: [
      { nome: 'Produto Alpha', valor: 80500,  qtd: 201, pct: 1.00 },
      { nome: 'Produto Beta',  valor: 64200,  qtd: 160, pct: 0.80 },
      { nome: 'Produto Gamma', valor: 51800,  qtd: 129, pct: 0.64 },
      { nome: 'Produto Delta', valor: 38700,  qtd:  97, pct: 0.48 },
      { nome: 'Outros',        valor: 52300,  qtd: 315, pct: 0.65 },
    ],
  },
  '1y': {
    label:     '1 ano',
    vendas:    1351000,
    ticket:    418,
    conversao: 0.262,
    clientes:  3230,
    pedidos:   4120,
    anterior:  { vendas: 1108000, ticket: 389, clientes: 2870 },
    meta:      { alvo: 1400000, clientes: 3500, pedidos: 4500 },
    canais: [
      { nome: 'Loja Online', pct: 0.57, cor: '#a855f7' },
      { nome: 'WhatsApp',    pct: 0.20, cor: '#22c55e' },
      { nome: 'Presencial',  pct: 0.12, cor: '#60a5fa' },
      { nome: 'Marketplace', pct: 0.11, cor: '#fbbf24' },
    ],
    destaques: {
      melhorDia:   { valor: '24 de Novembro', sub: 'R$ 9.800 (Black Friday)' },
      piorDia:     { valor: '1 de Janeiro', sub: 'R$ 420 em vendas' },
      melhorProd:  { valor: 'Produto Alpha', sub: '27% do faturamento' },
      picoHorario: { valor: '20h – 22h', sub: 'maior volume de pedidos' },
    },
    heatmapDias: 52, // semanas do ano como células
    heatmapVals: Array.from({length: 52}, () => Math.floor(Math.random() * 100)),
    ranking: [
      { nome: 'Produto Alpha', valor: 364770, qtd: 872,  pct: 1.00 },
      { nome: 'Produto Beta',  valor: 310730, qtd: 743,  pct: 0.85 },
      { nome: 'Produto Gamma', valor: 243180, qtd: 581,  pct: 0.67 },
      { nome: 'Produto Delta', valor: 189140, qtd: 452,  pct: 0.52 },
      { nome: 'Outros',        valor: 243180, qtd: 1472, pct: 0.67 },
    ],
  },
};

/* ================================================
   2. HELPERS
================================================ */
const fmtBRL = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
const fmtNum = n => Math.round(n).toLocaleString('pt-BR');
const fmtPct = n => (n * 100).toFixed(1).replace('.', ',') + '%';
const delta  = (atual, ant) => (atual - ant) / ant;

/** Anima contagem de 0 até target com easing ease-out */
function countUp(el, target, formatter, duration = 700) {
  if (!el) return;
  const start = performance.now();
  const step  = now => {
    const t = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = formatter(target * e);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Anima largura de barra após dois frames (garante transition CSS) */
function animBar(id, pct) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.width = Math.min(pct * 100, 100).toFixed(1) + '%';
  }));
}

/** Calcula Score (S/A/B/C/D) com base em métricas do período */
function calcScore(d) {
  const metaPct    = d.vendas / d.meta.alvo;
  const crescVendas = delta(d.vendas, d.anterior.vendas);
  const score = metaPct * 0.5 + crescVendas * 0.3 + d.conversao * 0.2;

  if (score >= 0.85) return { grade: 'S', desc: 'Período excepcional' };
  if (score >= 0.65) return { grade: 'A', desc: 'Acima do esperado' };
  if (score >= 0.45) return { grade: 'B', desc: 'Dentro do esperado' };
  if (score >= 0.25) return { grade: 'C', desc: 'Abaixo do esperado' };
  return               { grade: 'D', desc: 'Período crítico' };
}

/* ================================================
   3. SCORE DO PERÍODO
================================================ */
function renderScore(d) {
  const { grade, desc } = calcScore(d);
  const el    = document.getElementById('score-value');
  const elDesc = document.getElementById('score-desc');
  if (!el) return;

  el.textContent = grade;
  el.className   = 'score-value score-' + grade.toLowerCase();
  if (elDesc) elDesc.textContent = desc;
}

/* ================================================
   4. KPIs
================================================ */
function renderKPIs(d) {
  countUp(document.getElementById('kpi-vendas'),    d.vendas,    fmtBRL);
  countUp(document.getElementById('kpi-ticket'),    d.ticket,    fmtBRL);
  countUp(document.getElementById('kpi-clientes'),  d.clientes,  fmtNum);
  countUp(document.getElementById('kpi-pedidos'),   d.pedidos,   fmtNum);
  countUp(document.getElementById('kpi-conversao'), d.conversao,
    v => (v * 100).toFixed(1).replace('.', ',') + '%');

  renderDelta('kpi-vendas-delta',   delta(d.vendas,   d.anterior.vendas));
  renderDelta('kpi-ticket-delta',   delta(d.ticket,   d.anterior.ticket));
  renderDelta('kpi-clientes-delta', delta(d.clientes, d.anterior.clientes));

  const elSub = document.getElementById('kpi-pedidos-sub');
  if (elSub) elSub.textContent = `no período de ${d.label}`;
}

function renderDelta(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const pos   = val >= 0;
  el.textContent = `${pos ? '+' : ''}${fmtPct(Math.abs(val))} vs. anterior`;
  el.className   = 'kpi-delta ' + (pos ? 'pos' : 'neg');
}

/* ================================================
   5. META DO PERÍODO
================================================ */
function renderMeta(d) {
  const metaPct = d.vendas / d.meta.alvo;

  document.getElementById('meta-realizado').textContent = fmtBRL(d.vendas);
  document.getElementById('meta-alvo').textContent      = fmtBRL(d.meta.alvo);
  document.getElementById('meta-pct').textContent       = fmtPct(metaPct);
  document.getElementById('meta-bar-label-pct').textContent = fmtPct(metaPct);

  animBar('meta-bar', metaPct);

  /* Badge de status */
  const badge = document.getElementById('badge-meta-status');
  if (badge) {
    if (metaPct >= 1)    { badge.textContent = 'Meta atingida'; badge.className = 'resumo-badge badge-ok'; }
    else if (metaPct >= 0.7) { badge.textContent = 'No caminho';   badge.className = 'resumo-badge badge-atencao'; }
    else                 { badge.textContent = 'Atenção';       badge.className = 'resumo-badge badge-critico'; }
  }

  /* Sub-metas */
  const container = document.getElementById('sub-metas');
  if (!container) return;
  container.innerHTML = '';

  const subs = [
    { label: 'Clientes',  realizado: d.clientes, alvo: d.meta.clientes, cor: '#fb923c' },
    { label: 'Pedidos',   realizado: d.pedidos,  alvo: d.meta.pedidos,  cor: var_('#fbbf24') },
  ];

  subs.forEach(s => {
    const pct = Math.min(s.realizado / s.alvo, 1);
    const div = document.createElement('div');
    div.className = 'sub-meta-item';
    div.innerHTML = `
      <div class="sub-meta-top">
        <span class="sub-meta-label">${s.label}</span>
        <span class="sub-meta-val">${fmtNum(s.realizado)} / ${fmtNum(s.alvo)}</span>
      </div>
      <div class="sub-meta-track">
        <div class="sub-meta-bar" id="sub-bar-${s.label}" style="width:0%;background:${s.cor}"></div>
      </div>
    `;
    container.appendChild(div);
    animBar('sub-bar-' + s.label, pct);
  });
}

/* Pequeno helper para evitar var() inline no JS */
function var_(fallback) { return fallback; }

/* ================================================
   6. DESTAQUES
================================================ */
function renderDestaques(d) {
  const container = document.getElementById('destaques-grid');
  if (!container) return;
  container.innerHTML = '';

  const items = [
    { icone: '📈', label: 'Melhor Dia',     ...d.destaques.melhorDia },
    { icone: '📉', label: 'Dia mais fraco', ...d.destaques.piorDia },
    { icone: '⭐', label: 'Produto Destaque',...d.destaques.melhorProd },
    { icone: '🕐', label: 'Pico de Horário',...d.destaques.picoHorario },
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'destaque-item';
    div.innerHTML = `
      <span class="destaque-icone">${item.icone}</span>
      <span class="destaque-label">${item.label}</span>
      <span class="destaque-valor">${item.valor}</span>
      <span class="destaque-sub">${item.sub}</span>
    `;
    container.appendChild(div);
  });
}

/* ================================================
   7. CANAL DE VENDAS
================================================ */
function renderCanais(d) {
  const ul = document.getElementById('canais-list');
  if (!ul) return;
  ul.innerHTML = '';

  d.canais.forEach((canal, i) => {
    const valor = d.vendas * canal.pct;
    const li    = document.createElement('li');
    li.className = 'canal-item';
    li.innerHTML = `
      <div class="canal-top">
        <span class="canal-nome">
          <span class="canal-dot" style="background:${canal.cor};box-shadow:0 0 6px ${canal.cor}77;"></span>
          ${canal.nome}
        </span>
        <div class="canal-vals">
          <span class="canal-valor">${fmtBRL(valor)}</span>
          <span class="canal-pct">${fmtPct(canal.pct)}</span>
        </div>
      </div>
      <div class="canal-track">
        <div class="canal-bar" id="canal-bar-${i}" style="width:0%;background:${canal.cor};"></div>
      </div>
    `;
    ul.appendChild(li);
    animBar('canal-bar-' + i, canal.pct);
  });
}

/* ================================================
   8. HEATMAP (Pulso do Período)
================================================ */
function renderHeatmap(d) {
  const grid = document.getElementById('heatmap-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const vals     = d.heatmapVals;
  const max      = Math.max(...vals);
  const unitLabel = d.label === '1 ano' ? 'Semana' : 'Dia';

  vals.forEach((v, i) => {
    const norm = max > 0 ? v / max : 0;
    const lvl  = norm >= 0.9 ? 5 : norm >= 0.7 ? 4 : norm >= 0.5 ? 3 : norm >= 0.3 ? 2 : norm >= 0.1 ? 1 : 0;

    const cell = document.createElement('div');
    cell.className = `heatmap-cell hm-${lvl}`;
    cell.dataset.tip = `${unitLabel} ${i + 1}: ${Math.round(v)} vendas`;

    /* Entrada staggerada */
    cell.style.opacity   = '0';
    cell.style.transform = 'scale(0.7)';
    cell.style.transition = `opacity 0.3s ease ${i * 12}ms, transform 0.3s ease ${i * 12}ms`;

    grid.appendChild(cell);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      cell.style.opacity   = '1';
      cell.style.transform = 'scale(1)';
    }));
  });
}

/* ================================================
   9. RANKING DE PRODUTOS
================================================ */
function renderRanking(d) {
  const ol = document.getElementById('ranking-list');
  if (!ol) return;
  ol.innerHTML = '';

  d.ranking.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'ranking-item';
    li.style.opacity   = '0';
    li.style.transform = 'translateY(8px)';
    li.style.transition = `opacity 0.3s ease ${i * 60}ms, transform 0.3s ease ${i * 60}ms`;

    li.innerHTML = `
      <span class="ranking-pos">${i + 1}</span>
      <div class="ranking-info">
        <span class="ranking-nome">${item.nome}</span>
        <div class="ranking-bar-track">
          <div class="ranking-bar" id="rank-bar-${i}" style="width:0%"></div>
        </div>
      </div>
      <div class="ranking-vals">
        <span class="ranking-valor">${fmtBRL(item.valor)}</span>
        <span class="ranking-qtd">${fmtNum(item.qtd)} un.</span>
      </div>
    `;
    ol.appendChild(li);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      li.style.opacity   = '1';
      li.style.transform = 'translateY(0)';
      animBar('rank-bar-' + i, item.pct);
    }));
  });
}

/* ================================================
   10. INSIGHTS AUTOMÁTICOS
   Gera observações dinâmicas a partir dos dados do período.
================================================ */
function renderInsights(d) {
  const ul = document.getElementById('insights-list');
  if (!ul) return;
  ul.innerHTML = '';

  const insights = gerarInsights(d);

  insights.forEach((ins, i) => {
    const li = document.createElement('li');
    li.className = `insight-item ${ins.tipo}`;
    li.style.opacity   = '0';
    li.style.transform = 'translateX(-6px)';
    li.style.transition = `opacity 0.35s ease ${i * 70}ms, transform 0.35s ease ${i * 70}ms`;

    li.innerHTML = `
      <span class="insight-icone">${ins.icone}</span>
      <span class="insight-texto">${ins.texto}</span>
    `;
    ul.appendChild(li);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      li.style.opacity   = '1';
      li.style.transform = 'translateX(0)';
    }));
  });
}

/** Gera array de insights com base nos dados reais do período */
function gerarInsights(d) {
  const insights = [];

  const crescVendas   = delta(d.vendas,   d.anterior.vendas);
  const crescClientes = delta(d.clientes, d.anterior.clientes);
  const crescTicket   = delta(d.ticket,   d.anterior.ticket);
  const metaPct       = d.vendas / d.meta.alvo;
  const canalTopo     = d.canais[0];

  /* Crescimento de vendas */
  if (crescVendas >= 0.15) {
    insights.push({ tipo: 'pos', icone: '📈',
      texto: `Vendas cresceram <strong>${fmtPct(crescVendas)}</strong> em relação ao período anterior — ritmo acima da média.` });
  } else if (crescVendas > 0) {
    insights.push({ tipo: 'info', icone: '📊',
      texto: `Vendas cresceram <strong>${fmtPct(crescVendas)}</strong> vs. período anterior. Crescimento moderado.` });
  } else {
    insights.push({ tipo: 'neg', icone: '📉',
      texto: `Vendas caíram <strong>${fmtPct(Math.abs(crescVendas))}</strong> em relação ao período anterior. Atenção necessária.` });
  }

  /* Meta */
  if (metaPct >= 1) {
    insights.push({ tipo: 'pos', icone: '🎯',
      texto: `Meta do período <strong>atingida</strong> — ${fmtPct(metaPct)} do objetivo alcançado. Excelente desempenho.` });
  } else if (metaPct >= 0.8) {
    insights.push({ tipo: 'warn', icone: '🎯',
      texto: `Meta <strong>${fmtPct(metaPct)}</strong> concluída. Faltam ${fmtBRL(d.meta.alvo - d.vendas)} para bater o objetivo.` });
  } else {
    insights.push({ tipo: 'neg', icone: '🎯',
      texto: `Apenas <strong>${fmtPct(metaPct)}</strong> da meta atingida. São necessários ${fmtBRL(d.meta.alvo - d.vendas)} adicionais.` });
  }

  /* Ticket médio */
  if (crescTicket >= 0.05) {
    insights.push({ tipo: 'pos', icone: '💰',
      texto: `Ticket médio subiu <strong>${fmtPct(crescTicket)}</strong>, chegando a ${fmtBRL(d.ticket)}. Clientes comprando mais por pedido.` });
  } else if (crescTicket < -0.05) {
    insights.push({ tipo: 'warn', icone: '💰',
      texto: `Ticket médio caiu <strong>${fmtPct(Math.abs(crescTicket))}</strong> para ${fmtBRL(d.ticket)}. Considere estratégias de upsell.` });
  }

  /* Canal dominante */
  insights.push({ tipo: 'info', icone: '📡',
    texto: `<strong>${canalTopo.nome}</strong> responde por <strong>${fmtPct(canalTopo.pct)}</strong> das vendas — canal mais relevante do período.` });

  /* Crescimento de clientes */
  if (crescClientes >= 0.1) {
    insights.push({ tipo: 'pos', icone: '👥',
      texto: `Base de clientes cresceu <strong>${fmtPct(crescClientes)}</strong> — ${fmtNum(d.clientes - d.anterior.clientes)} novos clientes no período.` });
  } else if (crescClientes < 0) {
    insights.push({ tipo: 'neg', icone: '👥',
      texto: `Base de clientes ativos encolheu <strong>${fmtPct(Math.abs(crescClientes))}</strong>. Verifique churn e retenção.` });
  }

  /* Taxa de conversão */
  if (d.conversao >= 0.25) {
    insights.push({ tipo: 'pos', icone: '✅',
      texto: `Taxa de conversão em <strong>${fmtPct(d.conversao)}</strong> — acima de 25%, considerada referência saudável para o setor.` });
  } else {
    insights.push({ tipo: 'warn', icone: '⚠️',
      texto: `Taxa de conversão de <strong>${fmtPct(d.conversao)}</strong> indica oportunidade de melhoria no funil de vendas.` });
  }

  /* Produto destaque */
  insights.push({ tipo: 'info', icone: '⭐',
    texto: `<strong>${d.destaques.melhorProd.valor}</strong> foi o produto mais vendido: ${d.destaques.melhorProd.sub}.` });

  return insights;
}

/* ================================================
   11. RENDER PRINCIPAL
================================================ */
function render(period) {
  const d = DATA[period];

  renderScore(d);
  renderKPIs(d);
  renderMeta(d);
  renderDestaques(d);
  renderCanais(d);
  renderHeatmap(d);
  renderRanking(d);
  renderInsights(d);
}

/* ================================================
   12. FILTRO DE PERÍODO
================================================ */
function initPeriodFilter() {
  const container = document.getElementById('period-filter');
  if (!container) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.period-btn');
    if (!btn) return;

    container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Fade das seções de conteúdo */
    const cards = document.querySelectorAll('.resumo-card, .resumo-kpis, .periodo-score');
    cards.forEach(c => { c.style.transition = 'opacity 0.18s ease'; c.style.opacity = '0.35'; });

    setTimeout(() => {
      render(btn.dataset.period);
      cards.forEach(c => { c.style.opacity = '1'; });
    }, 180);
  });
}

/* ================================================
   13. INIT
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  render('7d');
  initPeriodFilter();
});