/**
 * Sistema de ícones únicos (linha, sem dependências externas) que substitui
 * todos os emojis do site. Os desenhos (paths) vivem uma única vez no sprite
 * <svg> injetado no início do <body> (ver index.html, id="icon-sprite"); aqui
 * ficam apenas os IDs válidos e um helper para gerar o <svg><use> certo em
 * qualquer lugar do JS, sem duplicar path data.
 */
window.PMIcons = (function () {
  // Precisa bater 1:1 com os <symbol id="icon-*"> definidos no sprite do HTML.
  var VALID_IDS = [
    "cart", "truck", "pin", "dine", "burger", "flame", "fries", "cup",
    "dessert", "chat", "camera", "chef", "close", "arrow-left",
    "arrow-right", "check", "star", "pizza", "wine", "pastel",
  ];

  function icon(name, extraClass) {
    var id = VALID_IDS.indexOf(name) !== -1 ? name : "dine";
    var cls = "icon-svg" + (extraClass ? " " + extraClass : "");
    return (
      '<svg class="' + cls + '" aria-hidden="true" focusable="false">' +
      '<use href="#icon-' + id + '"></use>' +
      "</svg>"
    );
  }

  return { icon: icon, VALID_IDS: VALID_IDS };
})();
