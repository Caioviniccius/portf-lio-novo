/**
 * Renderiza a navegação de categorias e a grade de produtos a partir de
 * window.MENU_CATEGORIES (js/data/menu-data.js). Nenhum dado de produto
 * fica hardcoded aqui — apenas a estrutura visual.
 */
window.PMMenu = (function () {
  function renderNav() {
    const nav = document.getElementById("menu-nav-scroller");
    if (!nav) return;
    nav.innerHTML = window.MENU_CATEGORIES.map(
      (cat, i) => `
      <button class="menu-nav__item${i === 0 ? " is-active" : ""}" role="tab" data-category="${cat.id}" aria-selected="${i === 0}">
        <span aria-hidden="true">${window.PMIcons.icon(cat.icon)}</span> ${window.PMUtils.escapeHtml(cat.label)}
      </button>`
    ).join("");

    nav.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-nav__item");
      if (!btn) return;
      const target = document.getElementById("cat-" + btn.dataset.category);
      if (target) {
        target.scrollIntoView({ behavior: window.PMUtils.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      }
    });
  }

  function productCardHtml(product, category) {
    const tags = (product.tags || [])
      .map((t) => `<span class="badge badge--gold">${window.PMUtils.escapeHtml(t)}</span>`)
      .join("");
    const priceLabel = window.PMUtils.formatPrice(product);
    // Produtos com preço ainda não definido pelo cliente não podem ser
    // adicionados ao carrinho (não há valor para somar) — em vez do botão
    // "Adicionar", oferecemos um jeito direto de perguntar o preço pelo
    // WhatsApp da loja.
    const footerAction = product.priceTBD
      ? `<a class="add-btn add-btn--ask" href="${window.PMWhatsapp.buildAskPriceLink(product.name, 1, "")}" target="_blank" rel="noopener" aria-label="Perguntar o preço de ${window.PMUtils.escapeHtml(product.name)} pelo WhatsApp">
          Perguntar ${window.PMIcons.icon("chat")}
        </a>`
      : `<button class="add-btn" type="button" data-quick-add="${product.id}" aria-label="Adicionar ${window.PMUtils.escapeHtml(product.name)} ao carrinho">
          + Adicionar
        </button>`;
    // O card inteiro (mídia + nome + descrição) é um único <button> que abre
    // o modal de personalização. O botão "Adicionar" fica FORA desse botão,
    // como irmão, para nunca haver um controle interativo aninhado dentro
    // de outro (isso quebraria a navegação por leitor de tela).
    return `
      <article class="product-card" data-product-id="${product.id}">
        <button type="button" class="product-card__open" data-open-product="${product.id}"
          aria-label="Ver detalhes de ${window.PMUtils.escapeHtml(product.name)}">
          <span class="product-card__media" data-media-slot></span>
          ${tags ? `<span class="product-card__tags">${tags}</span>` : ""}
          <span class="product-card__body-top">
            <h4>${window.PMUtils.escapeHtml(product.name)}</h4>
            <span class="product-card__desc">${window.PMUtils.escapeHtml(product.description)}</span>
          </span>
        </button>
        <div class="product-card__footer">
          <span class="product-card__price${product.priceTBD ? " product-card__price--tbd" : ""}">${priceLabel}</span>
          ${footerAction}
        </div>
      </article>`;
  }

  function renderCategories() {
    const container = document.getElementById("menu-categories");
    if (!container) return;

    container.innerHTML = window.MENU_CATEGORIES.map(
      (cat) => `
      <div class="menu-category" id="cat-${cat.id}">
        <div class="menu-category__head">
          <span class="icon" aria-hidden="true">${window.PMIcons.icon(cat.icon)}</span>
          <h3>${window.PMUtils.escapeHtml(cat.label)}</h3>
        </div>
        ${cat.note ? `<p class="menu-category__note">${window.PMUtils.escapeHtml(cat.note)}</p>` : ""}
        <div class="menu-grid reveal-stagger" data-category-grid="${cat.id}">
          ${cat.products.map((p) => productCardHtml(p, cat)).join("")}
        </div>
      </div>`
    ).join("");

    // Preenche as mídias com fallback de placeholder (evita <img src> quebrada).
    window.MENU_CATEGORIES.forEach((cat) => {
      cat.products.forEach((product) => {
        const card = container.querySelector(`.product-card[data-product-id="${product.id}"] [data-media-slot]`);
        if (card) card.appendChild(window.PMUtils.createProductMedia(product, cat.id));
      });
    });

    // Contagem total de itens do cardápio, usada na seção "Sobre".
    const totalProducts = window.MENU_CATEGORIES.reduce((sum, c) => sum + c.products.length, 0);
    const statEl = document.getElementById("stat-products");
    if (statEl) statEl.textContent = totalProducts + "+";
  }

  function setupScrollSpy() {
    const navButtons = Array.from(document.querySelectorAll(".menu-nav__item"));
    const sections = window.MENU_CATEGORIES.map((c) => document.getElementById("cat-" + c.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id.replace("cat-", "");
          navButtons.forEach((btn) => {
            const active = btn.dataset.category === id;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-selected", String(active));
            if (active) {
              btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function setupInteractions() {
    const container = document.getElementById("menu-categories");
    if (!container) return;

    container.addEventListener("click", (e) => {
      const quickAddBtn = e.target.closest("[data-quick-add]");
      if (quickAddBtn) {
        e.stopPropagation();
        const result = window.PMUtils.findProductById(quickAddBtn.dataset.quickAdd);
        if (!result) return;
        const { product, category } = result;
        window.PMCart.addItem({
          productId: product.id,
          categoryId: category.id,
          name: product.name,
          image: product.image,
          basePrice: product.price,
          addons: [],
          notes: "",
          quantity: 1,
        });
        quickAddBtn.classList.add("is-added", "pulse-once");
        quickAddBtn.innerHTML = `Adicionado ${window.PMIcons.icon("check")}`;
        window.PMUtils.showToast(`${product.name} adicionado ao carrinho`);
        setTimeout(() => {
          quickAddBtn.classList.remove("is-added", "pulse-once");
          quickAddBtn.textContent = "+ Adicionar";
        }, 1400);
        return;
      }

      const openBtn = e.target.closest("[data-open-product]");
      if (openBtn) {
        window.PMProductModal.open(openBtn.dataset.openProduct);
      }
    });
  }

  function init() {
    renderNav();
    renderCategories();
    setupScrollSpy();
    setupInteractions();
  }

  return { init };
})();
