// nessa parte faremos o js validar o cadastro
document.addEventListener("DOMContentLoaded", function(){
    var loginForm = document.querySelector(".login-form");
    var emailLoginInput = document.getElementById("email");
    var passwordLoginInput = document.getElementById("password");
    var errorLoginMsg = document.getElementById("form-login-error");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e){
            e.preventDefault();
            if(errorLoginMsg) errorLoginMsg.textContent="";

            var emailDigitado = emailLoginInput.ariaValueMax.trim();
            var senhaDigitada = passwordLoginInput.value;

            //puxa os dados salvoas
            var usuariosSalvos = JSON.parse(localStorage.getItem("gennus")) || {};
            var usuarioEncontrado = usuariosSalvos[emailDigitado];

            //verifica se achou um usuario e se senha esta certa
            if (usuarioEncontrado && usuarioEncontrado.senha === senhaDigitada) {
                // guarda quem logou no momento
                localStorage.setItem("gennus_usuario_logado", JSON.stringify(usuarioEncontrado));

                //redirecionando para o sistema
                window.location.href = "dashboard.html";
            }else {
                if(errorLoginMsg){
                    errorLoginMsg.textContent = "email ou senha incorretos";
                }else {
                    alert("email ou senha incorretos");                    
                }
            }
        });    
    }
}); 