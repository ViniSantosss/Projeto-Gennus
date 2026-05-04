/* ================================================
   lucro.js — Lucro Líquido — Gennus
================================================ */

const DATA = {
  '7d':  { receita: 28400,  despesas: 18200,  bruto: 22700,  ebitda: 9800 },
  '30d': { receita: 114300, despesas: 68400,  bruto: 91440,  ebitda: 48300 },
  '90d': { receita: 332800, despesas: 201000, bruto: 266240, ebitda: 141000 },
  '1y':  { receita: 1284000,despesas: 798000, bruto: 1027200,ebitda: 543000 },
};

// Despesas detalhadas (proporções fixas, valores escalam com o período)
const DEDUCOES = [
  { label: 'Folha de Pagamento', icone: '👥', corBarra: '#ef4444', corBg: 'rgba(239,68,68,0.1)', pct: 33.5 },
  { label: 'Aluguel & Espaço',   icone: '🏢', corBarra: '#fb923c', corBg: 'rgba(251,146,60,0.1)', pct: 7.2 },
  { label: 'Marketing & Ads',    icone: '📣', corBarra: '#a855f7', corBg: 'rgba(168,85,247,0.1)', pct: 5.4 },
  { label: 'Fornecedores',       icone: '📦', corBarra: '#60a5fa', corBg: 'rgba(96,165,250,0.1)', pct: 4.8 },
  { label: 'Softwares & TI',     icone: '💻', corBarra: '#22c55e', corBg: 'rgba(34,197,94,0.1)',  pct: 3.6 },
  { label: 'Logística',          icone: '🚚', corBarra: '#fbbf24', corBg: 'rgba(251,191,36,0.1)', pct: 3.0 },
  { label: 'Outros Custos',      icone: '📋', corBarra: '#6b7280', corBg: 'rgba(107,114,128,0.1)',pct: 2.4 },
];

const HISTORICO = [
  { label: 'T1', receita: 285000, despesas: 191000 },
  { label: 'T2', receita: 310000, despesas: 203000 },
  { label: 'T3', receita: 338000, despesas: 215000 },
  { label: 'T4', receita: 351000, despesas: 189000 },
];

const MARGENS = [
  { nome: 'Margem Bruta',      cor: '#22c55e', getVal: (r,d) => ((r - r*0.20) / r * 100), getR: (r,d) => r - r*0.20 },
  { nome: 'Margem Operacional',cor: '#60a5fa', getVal: (r,d) => ((r - d*0.85) / r * 100), getR: (r,d) => r - d*0.85 },
  { nome: 'Margem Líquida',    cor: '#a855f7', getVal: (r,d) => ((r - d) / r * 100),       getR: (r,d) => r - d },
];

// ------- Utilidades -------
const fmt  = v => 'R$ ' + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 0 });
const fmtK = v => {
  const a = Math.abs(v);
  return (v < 0 ? '−R$ ' : 'R$ ') + (a >= 1000 ? (a/1000).toFixed(0) + 'k' : a.toLocaleString('pt-BR'));
};

// ------- Calcular lucro -------
function calcLucro(period) {
  const d = DATA[period];
  return d.receita - d.despesas;
}

// ------- Equação grande -------
function renderEquacao(period) {
  const d      = DATA[period];
  const lucro  = d.receita - d.despesas;

  document.getElementById('eq-receita').textContent  = fmt(d.receita);
  document.getElementById('eq-despesas').textContent = fmt(d.despesas);
  document.getElementById('eq-lucro').textContent    = fmt(lucro);
}

// ------- KPIs secundários -------
function renderKPIs(period) {
  const d     = DATA[period];
  const lucro = d.receita - d.despesas;
  const margem = (lucro / d.receita * 100).toFixed(1);
  const breakeven = Math.ceil((d.despesas * 0.30) / (d.receita / 30));

  document.getElementById('kpi-bruto').textContent     = fmt(d.bruto);
  document.getElementById('kpi-ebitda').textContent    = fmt(d.ebitda);
  document.getElementById('kpi-margem').textContent    = margem + '%';
  document.getElementById('kpi-breakeven').textContent = breakeven + ' dias';

  const prevLucro = lucro * 0.88; // mock anterior
  const delta     = ((lucro - prevLucro) / prevLucro * 100).toFixed(1);
  const deltaEl   = document.getElementById('kpi-bruto-delta');
  deltaEl.textContent = (delta > 0 ? '▲ +' : '▼ ') + Math.abs(delta) + '% vs anterior';
  deltaEl.className   = 'kpi-delta ' + (delta >= 0 ? 'pos' : 'neg');

  // Score margem
  const scoreEl   = document.getElementById('luc-score-valor');
  const scoreDesc = document.getElementById('luc-score-desc');
  scoreEl.textContent = margem + '%';
  scoreDesc.textContent = margem > 35 ? 'excelente' : margem > 25 ? 'saudável' : margem > 15 ? 'razoável' : 'atenção';
}

// ------- Waterfall cascata -------
function renderWaterfall(period) {
  const d      = DATA[period];
  const lucro  = d.receita - d.despesas;
  const receita = d.receita;

  const container = document.getElementById('wf-container');
  container.innerHTML = '';

  // Linha da receita
  const rowReceita = makeWfRow({
    label: '💰 Receita Bruta',
    valor: receita,
    larguraPct: 100,
    corBarra: 'linear-gradient(90deg,#15803d,var(--verde))',
    tipo: 'receita',
    prefixo: '',
  });
  container.appendChild(rowReceita);

  // Deduções
  let restante = receita;
  DEDUCOES.forEach((ded, i) => {
    const valor    = receita * ded.pct / 100;
    restante      -= valor;
    const barraPct = (valor / receita * 100).toFixed(1);
    const delay    = 0.08 + i * 0.06;

    const row = makeWfRow({
      label: `${ded.icone} ${ded.label}`,
      valor: -valor,
      larguraPct: barraPct,
      corBarra: ded.corBarra,
      tipo: 'deducao',
      prefixo: '−',
      delay,
    });
    container.appendChild(row);
  });

  // Linha do resultado
  const margemPct = (lucro / receita * 100).toFixed(1);
  const rowLucro = makeWfRow({
    label: '✨ Lucro Líquido',
    valor: lucro,
    larguraPct: margemPct,
    corBarra: 'linear-gradient(90deg,var(--roxo-escuro),var(--roxo))',
    tipo: 'resultado',
    prefixo: '',
    delay: 0.08 + DEDUCOES.length * 0.06,
  });
  container.appendChild(rowLucro);

  // Badge status
  const badge = document.getElementById('badge-lucro-status');
  const marg  = parseFloat(margemPct);
  badge.textContent = marg > 35 ? 'Excelente' : marg > 25 ? 'Saudável' : marg > 15 ? 'Atenção' : 'Crítico';
  badge.className   = 'resumo-badge ' + (marg > 25 ? 'badge-ok' : marg > 15 ? 'badge-atencao' : 'badge-critico');
}

function makeWfRow({ label, valor, larguraPct, corBarra, tipo, prefixo, delay = 0 }) {
  const row = document.createElement('div');
  row.className = `wf-row wf-${tipo}`;

  const labelEl = document.createElement('span');
  labelEl.className = 'wf-label';
  labelEl.textContent = label;

  const barArea = document.createElement('div');
  barArea.className = 'wf-bar-area';

  const barBg   = document.createElement('div');
  barBg.className = 'wf-bar-bg';
  const barFill = document.createElement('div');
  barFill.className = 'wf-bar-fill';
  barFill.style.cssText = `
    width: 0%;
    background: ${corBarra};
    animation: growRight .9s cubic-bezier(0.16,1,0.3,1) ${delay}s both;
  `;
  // Animar a largura via JS depois do frame
  requestAnimationFrame(() => {
    setTimeout(() => { barFill.style.width = larguraPct + '%'; }, delay * 1000 + 50);
  });

  barBg.appendChild(barFill);
  barArea.appendChild(barBg);

  const valorEl = document.createElement('span');
  valorEl.className = 'wf-valor';
  valorEl.textContent = (prefixo ? '−' : '') + fmt(Math.abs(valor));

  row.appendChild(labelEl);
  row.appendChild(barArea);
  row.appendChild(valorEl);

  return row;
}

// ------- Impactos -------
function renderImpactos(period) {
  const d       = DATA[period];
  const receita = d.receita;
  const list    = document.getElementById('impactos-list');
  list.innerHTML = '';

  DEDUCOES.forEach(ded => {
    const valor = receita * ded.pct / 100;
    const item  = document.createElement('div');
    item.className = 'impacto-item';
    item.innerHTML = `
      <div class="impacto-icone" style="background:${ded.corBg};color:${ded.corBarra}">${ded.icone}</div>
      <div class="impacto-info">
        <span class="impacto-nome">${ded.label}</span>
        <div class="impacto-track">
          <div class="impacto-bar" style="width:${ded.pct}%;background:${ded.corBarra}"></div>
        </div>
      </div>
      <span class="impacto-pct">${ded.pct}%</span>
      <span class="impacto-valor">−${fmt(valor)}</span>
    `;
    list.appendChild(item);
  });

  // Régua proporcional
  const ruler = document.getElementById('impactos-ruler');
  ruler.innerHTML = '';
  const totalDedPct = DEDUCOES.reduce((s, d) => s + d.pct, 0);
  const lucroPct    = (100 - totalDedPct).toFixed(1);

  DEDUCOES.forEach(ded => {
    const seg = document.createElement('div');
    seg.className = 'ruler-seg';
    seg.style.cssText = `width:${ded.pct}%;background:${ded.corBarra};`;
    seg.textContent = ded.pct >= 5 ? ded.pct + '%' : '';
    ruler.appendChild(seg);
  });
  const lucroSeg = document.createElement('div');
  lucroSeg.className = 'ruler-seg';
  lucroSeg.style.cssText = `width:${lucroPct}%;background:var(--roxo);`;
  lucroSeg.textContent = '✨ ' + lucroPct + '%';
  ruler.appendChild(lucroSeg);
}

// ------- Evolução (gráfico de barras empilhado estilo) -------
function renderEvolucao() {
  const chart  = document.getElementById('evol-chart');
  const labels = document.getElementById('evol-labels');
  chart.innerHTML  = '';
  labels.innerHTML = '';

  const maxVal = Math.max(...HISTORICO.map(h => h.receita));

  HISTORICO.forEach((h, i) => {
    const lucro   = h.receita - h.despesas;
    const pRec    = (h.receita   / maxVal * 90).toFixed(1);
    const pDesp   = (h.despesas  / maxVal * 90).toFixed(1);
    const pLucro  = (lucro       / maxVal * 90).toFixed(1);
    const delay   = i * 0.07;

    const group = document.createElement('div');
    group.className = 'evol-group';

    [[pRec,'var(--amarelo)','rgba(251,191,36,.6)',fmtK(h.receita)],
     [pDesp,'var(--vermelho)','rgba(248,113,113,.6)',fmtK(h.despesas)],
     [pLucro,'var(--verde)','rgba(34,197,94,.6)',fmtK(lucro)]
    ].forEach(([h2, cor, bg, tip], bi) => {
      const bar = document.createElement('div');
      bar.className = 'evol-bar';
      bar.style.cssText = `height:${h2}%;background:${bg};border-top:2px solid ${cor};animation-delay:${delay + bi*0.04}s`;
      bar.setAttribute('data-tip', tip);
      group.appendChild(bar);
    });

    chart.appendChild(group);

    const lbl = document.createElement('div');
    lbl.className   = 'evol-lbl';
    lbl.textContent = h.label;
    labels.appendChild(lbl);
  });
}

// ------- Margens -------
function renderMargens(period) {
  const d    = DATA[period];
  const list = document.getElementById('margens-list');
  list.innerHTML = '';

  MARGENS.forEach(m => {
    const pct = m.getVal(d.receita, d.despesas).toFixed(1);
    const val = m.getR(d.receita, d.despesas);
    const li  = document.createElement('li');
    li.className = 'margem-item';
    li.innerHTML = `
      <div class="margem-top">
        <span class="margem-nome">${m.nome}</span>
        <div style="display:flex;gap:12px;align-items:center">
          <span class="margem-valor" style="color:${m.cor}">${fmt(val)}</span>
          <span class="margem-pct">${pct}%</span>
        </div>
      </div>
      <div class="margem-track">
        <div class="margem-bar" style="width:${Math.min(pct,100)}%;background:${m.cor}"></div>
      </div>
    `;
    list.appendChild(li);
  });

  // Saúde financeira
  const lucro   = d.receita - d.despesas;
  const margemL = lucro / d.receita * 100;
  const saudePct = Math.min(margemL * 2.5, 100).toFixed(0);

  document.getElementById('saude-bar').style.width = saudePct + '%';
  document.getElementById('saude-status').textContent =
    margemL > 35 ? '🟢 Excelente' : margemL > 25 ? '🔵 Saudável' : margemL > 15 ? '🟡 Razoável' : '🔴 Atenção';
  document.getElementById('saude-desc').textContent =
    margemL > 35
      ? 'A empresa apresenta margens muito acima da média do setor. Continue controlando os custos variáveis.'
      : margemL > 25
      ? 'Resultado financeiro sólido. A relação receita/despesa está bem equilibrada.'
      : margemL > 15
      ? 'Margem dentro do aceitável, mas há espaço para melhorar. Revise a folha de pagamento e marketing.'
      : 'Margens comprimidas. Recomenda-se revisão urgente das despesas fixas e variáveis.';
}

// ------- Render completo -------
function renderAll(period) {
  renderEquacao(period);
  renderKPIs(period);
  renderWaterfall(period);
  renderImpactos(period);
  renderMargens(period);
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
renderEvolucao();
renderAll('30d');