/**
 * Bootstrap da aplicação — conecta configuração, dados e módulos.
 */
(function () {
  function renderStoreLinks() {
    const cfg = window.STORE_CONFIG;
    const waLink = `https://wa.me/${cfg.phone.whatsapp}`;

    document.getElementById("contact-whatsapp").href = waLink;
    document.getElementById("contact-whatsapp-number").textContent = cfg.phone.display;
    document.getElementById("contact-instagram").href = cfg.instagram.url;
    document.getElementById("contact-instagram-handle").textContent = cfg.instagram.handle;
    document.getElementById("contact-address").textContent = `${cfg.address.street}, ${cfg.address.neighborhood} — ${cfg.address.city}`;

    document.getElementById("footer-whatsapp").href = waLink;
    document.getElementById("footer-instagram").href = cfg.instagram.url;
    document.getElementById("footer-year").textContent = String(new Date().getFullYear());

    document.title = cfg.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cfg.seo.description);
  }

  function renderPromotions() {
    const container = document.getElementById("promotions-list");
    const active = (window.PROMOTIONS || []).filter((p) => p.active);
    if (!active.length) {
      container.innerHTML = `<p class="text-muted">Nenhuma promoção ativa no momento. Volte em breve!</p>`;
      return;
    }
    container.innerHTML = active
      .map(
        (promo) => `
      <div class="promo-card">
        <div class="promo-stamp">${window.PMUtils.escapeHtml(promo.badge || "Promoção")}</div>
        <div>
          <h3>${window.PMUtils.escapeHtml(promo.title)}</h3>
          <p class="text-muted" style="margin-top:var(--sp-2)">${window.PMUtils.escapeHtml(promo.description)}</p>
          <div class="promo-card__price-row" style="margin-top:var(--sp-4)">
            ${promo.originalPrice ? `<span class="promo-card__original">${window.PMUtils.formatCurrency(promo.originalPrice)}</span>` : ""}
            <span class="promo-card__price">${window.PMUtils.formatCurrency(promo.price)}</span>
          </div>
          <button class="btn btn-primary" style="margin-top:var(--sp-4)" data-promo-add="${promo.linkedProductId || ""}">Adicionar ao pedido</button>
        </div>
      </div>`
      )
      .join("");

    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-promo-add]");
      if (!btn || !btn.dataset.promoAdd) return;
      const result = window.PMUtils.findProductById(btn.dataset.promoAdd);
      if (!result) return;
      window.PMProductModal.open(result.product.id);
    });
  }

  function starString(rating) {
    const filled = window.PMIcons.icon("star", "icon-svg--fill is-filled").repeat(rating);
    const empty = window.PMIcons.icon("star").repeat(5 - rating);
    return filled + empty;
  }

  function renderReviews() {
    const container = document.getElementById("reviews-list");
    container.innerHTML = (window.REVIEWS || [])
      .map(
        (r) => `
      <div class="review-card">
        <span class="review-card__stars" aria-hidden="true">${starString(r.rating)}</span>
        <p>${window.PMUtils.escapeHtml(r.text)}</p>
        <span class="review-card__name">${window.PMUtils.escapeHtml(r.name)}</span>
        ${r.mock ? `<span class="review-card__mock-note">Avaliação de exemplo</span>` : ""}
      </div>`
      )
      .join("");
  }

  function setupHeaderBehavior() {
    const header = document.getElementById("site-header");
    let lastY = window.scrollY;

    window.addEventListener(
      "scroll",
      window.PMUtils.debounce(() => {
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 40);
        lastY = y;
      }, 10),
      { passive: true }
    );
  }

  function setupMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  function init() {
    renderStoreLinks();
    window.PMMenu.init();
    window.PMProductModal.init();
    window.PMCartUI.init();
    window.PMCheckout.init();
    renderPromotions();
    renderReviews();
    setupHeaderBehavior();
    setupMobileMenu();

    // Reobserva elementos criados dinamicamente (cardápio, promoções, avaliações)
    if (window.PMReveal) window.PMReveal.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
