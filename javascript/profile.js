document.addEventListener('DOMContentLoaded', () => {

    // pega o usuário que está logado atualmente
    // o login.js salva esses dados em 'gennus_usuario_logado' quando o usuário entra
    const usuarioLogado = JSON.parse(localStorage.getItem('gennus_usuario_logado'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // elementos de exibição na tela ( nome essas coisas que ficam lá no header e na sidebar mostrando o nome do usuário, email e as iniciais)
    const displayName  = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const initialsDiv  = document.getElementById('profile-initials');
    const sidebarName  = document.getElementById('sidebar-name');
    const infoNome     = document.getElementById('info-nome');
    const infoEmail    = document.getElementById('info-email');

    // aqui serve pra preencher os campos de texto da página com as informações do usuário logado, tipo nome completo, email e iniciais
    function preencherTela(user) {
        const nomeCompleto = `${user.nome || ''} ${user.sobrenome || ''}`.trim();

        if (displayName)  displayName.textContent  = nomeCompleto || 'Usuário';
        if (displayEmail) displayEmail.textContent = user.email   || '';
        if (sidebarName)  sidebarName.textContent  = nomeCompleto || 'Usuário';
        if (infoNome)     infoNome.textContent      = nomeCompleto || '—';
        if (infoEmail)    infoEmail.textContent     = user.email   || '—';

        // aqui serve pra gerar as iniciais de acordo com o nome do caba, tipo vinicius santos vira VS
        if (initialsDiv && nomeCompleto) {
            const iniciais = nomeCompleto
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
            initialsDiv.textContent = iniciais;
        }
    }

    preencherTela(usuarioLogado);

    // função genérica para abrir e fechar os modais modals sei lá
    function abrirModal(modal) { modal.style.display = 'flex'; }
    function fecharModal(modal) { modal.style.display = 'none'; }

    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (e.target === modal) fecharModal(modal);
        });
    });


    // modal de editar informações do perfil (nome, sobrenome, email)
    const modalEdit      = document.getElementById('modal-edit-profile');
    const btnOpenEdit    = document.getElementById('btn-open-edit-modal');
    const btnCloseEdit   = document.getElementById('btn-close-edit-modal');
    const profileForm    = document.getElementById('profile-form');

    btnOpenEdit.addEventListener('click', () => {
        // preenche o formulário com os dados atuais antes de abrir
        document.getElementById('profile-nome').value      = usuarioLogado.nome      || '';
        document.getElementById('profile-sobrenome').value = usuarioLogado.sobrenome || '';
        document.getElementById('profile-email').value     = usuarioLogado.email     || '';
        abrirModal(modalEdit);
    });

    btnCloseEdit.addEventListener('click', () => fecharModal(modalEdit));

    // salva as alterações de nome, sobrenome e email
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoNome      = document.getElementById('profile-nome').value.trim();
            const novoSobrenome = document.getElementById('profile-sobrenome').value.trim();
            const novoEmail     = document.getElementById('profile-email').value.trim();

            // monta o objeto com os dados atualizados mantendo os demais campos intactos
            const novosDados = {
                ...usuarioLogado,
                nome:      novoNome,
                sobrenome: novoSobrenome,
                email:     novoEmail
            };

            // atualiza a sessão ativa
            localStorage.setItem('gennus_usuario_logado', JSON.stringify(novosDados));

            // atualiza no banco de usuários
            const todosUsuarios = JSON.parse(localStorage.getItem('gennus_usuarios')) || {};
            if (usuarioLogado.email !== novoEmail) {
                delete todosUsuarios[usuarioLogado.email];
            }
            todosUsuarios[novoEmail] = novosDados;
            localStorage.setItem('gennus_usuarios', JSON.stringify(todosUsuarios));

            fecharModal(modalEdit);
            alert('Perfil atualizado com sucesso!');
            location.reload();
        });
    }

   
    // modal de adicionar conta
    const modalAdd     = document.getElementById('modal-add-account');
    const btnOpenAdd   = document.getElementById('btn-open-add-modal');
    const btnCloseAdd  = document.getElementById('btn-close-add-modal');
    const addForm      = document.getElementById('add-account-form');

    btnOpenAdd.addEventListener('click',  () => abrirModal(modalAdd));
    btnCloseAdd.addEventListener('click', () => fecharModal(modalAdd));

    // cadastra o usuario tipo o register mas sem sair da página de perfil, e sem logar com a nova conta criada (ela só é salva no banco, mas a sessão continua com o usuário atual)
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome      = document.getElementById('new-account-nome').value.trim();
            const sobrenome = document.getElementById('new-account-sobrenome').value.trim();
            const email     = document.getElementById('new-account-email').value.trim();
            const senha     = document.getElementById('new-account-password').value;

            const todosUsuarios = JSON.parse(localStorage.getItem('gennus_usuarios')) || {};

            // verifica se o email já está cadastrado
            if (todosUsuarios[email]) {
                alert('Já existe uma conta com esse e-mail.');
                return;
            }

            // salva o novo usuário no mesmo formato que o register.js usa
            todosUsuarios[email] = { nome, sobrenome, email, senha };
            localStorage.setItem('gennus_usuarios', JSON.stringify(todosUsuarios));

            alert(`Conta de ${nome} ${sobrenome} criada com sucesso!`);
            addForm.reset();
            fecharModal(modalAdd);
        });
    }

   
    // modal de excluir conta
    const modalDelete    = document.getElementById('modal-delete-account');
    const btnOpenDelete  = document.getElementById('btn-open-delete-modal');
    const btnCloseDelete = document.getElementById('btn-close-delete-modal');
    const deleteForm     = document.getElementById('delete-account-form');

    // aqui abre um painel pra confirma
    btnOpenDelete.addEventListener('click', () => {
        abrirModal(modalDelete);
    });

    btnCloseDelete.addEventListener('click', () => fecharModal(modalDelete));

    // valida a senha e o texto de confirmação antes de excluir
    if (deleteForm) {
        deleteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const senhaDigitada   = document.getElementById('delete-password').value;
            const textoConfirmado = document.getElementById('delete-confirm-text').value;

            // pra confirma a exclusão conta o cara precisa escre EXCLUIR pra conseguir exclui
            if (textoConfirmado !== 'EXCLUIR') {
                alert('Digite EXCLUIR no campo de confirmação para prosseguir.');
                return;
            }

            const todosUsuarios = JSON.parse(localStorage.getItem('gennus_usuarios')) || {};
            const contaAtual    = todosUsuarios[usuarioLogado.email];

            // aqui faz uma verificação se a senha bate com o que está salvo no banco
            if (!contaAtual || contaAtual.senha !== senhaDigitada) {
                alert('Senha incorreta. A conta não foi excluída.');
                return;
            }

            // remove a conta do banco e encerra a sessão
            delete todosUsuarios[usuarioLogado.email];
            localStorage.setItem('gennus_usuarios', JSON.stringify(todosUsuarios));
            localStorage.removeItem('gennus_usuario_logado');

            alert('Conta excluída com sucesso.');
            window.location.href = 'login.html';
        });
    }
});