/* ================================================
   receita.js — Receita — Gennus
================================================ */

const DATA = {
  '7d':  { bruta: 28400, mrr: 21000, media: 4066, crescimento: +8.2,  deltaBruta: +5.1, deltaMrr: +3.4 },
  '30d': { bruta: 114300, mrr: 87500, media: 28575, crescimento: +12.7, deltaBruta: +12.7, deltaMrr: +9.2 },
  '90d': { bruta: 332800, mrr: 261000, media: 110933, crescimento: +19.4, deltaBruta: +19.4, deltaMrr: +14.1 },
  '1y':  { bruta: 1284000, mrr: 980000, media: 107000, crescimento: +31.2, deltaBruta: +31.2, deltaMrr: +22.8 },
};

const BARS = {
  '7d':  { labels: ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'], atual: [3200,4100,5800,2900,6400,3800,2200], anterior: [2800,3500,4200,3100,5200,2900,1900] },
  '30d': { labels: ['S1','S2','S3','S4'], atual: [24000,31000,28000,31300], anterior: [20000,26000,22000,27000] },
  '90d': { labels: ['Jan','Fev','Mar'], atual: [98000,114000,120800], anterior: [82000,95000,103000] },
  '1y':  { labels: ['T1','T2','T3','T4'], atual: [285000,310000,338000,351000], anterior: [218000,251000,278000,295000] },
};

const COMPOSICAO = [
  { nome: 'Produtos Físicos',   pct: 42, valor: 48006, cor: '#22c55e' },
  { nome: 'Serviços Mensais',   pct: 31, valor: 35433, cor: '#a855f7' },
  { nome: 'Licenças / SaaS',    pct: 16, valor: 18288, cor: '#60a5fa' },
  { nome: 'Consultoria',        pct:  7, valor:  8001, cor: '#fb923c' },
  { nome: 'Outros',             pct:  4, valor:  4572, cor: '#fbbf24' },
];

const PAGAMENTOS = [
  { nome: 'PIX',           pct: 44, cor: '#22c55e' },
  { nome: 'Cartão Crédito',pct: 28, cor: '#a855f7' },
  { nome: 'Boleto',        pct: 18, cor: '#60a5fa' },
  { nome: 'Transferência', pct: 10, cor: '#fb923c' },
];

const ENTRADAS = [
  { desc: 'Venda de Produto — Loja A',  meta: 'hoje, 14:32', valor: 1290.00, tag: 'pix',    tagClass: 'tag-pix' },
  { desc: 'Assinatura Mensal — Cliente X', meta: 'hoje, 11:10', valor: 899.00, tag: 'cartão', tagClass: 'tag-cartao' },
  { desc: 'Consultoria — Empresa Y',    meta: 'ontem, 17:45', valor: 2500.00, tag: 'transf',tagClass: 'tag-transf' },
  { desc: 'Licença Software — Q',       meta: 'ontem, 10:22', valor: 450.00,  tag: 'boleto', tagClass: 'tag-boleto' },
  { desc: 'Venda Avulsa — Loja B',      meta: '02/07, 09:11', valor: 380.00,  tag: 'pix',   tagClass: 'tag-pix' },
  { desc: 'Assinatura Anual — Cliente Z',meta:'01/07, 15:55', valor: 8400.00, tag: 'cartão', tagClass: 'tag-cartao' },
];

const TRIMESTRES = [
  { label: '1º Trimestre', valor: 285000, delta: +30.7 },
  { label: '2º Trimestre', valor: 310000, delta: +23.5 },
  { label: '3º Trimestre', valor: 338000, delta: +21.6 },
  { label: '4º Trimestre', valor: 351000, delta: +19.0 },
];

// ------- Utilidades -------
const fmt = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtK = v => v >= 1000 ? 'R$ ' + (v/1000).toFixed(0) + 'k' : fmt(v);

// ------- Renderização -------

function renderKPIs(period) {
  const d = DATA[period];
  document.getElementById('rec-total-valor').textContent  = fmt(d.bruta);
  document.getElementById('kpi-bruta').textContent        = fmt(d.bruta);
  document.getElementById('kpi-mrr').textContent          = fmt(d.mrr);
  document.getElementById('kpi-media').textContent        = fmt(d.media);
  document.getElementById('kpi-crescimento').textContent  = (d.crescimento > 0 ? '+' : '') + d.crescimento + '%';

  const bd = document.getElementById('kpi-bruta-delta');
  bd.textContent  = (d.deltaBruta > 0 ? '▲ +' : '▼ ') + Math.abs(d.deltaBruta) + '% vs anterior';
  bd.className    = 'kpi-delta ' + (d.deltaBruta >= 0 ? 'pos' : 'neg');

  const md = document.getElementById('kpi-mrr-delta');
  md.textContent  = (d.deltaMrr > 0 ? '▲ +' : '▼ ') + Math.abs(d.deltaMrr) + '% vs anterior';
  md.className    = 'kpi-delta ' + (d.deltaMrr >= 0 ? 'pos' : 'neg');
}

function renderBarChart(period) {
  const b = BARS[period];
  const maxVal = Math.max(...b.atual, ...b.anterior);

  const area   = document.getElementById('bar-chart-area');
  const labels = document.getElementById('bar-chart-labels');
  area.innerHTML   = '';
  labels.innerHTML = '';

  b.atual.forEach((v, i) => {
    const pAtual  = (v / maxVal * 100).toFixed(1);
    const pAnt    = (b.anterior[i] / maxVal * 100).toFixed(1);
    const delay   = i * 0.05;

    const group = document.createElement('div');
    group.className = 'bar-group';

    const barA = document.createElement('div');
    barA.className = 'bar-col bar-atual';
    barA.style.cssText = `height:${pAtual}%; animation-delay:${delay}s`;
    barA.setAttribute('data-tip', fmtK(v));

    const barP = document.createElement('div');
    barP.className = 'bar-col bar-anterior';
    barP.style.cssText = `height:${pAnt}%; animation-delay:${delay + 0.03}s`;
    barP.setAttribute('data-tip', fmtK(b.anterior[i]));

    group.appendChild(barP);
    group.appendChild(barA);
    area.appendChild(group);

    const lbl = document.createElement('div');
    lbl.className   = 'bar-label';
    lbl.textContent = b.labels[i];
    labels.appendChild(lbl);
  });
}

function renderComposicao() {
  const list = document.getElementById('comp-list');
  list.innerHTML = '';
  const total30 = DATA['30d'].bruta;

  COMPOSICAO.forEach(c => {
    const li = document.createElement('li');
    li.className = 'comp-item';
    li.innerHTML = `
      <div class="comp-top">
        <span class="comp-nome">
          <span class="comp-dot" style="background:${c.cor}"></span>
          ${c.nome}
        </span>
        <div class="comp-vals">
          <span class="comp-valor">${fmt(c.valor)}</span>
          <span class="comp-pct">${c.pct}%</span>
        </div>
      </div>
      <div class="comp-track">
        <div class="comp-bar" style="width:${c.pct}%;background:${c.cor}"></div>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderDonut() {
  const size   = 110;
  const r      = 38;
  const cx     = size / 2;
  const cy     = size / 2;
  const circ   = 2 * Math.PI * r;

  let offset = 0;
  let arcs   = '';

  PAGAMENTOS.forEach(p => {
    const dash = (p.pct / 100) * circ;
    const gap  = circ - dash;
    arcs += `<circle
      cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${p.cor}" stroke-width="12"
      stroke-dasharray="${dash} ${gap}"
      stroke-dashoffset="${-offset}"
      style="transition: stroke-dashoffset 0.6s ease"
    />`;
    offset += dash;
  });

  // Centro
  arcs += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="Space Grotesk" font-size="10" font-weight="700" fill="#ddd">PIX</text>
  <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-family="Space Grotesk" font-size="8" fill="#555">44%</text>`;

  document.getElementById('pag-donut').innerHTML =
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${arcs}</svg>`;

  const leg = document.getElementById('pag-legend');
  leg.innerHTML = '';
  PAGAMENTOS.forEach(p => {
    leg.innerHTML += `
      <li class="pag-leg-item">
        <span class="pag-leg-dot" style="background:${p.cor}"></span>
        <div class="pag-leg-info">
          <span class="pag-leg-nome">${p.nome}</span>
          <span class="pag-leg-val">${p.pct}%</span>
        </div>
      </li>
    `;
  });
}

function renderEntradas() {
  const list = document.getElementById('entradas-list');
  list.innerHTML = '';
  ENTRADAS.forEach(e => {
    const li = document.createElement('li');
    li.className = 'entrada-item';
    li.innerHTML = `
      <div class="entrada-info">
        <span class="entrada-desc">${e.desc}</span>
        <span class="entrada-meta">${e.meta}</span>
      </div>
      <div class="entrada-right">
        <span class="entrada-valor">${fmt(e.valor)}</span>
        <span class="entrada-tag ${e.tagClass}">${e.tag}</span>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderComparativoAnual() {
  const grid = document.getElementById('comp-anual-grid');
  grid.innerHTML = '';
  TRIMESTRES.forEach(t => {
    const div = document.createElement('div');
    div.className = 'quad-item';
    div.innerHTML = `
      <span class="quad-label">${t.label}</span>
      <span class="quad-valor">${fmtK(t.valor)}</span>
      <span class="quad-delta ${t.delta >= 0 ? 'pos' : 'neg'}">
        ${t.delta >= 0 ? '▲ +' : '▼ '}${Math.abs(t.delta)}% vs anterior
      </span>
    `;
    grid.appendChild(div);
  });
}

function renderAll(period) {
  renderKPIs(period);
  renderBarChart(period);
}

// ------- Filtro de período -------
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAll(btn.dataset.period);
  });
});

// ------- Init -------
renderComposicao();
renderDonut();
renderEntradas();
renderComparativoAnual();
renderAll('30d');