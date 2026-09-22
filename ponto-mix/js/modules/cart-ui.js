/**
 * UI do carrinho: drawer lateral (desktop e mobile), botão flutuante,
 * contador no header. Consome window.PMCart e nunca duplica lógica de
 * cálculo — sempre lê subtotal/total/itens diretamente do módulo de estado.
 */
window.PMCartUI = (function () {
  let knownLineIds = new Set();

  function lineAddonsLabel(line) {
    if (!line.addons || !line.addons.length) return "";
    return line.addons.map((a) => a.label).join(", ");
  }

  function cartItemHtml(line, isNew) {
    const addonsLabel = lineAddonsLabel(line);
    return `
    <div class="cart-item${isNew ? " is-entering" : ""}" data-line-id="${line.lineId}">
      <div class="cart-item__media">${
        // placeholder simples e leve dentro do carrinho (sem <img> pesado repetido)
        `<div class="img-placeholder" style="font-size:1.4rem">${window.PMIcons.icon(window.PMUtils.iconForCategory(line.categoryId))}</div>`
      }</div>
      <div>
        <div class="cart-item__name">${window.PMUtils.escapeHtml(line.name)}</div>
        ${addonsLabel ? `<div class="cart-item__meta">+ ${window.PMUtils.escapeHtml(addonsLabel)}</div>` : ""}
        ${line.notes ? `<div class="cart-item__meta">Obs: ${window.PMUtils.escapeHtml(line.notes)}</div>` : ""}
        <div class="cart-item__row">
          <div class="cart-item__qty">
            <button type="button" data-dec="${line.lineId}" aria-label="Diminuir quantidade de ${window.PMUtils.escapeHtml(line.name)}">−</button>
            <output>${line.quantity}</output>
            <button type="button" data-inc="${line.lineId}" aria-label="Aumentar quantidade de ${window.PMUtils.escapeHtml(line.name)}">+</button>
          </div>
          <button type="button" class="cart-item__remove" data-remove="${line.lineId}">remover</button>
        </div>
      </div>
      <span class="cart-item__price">${window.PMUtils.formatCurrency(window.PMCart.lineTotal(line))}</span>
    </div>`;
  }

  function render() {
    const state = window.PMCart.getState();
    const itemsContainer = document.getElementById("cart-items-container");
    const footer = document.getElementById("cart-drawer-footer");

    if (state.isEmpty) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <span class="emoji" aria-hidden="true">${window.PMIcons.icon("cart")}</span>
          <h4>Seu carrinho está vazio</h4>
          <p class="text-muted" style="font-size:var(--fs-sm)">Adicione itens do cardápio para começar seu pedido.</p>
          <a href="#cardapio" class="btn btn-primary" id="cart-empty-cta">Ver cardápio</a>
        </div>`;
      footer.style.display = "none";
    } else {
      const currentIds = new Set(state.items.map((l) => l.lineId));
      itemsContainer.innerHTML = state.items.map((line) => cartItemHtml(line, !knownLineIds.has(line.lineId))).join("");
      knownLineIds = currentIds;
      footer.style.display = "flex";
      document.getElementById("cart-subtotal").textContent = window.PMUtils.formatCurrency(state.subtotal);
      document.getElementById("cart-total").textContent = window.PMUtils.formatCurrency(state.subtotal);
    }

    // Header
    const headerCount = document.getElementById("header-cart-count");
    if (state.count > 0) {
      headerCount.hidden = false;
      headerCount.textContent = String(state.count);
      headerCount.classList.remove("count-bump");
      void headerCount.offsetWidth; // reflow para reiniciar a animação
      headerCount.classList.add("count-bump");
    } else {
      headerCount.hidden = true;
    }

    // Botão flutuante (mobile)
    const fab = document.getElementById("cart-fab");
    const fabCount = document.getElementById("cart-fab-count");
    const fabTotal = document.getElementById("cart-fab-total");
    if (state.count > 0) {
      fab.classList.add("is-visible");
      fabCount.textContent = `Carrinho (${state.count})`;
      fabTotal.textContent = window.PMUtils.formatCurrency(state.subtotal);
    } else {
      fab.classList.remove("is-visible");
    }
  }

  function openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    drawer.classList.add("is-open");
    drawer.removeAttribute("inert");
    document.getElementById("cart-drawer-overlay").classList.add("is-open");
    document.body.style.overflow = "hidden";
    drawer.querySelector(".icon-btn, a, button")?.focus();
  }

  function closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    drawer.classList.remove("is-open");
    drawer.setAttribute("inert", "");
    document.getElementById("cart-drawer-overlay").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function setupEvents() {
    document.getElementById("open-cart-btn").addEventListener("click", openDrawer);
    document.getElementById("cart-fab").addEventListener("click", openDrawer);
    document.getElementById("close-cart-btn").addEventListener("click", closeDrawer);
    document.getElementById("cart-drawer-overlay").addEventListener("click", closeDrawer);
    document.getElementById("continue-shopping-btn").addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.getElementById("cart-drawer").classList.contains("is-open")) closeDrawer();
    });

    document.getElementById("cart-items-container").addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const remove = e.target.closest("[data-remove]");
      if (inc) window.PMCart.incrementQuantity(inc.dataset.inc, 1);
      if (dec) window.PMCart.incrementQuantity(dec.dataset.dec, -1);
      if (remove) {
        const el = document.querySelector(`.cart-item[data-line-id="${remove.dataset.remove}"]`);
        if (el && !window.PMUtils.prefersReducedMotion()) {
          el.classList.add("is-leaving");
          setTimeout(() => window.PMCart.removeItem(remove.dataset.remove), 220);
        } else {
          window.PMCart.removeItem(remove.dataset.remove);
        }
      }
    });

    document.getElementById("go-to-checkout-btn").addEventListener("click", () => {
      closeDrawer();
      window.PMCheckout.open();
    });

    window.PMCart.subscribe(render);
  }

  function init() {
    setupEvents();
    render();
  }

  return { init, openDrawer, closeDrawer };
})();
