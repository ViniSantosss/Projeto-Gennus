document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const user = usuarios.find(u => u.email === email && u.senha === senha);

        if (user) {
            localStorage.setItem("gennus_usuario_logado", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    });
});