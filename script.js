// Marca o link do menu correspondente à página atual
const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".cabecalho__menu__links").forEach((link) => {
    const destino = link.getAttribute("href");
    if (destino === paginaAtual) {
        link.classList.add("cabecalho__menu__links--ativo");
        link.setAttribute("aria-current", "page");
    }
});

// Revela elementos suavemente ao entrar na tela
const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const elementosReveal = document.querySelectorAll(".reveal");

if (prefereMenosMovimento || !("IntersectionObserver" in window)) {
    elementosReveal.forEach((el) => el.classList.add("reveal--visivel"));
} else {
    const observer = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("reveal--visivel");
                    observer.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elementosReveal.forEach((el) => observer.observe(el));
}

// Textos gerados pelo script, no idioma da página
const emIngles = document.documentElement.lang.startsWith("en");
const textos = emIngles
    ? { verMais: "See more", fechar: "Close", detalhes: "Project details" }
    : { verMais: "Ver mais", fechar: "Fechar", detalhes: "Detalhes do projeto" };

// Cards de projeto compactos com "Ver mais" abrindo os detalhes em uma caixa maior
const gradeProjetos = document.querySelector(".projetos__grid");

if (gradeProjetos) {
    const modal = document.createElement("dialog");
    modal.className = "modal-projeto";
    modal.setAttribute("aria-label", textos.detalhes);
    modal.innerHTML = `
        <button class="modal-projeto__fechar" type="button" aria-label="${textos.fechar}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
            </svg>
        </button>
        <div class="modal-projeto__conteudo"></div>`;
    document.body.appendChild(modal);

    const conteudoModal = modal.querySelector(".modal-projeto__conteudo");

    const abrirModal = (card, botao) => {
        conteudoModal.replaceChildren(
            card.querySelector(".card-projeto__capa").cloneNode(true),
            card.querySelector(".card-projeto__corpo").cloneNode(true)
        );
        conteudoModal.querySelector(".card-projeto__ver-mais")?.remove();
        modal.botaoOrigem = botao;
        modal.showModal();
        document.body.classList.add("modal-aberto");
    };

    modal.querySelector(".modal-projeto__fechar").addEventListener("click", () => modal.close());

    // Fecha ao clicar fora da caixa
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.close();
    });

    modal.addEventListener("close", () => {
        document.body.classList.remove("modal-aberto");
        modal.botaoOrigem?.focus();
    });

    gradeProjetos.querySelectorAll(".card-projeto").forEach((card) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "card-projeto__ver-mais";
        botao.innerHTML = `${textos.verMais}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>`;
        botao.addEventListener("click", () => abrirModal(card, botao));
        card.querySelector(".card-projeto__corpo").appendChild(botao);
    });

    gradeProjetos.classList.add("projetos__grid--compacto");
}
