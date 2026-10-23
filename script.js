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
    ? {
        verDetalhes: "View Details",
        fechar: "Close",
        detalhes: "Project details",
        faltando: "Please fill in your name, what you need and a short description of the project.",
        emailAberto: "Your email app should open with the message ready to send. If nothing happens, write to {email}.",
        whatsappAberto: "WhatsApp opened in a new tab with your message ready. Just tap send.",
        assunto: "Website quote request",
        saudacao: "Hi Caio! I'd like a quote for a website.",
        rotulos: { nome: "Name", empresa: "Business", site: "Current website", tipo: "Project type", mensagem: "Details" },
    }
    : {
        verDetalhes: "Ver detalhes",
        fechar: "Fechar",
        detalhes: "Detalhes do projeto",
        faltando: "Preencha o seu nome, do que você precisa e uma breve descrição do projeto.",
        emailAberto: "O seu aplicativo de e-mail deve abrir com a mensagem pronta para enviar. Se nada acontecer, escreva para {email}.",
        whatsappAberto: "O WhatsApp abriu em outra aba com a sua mensagem pronta. É só enviar.",
        assunto: "Pedido de orçamento de site",
        saudacao: "Olá, Caio! Quero um orçamento para um site.",
        rotulos: { nome: "Nome", empresa: "Empresa", site: "Site atual", tipo: "Tipo de projeto", mensagem: "Detalhes" },
    };

// Cards de projeto compactos com "Ver detalhes" abrindo tudo em uma caixa maior
const gradeProjetos = document.querySelector(".projetos__grid");

if (gradeProjetos) {
    const modal = document.createElement("dialog");
    modal.className = "modal-projeto";
    modal.innerHTML = `
        <button class="modal-projeto__fechar" type="button" aria-label="${textos.fechar}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
        const titulo = card.querySelector(".card-projeto__titulo")?.textContent;
        modal.setAttribute("aria-label", titulo ? `${textos.detalhes}: ${titulo}` : textos.detalhes);
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
        if (location.hash) history.replaceState(null, "", location.pathname + location.search);
        modal.botaoOrigem?.focus();
    });

    const botoes = new Map();
    gradeProjetos.querySelectorAll(".card-projeto").forEach((card) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "card-projeto__ver-mais";
        botao.innerHTML = `${textos.verDetalhes}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>`;
        botao.addEventListener("click", () => abrirModal(card, botao));
        card.querySelector(".card-projeto__corpo").appendChild(botao);
        botoes.set(card.id, { card, botao });
    });

    gradeProjetos.classList.add("projetos__grid--compacto");

    // Links como projects.html#ponto-mix já abrem os detalhes daquele projeto
    const abrirPeloEndereco = () => {
        const alvo = botoes.get(decodeURIComponent(location.hash.slice(1)));
        if (alvo && !modal.open) {
            alvo.card.scrollIntoView({ block: "center" });
            abrirModal(alvo.card, alvo.botao);
        }
    };
    abrirPeloEndereco();
    window.addEventListener("hashchange", abrirPeloEndereco);
}

// Formulário de orçamento: monta a mensagem e abre o e-mail ou o WhatsApp do visitante.
// Nada é enviado para um servidor; o envio acontece pelo aplicativo que a pessoa escolher.
const formulario = document.querySelector("#formulario-orcamento");

if (formulario) {
    const status = formulario.querySelector(".formulario__status");
    const obrigatorios = ["nome", "tipo", "mensagem"];

    const mostrarStatus = (mensagem, tipo) => {
        status.textContent = mensagem;
        status.className = `formulario__status formulario__status--${tipo}`;
    };

    formulario.addEventListener("input", (evento) => {
        if (evento.target.value.trim()) evento.target.removeAttribute("aria-invalid");
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const canal = evento.submitter?.dataset.canal || "email";
        const dados = Object.fromEntries(
            [...new FormData(formulario)].map(([campo, valor]) => [campo, String(valor).trim()])
        );

        const invalidos = obrigatorios.filter((campo) => !dados[campo]);
        obrigatorios.forEach((campo) => {
            const elemento = formulario.elements[campo];
            if (invalidos.includes(campo)) elemento.setAttribute("aria-invalid", "true");
            else elemento.removeAttribute("aria-invalid");
        });
        if (invalidos.length) {
            mostrarStatus(textos.faltando, "erro");
            formulario.elements[invalidos[0]].focus();
            return;
        }

        const linhas = Object.entries(textos.rotulos)
            .filter(([campo]) => dados[campo])
            .map(([campo, rotulo]) => (campo === "mensagem" ? `\n${dados[campo]}` : `${rotulo}: ${dados[campo]}`));
        const texto = `${textos.saudacao}\n\n${linhas.join("\n")}`;

        let destino;
        if (canal === "whatsapp") {
            destino = `https://wa.me/${formulario.dataset.whatsapp}?text=${encodeURIComponent(texto)}`;
            mostrarStatus(textos.whatsappAberto, "ok");
        } else {
            const email = formulario.dataset.email;
            const assunto = dados.empresa ? `${textos.assunto} · ${dados.empresa}` : textos.assunto;
            destino = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`;
            mostrarStatus(textos.emailAberto.replace("{email}", email), "ok");
        }

        // Um link clicado pelo script abre o app certo sem ser bloqueado como pop-up
        const link = document.createElement("a");
        link.href = destino;
        if (canal === "whatsapp") {
            link.target = "_blank";
            link.rel = "noopener";
        }
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}
