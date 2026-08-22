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
