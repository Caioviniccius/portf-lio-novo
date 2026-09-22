/**
 * Estado central do carrinho.
 *
 * Único lugar com a lógica de carrinho — Menu, Modal de Produto, Drawer do
 * Carrinho e Checkout apenas leem esse estado e disparam suas ações através
 * da API abaixo, evitando duplicação de lógica (ver item 26 do briefing).
 *
 * Persistido em localStorage para sobreviver a reloads da página.
 */
window.PMCart = (function () {
  const STORAGE_KEY = "pontomix.cart.v1";
  let items = []; // cada item: { lineId, productId, categoryId, name, image, basePrice, addons, notes, quantity }
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) items = parsed;
      }
    } catch (e) {
      // localStorage indisponível (modo privado, etc.) — segue com carrinho em memória.
      items = [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* silencioso — carrinho segue funcionando apenas em memória */
    }
  }

  function notify() {
    persist();
    listeners.forEach((fn) => fn(getState()));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function lineUnitPrice(line) {
    const addonsTotal = (line.addons || []).reduce((sum, a) => sum + a.price, 0);
    return line.basePrice + addonsTotal;
  }

  function lineTotal(line) {
    return lineUnitPrice(line) * line.quantity;
  }

  /**
   * Adiciona um item ao carrinho. Itens com o mesmo produto + mesmos
   * adicionais + mesmas observações são agrupados (soma quantidade) — do
   * contrário viram uma linha separada, permitindo o mesmo produto
   * "duas vezes" com personalizações diferentes.
   */
  function addItem({ productId, categoryId, name, image, basePrice, addons = [], notes = "", quantity = 1 }) {
    const addonsKey = addons
      .map((a) => a.id)
      .sort()
      .join(",");
    const existing = items.find(
      (it) => it.productId === productId && it.addonsSignature === addonsKey && (it.notes || "") === (notes || "")
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        lineId: window.PMUtils.generateId(),
        productId,
        categoryId,
        name,
        image,
        basePrice,
        addons,
        addonsSignature: addonsKey,
        notes,
        quantity,
      });
    }
    notify();
  }

  function updateQuantity(lineId, quantity) {
    const line = items.find((it) => it.lineId === lineId);
    if (!line) return;
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    line.quantity = quantity;
    notify();
  }

  function incrementQuantity(lineId, delta) {
    const line = items.find((it) => it.lineId === lineId);
    if (!line) return;
    updateQuantity(lineId, line.quantity + delta);
  }

  function removeItem(lineId) {
    items = items.filter((it) => it.lineId !== lineId);
    notify();
  }

  function clear() {
    items = [];
    notify();
  }

  function getItems() {
    return items.slice();
  }

  function getSubtotal() {
    return items.reduce((sum, line) => sum + lineTotal(line), 0);
  }

  function getTotalCount() {
    return items.reduce((sum, line) => sum + line.quantity, 0);
  }

  function isEmpty() {
    return items.length === 0;
  }

  function getState() {
    return {
      items: getItems(),
      subtotal: getSubtotal(),
      count: getTotalCount(),
      isEmpty: isEmpty(),
    };
  }

  load();

  return {
    addItem,
    updateQuantity,
    incrementQuantity,
    removeItem,
    clear,
    getItems,
    getSubtotal,
    getTotalCount,
    isEmpty,
    getState,
    lineUnitPrice,
    lineTotal,
    subscribe,
  };
})();
