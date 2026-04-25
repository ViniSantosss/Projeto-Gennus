document.addEventListener("DOMContentLoaded", function () {

  /* ======================================
     1. TOGGLE DE SENHA
  ====================================== */
  document.querySelectorAll(".btn-eye").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.dataset.target;
      var input = document.getElementById(targetId);
      if (!input) return;

      var isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      var eyeOff = btn.querySelector(".eye-off");
      var eyeOn = btn.querySelector(".eye-on");

      if (eyeOff && eyeOn) {
        eyeOff.style.display = isHidden ? "none" : "block";
        eyeOn.style.display = isHidden ? "block" : "none";
      }

      btn.setAttribute(
        "aria-label",
        isHidden ? "Ocultar senha" : "Mostrar senha"
      );
    });
  });

  /* ======================================
     2. MODAL TERMOS
  ====================================== */
  var modal      = document.getElementById("terms-modal");
  var openBtn    = document.getElementById("open-terms-btn");
  var closeBtn   = document.getElementById("modal-close-btn");
  var aceitarBtn = document.getElementById("btn-aceitar");
  var recusarBtn = document.getElementById("btn-recusar");
  var modalBody  = document.getElementById("modal-body");
  var progressBar = document.getElementById("read-progress");
  var readHint   = document.getElementById("read-hint");
  var checkbox   = document.getElementById("use-terms");

  /* CORREÇÃO: em vez de um return que mata tudo,
     cada bloco só roda se o elemento existir. */

  /* ABRIR MODAL */
  if (openBtn && modal) {
    openBtn.addEventListener("click", function () {
      modal.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    });
  }

  /* FECHAR MODAL */
  function fecharModal() {
    if (!modal) return;
    modal.classList.remove("modal-open");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", fecharModal);
  if (recusarBtn) recusarBtn.addEventListener("click", fecharModal);

  /* Clicar fora do modal-box fecha o modal */
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) fecharModal();
    });
  }

  /* ESC fecha o modal */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharModal();
  });

  /* PROGRESSO DO SCROLL — habilita o botão "Aceitar" ao chegar no fim */
  if (modalBody) {
    modalBody.addEventListener("scroll", function () {
      var porcentagem =
        (modalBody.scrollTop /
          (modalBody.scrollHeight - modalBody.clientHeight)) *
        100;
      porcentagem = Math.min(100, Math.max(0, porcentagem));

      if (progressBar) progressBar.style.width = porcentagem + "%";

      if (porcentagem >= 95 && aceitarBtn && aceitarBtn.disabled) {
        aceitarBtn.disabled = false;
        if (readHint) readHint.textContent = "✓ Termos lidos";
      }
    });
  }

  /* ACEITAR — marca o checkbox e fecha */
  if (aceitarBtn) {
    aceitarBtn.addEventListener("click", function () {
      if (checkbox) checkbox.checked = true;
      fecharModal();
    });
  }
});