/**
 * Utilitários compartilhados entre módulos.
 * Tudo pendurado em window.PMUtils para simplicidade (sem bundler/build step).
 */
window.PMUtils = (function () {
  function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Alguns produtos ainda não têm preço definido pelo cliente (ver
  // `priceTBD` em menu-data.js). Nesses casos exibimos um aviso em vez de
  // um valor em R$ — nunca um preço inventado.
  function formatPrice(product) {
    if (product && product.priceTBD) return "Preço a definir";
    return formatCurrency(product.price);
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function generateId() {
    return "item_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function findProductById(productId) {
    for (const category of window.MENU_CATEGORIES) {
      const product = category.products.find((p) => p.id === productId);
      if (product) return { product, category };
    }
    return null;
  }

  // Ícone (chave do sprite em index.html #icon-sprite, via window.PMIcons)
  // usado no placeholder visual quando uma imagem real de produto ainda não
  // existe no caminho configurado.
  const CATEGORY_ICONS = {
    hamburgueres: "burger",
    combos: "flame",
    "combos-vip": "flame",
    "combos-artesanais": "flame",
    brotinhos: "pizza",
    porcoes: "fries",
    pasteis: "pastel",
    bebidas: "cup",
    "bebidas-alcoolicas": "wine",
    sobremesas: "dessert",
  };

  function iconForCategory(categoryId) {
    return CATEGORY_ICONS[categoryId] || "dine";
  }

  /**
   * Cria um elemento de mídia (imagem) com fallback automático para um
   * placeholder estilizado caso a imagem real não exista no caminho.
   * Isso permite que o proprietário simplesmente substitua o arquivo em
   * `images/...` no futuro sem alterar nenhum código.
   */
  function createProductMedia(product, categoryId) {
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    img.addEventListener("error", function onError() {
      img.removeEventListener("error", onError);
      const placeholder = document.createElement("div");
      placeholder.className = "img-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.innerHTML = window.PMIcons.icon(iconForCategory(categoryId));
      wrapper.replaceChildren(placeholder);
    });

    wrapper.appendChild(img);
    return wrapper;
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  return {
    formatCurrency,
    formatPrice,
    escapeHtml,
    generateId,
    findProductById,
    iconForCategory,
    createProductMedia,
    debounce,
    prefersReducedMotion,
    showToast,
  };
})();
