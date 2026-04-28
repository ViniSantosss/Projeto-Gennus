document.addEventListener("DOMContentLoaded", function () {

  /* ====================================================================
     1. SISTEMA DE MOSTRAR/OCULTAR SENHA (ÍCONE DE OLHO)
     ==================================================================== 
     Este bloco procura todos os botões com a classe ".btn-eye". 
     Quando o usuário clica, ele muda o tipo do input de "password" (bolinhas) 
     para "text" (visível) e troca os ícones de olho aberto/fechado.
  */
  document.querySelectorAll(".btn-eye").forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Pega o ID do input de senha que está ligado a este botão
      var targetId = btn.dataset.target;
      var input = document.getElementById(targetId);
      if (!input) return;

      // Verifica se a senha está escondida atualmente
      var isHidden = input.type === "password";
      
      // Se estava escondida, vira texto. Se era texto, vira bolinha.
      input.type = isHidden ? "text" : "password";

      // Seleciona os dois SVGs (olho aberto e olho com risco)
      var eyeOff = btn.querySelector(".eye-off");
      var eyeOn = btn.querySelector(".eye-on");

      // Alterna qual ícone aparece
      if (eyeOff && eyeOn) {
        eyeOff.style.display = isHidden ? "none" : "block";
        eyeOn.style.display = isHidden ? "block" : "none";
      }

      // Atualiza o texto para leitores de tela (Acessibilidade)
      btn.setAttribute(
        "aria-label",
        isHidden ? "Ocultar senha" : "Mostrar senha"
      );
    });
  });

  /* ====================================================================
     2. LÓGICA DO MODAL DE TERMOS DE USO
     ==================================================================== 
     Controla a abertura, fechamento e a barra de progresso de leitura
     do modal de Termos de Uso. O botão de aceitar só é liberado quando
     o usuário rola o texto até o final (ou se a tela for muito grande).
  */
  var modal       = document.getElementById("terms-modal");
  var openBtn     = document.getElementById("open-terms-btn");
  var closeBtn    = document.getElementById("modal-close-btn");
  var aceitarBtn  = document.getElementById("btn-aceitar");
  var recusarBtn  = document.getElementById("btn-recusar");
  var modalBody   = document.getElementById("modal-body");
  var progressBar = document.getElementById("read-progress");
  var readHint    = document.getElementById("read-hint");
  var checkbox    = document.getElementById("use-terms");

  /* ABRIR MODAL */
  if (openBtn && modal) {
    openBtn.addEventListener("click", function () {
      modal.classList.add("modal-open");
      document.body.style.overflow = "hidden"; // Trava o scroll da página de fundo
      
      // Verifica se o texto é curto o suficiente para não ter barra de rolagem.
      // Se for, já libera o botão "Aceitar" de imediato.
      if (modalBody && aceitarBtn) {
        if (modalBody.scrollHeight <= modalBody.clientHeight) {
           aceitarBtn.disabled = false;
           if (readHint) readHint.textContent = "✓ Termos lidos";
        }
      }
    });
  }

  /* FUNÇÃO PADRÃO PARA FECHAR MODAL */
  function fecharModal() {
    if (!modal) return;
    modal.classList.remove("modal-open");
    document.body.style.overflow = ""; // Libera o scroll da página de fundo
  }

  // Fecha o modal ao clicar no X ou no botão Recusar
  if (closeBtn) closeBtn.addEventListener("click", fecharModal);
  if (recusarBtn) recusarBtn.addEventListener("click", fecharModal);

  // Fecha o modal se o usuário clicar na área escura (fora da caixinha branca)
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) fecharModal();
    });
  }

  // Fecha o modal se o usuário apertar a tecla ESC do teclado
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharModal();
  });

  /* BARRA DE PROGRESSO E LIBERAÇÃO DO BOTÃO "ACEITAR" */
  if (modalBody) {
    modalBody.addEventListener("scroll", function () {
      // Calcula a porcentagem de scroll baseada na altura total do texto
      var porcentagem =
        (modalBody.scrollTop /
          (modalBody.scrollHeight - modalBody.clientHeight)) *
        100;
      
      // Garante que o valor fique entre 0 e 100
      porcentagem = Math.min(100, Math.max(0, porcentagem));

      // Aumenta a barrinha verde no rodapé
      if (progressBar) progressBar.style.width = porcentagem + "%";

      // Se o usuário rolou 95% do texto, libera o botão para aceitar
      if (porcentagem >= 95 && aceitarBtn && aceitarBtn.disabled) {
        aceitarBtn.disabled = false;
        if (readHint) readHint.textContent = "✓ Termos lidos";
      }
    });
  }

  /* BOTÃO ACEITAR TERMOS */
  if (aceitarBtn) {
    aceitarBtn.addEventListener("click", function () {
      if (checkbox) checkbox.checked = true; // Marca automaticamente a caixinha do formulário
      fecharModal();
    });
  }

  /* ====================================================================
     3. ALTERNAR PLACEHOLDER E LABEL (CPF vs CNPJ)
     ==================================================================== 
     Quando o usuário escolhe Pessoa Física ou Jurídica, o sistema muda
     o título do campo e a máscara visual (placeholder) para ajudar na digitação.
  */
  var personTypeSelect = document.getElementById("person-type");
  var documentInput    = document.getElementById("document-number");
  var labelDocument    = document.getElementById("label-document");
  
  if (personTypeSelect && documentInput && labelDocument) {
    personTypeSelect.addEventListener("change", function () {
      if (this.value === "natural-person") {
        labelDocument.textContent = "Número do Documento (CPF)";
        documentInput.placeholder = "000.000.000-00";
      } else {
        labelDocument.textContent = "Número do Documento (CNPJ)";
        documentInput.placeholder = "00.000.000/0001-00";
      }
    });
  }

  /* ====================================================================
     4. CADASTRO E VALIDAÇÃO COM LOCALSTORAGE
     ==================================================================== 
     Este é o coração do arquivo. Ele bloqueia o envio falso, verifica
     se as senhas batem e salva os dados no navegador simulando um Banco de Dados.
  */
  var registerForm         = document.querySelector(".login-form");
  var passwordInput        = document.getElementById("password");
  var confirmPasswordInput = document.getElementById("confirm-password");
  var emailInput           = document.getElementById("email");
  var firstNameInput       = document.getElementById("first-name");
  var lastNameInput        = document.getElementById("last-name"); 
  var errorMsg             = document.getElementById("form-register-error");

  if (registerForm) {
    // Escuta o evento de SUBMIT (quando o usuário clica em "Criar conta")
    registerForm.addEventListener("submit", function (e) {
      
      // IMPEDE O NAVEGADOR DE ENVIAR O FORMULÁRIO (Evita o Erro 405)
      e.preventDefault(); 
      
      // Limpa qualquer mensagem de erro que estivesse na tela antes
      if(errorMsg) errorMsg.textContent = ""; 
      
      // 1ª Validação: Verifica se as duas senhas digitadas são idênticas
      if (passwordInput.value !== confirmPasswordInput.value) {
        if(errorMsg) errorMsg.textContent = "As senhas não coincidem. Tente novamente.";
        confirmPasswordInput.focus(); // Coloca o cursor de volta na segunda senha
        return; // Interrompe o código aqui, não tenta salvar
      }

      // Puxa do navegador os usuários que já foram criados antes (ou um objeto vazio se for o primeiro)
      var usuariosSalvos = JSON.parse(localStorage.getItem("gennus_usuarios")) || {};
      
      // Pega o email digitado sem espaços vazios nas pontas
      var emailDigitado = emailInput.value.trim();

      // 2ª Validação: Verifica se esse e-mail já existe na base do navegador
      if (usuariosSalvos[emailDigitado]) {
        if(errorMsg) errorMsg.textContent = "Este e-mail já está cadastrado. Tente fazer login.";
        return;
      }

      // 3º Passo: Se passou nas validações, cria o pacote de dados do novo usuário
      usuariosSalvos[emailDigitado] = {
        nome: firstNameInput.value.trim(),
        sobrenome: lastNameInput.value.trim(), 
        documento: documentInput ? documentInput.value.trim() : "",
        senha: passwordInput.value 
      };

      // 4º Passo: Converte o pacote em String e salva no Banco de Dados local do navegador
      localStorage.setItem("gennus_usuarios", JSON.stringify(usuariosSalvos));

      // Feedback final e redirecionamento de tela
      alert("Conta criada com sucesso! Redirecionando para o login...");
      window.location.href = "login.html"; // Manda o usuário para a página de entrada
    });
  }

}); // FIM DO ARQUIVO (Fechamento do DOMContentLoaded)