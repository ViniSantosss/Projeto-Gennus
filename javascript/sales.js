document.addEventListener('DOMContentLoaded', function() {

    const params    = new URLSearchParams(window.location.search);
    const editId    = params.get('id');
    const isEditing = !!editId;

    const productSelect  = document.getElementById('sale-product-select');
    const quantityInput  = document.getElementById('sale-quantity');
    const totalInput     = document.getElementById('sale-total');
    const previewWrapper = document.getElementById('product-preview-wrapper');
    const previewImg     = document.getElementById('preview-img');
    const previewName    = document.getElementById('preview-name');
    const previewPrice   = document.getElementById('preview-price');
    const previewStock   = document.getElementById('preview-stock');

    let selectedProduct = null;

    if (productSelect) {
        const productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');

        if (isEditing) {
            productBank.forEach(product => {
                const opt = document.createElement('option');
                opt.value = product.id;
                opt.textContent = `${product.nome} — R$ ${parseFloat(product.preco).toFixed(2)} (${product.estoque} un.)`;
                productSelect.appendChild(opt);
            });
        } else {
            const ativos = productBank.filter(p => p.status === 'active' && parseInt(p.estoque) > 0);

            if (ativos.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'Nenhum produto disponível';
                opt.disabled = true;
                productSelect.appendChild(opt);

                const formCard = document.querySelector('.sales-form-card');
                if (formCard) formCard.style.display = 'none';

                const header = document.querySelector('.sales-header p');
                if (header) {
                    header.innerHTML = `Você não tem produtos ativos com estoque disponível. <a href="product-create.html" style="color: var(--roxo);">Cadastrar produto →</a>`;
                }
            } else {
                ativos.forEach(product => {
                    const opt = document.createElement('option');
                    opt.value = product.id;
                    opt.textContent = `${product.nome} — R$ ${parseFloat(product.preco).toFixed(2)} (${product.estoque} un.)`;
                    productSelect.appendChild(opt);
                });
            }
        }

        productSelect.addEventListener('change', function() {
            const productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');
            selectedProduct = productBank.find(p => String(p.id) === String(this.value));

            if (selectedProduct && previewWrapper) {
                previewImg.src           = selectedProduct.imagem || '../assets/placeholder-image.jpg';
                previewName.textContent  = selectedProduct.nome;
                previewPrice.textContent = `R$ ${parseFloat(selectedProduct.preco).toFixed(2)} por unidade`;
                previewStock.textContent = `${selectedProduct.estoque} unidades disponíveis`;
                previewWrapper.style.display = 'block';
                calcularTotal();
            }
        });
    }

    // calcula o total de acordo com a quantidade e o produto selecionado
    function calcularTotal() {
        if (!selectedProduct || !quantityInput || !totalInput) return;
        const qty   = parseInt(quantityInput.value) || 0;
        const preco = parseFloat(selectedProduct.preco) || 0;
        const total = qty * preco;
        totalInput.value = `R$ ${total.toFixed(2)}`;
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', calcularTotal);
    }

    const resetBtn = document.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            selectedProduct = null;
            if (previewWrapper) previewWrapper.style.display = 'none';
            if (totalInput) totalInput.value = '';
        });
    }

    // preenche o formulário quando for editar uma venda
    if (isEditing && productSelect) {
        const pageTitle    = document.querySelector('.sales-header h1');
        const pageSubtitle = document.querySelector('.sales-header p');
        const submitBtn    = document.querySelector('#sales-actions-form button[type="submit"]');

        if (pageTitle)    pageTitle.textContent    = 'Editar Venda';
        if (pageSubtitle) pageSubtitle.textContent = 'Atualize as informações da venda.';
        if (submitBtn)    submitBtn.textContent    = 'Salvar Alterações';

        const salesBank = JSON.parse(localStorage.getItem('sales_data_bank') || '[]');
        const sale = salesBank.find(s => String(s.saleId) === String(editId));

        if (sale) {
            document.getElementById('sale-client-name').value  = sale.clientName  || '';
            document.getElementById('sale-client-email').value = sale.clientEmail || '';
            document.getElementById('sale-date').value         = sale.saleDate    || '';
            document.getElementById('sale-status').value       = sale.saleStatus  || 'concluida';
            document.getElementById('sale-mother-name').value  = sale.motherName  || '';
            document.getElementById('sale-father-name').value  = sale.fatherName  || '';

            if (sale.productId) {
                productSelect.value = sale.productId;
                productSelect.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    if (quantityInput) quantityInput.value = sale.quantity || '';
                    calcularTotal();
                }, 0);
            }
        } else {
            alert('Venda não encontrada.');
            window.location.href = 'sales-list.html';
        }
    }

    // formulário de criação ou edição de venda
    const salesForm = document.getElementById('sales-actions-form');

    if (salesForm) {
        salesForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const clientName  = document.getElementById('sale-client-name').value;
            const clientEmail = document.getElementById('sale-client-email').value;
            const qty         = parseInt(quantityInput?.value) || 0;
            const saleDate    = document.getElementById('sale-date').value;
            const saleStatus  = document.getElementById('sale-status').value;
            const motherName  = document.getElementById('sale-mother-name').value;
            const fatherName  = document.getElementById('sale-father-name').value;

            if (!selectedProduct) {
                alert('Selecione um produto para continuar.');
                return;
            }
            if (qty <= 0) {
                alert('Informe uma quantidade válida.');
                return;
            }

            let salesBank   = JSON.parse(localStorage.getItem('sales_data_bank') || '[]');
            let productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');

            if (isEditing) {
                const oldSale      = salesBank.find(s => String(s.saleId) === String(editId));
                const oldQty       = parseInt(oldSale?.quantity) || 0;
                const oldProductId = oldSale?.productId;

                // devolve o estoque do produto anterior
                productBank = productBank.map(p => {
                    if (String(p.id) === String(oldProductId)) {
                        return { ...p, estoque: String(parseInt(p.estoque) + oldQty) };
                    }
                    return p;
                });

                const prodAtualizado = productBank.find(p => String(p.id) === String(selectedProduct.id));
                if (qty > parseInt(prodAtualizado?.estoque || 0)) {
                    alert(`Estoque insuficiente! Disponível: ${prodAtualizado?.estoque} unidades.`);
                    return;
                }

                const total = qty * parseFloat(selectedProduct.preco);

                salesBank = salesBank.map(s => {
                    if (String(s.saleId) === String(editId)) {
                        return { ...s, clientName, clientEmail, productName: selectedProduct.nome, productId: selectedProduct.id, quantity: qty, priceUnit: selectedProduct.preco, total: total.toFixed(2), saleDate, saleStatus, motherName, fatherName };
                    }
                    return s;
                });

                productBank = productBank.map(p => {
                    if (String(p.id) === String(selectedProduct.id)) {
                        return { ...p, estoque: String(parseInt(p.estoque) - qty) };
                    }
                    return p;
                });

                localStorage.setItem('sales_data_bank', JSON.stringify(salesBank));
                localStorage.setItem('product_data_bank', JSON.stringify(productBank));
                alert('Venda atualizada com sucesso!');

            } else {
                if (qty > parseInt(selectedProduct.estoque)) {
                    alert(`Estoque insuficiente! Disponível: ${selectedProduct.estoque} unidades.`);
                    return;
                }

                const total  = qty * parseFloat(selectedProduct.preco);
                const saleId = Date.now();

                salesBank.push({ saleId, clientName, clientEmail, productName: selectedProduct.nome, productId: selectedProduct.id, quantity: qty, priceUnit: selectedProduct.preco, total: total.toFixed(2), saleDate, saleStatus, motherName, fatherName });

                productBank = productBank.map(p => {
                    if (String(p.id) === String(selectedProduct.id)) {
                        return { ...p, estoque: String(parseInt(p.estoque) - qty) };
                    }
                    return p;
                });

                localStorage.setItem('sales_data_bank', JSON.stringify(salesBank));
                localStorage.setItem('product_data_bank', JSON.stringify(productBank));
                alert('Venda cadastrada com sucesso!');
            }

            window.location.href = 'sales-list.html';
        });
    }

    // tabela de vendas
    let currentFilter = 'all';

    function createSalesTable(filteredData) {
        const todos = JSON.parse(localStorage.getItem('sales_data_bank')) || [];
        const salesDataBank = filteredData !== undefined
            ? filteredData
            : (currentFilter !== 'all' ? todos.filter(s => s.saleStatus === currentFilter) : todos);

        const salesTableData = document.getElementById('sales-table-data');
        if (!salesTableData) return;

        if (salesDataBank.length === 0) {
            salesTableData.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--texto-muted);">Nenhuma venda encontrada.</td></tr>';
            return;
        }

        salesTableData.innerHTML = '';

        // verifica quais produtos ainda existem no banco
        const productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');

        salesDataBank.forEach(sale => {
            const formattedDate  = sale.saleDate ? sale.saleDate.split('-').reverse().join('/') : '---';
            const total          = sale.total ? `R$ ${parseFloat(sale.total).toFixed(2)}` : '---';
            const produtoExiste  = productBank.find(p => String(p.id) === String(sale.productId));
            const nomeProduto    = produtoExiste
                ? sale.productName
                : `${sale.productName} <span style="color: var(--vermelho); font-size: 0.75rem;">(removido)</span>`;

            salesTableData.innerHTML += `
                <tr>
                    <td style="font-family: monospace; color: var(--roxo);">#${String(sale.saleId).slice(-6)}</td>
                    <td>
                        <div style="display: flex; flex-direction: column;">
                            <span style="color: var(--texto); font-weight: 500;">${sale.clientName}</span>
                            <span style="font-size: 0.75rem; color: var(--texto-muted);">${sale.clientEmail}</span>
                        </div>
                    </td>
                    <td>${nomeProduto}</td>
                    <td>${sale.quantity}</td>
                    <td>${total}</td>
                    <td><span class="status-badge status-${sale.saleStatus}">${sale.saleStatus}</span></td>
                    <td>${formattedDate}</td>
                    <td style="text-align: center; display: flex; gap: 6px; justify-content: center;">
                        <button class="btn-secondary btn-edit-row" data-id="${sale.saleId}" style="padding: 6px 12px; font-size: 0.75rem;">Editar</button>
                        <button class="btn-secondary btn-delete-row" data-id="${sale.saleId}" style="padding: 6px 12px; font-size: 0.75rem; color: var(--vermelho); border-color: rgba(248, 113, 113, 0.1);">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    // botões de editar e excluir da tabela
    const salesTableData = document.getElementById('sales-table-data');
    if (salesTableData) {
        salesTableData.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-delete-row')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('Deseja realmente excluir esta venda?')) {
                    deleteSale(id);
                }
            }
            if (e.target.classList.contains('btn-edit-row')) {
                const id = e.target.getAttribute('data-id');
                window.location.href = `sales-create.html?id=${id}`;
            }
        });
    }

    function deleteSale(id) {
        let salesBank = JSON.parse(localStorage.getItem('sales_data_bank') || '[]');
        const sale = salesBank.find(s => String(s.saleId) === String(id));

        // devolve o estoque ao produto quando a venda é excluída
        if (sale?.productId) {
            let productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');
            productBank = productBank.map(p => {
                if (String(p.id) === String(sale.productId)) {
                    return { ...p, estoque: String(parseInt(p.estoque) + parseInt(sale.quantity)) };
                }
                return p;
            });
            localStorage.setItem('product_data_bank', JSON.stringify(productBank));
        }

        salesBank = salesBank.filter(s => String(s.saleId) !== String(id));
        localStorage.setItem('sales_data_bank', JSON.stringify(salesBank));
        createSalesTable();
    }

    // filtro por status
    const filterSelect = document.getElementById('filter-sale-status');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            currentFilter = this.value;
            const todos = JSON.parse(localStorage.getItem('sales_data_bank')) || [];
            const dadosFiltrados = currentFilter === 'all' ? todos : todos.filter(s => s.saleStatus === currentFilter);
            createSalesTable(dadosFiltrados);
        });
    }

    // filtro por busca
    const searchInput = document.getElementById('sales-search-filter');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const termo = this.value.toLowerCase();
            const todos = JSON.parse(localStorage.getItem('sales_data_bank')) || [];
            const resultado = todos.filter(s =>
                s.clientName.toLowerCase().includes(termo) ||
                s.productName.toLowerCase().includes(termo)
            );
            createSalesTable(resultado);
        });
    }

    createSalesTable();
});