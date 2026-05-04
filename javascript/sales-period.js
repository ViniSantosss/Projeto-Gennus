document.addEventListener('DOMContentLoaded', function() {

    // pega as vendas salvas no localStorage
    const salesBank = JSON.parse(localStorage.getItem('sales_data_bank') || '[]');

    // começa no mês e ano atual
    let currentYear  = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDay  = null;

    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    // retorna as vendas de um dia específico comparando a data no formato YYYY-MM-DD
    function getSalesByDay(year, month, day) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return salesBank.filter(s => s.saleDate === dateStr);
    }

    // retorna todas as vendas do mês verificando se a data começa com o prefixo YYYY-MM
    function getSalesByMonth(year, month) {
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        return salesBank.filter(s => s.saleDate && s.saleDate.startsWith(prefix));
    }

    // atualiza os três cards de resumo no topo da página
    function updateMonthlySummary() {
        const monthSales = getSalesByMonth(currentYear, currentMonth);
        const total = monthSales.reduce((acc, s) => acc + parseFloat(s.total || 0), 0);
        const qty   = monthSales.reduce((acc, s) => acc + parseInt(s.quantity || 0), 0);

        document.getElementById('summary-count').textContent = monthSales.length;
        document.getElementById('summary-total').textContent = `R$ ${total.toFixed(2)}`;
        document.getElementById('summary-qty').textContent   = qty;
    }

    // monta o calendário do mês atual no grid
    function renderCalendar() {
        const grid  = document.getElementById('calendar-grid');
        const title = document.getElementById('calendar-title');

        title.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        grid.innerHTML = '';

        // descobre em qual dia da semana o mês começa (0 = domingo)
        const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today       = new Date();

        // adiciona células vazias antes do primeiro dia do mês
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        // cria uma célula pra cada dia do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const daySales   = getSalesByDay(currentYear, currentMonth, day);
            const isToday    = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
            const isSelected = selectedDay === day;

            const cell = document.createElement('div');
            cell.className = 'calendar-day' +
                (daySales.length > 0 ? ' has-sales' : '') +
                (isToday    ? ' today'    : '') +
                (isSelected ? ' selected' : '');

            // soma o total do dia pra mostrar no calendário
            const dayTotal = daySales.reduce((acc, s) => acc + parseFloat(s.total || 0), 0);

            cell.innerHTML = `
                <span class="day-number">${day}</span>
                ${daySales.length > 0 ? `<div class="day-dot"></div>` : ''}
                ${daySales.length > 0 ? `<span class="day-total">R$${dayTotal.toFixed(0)}</span>` : ''}
            `;

            // ao clicar no dia, marca como selecionado e mostra as vendas
            cell.addEventListener('click', () => {
                selectedDay = day;
                renderCalendar();
                showDayDetail(day);
            });

            grid.appendChild(cell);
        }

        updateMonthlySummary();
    }

    // mostra as vendas do dia clicado no painel lateral
    function showDayDetail(day) {
        const sales   = getSalesByDay(currentYear, currentMonth, day);
        const title   = document.getElementById('detail-title');
        const content = document.getElementById('detail-content');

        const dateStr = `${String(day).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
        title.textContent = `Vendas em ${dateStr}`;

        if (sales.length === 0) {
            content.innerHTML = '<p class="day-detail-empty">Nenhuma venda neste dia.</p>';
            return;
        }

        // monta um card pra cada venda do dia
        content.innerHTML = sales.map(sale => `
            <div class="day-sale-item">
                <span class="sale-client">${sale.clientName}</span>
                <span class="sale-product">${sale.productName} × ${sale.quantity} un.</span>
                <div class="sale-footer">
                    <span class="status-badge status-${sale.saleStatus}">${sale.saleStatus}</span>
                    <span class="sale-total">R$ ${parseFloat(sale.total || 0).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    // reseta o painel lateral ao trocar de mês
    function resetDetail() {
        selectedDay = null;
        document.getElementById('detail-title').textContent = 'Selecione um dia';
        document.getElementById('detail-content').innerHTML = '<p class="day-detail-empty">Clique em um dia do calendário para ver as vendas.</p>';
    }

    // botão de mês anterior
    document.getElementById('btn-prev').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        resetDetail();
        renderCalendar();
    });

    // botão de próximo mês
    document.getElementById('btn-next').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        resetDetail();
        renderCalendar();
    });

    renderCalendar();
});