document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Captura os valores
        const nome = document.getElementById("reg-nome").value;
        const email = document.getElementById("reg-email").value;
        const senha = document.getElementById("reg-password").value;

        // 2. Cria o objeto do usuário
        const novoUsuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        // 3. Recupera lista de usuários ou cria uma nova
        let usuarios = JSON.parse(localStorage.getItem("gennus_db_usuarios")) || [];

        // 4. Verifica se o e-mail já existe
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            alert("Este e-mail já está cadastrado!");
            return;
        }

        // 5. Salva no banco local
        usuarios.push(novoUsuario);
        localStorage.setItem("gennus_db_usuarios", JSON.stringify(usuarios));

        alert("Conta criada com sucesso! Redirecionando para o login...");
        window.location.href = "login.html";
    });
});