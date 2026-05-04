document.addEventListener('DOMContentLoaded', function() {
    
    // --- uplod de imgare ---
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    // --- resetar o preview da imagem quando clicar no reset do formulário ---
    const resetBtn = document.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (imagePreview) {
                imagePreview.src = '';
                imagePreview.style.display = 'none';
            }
            if (uploadPlaceholder) {
                uploadPlaceholder.style.display = 'flex';
            }
        });
    }

    // --- detecta se é edição ou criação ---
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    const isEditing = !!editId;

    if (isEditing) {
        // muda os textos da página para modo edição
        const pageTitle = document.querySelector('.products-header h1');
        const pageSubtitle = document.querySelector('.products-header p');
        const submitBtn = document.getElementById('product-button-save');

        if (pageTitle) pageTitle.textContent = 'Editar Produto';
        if (pageSubtitle) pageSubtitle.textContent = 'Atualize as informações do produto.';
        if (submitBtn) submitBtn.textContent = 'Salvar Alterações';

        // busca o produto no localStorage e preenche o formulário
        const productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');
        const product = productBank.find(p => String(p.id) === String(editId));

        if (product) {
            document.getElementById('product-name').value        = product.nome || '';
            document.getElementById('product-description').value = product.descricao || '';
            document.getElementById('product-price').value       = product.preco || '';
            document.getElementById('product-stock').value       = product.estoque || '';
            document.getElementById('product-status').value      = product.status || 'active';
            document.getElementById('product-category').value    = product.categoria || '';

            // carrega a imagem se tiver
            if (product.imagem && imagePreview && uploadPlaceholder) {
                imagePreview.src = product.imagem;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            }
        } else {
            alert('Produto não encontrado.');
            window.location.href = 'product-list.html';
        }
    }

    // --- o formulations ---
    const formProduto = document.getElementById('form-produto');

    if (formProduto) {
        formProduto.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome      = document.getElementById('product-name').value;
            const descricao = document.getElementById('product-description').value;
            const preco     = document.getElementById('product-price').value;
            const estoque   = document.getElementById('product-stock').value;
            const status    = document.getElementById('product-status').value;
            const categoria = document.getElementById('product-category').value;
            const imagem    = imagePreview?.src && imagePreview.style.display !== 'none'
                                ? imagePreview.src
                                : null;

            let productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');

            if (isEditing) {
                // atualiza o produto existente
                productBank = productBank.map(p => {
                    if (String(p.id) === String(editId)) {
                        return { ...p, nome, descricao, preco, estoque, status, categoria, imagem };
                    }
                    return p;
                });

                localStorage.setItem('product_data_bank', JSON.stringify(productBank));
                alert('Produto atualizado com sucesso!');
            } else {
                // cria um novo produto
                const productData = {
                    id: Date.now(),
                    nome, descricao, preco, estoque, status, categoria, imagem
                };

                productBank.push(productData);
                localStorage.setItem('product_data_bank', JSON.stringify(productBank));
                alert('Produto cadastrado com sucesso!');
            }

            window.location.href = 'product-list.html';
        });
    }

    // --- os cards ---
    function renderProducts() {
        const grid = document.getElementById('product-card-grid');
        const filterBar = document.querySelector('.product-list-filters');
        if (!grid) return;

        const productBank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');
        
        if (filterBar) {
            filterBar.style.display = productBank.length === 0 ? 'none' : 'block';
        }

        const searchTerm     = document.getElementById('product-search-filter')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('product-categories-filter')?.value || 'all';

        const filteredProducts = productBank.filter(p => {
            const matchesSearch   = p.nome.toLowerCase().includes(searchTerm) || 
                                    p.descricao.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || p.categoria === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        grid.innerHTML = '';

        if (productBank.length === 0) {
            grid.innerHTML = `
                <div class="product-card-grid-alert">
                    <p>Você ainda não tem produtos cadastrados.</p>
                    <article class="product-card add-product-card" style="margin: 24px auto 0; max-width: 220px;">
                        <a href="product-create.html" class="product-add-link">
                            <span class="product-add-icon">+</span>
                            <p class="product-add-title">Adicionar Produto</p>
                        </a>
                    </article>
                </div>
            `;
            return;
        }

        let cardsHTML = '';

        if (searchTerm === '' && categoryFilter === 'all') {
            cardsHTML += `
                <article class="product-card add-product-card">
                    <a href="product-create.html" class="product-add-link">
                        <span class="product-add-icon">+</span>
                        <p class="product-add-title">Adicionar Produto</p>
                    </a>
                </article>
            `;
        }

        if (filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="product-card-grid-alert" style="grid-column: 1 / -1; width: 100%;">
                    <p>Nenhum produto corresponde aos filtros aplicados.</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const categoriaLabel = {
                'product-category-tools':     'Ferramentas',
                'product-category-fashion':   'Roupas',
                'product-category-eletronics':'Eletrônicos',
                'product-category-domestic':  'Coisas de casa',
                'product-category-self-care': 'Cuidado pessoal'
            }[product.categoria] || 'Sem categoria';

            cardsHTML += `
                <article class="product-card"
                    data-product-card-id="${product.id}"
                    data-product-card-name="${product.nome}"
                    data-product-card-status="${product.status}"
                    data-product-card-quantity="${product.estoque}"
                    data-product-card-price="${product.preco}">

                    <img src="${product.imagem || '../assets/placeholder-image.jpg'}" alt="imagem do produto" class="product-card-image">

                    <div class="product-card-info">
                        <h3 class="product-card-name">${product.nome}</h3>
                        <p class="product-card-category">Categoria: ${categoriaLabel}</p>
                        <p class="product-card-status">Status: ${product.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                        <p class="product-card-stock">Estoque: ${product.estoque}</p>
                        <h3 class="product-card-price">R$ ${parseFloat(product.preco).toFixed(2)}</h3> 
                    </div>

                    <div class="product-card-functions">
                        <button class="product-card-edit btn-edit-product" data-id="${product.id}">Editar</button>
                        <button class="product-card-delete btn-delete-product" data-id="${product.id}">Excluir</button>
                    </div>
                </article>
            `;
        });

        grid.innerHTML += cardsHTML;
    }

    // --- filtros ---
    const searchInput    = document.getElementById('product-search-filter');
    const categorySelect = document.getElementById('product-categories-filter');

    if (searchInput)    searchInput.addEventListener('input', renderProducts);
    if (categorySelect) categorySelect.addEventListener('change', renderProducts);

    renderProducts();

    // --- grid ---
    const grid = document.getElementById('product-card-grid');
    if (grid) {
        grid.addEventListener('click', function(e) {

            // botão excluir
            if (e.target.classList.contains('btn-delete-product')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('Deseja excluir este produto?')) {
                    let bank = JSON.parse(localStorage.getItem('product_data_bank') || '[]');
                    bank = bank.filter(p => String(p.id) !== String(id));
                    localStorage.setItem('product_data_bank', JSON.stringify(bank));
                    renderProducts();
                }
            }

            // botão editar — redireciona para o create passando o id
            if (e.target.classList.contains('btn-edit-product')) {
                const id = e.target.getAttribute('data-id');
                window.location.href = `product-create.html?id=${id}`;
            }
        });
    }
});