/* ================================================
   despesas.js — Despesas — Gennus
================================================ */

const DATA = {
  '7d':  { total: 18200, folha: 10080, fixo: 5100, variavel: 3020, deltaTot: +2.1 },
  '30d': { total: 68400, folha: 38200, fixo: 18600, variavel: 11600, deltaTot: +4.3 },
  '90d': { total: 201000, folha: 112000, fixo: 56000, variavel: 33000, deltaTot: +8.7 },
  '1y':  { total: 798000, folha: 446000, fixo: 220000, variavel: 132000, deltaTot: +15.2 },
};

const CATEGORIAS = [
  { nome: 'Folha de Pagamento', icone: '👥', cor: '#ef4444', pct: 56, valor: 38200 },
  { nome: 'Aluguel & Espaço',   icone: '🏢', cor: '#fb923c', pct: 12, valor: 8208 },
  { nome: 'Marketing & Ads',    icone: '📣', cor: '#a855f7', pct:  9, valor: 6156 },
  { nome: 'Fornecedores',       icone: '📦', cor: '#60a5fa', pct:  8, valor: 5472 },
  { nome: 'Softwares & TI',     icone: '💻', cor: '#22c55e', pct:  6, valor: 4104 },
  { nome: 'Logística',          icone: '🚚', cor: '#fbbf24', pct:  5, valor: 3420 },
  { nome: 'Outros',             icone: '📋', cor: '#6b7280', pct:  4, valor: 2736 },
];

const FUNCIONARIOS = {
  clt: [
    { nome: 'Carlos Mendes',   cargo: 'Gerente de Vendas',   custo: 8200,  tipo: 'clt',      tipoClass: 'tipo-clt', avatar: 'CM' },
    { nome: 'Ana Ribeiro',     cargo: 'Desenvolvedora Senior', custo: 9800, tipo: 'clt',     tipoClass: 'tipo-clt', avatar: 'AR' },
    { nome: 'Thiago Lima',     cargo: 'Designer UX/UI',       custo: 6400, tipo: 'clt',      tipoClass: 'tipo-clt', avatar: 'TL' },
    { nome: 'Fernanda Costa',  cargo: 'Analista Financeira',  custo: 5800, tipo: 'clt',      tipoClass: 'tipo-clt', avatar: 'FC' },
    { nome: 'Pedro Souza',     cargo: 'Atendimento / CS',     custo: 3800, tipo: 'clt',      tipoClass: 'tipo-clt', avatar: 'PS' },
  ],
  pj: [
    { nome: 'Rafael Santos',   cargo: 'Dev Backend — PJ',     custo: 7200, tipo: 'pj',       tipoClass: 'tipo-pj', avatar: 'RS' },
    { nome: 'Mariana Faria',   cargo: 'Copywriting — PJ',     custo: 2800, tipo: 'pj',       tipoClass: 'tipo-pj', avatar: 'MF' },
    { nome: 'Lucas Prado',     cargo: 'Tráfego Pago — PJ',    custo: 3500, tipo: 'pj',       tipoClass: 'tipo-pj', avatar: 'LP' },
  ],
  terceiros: [
    { nome: 'Contabilidade S.A.',  cargo: 'Serviços Contábeis',   custo: 1800, tipo: 'terceiro', tipoClass: 'tipo-terceiro', avatar: 'CO' },
    { nome: 'Limpeza Express',     cargo: 'Limpeza do Espaço',    custo: 900,  tipo: 'terceiro', tipoClass: 'tipo-terceiro', avatar: 'LE' },
    { nome: 'Segurança Total',     cargo: 'Vigilância Patrimonial',custo:1200, tipo: 'terceiro', tipoClass: 'tipo-terceiro', avatar: 'ST' },
  ],
};

const TIMELINE = [
  { label: 'S1/Jan', valor: 14200, media: 0 },
  { label: 'S2/Jan', valor: 17800, media: 0 },
  { label: 'S3/Jan', valor: 12900, media: 0 },
  { label: 'S4/Jan', valor: 16100, media: 0 },
  { label: 'S1/Fev', valor: 15600, media: 0 },
  { label: 'S2/Fev', valor: 19200, media: 0 },
  { label: 'S3/Fev', valor: 13800, media: 0 },
  { label: 'S4/Fev', valor: 15400, media: 0 },
  { label: 'S1/Mar', valor: 16800, media: 0 },
  { label: 'S2/Mar', valor: 20100, media: 0 },
  { label: 'S3/Mar', valor: 14200, media: 0 },
  { label: 'S4/Mar', valor: 17600, media: 0 },
];

const SAIDAS = [
  { icone: '👥', iBg: 'rgba(239,68,68,0.1)',   iColor: '#ef4444', desc: 'Folha — Quinzena 1',      meta: 'hoje, 08:00',   valor: 19100 },
  { icone: '🏢', iBg: 'rgba(251,146,60,0.1)',  iColor: '#fb923c', desc: 'Aluguel — Julho',         meta: 'ontem, 12:00',  valor: 8208  },
  { icone: '📣', iBg: 'rgba(168,85,247,0.1)',  iColor: '#a855f7', desc: 'Google Ads — Campanha',   meta: '02/07, 16:40',  valor: 3200  },
  { icone: '💻', iBg: 'rgba(34,197,94,0.1)',   iColor: '#22c55e', desc: 'Assinatura AWS',          meta: '01/07, 09:00',  valor: 1420  },
  { icone: '📦', iBg: 'rgba(96,165,250,0.1)',  iColor: '#60a5fa', desc: 'Fornecedor — Estoque',    meta: '30/06, 14:20',  valor: 5472  },
  { icone: '🚚', iBg: 'rgba(251,191,36,0.1)',  iColor: '#fbbf24', desc: 'Frete — Saída Lote 18',   meta: '29/06, 10:55',  valor: 840   },
];

const PROJECAO = {
  total: 71200,
  delta: +4.1,
  itens: [
    { nome: 'Folha de Pagamento', icon: '👥', valor: 38200 },
    { nome: 'Aluguel',            icon: '🏢', valor: 8208  },
    { nome: 'Marketing',          icon: '📣', valor: 6800  },
    { nome: 'Fornecedores',       icon: '📦', valor: 5900  },
    { nome: 'TI & Softwares',     icon: '💻', valor: 4400  },
    { nome: 'Outros',             icon: '📋', valor: 7692  },
  ],
};

// ------- Utilidades -------
const fmt  = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
const fmtK = v => v >= 1000 ? 'R$ ' + (v/1000).toFixed(1) + 'k' : fmt(v);

// ------- Renderizações -------

function renderKPIs(period) {
  const d = DATA[period];
  const ratio = (d.total / 114300 * 100).toFixed(0); // relativo à receita de 30d

  document.getElementById('kpi-total').textContent    = fmt(d.total);
  document.getElementById('kpi-folha').textContent    = fmt(d.folha);
  document.getElementById('kpi-fixo').textContent     = fmt(d.fixo);
  document.getElementById('kpi-variavel').textContent = fmt(d.variavel);

  const deltaEl = document.getElementById('kpi-total-delta');
  deltaEl.textContent = (d.deltaTot > 0 ? '▲ +' : '▼ ') + Math.abs(d.deltaTot) + '% vs anterior';
  deltaEl.className   = 'kpi-delta ' + (d.deltaTot <= 5 ? 'pos' : 'neg');

  document.getElementById('kpi-folha-sub').textContent =
    ((d.folha / d.total) * 100).toFixed(0) + '% do total';

  // Alerta custo/receita (baseado em 30d fixo como referência de receita)
  const RECEITA_REF = { '7d': 28400, '30d': 114300, '90d': 332800, '1y': 1284000 };
  const pct = ((d.total / RECEITA_REF[period]) * 100).toFixed(0);
  const alertVal = document.getElementById('desp-alerta-valor');
  alertVal.textContent = pct + '%';
  alertVal.className   = 'desp-alerta-valor ' + (pct > 70 ? 'alto' : pct > 55 ? '' : 'ok');
  document.getElementById('desp-alerta-desc').textContent =
    pct > 70 ? 'atenção: custo elevado' : pct > 55 ? 'dentro do esperado' : 'excelente controle';

  // Badge status
  const badge = document.getElementById('badge-status');
  badge.textContent = pct > 70 ? 'Crítico' : pct > 55 ? 'Atenção' : 'Normal';
  badge.className   = 'resumo-badge ' + (pct > 70 ? 'badge-critico' : pct > 55 ? 'badge-atencao' : 'badge-ok');
}

function renderCategorias(period) {
  const d    = DATA[period];
  const list = document.getElementById('cat-list');
  list.innerHTML = '';

  CATEGORIAS.forEach(c => {
    const valor = Math.round(d.total * c.pct / 100);
    const li    = document.createElement('li');
    li.className = 'cat-item';
    li.innerHTML = `
      <div class="cat-top">
        <span class="cat-nome">
          <span class="cat-icone" style="background:${c.cor}22;color:${c.cor}">${c.icone}</span>
          ${c.nome}
        </span>
        <div class="cat-vals">
          <span class="cat-valor">${fmt(valor)}</span>
          <span class="cat-pct">${c.pct}%</span>
        </div>
      </div>
      <div class="cat-track">
        <div class="cat-bar" style="width:${c.pct}%;background:${c.cor}"></div>
      </div>
    `;
    list.appendChild(li);
  });
}

let activeTab = 'clt';

function renderFuncionarios(tab) {
  activeTab = tab;
  const grupo = FUNCIONARIOS[tab];
  const list  = document.getElementById('func-list');
  list.innerHTML = '';

  const avatarColors = ['#ef4444','#fb923c','#a855f7','#60a5fa','#22c55e','#fbbf24','#ec4899'];

  grupo.forEach((f, i) => {
    const li = document.createElement('li');
    li.className = 'func-item';
    li.innerHTML = `
      <div class="func-avatar" style="background:linear-gradient(135deg,${avatarColors[i % avatarColors.length]},${avatarColors[(i+2) % avatarColors.length]})">${f.avatar}</div>
      <div class="func-info">
        <span class="func-nome">${f.nome}</span>
        <span class="func-cargo">${f.cargo}</span>
      </div>
      <div class="func-custo">
        <span class="func-custo-val">${fmt(f.custo)}<small style="font-size:.62rem;opacity:.6">/mês</small></span>
        <span class="func-custo-tipo ${f.tipoClass}">${f.tipo === 'terceiro' ? '3º' : f.tipo.toUpperCase()}</span>
      </div>
    `;
    list.appendChild(li);
  });

  const totalGrupo = grupo.reduce((s, f) => s + f.custo, 0);
  document.getElementById('func-total-badge').textContent = fmt(totalGrupo) + '/mês';
  document.getElementById('func-rodape').innerHTML = `
    <span class="func-rod-label">${grupo.length} colaborador${grupo.length !== 1 ? 'es' : ''} — ${tab.toUpperCase()}</span>
    <span class="func-rod-total">${fmt(totalGrupo)}/mês</span>
  `;
}

function renderTimeline() {
  const grid   = document.getElementById('tl-grid');
  const media  = TIMELINE.reduce((s, t) => s + t.valor, 0) / TIMELINE.length;
  const maxVal = Math.max(...TIMELINE.map(t => t.valor));
  grid.innerHTML = '';

  TIMELINE.forEach((t, i) => {
    const pct  = (t.valor / maxVal * 85).toFixed(1);
    const diff = t.valor - media;
    const cor  = diff > 1500 ? 'var(--vermelho)' : diff > -500 ? '#fb923c' : '#60a5fa';
    const delay = i * 0.04;

    const col = document.createElement('div');
    col.className = 'tl-col';
    col.innerHTML = `
      <div class="tl-bar-wrap">
        <div class="tl-bar" style="height:${pct}%;background:${cor};animation-delay:${delay}s" data-tip="${fmtK(t.valor)}"></div>
      </div>
      <span class="tl-label">${t.label}</span>
    `;
    grid.appendChild(col);
  });
}

function renderSaidas() {
  const list = document.getElementById('saidas-list');
  list.innerHTML = '';
  SAIDAS.forEach(s => {
    const li = document.createElement('li');
    li.className = 'saida-item';
    li.innerHTML = `
      <div class="saida-esq">
        <div class="saida-icone" style="background:${s.iBg};color:${s.iColor}">${s.icone}</div>
        <div class="saida-info">
          <span class="saida-desc">${s.desc}</span>
          <span class="saida-meta">${s.meta}</span>
        </div>
      </div>
      <span class="saida-valor">−${fmt(s.valor)}</span>
    `;
    list.appendChild(li);
  });
}

function renderProjecao() {
  const d = PROJECAO;
  document.getElementById('proj-principal').innerHTML = `
    <div>
      <div class="proj-main-label">Projeção próximo período</div>
      <div class="proj-main-valor">${fmt(d.total)}</div>
      <div class="proj-main-delta">▲ +${d.delta}% estimado</div>
    </div>
  `;
  const list = document.getElementById('proj-items');
  list.innerHTML = '';
  d.itens.forEach(item => {
    const li = document.createElement('li');
    li.className = 'proj-item';
    li.innerHTML = `
      <span class="proj-item-nome" data-icon="${item.icon}">${item.nome}</span>
      <span class="proj-item-val">${fmt(item.valor)}</span>
    `;
    list.appendChild(li);
  });
}

// ------- Tabs funcionários -------
document.querySelectorAll('.func-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.func-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderFuncionarios(tab.dataset.tab);
  });
});

// ------- Filtro de período -------
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderKPIs(btn.dataset.period);
    renderCategorias(btn.dataset.period);
  });
});

// ------- Init -------
renderKPIs('30d');
renderCategorias('30d');
renderFuncionarios('clt');
renderTimeline();
renderSaidas();
renderProjecao();