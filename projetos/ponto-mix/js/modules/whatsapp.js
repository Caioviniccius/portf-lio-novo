/**
 * Geração da mensagem de pedido e do link do WhatsApp.
 * Usa SEMPRE o número configurado em js/data/store-config.js — nunca uma
 * API fictícia. O link abre o WhatsApp (app ou web) com a mensagem já
 * preenchida via URL encoding (encodeURIComponent).
 */
window.PMWhatsapp = (function () {
  function buildMessage({ items, subtotal, fee, total, orderType, customer }) {
    const lines = [];
    lines.push(`Olá! Gostaria de fazer um pedido na ${window.STORE_CONFIG.name}.`);
    lines.push("");
    lines.push("*PEDIDO:*");
    items.forEach((line) => {
      const unit = window.PMCart.lineTotal(line);
      const addonsLabel = line.addons && line.addons.length ? ` (+ ${line.addons.map((a) => a.label).join(", ")})` : "";
      lines.push(`${line.quantity}x ${line.name}${addonsLabel} — ${window.PMUtils.formatCurrency(unit)}`);
      if (line.notes) lines.push(`   Obs: ${line.notes}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${window.PMUtils.formatCurrency(subtotal)}`);
    lines.push("");
    lines.push(`Modalidade: ${orderType}`);

    if (fee && fee.amount > 0) {
      lines.push(`Taxa de entrega: ${window.PMUtils.formatCurrency(fee.amount)}`);
    } else if (fee && fee.label && fee.label !== "—") {
      lines.push(`Taxa de entrega: ${fee.label}`);
    }

    lines.push("");
    lines.push("*Cliente:*");
    if (customer.name) lines.push(customer.name);
    lines.push("");

    if (customer.phone) {
      lines.push("*Telefone:*");
      lines.push(customer.phone);
      lines.push("");
    }

    if (customer.address) {
      lines.push("*Endereço:*");
      const addressParts = [customer.address, customer.number].filter(Boolean).join(", ");
      lines.push(addressParts);
      if (customer.neighborhood) lines.push(customer.neighborhood);
      if (customer.complement) lines.push(`Complemento: ${customer.complement}`);
      if (customer.reference) lines.push(`Referência: ${customer.reference}`);
      lines.push("");
    }

    if (customer.table) {
      lines.push("*Mesa:*");
      lines.push(customer.table);
      lines.push("");
    }

    if (customer.notes) {
      lines.push("*Observação:*");
      lines.push(customer.notes);
      lines.push("");
    }

    lines.push(`*TOTAL: ${window.PMUtils.formatCurrency(total)}*`);

    return lines.join("\n");
  }

  function buildOrderLink(orderData) {
    const message = buildMessage(orderData);
    const phone = window.STORE_CONFIG.phone.whatsapp;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  // Para produtos com "Preço a definir" (ver priceTBD em menu-data.js):
  // em vez de adicionar ao carrinho com um preço inventado, o cliente
  // pergunta o valor direto pelo WhatsApp da loja.
  function buildAskPriceLink(productName, quantity, notes) {
    const qtyLabel = quantity && quantity > 1 ? `${quantity}x ` : "";
    let text = `Olá! Gostaria de saber o preço de: ${qtyLabel}${productName}.`;
    if (notes) text += ` Obs: ${notes}`;
    const phone = window.STORE_CONFIG.phone.whatsapp;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  return { buildMessage, buildOrderLink, buildAskPriceLink };
})();
