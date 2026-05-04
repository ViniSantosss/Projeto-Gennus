/**
 * renda.js — Renda Bruta / Líquida — Gennus
 * JS interativo com dados simulados.
 * Sem localStorage / backend — só UI e lógica de apresentação.
 */

'use strict';

/* ================================================
   1. DADOS SIMULADOS POR PERÍODO
================================================ */
const DATA = {
  '7d': {
    label: '7 dias',
    bruta:    41800,
    impostos: 6270,   // ~15%
    custos:   12540,  // ~30%
    outras:   2090,   // ~5%
    anterior: { liquida: 18200 }, // período anterior (para delta)
    historico: [
      { periodo: 'Seg', bruto: 5800, deducoes: 2900, liquido: 2900 },
      { periodo: 'Ter', bruto: 5200, deducoes: 2600, liquido: 2600 },
      { periodo: 'Qua', bruto: 6400, deducoes: 3200, liquido: 3200 },
      { periodo: 'Qui', bruto: 5900, deducoes: 2950, liquido: 2950 },
      { periodo: 'Sex', bruto: 7100, deducoes: 3550, liquido: 3550 },
      { periodo: 'Sáb', bruto: 7800, deducoes: 3900, liquido: 3900 },
      { periodo: 'Dom', bruto: 3600, deducoes: 1800, liquido: 1800 },
    ],
  },
  '30d': {
    label: '30 dias',
    bruta:    109300,
    impostos: 16395,
    custos:   32790,
    outras:   5465,
    anterior: { liquida: 48200 },
    historico: [
      { periodo: 'Semana 1', bruto: 22000, deducoes: 11000, liquido: 11000 },
      { periodo: 'Semana 2', bruto: 27500, deducoes: 13750, liquido: 13750 },
      { periodo: 'Semana 3', bruto: 31000, deducoes: 15500, liquido: 15500 },
      { periodo: 'Semana 4', bruto: 28800, deducoes: 14400, liquido: 14400 },
    ],
  },
  '90d': {
    label: '3 meses',
    bruta:    287500,
    impostos: 43125,
    custos:   86250,
    outras:   14375,
    anterior: { liquida: 128000 },
    historico: [
      { periodo: 'Janeiro',   bruto: 88000,  deducoes: 44000, liquido: 44000 },
      { periodo: 'Fevereiro', bruto: 102000, deducoes: 51000, liquido: 51000 },
      { periodo: 'Março',     bruto: 97500,  deducoes: 48750, liquido: 48750 },
    ],
  },
  '1y': {
    label: '1 ano',
    bruta:    1351000,
    impostos: 202650,
    custos:   405300,
    outras:   67550,
    anterior: { liquida: 580000 },
    historico: [
      { periodo: 'Jan', bruto: 71000,  deducoes: 35500, liquido: 35500 },
      { periodo: 'Fev', bruto: 88000,  deducoes: 44000, liquido: 44000 },
      { periodo: 'Mar', bruto: 102000, deducoes: 51000, liquido: 51000 },
      { periodo: 'Abr', bruto: 97500,  deducoes: 48750, liquido: 48750 },
      { periodo: 'Mai', bruto: 115000, deducoes: 57500, liquido: 57500 },
      { periodo: 'Jun', bruto: 128000, deducoes: 64000, liquido: 64000 },
      { periodo: 'Jul', bruto: 119000, deducoes: 59500, liquido: 59500 },
      { periodo: 'Ago', bruto: 132000, deducoes: 66000, liquido: 66000 },
      { periodo: 'Set', bruto: 141000, deducoes: 70500, liquido: 70500 },
      { periodo: 'Out', bruto: 138000, deducoes: 69000, liquido: 69000 },
      { periodo: 'Nov', bruto: 152000, deducoes: 76000, liquido: 76000 },
      { periodo: 'Dez', bruto: 168000, deducoes: 84000, liquido: 84000 },
    ],
  },
};

/* Categorias de dedução com cores fixas */
const CATEGORIAS = [
  { key: 'impostos', nome: 'Impostos',            cor: '#f87171' },
  { key: 'custos',   nome: 'Custos Operacionais', cor: '#fb923c' },
  { key: 'outras',   nome: 'Outras Deduções',     cor: '#fbbf24' },
];

/* ================================================
   2. HELPERS
================================================ */

/** Formata número em BRL: 120000 → "R$ 120.000" */
function fmtBRL(n) {
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR');
}

/** Formata percentual: 0.427 → "42,7%" */
function fmtPct(n) {
  return (n * 100).toFixed(1).replace('.', ',') + '%';
}

/** Calcula derivados a partir dos dados brutos */
function calcular(d) {
  const deducoes = d.impostos + d.custos + d.outras;
  const liquida  = d.bruta - deducoes;
  const margem   = liquida / d.bruta;
  const crescimento = (liquida - d.anterior.liquida) / d.anterior.liquida;
  return { deducoes, liquida, margem, crescimento };
}

/** Classifica margem para colorir a tag da tabela */
function classMargem(pct) {
  if (pct >= 0.40) return 'alta';
  if (pct >= 0.25) return 'media';
  return 'baixa';
}

/* ================================================
   3. ANIMAÇÃO DE CONTAGEM (count-up)
   Anima um elemento de 0 até o valor alvo.
================================================ */
function countUp(el, target, formatter, duration = 700) {
  if (!el) return;
  const start     = performance.now();
  const startVal  = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easing: ease-out cúbico
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = startVal + (target - startVal) * eased;
    el.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ================================================
   4. RENDERIZAÇÃO: KPIs
================================================ */
function renderKPIs(d, calc) {
  /* Valores principais */
  countUp(document.getElementById('kpi-bruta'),    d.bruta,       fmtBRL);
  countUp(document.getElementById('kpi-liquida'),  calc.liquida,  fmtBRL);
  countUp(document.getElementById('kpi-deducoes'), calc.deducoes, fmtBRL);

  /* Margem — anima de 0% a valor real */
  const elMargem = document.getElementById('kpi-margem');
  countUp(elMargem, calc.margem * 100, v => v.toFixed(1).replace('.', ',') + '%');

  /* Deltas */
  renderDelta('kpi-bruta-delta',   null);  // bruta não tem delta simples
  renderDelta('kpi-liquida-delta', calc.crescimento);
}

function renderDelta(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  if (valor === null) { el.textContent = ''; return; }

  const pos   = valor >= 0;
  const sinal = pos ? '+' : '';
  el.textContent = `${sinal}${fmtPct(Math.abs(valor))} vs. anterior`;
  el.className   = 'kpi-delta ' + (pos ? 'pos' : 'neg');
}

/* ================================================
   5. RENDERIZAÇÃO: WATERFALL
================================================ */
function renderWaterfall(d, calc) {
  /* Badge do período */
  const badge = document.getElementById('badge-periodo');
  if (badge) badge.textContent = d.label;

  /* Helper: anima a largura de uma barra */
  function animBar(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    // reset pra 0 antes de animar (garante que a animação sempre roda)
    el.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = (pct * 100).toFixed(1) + '%';
      });
    });
  }

  /* Linha: Receita Bruta (sempre 100%) */
  document.getElementById('wf-bruta-val').textContent = fmtBRL(d.bruta);
  animBar('wf-bar-bruta', 1);

  /* Linha: Impostos */
  const pctImpostos = d.impostos / d.bruta;
  document.getElementById('wf-impostos-val').textContent = '− ' + fmtBRL(d.impostos);
  document.getElementById('wf-impostos-pct').textContent = fmtPct(pctImpostos);
  animBar('wf-bar-impostos', pctImpostos);

  /* Linha: Custos Operacionais */
  const pctCustos = d.custos / d.bruta;
  document.getElementById('wf-custos-val').textContent = '− ' + fmtBRL(d.custos);
  document.getElementById('wf-custos-pct').textContent = fmtPct(pctCustos);
  animBar('wf-bar-custos', pctCustos);

  /* Linha: Outras Deduções */
  const pctOutras = d.outras / d.bruta;
  document.getElementById('wf-outras-val').textContent = '− ' + fmtBRL(d.outras);
  document.getElementById('wf-outras-pct').textContent = fmtPct(pctOutras);
  animBar('wf-bar-outras', pctOutras);

  /* Linha: Renda Líquida */
  const pctLiquida = calc.liquida / d.bruta;
  document.getElementById('wf-liquida-val').textContent = fmtBRL(calc.liquida);
  document.getElementById('wf-liquida-pct').textContent = fmtPct(pctLiquida);
  animBar('wf-bar-liquida', pctLiquida);
}

/* ================================================
   6. RENDERIZAÇÃO: DETALHAMENTO
================================================ */
function renderDetalhamento(d, calc) {
  const ul = document.getElementById('detalhe-list');
  if (!ul) return;
  ul.innerHTML = '';

  CATEGORIAS.forEach(cat => {
    const valor = d[cat.key];
    const pct   = valor / d.bruta;

    const li = document.createElement('li');
    li.className = 'detalhe-item';
    li.innerHTML = `
      <span class="detalhe-dot" style="background:${cat.cor};box-shadow:0 0 7px ${cat.cor}66;"></span>
      <span class="detalhe-nome">${cat.nome}</span>
      <span class="detalhe-valor">− ${fmtBRL(valor)}</span>
      <span class="detalhe-pct-tag">${fmtPct(pct)}</span>
    `;
    ul.appendChild(li);
  });

  /* Rodapé */
  document.getElementById('df-deducoes').textContent = '− ' + fmtBRL(calc.deducoes);
  document.getElementById('df-liquida').textContent  = fmtBRL(calc.liquida);
}

/* ================================================
   7. RENDERIZAÇÃO: TABELA HISTÓRICO
================================================ */
function renderHistorico(d) {
  const tbody = document.getElementById('historico-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const rows = d.historico;

  rows.forEach((row, i) => {
    const margem = row.liquido / row.bruto;
    const classMg = classMargem(margem);

    /* Variação: compara com linha anterior */
    let varHTML = '<span style="color:#333">—</span>';
    if (i > 0) {
      const prev = rows[i - 1].liquido;
      const var_ = (row.liquido - prev) / prev;
      const pos  = var_ >= 0;
      const sinal = pos ? '+' : '';
      varHTML = `<span class="${pos ? 'td-var-pos' : 'td-var-neg'}">${sinal}${fmtPct(Math.abs(var_))}</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.periodo}</td>
      <td class="td-bruto">${fmtBRL(row.bruto)}</td>
      <td style="color:var(--vermelho)">${fmtBRL(row.deducoes)}</td>
      <td class="td-liquido">${fmtBRL(row.liquido)}</td>
      <td><span class="margem-tag ${classMg}">${fmtPct(margem)}</span></td>
      <td>${varHTML}</td>
    `;

    /* Entrada staggerada por linha */
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(6px)';
    tr.style.transition = `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms`;
    tbody.appendChild(tr);

    /* Força reflow antes de aplicar o estado final */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tr.style.opacity = '1';
        tr.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ================================================
   8. RENDERIZAÇÃO: SAÚDE FINANCEIRA
================================================ */
function renderSaude(d, calc) {
  /* Helper: anima barra de saúde */
  function animSaudeBar(id, pct) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = Math.min(pct * 100, 100).toFixed(1) + '%';
      });
    });
  }

  /* Margem líquida */
  document.getElementById('saude-margem-val').textContent = fmtPct(calc.margem);
  animSaudeBar('saude-bar-margem', calc.margem);
  /* Cor condicional do valor de margem */
  const elMargVal = document.getElementById('saude-margem-val');
  if (elMargVal) {
    elMargVal.style.color = calc.margem >= 0.4
      ? 'var(--verde)'
      : calc.margem >= 0.25
        ? 'var(--amarelo)'
        : 'var(--vermelho)';
  }

  /* Eficiência operacional = 1 - (custos / bruta) */
  const eficiencia = 1 - (d.custos / d.bruta);
  document.getElementById('saude-eficiencia-val').textContent = fmtPct(eficiencia);
  animSaudeBar('saude-bar-eficiencia', eficiencia);

  /* Carga tributária = impostos / bruta */
  const tributos = d.impostos / d.bruta;
  document.getElementById('saude-tributos-val').textContent = fmtPct(tributos);
  animSaudeBar('saude-bar-tributos', tributos);

  /* Crescimento líquido */
  const pos = calc.crescimento >= 0;
  const elCrescVal  = document.getElementById('saude-crescimento-val');
  const elCrescDesc = document.getElementById('saude-crescimento-desc');

  if (elCrescVal) {
    const sinal = pos ? '+' : '';
    elCrescVal.textContent = `${sinal}${fmtPct(Math.abs(calc.crescimento))}`;
    elCrescVal.className   = 'saude-valor saude-valor-crescimento ' + (pos ? 'pos' : 'neg');
  }

  if (elCrescDesc) {
    elCrescDesc.textContent = pos
      ? `↑ Crescimento vs. período anterior`
      : `↓ Queda vs. período anterior`;
    elCrescDesc.style.color = pos ? 'var(--verde)' : 'var(--vermelho)';
    elCrescDesc.style.opacity = '0.8';
  }
}

/* ================================================
   9. RENDER PRINCIPAL
   Orquestra todos os sub-renders para um período.
================================================ */
function render(period) {
  const d    = DATA[period];
  const calc = calcular(d);

  renderKPIs(d, calc);
  renderWaterfall(d, calc);
  renderDetalhamento(d, calc);
  renderHistorico(d);
  renderSaude(d, calc);
}

/* ================================================
   10. FILTRO DE PERÍODO
================================================ */
function initPeriodFilter() {
  const container = document.getElementById('period-filter');
  if (!container) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.period-btn');
    if (!btn) return;

    /* Atualiza estado visual dos botões */
    container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Fade-out rápido dos cards de conteúdo */
    const cards = document.querySelectorAll('.renda-card, .renda-kpis');
    cards.forEach(c => {
      c.style.transition = 'opacity 0.18s ease';
      c.style.opacity    = '0.4';
    });

    /* Aguarda o fade e re-renderiza */
    setTimeout(() => {
      render(btn.dataset.period);
      cards.forEach(c => {
        c.style.opacity = '1';
      });
    }, 180);
  });
}

/* ================================================
   11. HOVER INTERATIVO NA TABELA
   Destaca a linha inteira ao passar o mouse.
================================================ */
function initTableHover() {
  const tbody = document.getElementById('historico-tbody');
  if (!tbody) return;

  /* Delegação de evento — funciona mesmo após re-render */
  tbody.addEventListener('mouseover', e => {
    const tr = e.target.closest('tr');
    if (tr) tr.style.background = 'rgba(168,85,247,0.04)';
  });

  tbody.addEventListener('mouseout', e => {
    const tr = e.target.closest('tr');
    if (tr) tr.style.background = '';
  });
}

/* ================================================
   12. TOOLTIP NOS ITENS DO DETALHAMENTO
   Mostra valor exato ao hover nas linhas da lista.
================================================ */
function initDetalheTooltip() {
  const ul = document.getElementById('detalhe-list');
  if (!ul) return;

  ul.addEventListener('mouseover', e => {
    const item = e.target.closest('.detalhe-item');
    if (!item || item.querySelector('.detalhe-tooltip')) return;

    const valEl = item.querySelector('.detalhe-valor');
    if (!valEl) return;

    const tip = document.createElement('span');
    tip.className   = 'detalhe-tooltip';
    tip.textContent = 'dedução do bruto';
    tip.style.cssText = `
      position:absolute; right:10px; top:-22px;
      background:#111; border:1px solid rgba(255,255,255,0.08);
      color:#777; font-size:0.62rem; padding:2px 7px;
      border-radius:4px; pointer-events:none; white-space:nowrap;
      font-family:'Space Grotesk',sans-serif;
    `;
    item.style.position = 'relative';
    item.appendChild(tip);
  });

  ul.addEventListener('mouseout', e => {
    const item = e.target.closest('.detalhe-item');
    if (!item) return;
    const tip = item.querySelector('.detalhe-tooltip');
    if (tip) tip.remove();
  });
}

/* ================================================
   13. INIT
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  render('7d');
  initPeriodFilter();
  initTableHover();
  initDetalheTooltip();
});