/**
 * Modal de produto: exibe detalhes, adicionais configuráveis (vindos de
 * ADDON_LIBRARY via product.addonsGroup), observações rápidas/livres,
 * seletor de quantidade e adiciona ao carrinho.
 */
window.PMProductModal = (function () {
  let state = null; // { product, category, quantity, selectedAddons: Set<id>, notes }
  let lastFocusedEl = null;

  const overlay = () => document.getElementById("product-modal-overlay");

  function getAddonsForProduct(product) {
    if (!product.addonsGroup) return [];
    return window.ADDON_LIBRARY[product.addonsGroup] || [];
  }

  function computeUnitPrice() {
    const { product, selectedAddons } = state;
    if (product.priceTBD) return null;
    const addons = getAddonsForProduct(product).filter((a) => selectedAddons.has(a.id));
    return product.price + addons.reduce((sum, a) => sum + a.price, 0);
  }

  function render() {
    const { product, category, quantity, selectedAddons, notes } = state;

    document.getElementById("product-modal-title").textContent = product.name;
    document.getElementById("product-modal-desc").textContent = product.description;
    document.getElementById("product-modal-ingredients").textContent = product.ingredients
      ? "Ingredientes: " + product.ingredients
      : "";

    const mediaSlot = document.getElementById("product-modal-media-inner");
    mediaSlot.innerHTML = "";
    mediaSlot.appendChild(window.PMUtils.createProductMedia(product, state.category.id));

    // Adicionais
    const addons = getAddonsForProduct(product);
    const addonsContainer = document.getElementById("product-modal-addons");
    if (addons.length) {
      addonsContainer.innerHTML = `
        <p class="modal-section-title">Adicionais</p>
        <div>
          ${addons
            .map(
              (a) => `
            <div class="addon-row">
              <label>
                <input type="checkbox" data-addon-id="${a.id}" ${selectedAddons.has(a.id) ? "checked" : ""} />
                ${window.PMUtils.escapeHtml(a.label)}
              </label>
              <span class="addon-price">+ ${window.PMUtils.formatCurrency(a.price)}</span>
            </div>`
            )
            .join("")}
        </div>`;
    } else {
      addonsContainer.innerHTML = "";
    }

    // Observações rápidas (chips) — alguns chips ("Sem cebola", "Bem
    // passado" etc.) só fazem sentido para comida preparada na hora, então
    // categorias com `showQuickNotes: false` (bebidas, bebidas alcoólicas,
    // sobremesas) não mostram nenhum chip — o campo de texto livre abaixo
    // continua disponível normalmente em todos os produtos.
    const quickNotes = category.showQuickNotes === false ? [] : window.QUICK_NOTES;
    const chipsContainer = document.getElementById("product-modal-notes-chips");
    chipsContainer.innerHTML = quickNotes.map(
      (note) => `<button type="button" class="notes-chip${notes.quick.has(note) ? " is-selected" : ""}" data-note="${window.PMUtils.escapeHtml(note)}">${window.PMUtils.escapeHtml(note)}</button>`
    ).join("");

    document.getElementById("product-modal-notes-text").value = notes.free;
    document.getElementById("product-modal-qty-value").textContent = String(quantity);

    const unitPrice = computeUnitPrice();
    const totalEl = document.getElementById("product-modal-total");
    totalEl.textContent = unitPrice == null ? "Preço a definir" : window.PMUtils.formatCurrency(unitPrice * quantity);
    totalEl.classList.toggle("is-tbd", unitPrice == null);
    document.getElementById("product-modal-qty-dec").disabled = quantity <= 1;

    // Produtos com preço ainda não definido não vão para o carrinho — o
    // botão passa a abrir o WhatsApp para o cliente perguntar o valor.
    const addBtn = document.getElementById("product-modal-add-btn");
    addBtn.textContent = product.priceTBD ? "Perguntar" : "Adicionar";
  }

  function combinedNotes() {
    const parts = Array.from(state.notes.quick);
    if (state.notes.free.trim()) parts.push(state.notes.free.trim());
    return parts.join("; ");
  }

  function open(productId) {
    const result = window.PMUtils.findProductById(productId);
    if (!result) return;
    lastFocusedEl = document.activeElement;

    state = {
      product: result.product,
      category: result.category,
      quantity: 1,
      selectedAddons: new Set(),
      notes: { quick: new Set(), free: "" },
    };

    render();
    const ov = overlay();
    ov.removeAttribute("inert");
    ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.getElementById("close-product-modal").focus();
  }

  function close() {
    overlay().classList.remove("is-open");
    overlay().setAttribute("inert", "");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function setupEvents() {
    document.getElementById("close-product-modal").addEventListener("click", close);
    overlay().addEventListener("click", (e) => {
      if (e.target === overlay()) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay().classList.contains("is-open")) close();
    });

    document.getElementById("product-modal-qty-dec").addEventListener("click", () => {
      if (!state) return;
      state.quantity = Math.max(1, state.quantity - 1);
      render();
    });
    document.getElementById("product-modal-qty-inc").addEventListener("click", () => {
      if (!state) return;
      state.quantity += 1;
      render();
    });

    document.getElementById("product-modal-addons").addEventListener("change", (e) => {
      const input = e.target.closest("[data-addon-id]");
      if (!input || !state) return;
      if (input.checked) state.selectedAddons.add(input.dataset.addonId);
      else state.selectedAddons.delete(input.dataset.addonId);
      render();
    });

    document.getElementById("product-modal-notes-chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".notes-chip");
      if (!chip || !state) return;
      const note = chip.dataset.note;
      if (state.notes.quick.has(note)) state.notes.quick.delete(note);
      else state.notes.quick.add(note);
      render();
    });

    document.getElementById("product-modal-notes-text").addEventListener("input", (e) => {
      if (!state) return;
      state.notes.free = e.target.value;
      const unitPrice = computeUnitPrice();
      const totalEl = document.getElementById("product-modal-total");
      totalEl.textContent = unitPrice == null ? "Preço a definir" : window.PMUtils.formatCurrency(unitPrice * state.quantity);
      totalEl.classList.toggle("is-tbd", unitPrice == null);
    });

    document.getElementById("product-modal-add-btn").addEventListener("click", () => {
      if (!state) return;

      if (state.product.priceTBD) {
        const link = window.PMWhatsapp.buildAskPriceLink(state.product.name, state.quantity, combinedNotes());
        window.open(link, "_blank", "noopener");
        close();
        return;
      }

      const addons = getAddonsForProduct(state.product).filter((a) => state.selectedAddons.has(a.id));
      window.PMCart.addItem({
        productId: state.product.id,
        categoryId: state.category.id,
        name: state.product.name,
        image: state.product.image,
        basePrice: state.product.price,
        addons: addons,
        notes: combinedNotes(),
        quantity: state.quantity,
      });
      window.PMUtils.showToast(`${state.product.name} adicionado ao carrinho`);
      close();
    });
  }

  function init() {
    setupEvents();
  }

  return { init, open, close };
})();
