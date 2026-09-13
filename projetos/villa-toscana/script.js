(function(){
  "use strict";

  var WHATSAPP_NUMBER = "5574991608952";

  var CATEGORIES = [
    {id:"pizzas", label:"Pizzas Salgadas", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 3 20h18L12 2Z"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="10" cy="16" r="1.1" fill="currentColor" stroke="none"/><circle cx="14" cy="16" r="1.1" fill="currentColor" stroke="none"/></svg>'},
    {id:"doces", label:"Pizzas Doces", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11h16l-2 9H6l-2-9Z"/><path d="M4 11c0-4 3-7 8-7s8 3 8 7"/><path d="M12 4v0"/></svg>'},
    {id:"esfirras", label:"Esfirras", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 13c0-5 4-9 9-9s9 4 9 9c-2.5 2-6 3-9 3s-6.5-1-9-3Z"/><circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14.3" r="1" fill="currentColor" stroke="none"/></svg>'},
    {id:"porcoes", label:"Porções", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1.5 12a2 2 0 0 1-2 1.8h-5a2 2 0 0 1-2-1.8L6 8Z"/><path d="M8 8V5a4 4 0 0 1 8 0v3"/></svg>'},
    {id:"bebidas", label:"Bebidas", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 9h10l-1 11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 9Z"/><path d="M5 9h14l-1-4H6l-1 4Z"/></svg>'},
    {id:"drinks", label:"Drinks", icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16l-8 9-8-9Z"/><path d="M12 13v7M8 20h8"/></svg>'}
  ];

  // toppingColors reference the item's visual "photo" — a generated icon
  // standing in for a reference product photo, built from real toppings.
  var MENU = [
    {id:"p1", cat:"pizzas", name:"Margherita", desc:"Molho de tomate, mussarela, manjericão fresco, azeite", price:48, toppings:["cheese","basil","basil"]},
    {id:"p2", cat:"pizzas", name:"Calabresa", desc:"Molho de tomate, mussarela, calabresa fatiada, cebola", price:46, toppings:["pepperoni","onion","cheese","pepperoni"]},
    {id:"p3", cat:"pizzas", name:"Portuguesa", desc:"Presunto, ovos, cebola, azeitona, ervilha, mussarela", price:52, toppings:["ham","olive","onion","cheese","pea"]},
    {id:"p4", cat:"pizzas", name:"Frango com Catupiry", desc:"Frango desfiado, catupiry cremoso, milho", price:50, toppings:["chicken","cream","corn","chicken"]},
    {id:"p5", cat:"pizzas", name:"Quatro Queijos", desc:"Mussarela, provolone, parmesão e catupiry", price:54, toppings:["cheese","cheese","cream","cheese"]},
    {id:"p6", cat:"pizzas", name:"Toscana Especial", desc:"Linguiça toscana, pimentão, cebola roxa, azeitona preta", price:56, toppings:["pepperoni","pepper","onion","olive"]},
    {id:"p7", cat:"pizzas", name:"Pepperoni", desc:"Mussarela, pepperoni fatiado, orégano", price:50, toppings:["cheese","pepperoni","pepperoni","pepperoni"]},
    {id:"p8", cat:"pizzas", name:"Napolitana", desc:"Tomate fatiado, mussarela, parmesão, manjericão", price:48, toppings:["tomato","cheese","basil"]},
    {id:"p9", cat:"pizzas", name:"Vegetariana", desc:"Abobrinha, berinjela, pimentão, tomate seco, rúcula", price:50, toppings:["pepper","tomato","basil","onion"]},
    {id:"p10", cat:"pizzas", name:"Bacon com Cheddar", desc:"Mussarela, bacon crocante, cheddar cremoso", price:54, toppings:["cheese","bacon","cream","bacon"]},
    {id:"p11", cat:"pizzas", name:"Carne Seca com Catupiry", desc:"Carne seca desfiada, catupiry, cebola roxa", price:58, toppings:["ham","cream","onion"]},
    {id:"p12", cat:"pizzas", name:"Margherita Búfala", desc:"Mussarela de búfala, tomate cereja, manjericão, azeite trufado", price:62, toppings:["cheese","tomato","basil","basil"]},

    {id:"d1", cat:"doces", name:"Chocolate com Morango", desc:"Chocolate ao leite derretido, morangos frescos", price:46, toppings:["choc","choc"]},
    {id:"d2", cat:"doces", name:"Romeu e Julieta", desc:"Goiabada cremosa, mussarela", price:44, toppings:["cream","choc"]},
    {id:"d3", cat:"doces", name:"Banana com Canela", desc:"Banana caramelizada, canela, leite condensado", price:44, toppings:["cream","cream"]},
    {id:"d4", cat:"doces", name:"Chocolate Branco com Nutella", desc:"Camadas de chocolate branco e nutella", price:48, toppings:["cream","choc","cream"]},
    {id:"d5", cat:"doces", name:"Prestígio", desc:"Chocolate, coco ralado, leite condensado", price:46, toppings:["choc","cream"]},
    {id:"d6", cat:"doces", name:"Doce de Leite com Confeitos", desc:"Doce de leite cremoso, confeitos coloridos", price:44, toppings:["cream","cream","choc"]},

    {id:"es1", cat:"esfirras", name:"Esfirra de Carne", desc:"Massa artesanal recheada com carne temperada", price:7, toppings:["ham"]},
    {id:"es2", cat:"esfirras", name:"Esfirra de Frango com Catupiry", desc:"Frango desfiado e catupiry cremoso", price:7.5, toppings:["chicken","cream"]},
    {id:"es3", cat:"esfirras", name:"Esfirra de Queijo", desc:"Recheio generoso de mussarela", price:6.5, toppings:["cheese"]},
    {id:"es4", cat:"esfirras", name:"Esfirra de Calabresa", desc:"Calabresa moída com cebola", price:7, toppings:["pepperoni","onion"]},
    {id:"es5", cat:"esfirras", name:"Esfirra Vegetariana", desc:"Abobrinha, tomate e ervas", price:6.5, toppings:["tomato","basil"]},
    {id:"es6", cat:"esfirras", name:"Esfirra Doce de Chocolate", desc:"Massa fofinha recheada com chocolate", price:7, toppings:["choc"]},

    {id:"po1", cat:"porcoes", name:"Batata Frita Crocante", desc:"400g, porção individual ou para dividir", price:28, toppings:["fry"]},
    {id:"po2", cat:"porcoes", name:"Calabresa Acebolada", desc:"350g de calabresa fatiada na cebola", price:32, toppings:["pepperoni","onion"]},
    {id:"po3", cat:"porcoes", name:"Frango à Passarinho", desc:"400g de frango temperado e frito", price:34, toppings:["chicken"]},
    {id:"po4", cat:"porcoes", name:"Polenta Frita", desc:"350g de polenta crocante por fora, macia por dentro", price:26, toppings:["fry"]},
    {id:"po5", cat:"porcoes", name:"Bruschetta Toscana", desc:"4 unidades, tomate, manjericão e azeite", price:24, toppings:["tomato","basil"]},
    {id:"po6", cat:"porcoes", name:"Pão de Alho Artesanal", desc:"6 unidades, feito na casa", price:18, toppings:["fry"]},

    {id:"b1", cat:"bebidas", name:"Coca-Cola 2L", desc:"Garrafa 2 litros, gelada", price:14, toppings:["drink"]},
    {id:"b2", cat:"bebidas", name:"Guaraná Antarctica 2L", desc:"Garrafa 2 litros, gelada", price:13, toppings:["drink"]},
    {id:"b3", cat:"bebidas", name:"Coca-Cola Lata 350ml", desc:"Lata individual gelada", price:6, toppings:["drink"]},
    {id:"b4", cat:"bebidas", name:"Suco Natural de Laranja", desc:"500ml, feito na hora", price:10, toppings:["drink"]},
    {id:"b5", cat:"bebidas", name:"Água Mineral 500ml", desc:"Sem gás, gelada", price:4, toppings:["drink"]},
    {id:"b6", cat:"bebidas", name:"Água com Gás 500ml", desc:"Gelada", price:5, toppings:["drink"]},
    {id:"b7", cat:"bebidas", name:"Cerveja Long Neck", desc:"275ml, gelada", price:9, toppings:["drink"]},
    {id:"b8", cat:"bebidas", name:"Suco de Uva Integral", desc:"500ml, sem conservantes", price:10, toppings:["drink"]},

    {id:"dr1", cat:"drinks", name:"Caipirinha", desc:"Cachaça, limão, açúcar e gelo", price:18, toppings:["drink"]},
    {id:"dr2", cat:"drinks", name:"Caipiroska de Morango", desc:"Vodka, morango, limão e açúcar", price:20, toppings:["drink"]},
    {id:"dr3", cat:"drinks", name:"Gin Tônica", desc:"Gin, água tônica, limão siciliano e especiarias", price:24, toppings:["drink"]},
    {id:"dr4", cat:"drinks", name:"Aperol Spritz", desc:"Aperol, espumante, água com gás e laranja", price:26, toppings:["drink"]},
    {id:"dr5", cat:"drinks", name:"Negroni", desc:"Gin, vermute rosso e Campari", price:26, toppings:["drink"]},
    {id:"dr6", cat:"drinks", name:"Moscow Mule", desc:"Vodka, gengibre, limão e espuma cítrica", price:24, toppings:["drink"]}
  ];

  var TOPPING_COLOR = {
    cheese:"#f0dfa8", pepperoni:"#8f2e24", basil:"#5c7a4a", onion:"#e7d7ee",
    ham:"#d98f9a", olive:"#2c2a24", pea:"#7fae5c", chicken:"#e6c98a",
    cream:"#f5ecd8", corn:"#f0c23e", pepper:"#c65a2e", tomato:"#c0392b",
    bacon:"#a8452f", choc:"#5a3420", fry:"#e3b45a", drink:"#8fb2c9"
  };

  function money(n){ return "R$ " + n.toFixed(2).replace(".", ","); }

  function seedFrom(str){
    var h = 0;
    for (var i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
    return function(){ h = (h*1103515245 + 12345) >>> 0; return (h % 1000)/1000; };
  }

  function pizzaIconSVG(item){
    var rnd = seedFrom(item.id);
    var n = item.toppings.length;
    var dots = "";
    for (var i=0;i<n;i++){
      var angle = (i/n) * Math.PI*2 + rnd()*0.5;
      var radius = 16 + rnd()*8;
      var cx = 32 + Math.cos(angle)*radius;
      var cy = 32 + Math.sin(angle)*radius;
      var r = 3.4 + rnd()*1.6;
      var color = TOPPING_COLOR[item.toppings[i]] || "#e0d3ae";
      dots += '<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+color+'"/>';
    }
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="29" fill="#dcb877"/>' +
      '<circle cx="32" cy="32" r="25" fill="#a83226"/>' +
      '<circle cx="32" cy="32" r="22" fill="#efe0b0"/>' +
      dots +
      '<g stroke="#c99f5e" stroke-width="1.4" opacity="0.55">' +
      '<line x1="32" y1="4" x2="32" y2="60"/><line x1="4" y1="32" x2="60" y2="32"/>' +
      '<line x1="12" y1="12" x2="52" y2="52"/><line x1="52" y1="12" x2="12" y2="52"/>' +
      '</g></svg>';
  }

  function drinkIconSVG(){
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="29" fill="#213627"/>' +
      '<rect x="24" y="14" width="16" height="36" rx="4" fill="#8fb2c9"/>' +
      '<rect x="24" y="14" width="16" height="9" rx="4" fill="#c8dde6"/>' +
      '<rect x="26" y="27" width="12" height="4" fill="#213627" opacity="0.35"/>' +
      '</svg>';
  }

  // Demo photos: one representative photo per category, reused across every
  // item in it until the client supplies a unique photo for each product.
  var CATEGORY_PHOTO = {
    pizzas:"pizza-salgada.jpg",
    doces:"pizza-doce.jpg",
    esfirras:"pizza-salgada.jpg",
    porcoes:"porcao.jpg",
    bebidas:"bebida.jpg",
    drinks:"bebida.jpg"
  };
  function photoFor(item){
    return '<img src="' + CATEGORY_PHOTO[item.cat] + '" alt="' + item.name + '" loading="lazy">';
  }

  // ---- pizza builder: sizes, multi-flavor from M up, stuffed crust ----
  var SIZES = [
    {id:"P", name:"Pequena", sub:"1 sabor", mult:0.68, maxFlavors:1, allowBorda:false},
    {id:"M", name:"Média", sub:"até 2 sabores", mult:0.85, maxFlavors:2, allowBorda:true},
    {id:"G", name:"Grande", sub:"até 3 sabores", mult:1, maxFlavors:3, allowBorda:true}
  ];
  var BORDA_OPTIONS = [
    {id:"none", name:"Sem borda recheada", price:0},
    {id:"catupiry", name:"Catupiry", price:8},
    {id:"cheddar", name:"Cheddar", price:8},
    {id:"chocolate", name:"Chocolate", price:8}
  ];
  var PIZZA_FLAVORS = MENU.filter(function(m){ return m.cat === "pizzas" || m.cat === "doces"; });

  var cart = {}; // key -> {label, sub, price, qty}
  var activeFilter = "pizzas";

  function isPizzaCat(cat){ return cat === "pizzas" || cat === "doces"; }

  var catTabsEl = document.getElementById("catTabs");
  var menuGridEl = document.getElementById("menuGrid");

  function renderTabs(){
    catTabsEl.innerHTML = "";
    CATEGORIES.forEach(function(c){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cat-tab" + (c.id === activeFilter ? " active" : "");
      b.innerHTML = c.icon + "<span>" + c.label + "</span>";
      b.addEventListener("click", function(){
        activeFilter = c.id;
        renderTabs();
        renderMenu();
      });
      catTabsEl.appendChild(b);
    });
  }

  function buildItemCard(item){
    var card = document.createElement("article");
    card.className = "item-card";

    var photo = document.createElement("div");
    photo.className = "item-photo";
    photo.innerHTML = photoFor(item);

    var body = document.createElement("div");
    body.className = "item-body";
    var h = document.createElement("h3"); h.textContent = item.name;
    var p = document.createElement("p"); p.textContent = item.desc;
    var foot = document.createElement("div"); foot.className = "item-foot";

    if (isPizzaCat(item.cat)){
      var priceBlock = document.createElement("div");
      priceBlock.className = "price-block";
      priceBlock.innerHTML = '<span class="from-label">A partir de</span><span class="price">' + money(Math.round(item.price*SIZES[0].mult)) + '</span>';
      var buildBtn = document.createElement("button");
      buildBtn.className = "build-btn"; buildBtn.type = "button";
      buildBtn.textContent = "Montar pizza";
      buildBtn.addEventListener("click", function(){ openPizzaModal(item); });
      foot.appendChild(priceBlock);
      foot.appendChild(buildBtn);
    } else {
      var priceBlock2 = document.createElement("div");
      priceBlock2.className = "price-block";
      priceBlock2.innerHTML = '<span class="price">' + money(item.price) + '</span>';
      foot.appendChild(priceBlock2);
      foot.appendChild(controlFor(item));
    }

    body.appendChild(h); body.appendChild(p); body.appendChild(foot);
    card.appendChild(photo); card.appendChild(body);
    return card;
  }

  function renderMenu(){
    var items = MENU.filter(function(m){ return m.cat === activeFilter; });
    menuGridEl.innerHTML = "";
    items.forEach(function(item){ menuGridEl.appendChild(buildItemCard(item)); });
  }

  function controlFor(item){
    var entry = cart[item.id];
    var qty = entry ? entry.qty : 0;
    if (qty === 0){
      var addBtn = document.createElement("button");
      addBtn.className = "add-btn";
      addBtn.type = "button";
      addBtn.setAttribute("aria-label", "Adicionar " + item.name);
      addBtn.textContent = "+";
      addBtn.addEventListener("click", function(){
        cart[item.id] = {label:item.name, sub:null, price:item.price, qty:1};
        renderCart();
      });
      return addBtn;
    }
    var wrap = document.createElement("div");
    wrap.className = "qty-controls";
    var minus = document.createElement("button"); minus.type="button"; minus.textContent = "–";
    var span = document.createElement("span"); span.textContent = qty;
    var plus = document.createElement("button"); plus.type="button"; plus.textContent = "+";
    minus.addEventListener("click", function(){
      if (cart[item.id]){
        cart[item.id].qty = Math.max(0, cart[item.id].qty - 1);
        if (cart[item.id].qty === 0) delete cart[item.id];
      }
      renderCart();
    });
    plus.addEventListener("click", function(){
      cart[item.id] = cart[item.id] || {label:item.name, sub:null, price:item.price, qty:0};
      cart[item.id].qty += 1;
      renderCart();
    });
    wrap.appendChild(minus); wrap.appendChild(span); wrap.appendChild(plus);
    return wrap;
  }

  // ---- pizza builder modal ----
  var pmOverlay = document.getElementById("pmOverlay");
  var pmClose = document.getElementById("pmClose");
  var pmTitle = document.getElementById("pmTitle");
  var pmSizesEl = document.getElementById("pmSizes");
  var pmSizeHint = document.getElementById("pmSizeHint");
  var pmFlavorsEl = document.getElementById("pmFlavors");
  var pmFlavorLabel = document.getElementById("pmFlavorLabel");
  var pmBordaSection = document.getElementById("pmBordaSection");
  var pmBordaEl = document.getElementById("pmBorda");
  var pmPriceEl = document.getElementById("pmPrice");
  var pmAddBtn = document.getElementById("pmAdd");

  var pmState = { sizeId:"G", flavorIds:[], bordaId:"none" };

  function currentSize(){ return SIZES.filter(function(s){return s.id===pmState.sizeId;})[0]; }

  function openPizzaModal(item){
    pmState.sizeId = "G";
    pmState.flavorIds = [item.id];
    pmState.bordaId = "none";
    pmTitle.textContent = "Monte sua pizza";
    renderPmSizes();
    renderPmFlavors();
    renderPmBorda();
    updatePmPrice();
    pmOverlay.hidden = false;
  }

  function renderPmSizes(){
    pmSizesEl.innerHTML = "";
    SIZES.forEach(function(sz){
      var pill = document.createElement("div");
      pill.className = "size-pill" + (sz.id === pmState.sizeId ? " active" : "");
      pill.innerHTML = '<span class="sz-name">'+sz.id+'</span><span class="sz-sub">'+sz.sub+'</span>';
      pill.addEventListener("click", function(){
        pmState.sizeId = sz.id;
        if (pmState.flavorIds.length > sz.maxFlavors){
          pmState.flavorIds = pmState.flavorIds.slice(0, sz.maxFlavors);
        }
        if (!sz.allowBorda) pmState.bordaId = "none";
        renderPmSizes(); renderPmFlavors(); renderPmBorda(); updatePmPrice();
      });
      pmSizesEl.appendChild(pill);
    });
    var sz = currentSize();
    pmSizeHint.textContent = sz.maxFlavors === 1
      ? "Tamanho " + sz.name + ": escolha 1 sabor."
      : "Tamanho " + sz.name + ": combine até " + sz.maxFlavors + " sabores — vale o preço do sabor mais caro escolhido.";
  }

  function renderPmFlavors(){
    var sz = currentSize();
    pmFlavorLabel.textContent = "2. Escolha o" + (sz.maxFlavors > 1 ? "(s) sabor(es)" : " sabor") +
      " (" + pmState.flavorIds.length + "/" + sz.maxFlavors + ")";
    pmFlavorsEl.innerHTML = "";

    var groups = [
      {label:"Sabores salgados", cat:"pizzas"},
      {label:"Sabores doces", cat:"doces"}
    ];
    groups.forEach(function(g){
      var groupLabel = document.createElement("div");
      groupLabel.className = "flavor-group-label";
      groupLabel.textContent = g.label;
      pmFlavorsEl.appendChild(groupLabel);

      PIZZA_FLAVORS.filter(function(f){return f.cat === g.cat;}).forEach(function(flavor){
        var checked = pmState.flavorIds.indexOf(flavor.id) !== -1;
        var atMax = pmState.flavorIds.length >= sz.maxFlavors;
        var row = document.createElement("label");
        row.className = "flavor-row" + (!checked && atMax ? " disabled" : "");

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = checked;
        cb.addEventListener("change", function(){
          if (cb.checked){
            if (pmState.flavorIds.length >= sz.maxFlavors){
              if (sz.maxFlavors === 1){ pmState.flavorIds = [flavor.id]; }
            } else {
              pmState.flavorIds.push(flavor.id);
            }
          } else {
            pmState.flavorIds = pmState.flavorIds.filter(function(id){return id !== flavor.id;});
          }
          renderPmFlavors(); updatePmPrice();
        });

        var iconWrap = document.createElement("span");
        iconWrap.className = "fr-icon";
        iconWrap.innerHTML = photoFor(flavor);

        var name = document.createElement("span");
        name.className = "fr-name"; name.textContent = flavor.name;

        var pr = document.createElement("span");
        pr.className = "fr-price"; pr.textContent = money(flavor.price);

        row.appendChild(cb); row.appendChild(iconWrap); row.appendChild(name); row.appendChild(pr);
        pmFlavorsEl.appendChild(row);
      });
    });
  }

  function renderPmBorda(){
    var sz = currentSize();
    pmBordaSection.hidden = !sz.allowBorda;
    pmBordaEl.innerHTML = "";
    BORDA_OPTIONS.forEach(function(b){
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "borda-pill" + (pmState.bordaId === b.id ? " active" : "");
      pill.textContent = b.name + (b.price > 0 ? " (+" + money(b.price) + ")" : "");
      pill.addEventListener("click", function(){
        pmState.bordaId = b.id;
        renderPmBorda(); updatePmPrice();
      });
      pmBordaEl.appendChild(pill);
    });
  }

  function computePmPrice(){
    var sz = currentSize();
    var flavors = PIZZA_FLAVORS.filter(function(f){ return pmState.flavorIds.indexOf(f.id) !== -1; });
    if (flavors.length === 0) return {price:0, flavors:flavors};
    var maxBase = Math.max.apply(null, flavors.map(function(f){return f.price;}));
    var borda = BORDA_OPTIONS.filter(function(b){return b.id===pmState.bordaId;})[0];
    var bordaPrice = (sz.allowBorda && borda) ? borda.price : 0;
    var price = Math.round(maxBase * sz.mult) + bordaPrice;
    return {price:price, flavors:flavors, borda:(bordaPrice>0?borda:null)};
  }

  function updatePmPrice(){
    var calc = computePmPrice();
    pmPriceEl.textContent = money(calc.price);
    pmAddBtn.disabled = calc.flavors.length === 0;
  }

  pmAddBtn.addEventListener("click", function(){
    var sz = currentSize();
    var calc = computePmPrice();
    if (calc.flavors.length === 0) return;
    var flavorNames = calc.flavors.map(function(f){return f.name;});
    var key = "pizza:" + sz.id + ":" + calc.flavors.map(function(f){return f.id;}).sort().join("+") + ":" + pmState.bordaId;
    var label = "Pizza " + sz.name + " (" + flavorNames.join(" / ") + ")";
    var sub = calc.borda ? "Borda: " + calc.borda.name : null;
    if (cart[key]){
      cart[key].qty += 1;
    } else {
      cart[key] = {label:label, sub:sub, price:calc.price, qty:1};
    }
    pmOverlay.hidden = true;
    renderCart();
  });

  pmClose.addEventListener("click", function(){ pmOverlay.hidden = true; });
  pmOverlay.addEventListener("click", function(e){ if (e.target === pmOverlay) pmOverlay.hidden = true; });

  // ---- cart panel ----
  var cartFab = document.getElementById("cartFab");
  var cartCount = document.getElementById("cartCount");
  var cartOverlay = document.getElementById("cartOverlay");
  var cartItemsEl = document.getElementById("cartItems");
  var cartTotalEl = document.getElementById("cartTotal");
  var waBtn = document.getElementById("waBtn");
  var cartClose = document.getElementById("cartClose");
  var orderModePillsEl = document.getElementById("orderModePills");
  var orderModeHintEl = document.getElementById("orderModeHint");

  var ORDER_MODES = [
    {id:"entrega", label:"Entrega", hint:"Informe o endereço na mensagem para combinarmos a entrega."},
    {id:"retirada", label:"Retirar no local", hint:"Retirada na Villa Toscana — Povoado de Poços, Campo Formoso, BA."}
  ];
  var orderMode = "entrega";

  function renderOrderModePills(){
    orderModePillsEl.innerHTML = "";
    ORDER_MODES.forEach(function(mode){
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "order-mode-pill" + (orderMode === mode.id ? " active" : "");
      pill.textContent = mode.label;
      pill.addEventListener("click", function(){
        orderMode = mode.id;
        renderCart();
      });
      orderModePillsEl.appendChild(pill);
    });
    var active = ORDER_MODES.filter(function(m){return m.id===orderMode;})[0];
    orderModeHintEl.textContent = active ? active.hint : "";
  }

  function cartEntries(){
    return Object.keys(cart).map(function(key){
      var e = cart[key];
      return {key:key, label:e.label, sub:e.sub, price:e.price, qty:e.qty};
    });
  }

  function renderCart(){
    renderMenu();
    renderOrderModePills();
    var entries = cartEntries();
    var totalQty = entries.reduce(function(s,e){return s+e.qty;}, 0);
    var totalPrice = entries.reduce(function(s,e){return s+e.qty*e.price;}, 0);

    cartFab.hidden = totalQty === 0;
    cartCount.textContent = totalQty;
    cartTotalEl.textContent = money(totalPrice);

    cartItemsEl.innerHTML = "";
    if (entries.length === 0){
      var empty = document.createElement("div");
      empty.className = "cart-empty";
      empty.textContent = "Seu carrinho está vazio. Adicione itens do cardápio.";
      cartItemsEl.appendChild(empty);
    } else {
      entries.forEach(function(e){
        var row = document.createElement("div");
        row.className = "cart-row";
        var subLine = e.sub ? '<span class="p">'+e.sub+' · '+money(e.price)+' cada · '+money(e.price*e.qty)+'</span>'
                             : '<span class="p">'+money(e.price)+' cada · '+money(e.price*e.qty)+'</span>';
        row.innerHTML = '<div class="ci-name"><span class="n">'+e.qty+'x '+e.label+'</span>' + subLine + '</div>';
        var rm = document.createElement("button");
        rm.className = "remove"; rm.type="button"; rm.textContent = "✕";
        rm.setAttribute("aria-label","Remover "+e.label);
        rm.addEventListener("click", function(){
          delete cart[e.key];
          renderCart();
        });
        row.appendChild(rm);
        cartItemsEl.appendChild(row);
      });
    }

    if (totalQty === 0){
      waBtn.setAttribute("aria-disabled","true");
      waBtn.style.pointerEvents = "none";
      waBtn.style.opacity = "0.45";
      waBtn.removeAttribute("href");
    } else {
      waBtn.style.pointerEvents = "";
      waBtn.style.opacity = "";
      var lines = ["Olá! Gostaria de fazer o seguinte pedido na Villa Toscana:", ""];
      entries.forEach(function(e){
        lines.push(e.qty + "x " + e.label + (e.sub ? " — " + e.sub : "") + " — " + money(e.price*e.qty));
      });
      lines.push("");
      lines.push("Total: " + money(totalPrice));
      lines.push("");
      if (orderMode === "retirada"){
        lines.push("Forma de recebimento: Retirar no local (Povoado de Poços, Campo Formoso — BA)");
      } else {
        lines.push("Forma de recebimento: Entrega");
        lines.push("Endereço para entrega: ");
      }
      lines.push("Forma de pagamento: ");
      var text = encodeURIComponent(lines.join("\n"));
      waBtn.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
    }
  }

  var successToast = document.getElementById("successToast");
  var toastTimer = null;
  function showSuccessToast(){
    if (toastTimer) clearTimeout(toastTimer);
    successToast.hidden = false;
    requestAnimationFrame(function(){ successToast.classList.add("show"); });
    toastTimer = setTimeout(function(){
      successToast.classList.remove("show");
      setTimeout(function(){ successToast.hidden = true; }, 300);
    }, 3800);
  }

  waBtn.addEventListener("click", function(){
    if (waBtn.getAttribute("aria-disabled") === "true") return;
    // Let the WhatsApp link open first, then clear the order on the site
    // so a returning visitor sees a fresh cart instead of the old order.
    setTimeout(function(){
      cart = {};
      cartOverlay.hidden = true;
      renderCart();
      showSuccessToast();
    }, 250);
  });

  cartFab.addEventListener("click", function(){ cartOverlay.hidden = false; });
  cartClose.addEventListener("click", function(){ cartOverlay.hidden = true; });
  cartOverlay.addEventListener("click", function(e){ if (e.target === cartOverlay) cartOverlay.hidden = true; });

  renderTabs();
  renderCart();
})();
