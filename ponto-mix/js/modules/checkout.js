/**
 * Fluxo de checkout: 1) modalidade → 2) dados do cliente → 3) revisão e
 * envio para o WhatsApp. Cada modalidade define seus próprios campos de
 * formulário, então adicionar uma modalidade nova não exige tocar nas
 * outras etapas.
 */
window.PMCheckout = (function () {
  let state = { step: 1, orderType: null, formData: {} };

  function enabledOrderTypes() {
    const cfg = window.STORE_CONFIG.orderTypes;
    return Object.entries(cfg)
      .filter(([, v]) => v.enabled)
      .map(([id, v]) => ({ id, ...v }));
  }

  // Define os campos de formulário por modalidade. Fácil de estender:
  // adicione um objeto { name, label, type, required, placeholder }.
  function fieldsForType(orderTypeId) {
    const common = [
      { name: "name", label: "Nome", type: "text", required: true, placeholder: "Seu nome completo" },
      { name: "phone", label: "Telefone", type: "tel", required: true, placeholder: "(74) 90000-0000" },
    ];

    if (orderTypeId === "delivery") {
      return [
        ...common,
        { name: "address", label: "Endereço", type: "text", required: true, placeholder: "Rua/Av." },
        { name: "number", label: "Número", type: "text", required: true, placeholder: "Nº" },
        { name: "neighborhood", label: "Bairro", type: "text", required: true, placeholder: "Bairro" },
        { name: "complement", label: "Complemento", type: "text", required: false, placeholder: "Apto, bloco... (opcional)" },
        { name: "reference", label: "Ponto de referência", type: "text", required: false, placeholder: "Opcional" },
        { name: "notes", label: "Observações do pedido", type: "textarea", required: false, placeholder: "Opcional" },
      ];
    }

    if (orderTypeId === "pickup") {
      return [...common, { name: "notes", label: "Observações do pedido", type: "textarea", required: false, placeholder: "Opcional" }];
    }

    if (orderTypeId === "dineIn") {
      return [
        { name: "name", label: "Nome", type: "text", required: true, placeholder: "Seu nome" },
        { name: "table", label: "Número da mesa", type: "text", required: true, placeholder: "Ex: 12" },
        { name: "notes", label: "Observações do pedido", type: "textarea", required: false, placeholder: "Opcional" },
      ];
    }

    return common;
  }

  function deliveryFee() {
    const cfg = window.STORE_CONFIG.orderTypes.delivery;
    if (!cfg) return { amount: 0, label: "—" };
    if (cfg.feeMode === "flat" && typeof cfg.flatFee === "number") {
      return { amount: cfg.flatFee, label: window.PMUtils.formatCurrency(cfg.flatFee) };
    }
    if (cfg.feeMode === "byNeighborhood") {
      const neighborhood = state.formData.neighborhood;
      const fee = cfg.feesByNeighborhood[neighborhood];
      if (typeof fee === "number") return { amount: fee, label: window.PMUtils.formatCurrency(fee) };
    }
    // Nenhuma taxa configurada ainda — não inventamos valor.
    return { amount: 0, label: "A combinar" };
  }

  function renderSteps() {
    document.querySelectorAll(".checkout-panel").forEach((panel) => {
      panel.classList.toggle("is-active", Number(panel.dataset.panel) === state.step);
    });
    document.querySelectorAll(".checkout-steps .step").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.step) === state.step);
    });

    const prevBtn = document.getElementById("checkout-prev-btn");
    const nextBtn = document.getElementById("checkout-next-btn");
    prevBtn.style.visibility = state.step === 1 ? "hidden" : "visible";
    nextBtn.textContent = state.step === 3 ? "Finalizar Pedido no WhatsApp" : "Continuar";
    nextBtn.disabled = state.step === 1 && !state.orderType;
  }

  function renderOrderTypeGrid() {
    const grid = document.getElementById("order-type-grid");
    grid.innerHTML = enabledOrderTypes()
      .map(
        (t) => `
      <button type="button" class="order-type-card${state.orderType === t.id ? " is-selected" : ""}" data-order-type="${t.id}">
        <span class="emoji" aria-hidden="true">${window.PMIcons.icon(t.icon)}</span>
        <h4>${window.PMUtils.escapeHtml(t.label)}</h4>
        <span class="order-type-card__desc">${window.PMUtils.escapeHtml(t.description)}</span>
      </button>`
      )
      .join("");
  }

  function pickupInfoHtml() {
    const cfg = window.STORE_CONFIG;
    return `
      <div class="summary-card" style="margin-bottom:var(--sp-4)">
        <p class="modal-section-title">Informações para retirada</p>
        <p class="text-muted" style="font-size:var(--fs-sm)">
          ${window.PMUtils.escapeHtml(cfg.address.street)}, ${window.PMUtils.escapeHtml(cfg.address.neighborhood)} —
          ${window.PMUtils.escapeHtml(cfg.address.city)}
        </p>
        ${
          cfg.hours && cfg.hours.length
            ? `<p class="text-muted" style="font-size:var(--fs-sm)">${cfg.hours
                .map((h) => `${window.PMUtils.escapeHtml(h.days)}: ${window.PMUtils.escapeHtml(h.time)}`)
                .join(" · ")}</p>`
            : ""
        }
      </div>`;
  }

  function renderForm() {
    const form = document.getElementById("checkout-form");
    const fields = fieldsForType(state.orderType);
    const intro = state.orderType === "pickup" ? pickupInfoHtml() : "";

    form.innerHTML =
      intro +
      fields
        .map((f) => {
          const value = window.PMUtils.escapeHtml(state.formData[f.name] || "");
          if (f.type === "textarea") {
            return `
            <div class="field">
              <label for="field-${f.name}">${f.label}${f.required ? "" : " (opcional)"}</label>
              <textarea id="field-${f.name}" name="${f.name}" placeholder="${f.placeholder || ""}">${value}</textarea>
              <span class="error-msg" data-error-for="${f.name}" hidden>Campo obrigatório</span>
            </div>`;
          }
          return `
            <div class="field">
              <label for="field-${f.name}">${f.label}${f.required ? "" : " (opcional)"}</label>
              <input id="field-${f.name}" name="${f.name}" type="${f.type}" placeholder="${f.placeholder || ""}" value="${value}" />
              <span class="error-msg" data-error-for="${f.name}" hidden>Campo obrigatório</span>
            </div>`;
        })
        .join("");
  }

  function readForm() {
    const form = document.getElementById("checkout-form");
    const fields = fieldsForType(state.orderType);
    fields.forEach((f) => {
      const el = form.querySelector(`[name="${f.name}"]`);
      if (el) state.formData[f.name] = el.value.trim();
    });
  }

  function validateForm() {
    readForm();
    const fields = fieldsForType(state.orderType);
    let valid = true;
    fields.forEach((f) => {
      const errorEl = document.querySelector(`[data-error-for="${f.name}"]`);
      const inputEl = document.querySelector(`#field-${f.name}`);
      const isEmpty = f.required && !state.formData[f.name];
      if (errorEl) errorEl.hidden = !isEmpty;
      if (inputEl) inputEl.classList.toggle("field-error", isEmpty);
      if (isEmpty) valid = false;
    });
    return valid;
  }

  function renderSummary() {
    const cartState = window.PMCart.getState();
    const itemsContainer = document.getElementById("checkout-summary-items");
    itemsContainer.innerHTML = cartState.items
      .map(
        (line) => `
      <div class="summary-item-row">
        <span><span class="qty">${line.quantity}x</span>${window.PMUtils.escapeHtml(line.name)}${
          line.addons && line.addons.length ? ` <span class="text-muted">(+ ${window.PMUtils.escapeHtml(line.addons.map((a) => a.label).join(", "))})</span>` : ""
        }</span>
        <span>${window.PMUtils.formatCurrency(window.PMCart.lineTotal(line))}</span>
      </div>`
      )
      .join("");

    const fee = state.orderType === "delivery" ? deliveryFee() : { amount: 0, label: null };
    const feeLabel = document.getElementById("checkout-summary-fee-label");
    const feeValue = document.getElementById("checkout-summary-fee");

    if (state.orderType === "delivery") {
      feeLabel.hidden = false;
      feeValue.hidden = false;
      feeLabel.textContent = "Taxa de entrega";
      feeValue.textContent = fee.label;
    } else {
      feeLabel.hidden = true;
      feeValue.hidden = true;
    }

    document.getElementById("checkout-summary-subtotal").textContent = window.PMUtils.formatCurrency(cartState.subtotal);
    document.getElementById("checkout-summary-total").textContent = window.PMUtils.formatCurrency(cartState.subtotal + fee.amount);

    const customerContainer = document.getElementById("checkout-summary-customer");
    const fields = fieldsForType(state.orderType);
    customerContainer.innerHTML = fields
      .filter((f) => state.formData[f.name])
      .map((f) => `<div><strong>${f.label}:</strong> ${window.PMUtils.escapeHtml(state.formData[f.name])}</div>`)
      .join("");
  }

  function goNext() {
    if (state.step === 1) {
      if (!state.orderType) return;
      state.step = 2;
      renderForm();
    } else if (state.step === 2) {
      if (!validateForm()) return;
      state.step = 3;
      renderSummary();
    } else if (state.step === 3) {
      finalize();
      return;
    }
    renderSteps();
  }

  function goPrev() {
    if (state.step > 1) state.step -= 1;
    if (state.step === 2) renderForm();
    renderSteps();
  }

  function finalize() {
    const fee = state.orderType === "delivery" ? deliveryFee() : { amount: 0 };
    const cartState = window.PMCart.getState();
    const orderTypeLabel = window.STORE_CONFIG.orderTypes[state.orderType].label;

    const url = window.PMWhatsapp.buildOrderLink({
      items: cartState.items,
      subtotal: cartState.subtotal,
      fee,
      total: cartState.subtotal + fee.amount,
      orderType: orderTypeLabel,
      customer: state.formData,
    });

    window.open(url, "_blank", "noopener");
    window.PMUtils.showToast("Pedido enviado! Confira o WhatsApp para confirmar.");
    window.PMCart.clear();
    close();
  }

  function open() {
    if (window.PMCart.isEmpty()) {
      window.PMUtils.showToast("Seu carrinho está vazio");
      return;
    }
    state = { step: 1, orderType: enabledOrderTypes().length === 1 ? enabledOrderTypes()[0].id : null, formData: {} };
    renderOrderTypeGrid();
    renderSteps();
    const overlay = document.getElementById("checkout-overlay");
    overlay.removeAttribute("inert");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.getElementById("checkout-back-btn").focus();
  }

  function close() {
    const overlay = document.getElementById("checkout-overlay");
    overlay.classList.remove("is-open");
    overlay.setAttribute("inert", "");
    document.body.style.overflow = "";
  }

  function setupEvents() {
    document.getElementById("order-type-grid").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-order-type]");
      if (!btn) return;
      state.orderType = btn.dataset.orderType;
      renderOrderTypeGrid();
      renderSteps();
    });

    document.getElementById("checkout-next-btn").addEventListener("click", goNext);
    document.getElementById("checkout-prev-btn").addEventListener("click", goPrev);
    document.getElementById("checkout-back-btn").addEventListener("click", () => {
      if (state.step > 1) {
        goPrev();
      } else {
        close();
      }
    });
  }

  function init() {
    setupEvents();
  }

  return { init, open, close };
})();
