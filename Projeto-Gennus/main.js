document.addEventListener("DOMContentLoaded", () => {
  //animação no scroll//

  const elements = document.querySelectorAll(".fade-in"); //seleciona TODOS os elementos do html (document) que tenham o seletor css .fade-in. Const cria uma variável constante.

  /*vai criar um observador (um-para-muitos). Quando um objeto principal (subject)
    altera seu estado, todos os dependentes (observers) são notificados e 
    atualizados automaticamente*/

  //IntersectionObserver: cria um observador que fica monitorando quando elementos entram na tela
  const observer = new IntersectionObserver(
    (entries) => {
      //entries: lista de elementos sendo observados, cada item desta lista é um entry
      //forEach: percorrer sobre cada elemento dessa lista (no caso a lista de elementos observados entries)
      // => são ideais para funções curtas e tabem muito boas para abreviar a function. No caso, aqui seria function(entries) {}
      entries.forEach((entry) => {
        //entry.isIntersecting = se está visivel
        if (entry.isIntersecting) {
          //entry.target = o elemento html
          //entry.target.classList.add('show') = adiciona uma classe ao html, exemplo:
          /* <div class="box"></div>
                box.classList.add('active');
                <div class="box active"></div> */
          entry.target.classList.add("show");

          //para de observar depois que animou (melhor performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshould: 0.2, //20% do elemento vai precisar aparecer pra ativar
    },
  );

  //el = cada elemento individual da lista
  //observer.observe(el) = começa a observar esse elemento aqui
  //observer é o IntersectionObserver la de cima
  //"Para cada elemento com .fade-in, manda o observer começar a observar ele"
  elements.forEach((el) => observer.observe(el));

  // ===============================
  // SCROLL SUAVE NOS LINKS
  // ===============================

  // Seleciona TODOS os links que começam com #
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Evita o comportamento padrão (pulo seco)
      e.preventDefault();

      // Pega o destino do link (#about, #reviews etc)
      const targetId = this.getAttribute("href");

      // Seleciona o elemento destino
      const targetElement = document.querySelector(targetId);

      // Faz o scroll suave até ele
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // LINK ATIVO NAVBAR ===============================

  // Seleciona todas as sections
  const sections = document.querySelectorAll("section");

  // Seleciona todos os links da navbar
  const navLinks = document.querySelectorAll(".nav-a");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    // Percorre cada section
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Verifica se o scroll está dentro da section
      if (scrollY >= sectionTop - 100) {
        currentSection = section.getAttribute("id");
      }
    });

    // Remove active de todos
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Adiciona active no link correspondente
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
});
