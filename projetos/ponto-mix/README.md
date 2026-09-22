# Ponto Mix — Site Completo

Site institucional + cardápio digital + carrinho + checkout com finalização via WhatsApp, para a hamburgueria **Ponto Mix**.

Site 100% estático (HTML/CSS/JS puro, sem build step) — pode ser hospedado em qualquer hospedagem de sites estáticos (Hostinger, Netlify, Vercel, GitHub Pages, etc.), bastando enviar os arquivos.

---

## 1. Estrutura do projeto

```
ponto-mix/
├── index.html                 # Estrutura semântica de todo o site
├── css/
│   ├── fonts.css                # @font-face das fontes auto-hospedadas (ver seção 2)
│   ├── style.css               # Design tokens (cores, tipografia, spacing) + reset + layout base
│   ├── components.css          # Todos os componentes visuais (header, hero, cardápio, modal, carrinho, checkout...)
│   └── animations.css          # Reveals, microinterações, keyframes
├── js/
│   ├── data/
│   │   ├── store-config.js     # ÚNICA fonte de dados da loja (nome, WhatsApp, endereço, modalidades...)
│   │   └── menu-data.js        # ÚNICA fonte do cardápio (categorias, produtos, adicionais, promoções, avaliações)
│   ├── modules/
│   │   ├── utils.js            # Helpers (formatação de moeda, placeholders de imagem, toast, etc.)
│   │   ├── icons.js            # Helper que gera <svg><use> a partir do sprite de ícones do HTML
│   │   ├── cart.js             # Estado central do carrinho (fonte única de verdade)
│   │   ├── menu-render.js      # Renderiza cardápio a partir de menu-data.js
│   │   ├── product-modal.js    # Modal de personalização de produto
│   │   ├── cart-ui.js          # Drawer do carrinho + botão flutuante + contador do header
│   │   ├── checkout.js         # Fluxo de checkout (modalidade → dados → resumo)
│   │   ├── whatsapp.js         # Geração da mensagem e do link wa.me
│   │   └── reveal.js           # Reveal de seções ao rolar a página
│   └── main.js                 # Bootstrap: conecta tudo
├── fonts/
│   ├── *.woff2                 # Arquivos das fontes Permanent Marker + Plus Jakarta Sans, auto-hospedados (ver seção 2)
│   └── licenses/                # Licenças originais das fontes (Apache 2.0 / SIL OFL 1.1)
└── images/
    ├── logo/                   # Logo (placeholder — TODO substituir)
    ├── hero/                   # Foto do produto usada no Hero (enviada pelo cliente)
    ├── ui/                     # Assets de interface enviados pelo cliente (ex.: botao-manda-ver.png/.webp do botão "Manda ver")
    └── burgers|combos|sides|drinks|desserts|pizzas|pasteis/  # Imagens de produtos (placeholders — TODO substituir)
```

Essa separação existe para que **nenhuma alteração de conteúdo exija tocar em código**: produtos, preços e dados da loja vivem só em `js/data/`.

---

## 2. Tecnologias utilizadas

- **HTML5 semântico** (`header`, `main`, `section`, `footer`, `article`, `aside`, `dialog` via `role="dialog"`)
- **CSS3 puro** — variáveis nativas (design tokens), Grid, Flexbox, `clamp()` para tipografia fluida, sem framework/build step
- **JavaScript vanilla (ES6+)**, modular via IIFEs (`window.PM*`), sem dependência de bundler
- **Fontes auto-hospedadas** — Permanent Marker e Plus Jakarta Sans ficam em `fonts/` (arquivos `.woff2`), carregadas via `css/fonts.css`. O site não depende mais do Google Fonts: funciona normalmente até em redes que bloqueiam domínios do Google, e carrega um pouco mais rápido (uma conexão a menos). Os arquivos vieram do [Fontsource](https://fontsource.org), que redistribui as mesmas fontes do Google Fonts com a licença original — ambas de código aberto e livres para uso comercial (ver seção "Decisões de design principais")
- **Foto real no Hero** — imagem de produto enviada pelo cliente (`images/hero/`), servida em `<picture>` com WebP + JPEG e três larguras (600/800/918px) para carregar rápido em qualquer tela
- **Sistema de ícones próprio** — um único sprite SVG (`<symbol>`) no início do `<body>` substitui todos os emojis do site; cada ícone é desenhado uma vez e reaproveitado via `<use>`, tanto no HTML estático quanto no JS (`js/modules/icons.js`) — zero biblioteca de ícones de terceiros, zero emoji. Hoje são 20 ícones (cardápio, contato, carrinho, avaliações, navegação e os três adicionados para as novas categorias: pizza, taça de vinho, pastel)
- **localStorage** — persistência do carrinho entre sessões
- **API do WhatsApp (`wa.me`)** — finalização de pedido, sem backend

Nenhum backend, banco de dados ou build step é necessário. O site é puramente estático.

---

## 3. Skills e princípios de design aplicados

- **frontend-design**: identidade visual própria (preto puro + dourado de chapa + creme), tipografia com personalidade (Permanent Marker para impacto + Plus Jakarta Sans para leitura), estrutura de layout assimétrica em vez do padrão "card genérico"
- **frontend-architecture-master / ecc-frontend-patterns**: separação dados/UI, estado centralizado do carrinho (fonte única de verdade), módulos independentes e reutilizáveis
- **ui-ux-animation-expert / animate**: hierarquia de intensidade de movimento (Hero impactante, cardápio sutil, carrinho responsivo, microinterações nos botões), tudo com propósito e sem exagero
- **performance-engineer**: lazy loading de imagens dos produtos, foto do Hero em WebP/JPEG responsivo (3 larguras) com `fetchpriority="high"` só nela, sprite único de ícones SVG (zero requisição por ícone), CSS sem frameworks pesados, payload total enxuto
- **webapp-testing**: suíte de testes end-to-end com Playwright cobrindo todo o fluxo de compra (ver seção 9)
- **accessibility-review**: auditoria WCAG 2.1 AA com axe-core — 0 violações encontradas nos estados testados (ver seção 9)

### Decisões de design principais

- **Paleta**: preto puro (`#000000`) como cor principal, dourado de chapa (`#e3a730`) como cor de marca, creme quente (`#faf6ec`) para contraste
- **Tipografia**: Permanent Marker (traço de marcador/pincel, casual e com atitude, reforça o "sabor da rua" do briefing) para headlines grandes (h1–h4), Plus Jakarta Sans para tudo que precisa ser lido — duas famílias, papéis claramente distintos. Ambas são de código aberto e livres para uso comercial sem nenhuma pendência de licenciamento (Permanent Marker: Apache 2.0; Plus Jakarta Sans: SIL Open Font License 1.1) — diferente da fonte "Road Rage" pedida inicialmente, que no dafont.com é apenas para uso pessoal (uso comercial exigiria licença paga direto com o autor). Os arquivos das duas fontes ficam auto-hospedados dentro do próprio site (`fonts/`, ver seção 2) em vez de carregados do Google Fonts — mais rápido e sem dependência de domínio externo; as licenças originais de cada fonte ficam em `fonts/licenses/`
- **Estrutura visual**: bordas tracejadas em forma de "carimbo" nas promoções, faixa quadriculada usada com moderação, textura de grão sutil no fundo — reforçam a identidade "hamburgueria artesanal" sem recorrer a glassmorphism/gradientes excessivos
- **Hero com foto real**: a peça central do Hero é a foto do produto enviada pelo cliente (hambúrguer + batata + copo com a marca impressa), grande e sem moldura; o texto de impacto ("A fome bate, a gente destrói.") e a chamada ("Manda ver") foram recriados como texto HTML de verdade — não fazem parte da imagem — para continuarem editáveis, acessíveis a leitores de tela e indexáveis por buscadores
- **Ícones de linha exclusivos**: nenhum emoji no site — todo indicador visual (categorias do cardápio, formas de pedido, contato, avaliações, botões de fechar/voltar) usa um ícone de linha desenhado especificamente para a Ponto Mix, com aparência consistente em qualquer sistema operacional ou navegador
- **Cardápio ampliado a partir dos flyers enviados pelo cliente**: 5 categorias novas de conteúdo (Combos VIP, Combos Artesanais, Brotinho/mini pizzas, Pastéis Salgados, Bebidas Alcoólicas) mais 4 hambúrgueres artesanais novos, totalizando 60 produtos adicionados. Nenhum desses itens tinha preço nos materiais recebidos — em vez de inventar um valor, todos entraram com `priceTBD: true` (ver seção 8), exibindo "Preço a definir" e um botão direto para perguntar o valor pelo WhatsApp já configurado do cliente ((74) 99160-8952 — o único número usado no site, mesmo os flyers de combos trazendo um número diferente)
- **Preços reais aplicados a partir da lista enviada pelo cliente**: numa rodada seguinte, o cliente enviou os preços reais de ~35 itens (parte deles já existentes no cardápio como `priceTBD`, parte novos). Cada item recebeu `price` real e, quando o cliente informou um valor promocional ("de R$ X por R$ Y"), a tag `tags: ["promoção"]` foi adicionada (mostra o selo dourado "Promoção" no card — mesmo padrão visual já usado no Combo do Dia). ~30 produtos que não tinham equivalente no cardápio (ex.: Pastel Pizza, Pastel Romeu e Julieta, Big, Mix Bruno, Coxinha, Budweiser, Coca-Cola 1L etc.) foram criados do zero com nome, descrição e preço reais.
- **Itens de exemplo removidos**: o site partiu de um cardápio-modelo (ver aviso no topo de `js/data/menu-data.js`) usado só para demonstrar o funcionamento das categorias antes de qualquer dado real chegar. A pedido do cliente, todos os 15 produtos que ainda eram desse cardápio de exemplo — nunca confirmados pelo cliente — foram removidos: X-Tudo Ponto Mix, Clássico Mix, Duplo Cheddar, Bacon Supreme, Veggie Mix, Combo Casal, Combo Solo, Batata Frita Pequena, Batata Frita Grande, Onion Rings, Refrigerante — Lata (genérico), Refrigerante — 600ml (genérico), Suco Natural (genérico), Brownie com Sorvete e Milkshake. O cardápio agora só tem os produtos vindos dos flyers e da lista de preços reais enviados pelo cliente — nenhum dado inventado.

> **Nota sobre a identidade visual**: o Instagram da Ponto Mix (mencionado no briefing) não foi recebido nesta sessão de desenvolvimento. A paleta preto/dourado/branco segue exatamente o que foi especificado no briefing. A foto do Hero (`images/hero/`) já é real, enviada pelo cliente; a logo e as fotos individuais de cada produto no cardápio (`images/logo/`, `images/burgers/` etc.) ainda são placeholders — assim que estiverem disponíveis, basta substituir os arquivos mantendo os mesmos nomes (veja seção 6) — a estrutura já está pronta para isso.

---

## 4. Como funciona o Hero (foto + texto real)

Arquivo: `index.html` (`.hero__content` e `.hero__visual`, dentro de `<section class="hero">`) + `css/components.css` (`.hero__inner`, `.hero__visual`, `.hero__illustration`) + `images/hero/`.

- **Foto, não ilustração**: o Hero usa a foto de produto enviada pelo cliente (hambúrguer duplo com bacon + batata frita + copo com a marca impressa), exibida sem corte, na proporção nativa do arquivo (`aspect-ratio: 1618 / 972` em `.hero__visual`). Uma versão anterior dessa mesma campanha tinha um texto ("A fome bate, a gente destrói...") desenhado dentro da imagem — esse texto foi **recriado como HTML de verdade** em `.hero__content` (headline, subtítulo e botão), em vez de ficar preso em pixels. Isso mantém o texto selecionável, acessível a leitores de tela, indexável por buscadores e fácil de editar depois, sem precisar reabrir nenhum editor de imagem.
- **Formatos responsivos**: a foto é servida via `<picture>` com WebP (mais leve) e fallback JPEG, em três larguras (600/800/1618px) — o navegador baixa só o tamanho necessário para a tela do visitante. Para trocar a foto no futuro, basta substituir os arquivos em `images/hero/` (mantendo os mesmos nomes), ajustando `width`/`height` do `<img>` e o `aspect-ratio` de `.hero__visual` se a proporção da nova foto for diferente.
- **Sem moldura, propositalmente**: `.hero__visual` não tem borda, fundo, sombra de card ou `border-radius` — a foto fica solta sobre o fundo preto da página, "sangrando" até a borda direita da viewport em telas ≥ 941px (`margin-right` negativo), para parecer maior e mais integrada ao layout. Em mobile, o limite de largura da imagem é 560px.
- **Selo "Mais pedido"**: o destaque foi pensado para marcar um produto de verdade no cardápio (`tags: ["mais pedido"]` em `js/data/menu-data.js`), em vez de ficar preso na foto do Hero. Nenhum produto está marcado assim no momento (o item que tinha essa tag era um item de exemplo do cardápio-modelo, removido a pedido do cliente) — basta adicionar `"mais pedido"` ao array `tags` do produto real que mais vende para o selo dourado aparecer no card dele.
- **Botão "Manda ver" com arte pronta (`.brush-btn`, componente reutilizável)**: depois de iterar em versões com pincelada + texto em HTML por cima, o cliente enviou uma arte já finalizada (pincelada + o texto "Manda ver" + a seta, tudo desenhado na própria imagem) e pediu pra substituir o botão por ela diretamente. O componente ficou mais simples: `images/ui/botao-manda-ver.png` (com fallback `.webp` mais leve via `<picture>`) é usado como está, sem nenhum texto em HTML sobreposto — `width: 100%; height: auto` no `<img>` preserva a proporção original do arquivo (redimensionei a arte enviada, que veio em ~1735×906px, para 700×366px antes de salvar, só pra não carregar um arquivo desnecessariamente grande num botão pequeno — sem recortar nem alterar o conteúdo visual). Como o texto agora é só pixel (não dá pra leitor de tela "ler"), o nome acessível do link vem de `aria-label="Manda ver — ir para o cardápio"` no `<a>` (a imagem tem `alt=""` pra não duplicar). Estrutura: `<div class="brush-button-wrapper"><a class="brush-btn" aria-label="..."><picture>…<img class="brush-btn__bg"></picture></a></div>`. Tamanho: `width: min(220px, 62vw)` no desktop e `width: min(58vw, 200px)` no mobile. CSS em `css/components.css`, logo após `.hero__ctas`. O botão secundário "Fazer Pedido" que ficava ao lado foi removido a pedido do cliente — o Hero agora tem só a chamada principal ("Manda ver"), que continua levando ao cardápio (`href="#cardapio"`); o atalho de "ir direto pro checkout se já tiver item no carrinho" que esse botão oferecia (`setupHeroCta()` em `js/main.js`) foi removido junto, já que dependia dele. No hover/foco, a imagem cresce sutilmente (`scale(1.03)`, sem glow/sombra); a entrada tem uma animação leve (`@keyframes brush-btn-in`, fade + scale), e tudo respeita `prefers-reduced-motion`. `.brush-btn` é um componente independente (não depende de `.btn`/`.btn-primary`) pensado para ser reaproveitado em outro botão do site — bastaria repetir a mesma estrutura com outra imagem/`aria-label`/`href`.

---

## 5. Como funciona o carrinho

Arquivo central: `js/modules/cart.js` (estado) + `js/modules/cart-ui.js` (interface).

- **Fonte única de verdade**: `window.PMCart` guarda a lista de itens e expõe `addItem`, `updateQuantity`, `incrementQuantity`, `removeItem`, `clear`, `getState()`. Nenhum outro módulo mantém sua própria cópia do carrinho — Menu, Modal de Produto, Drawer e Checkout todos leem o mesmo estado.
- **Agrupamento inteligente**: adicionar o mesmo produto duas vezes com os **mesmos** adicionais/observações soma a quantidade na mesma linha; com adicionais/observações **diferentes**, vira uma linha separada (permite pedir "2 Mix-Tudo, um sem cebola e outro com bacon extra", por exemplo).
- **Persistência**: o carrinho é salvo em `localStorage` a cada alteração (`pontomix.cart.v1`) e recuperado automaticamente ao recarregar a página. Se o navegador bloquear localStorage (modo privado), o carrinho segue funcionando normalmente em memória durante a sessão.
- **Interface**:
  - Desktop: drawer lateral (`#cart-drawer`), aberto pelo botão do header.
  - Mobile: o mesmo drawer ocupa a tela toda, mais um **botão flutuante** (`#cart-fab`) que mostra contagem e total, sempre visível quando há itens.
  - Estado vazio: mensagem "Seu carrinho está vazio" com CTA "Ver cardápio".
- **Reatividade**: qualquer mudança no carrinho notifica automaticamente a UI via `subscribe()` — não há necessidade de chamar renderizações manualmente espalhadas pelo código.

---

## 6. Como funciona o checkout

Arquivo: `js/modules/checkout.js`.

Fluxo em 3 etapas, cada uma validada antes de avançar:

1. **Modalidade** — Entrega / Retirada no local / Comer no local (lidas de `STORE_CONFIG.orderTypes`; desativar uma modalidade é só colocar `enabled: false` em `store-config.js`).
2. **Dados do cliente** — os campos mudam de acordo com a modalidade escolhida (`fieldsForType()`), sem tocar nas outras modalidades:
   - Entrega: nome, telefone, endereço, número, bairro, complemento, referência, observações.
   - Retirada: nome, telefone, observações — mais um bloco com o endereço/horário do estabelecimento (lidos de `STORE_CONFIG`).
   - Comer no local: nome, número da mesa, observações.
   - Validação client-side simples: campos obrigatórios vazios são destacados com mensagem de erro.
3. **Revisão** — resumo dos itens, subtotal, taxa (se aplicável) e total, além dos dados informados. O botão final chama `finalize()`.

**Taxa de entrega**: propositalmente **não inventada**. `STORE_CONFIG.orderTypes.delivery.feeMode` começa como `"unset"` (mostra "A combinar"). A estrutura já suporta:
- `feeMode: "flat"` + `flatFee: 5` → taxa fixa para qualquer bairro.
- `feeMode: "byNeighborhood"` + `feesByNeighborhood: { "Centro": 5, "Bairro X": 8 }` → taxa por bairro, usando o valor que o cliente digitou no campo "Bairro".

---

## 7. Como o WhatsApp é gerado

Arquivo: `js/modules/whatsapp.js`.

- `buildMessage()` monta o texto formatado (itens, adicionais, observações, subtotal, modalidade, taxa, dados do cliente, total) seguindo exatamente o formato pedido no briefing.
- `buildOrderLink()` codifica essa mensagem com `encodeURIComponent` e monta o link `https://wa.me/5574991608952?text=...` — o número vem **sempre** de `STORE_CONFIG.phone.whatsapp`, nunca hardcoded em outro lugar.
- Ao finalizar, o site abre esse link em uma nova aba (`window.open(url, "_blank")`) — o WhatsApp Web ou o app abrem com a mensagem **já preenchida**, pronta para o cliente apenas apertar enviar. Não há nenhuma API fictícia envolvida: é o mecanismo oficial e público do WhatsApp (`wa.me`).
- Após o envio, o carrinho é limpo automaticamente.

---

## 8. Onde alterar informações

### Produtos, preços, categorias, adicionais e promoções
→ `js/data/menu-data.js`

- Editar um produto existente: altere o objeto correspondente (`name`, `description`, `ingredients`, `price`, `image`, `tags`).
- Adicionar um produto novo: adicione um objeto ao array `products` da categoria desejada — aparece automaticamente no cardápio, sem tocar em nenhum componente.
- Adicionar uma categoria nova: adicione um objeto a `MENU_CATEGORIES` com um `id` único — nav, âncoras e grid são gerados automaticamente. Um campo opcional `note` exibe um aviso abaixo do título da categoria (usado hoje em "Bebidas Alcoólicas" para o aviso de +18).
- **Chips de observação rápida** ("Sem cebola", "Bem passado" etc., no modal de produto): vêm do array `QUICK_NOTES` e só aparecem em categorias que fazem sentido para eles. Uma categoria com `showQuickNotes: false` (hoje: Bebidas, Bebidas Alcoólicas, Sobremesas) não mostra nenhum chip — só o campo de texto livre, que continua disponível em todo produto. Para dar um conjunto de chips diferente a uma categoria específica (ex.: chips próprios para os brotinhos/pizzas), crie um novo array de textos em `menu-data.js` e ajuste a linha `const quickNotes = ...` em `js/modules/product-modal.js` para escolher o array certo por categoria.
- **Produto sem preço definido**: use `price: null` + `priceTBD: true` em vez de inventar um valor. O site troca automaticamente o preço por "Preço a definir" no card e no modal, desativa o "Adicionar ao carrinho" (não há valor para somar) e mostra um botão "Perguntar no WhatsApp" que abre o WhatsApp da loja com o nome do produto já preenchido. Assim que o preço real existir, basta preencher `price` com o número e remover `priceTBD: true` — o produto volta a poder ir para o carrinho normalmente.
- Adicionar/editar adicionais: `ADDON_LIBRARY`, organizados por grupo (`burger`, `sides`, etc.) e referenciados no produto via `addonsGroup`. Produtos com `priceTBD: true` usam `addonsGroup: null` (o valor final ainda não é conhecido, então adicionais ficam desativados até o preço ser definido).
- Promoções: array `PROMOTIONS` — desativar uma promoção é só `active: false`.
- Avaliações: array `REVIEWS` — substitua os itens marcados `mock: true` por avaliações reais quando disponíveis.

### Dados da loja (nome, WhatsApp, Instagram, endereço, horário, modalidades)
→ `js/data/store-config.js`

Esse arquivo é a **única fonte** desses dados em todo o projeto — o número de WhatsApp, por exemplo, nunca está hardcoded em nenhum outro arquivo.

Campos marcados `TODO: SUBSTITUIR PELO DADO REAL` ainda não foram informados e precisam ser preenchidos antes de publicar o site (endereço completo, horário de funcionamento, logo real).

### Imagens de produtos e logo
→ pasta `images/`

Basta substituir o arquivo no caminho já referenciado em `menu-data.js`/`store-config.js` (ex.: `images/burgers/mix-tudo.svg` → sua foto real, pode ser `.jpg`/`.png`/`.webp`, só ajuste a extensão no dado do produto). Enquanto uma imagem real não existir naquele caminho, o site exibe automaticamente um placeholder estilizado (não uma imagem quebrada) — não é necessário nenhum ajuste de código quando a foto real chegar.

---

## 9. Testes e revisão de qualidade realizados

Suíte de testes end-to-end (Playwright) cobrindo:

- ✅ Adicionar produto / adicionar vários produtos diferentes
- ✅ Produto com adicionais e observações (modal de personalização)
- ✅ Aumentar / diminuir quantidade (recalcula subtotal corretamente)
- ✅ Remover produto do carrinho
- ✅ Cálculo de subtotal e total
- ✅ Carrinho vazio (estado e CTA)
- ✅ Seleção das 3 modalidades (Entrega, Retirada, Comer no local)
- ✅ Validação de formulário (campos obrigatórios)
- ✅ Geração da mensagem e do link do WhatsApp (número e URL encoding corretos)
- ✅ Carrinho é limpo após o pedido ser enviado
- ✅ Responsividade em 320/375/390/414/768/1024/1280/1440/1920px, sem overflow horizontal e sem erros de JS
- ✅ Foto do Hero (com texto real sobreposto) renderiza corretamente em todas as larguras testadas, sem quebrar o layout
- ✅ Nenhum emoji no site — todos os ícones (cardápio, formas de pedido, contato, avaliações) usam o sprite SVG próprio
- ✅ Produtos com `priceTBD: true` mostram "Preço a definir", não têm botão "Adicionar" (não vão para o carrinho) e abrem o WhatsApp corretamente com o nome do produto ao clicar em "Perguntar"
- ✅ As 5 categorias novas (Combos VIP, Combos Artesanais, Brotinho, Pastéis Salgados, Bebidas Alcoólicas) aparecem na navegação e renderizam todos os produtos sem erros de console
- ✅ Produtos atualizados com preço real (ex.: Mix-Frango, Mix-Bacon, Pastel de Frango, Combo do Cavalo etc.) passam a exibir o preço em R$ e o botão "+ Adicionar" normal, com o cálculo de carrinho e total corretos; produtos ainda sem preço informado continuam com "Preço a definir" e "Perguntar"
- ✅ 93 produtos no total (após a remoção dos itens de exemplo), todos com `id` único e caminho de imagem válido (verificado programaticamente)
- ✅ Fontes auto-hospedadas: `document.fonts` confirma Permanent Marker e Plus Jakarta Sans carregando dos arquivos locais em `fonts/`, sem nenhuma requisição de rede externa e sem erros de console — o site funciona 100% offline de qualquer domínio do Google

**Resultado: 44/44 verificações funcionais aprovadas.**

**Acessibilidade** — auditoria WCAG 2.1 AA (axe-core) em 4 estados diferentes (página completa, carrinho aberto, modal de produto aberto, checkout no mobile): **0 violações**. Durante a auditoria, dois problemas reais foram corrigidos:
- Controles interativos aninhados no card de produto (botão "Adicionar" dentro de um cartão inteiro clicável) — resolvido separando o card em duas áreas de clique independentes.
- Elementos focáveis dentro de painéis fechados (drawer/modal/checkout) continuavam alcançáveis via Tab — resolvido usando o atributo `inert` nesses painéis quando fechados.

---

## 10. Como fazer o deploy

Por ser um site 100% estático, o deploy é simples:

1. Preencha os campos `TODO` em `js/data/store-config.js` (endereço, horário, logo real) e `js/data/menu-data.js` (cardápio real, se for diferente do exemplo).
2. Envie a pasta inteira do projeto (mantendo a estrutura de subpastas) para a hospedagem escolhida:
   - **Hostinger / hospedagem compartilhada**: envie os arquivos via FTP/gerenciador de arquivos para a pasta pública do domínio (ex.: `public_html`).
   - **Netlify/Vercel**: arraste a pasta do projeto no painel, ou conecte um repositório Git — nenhuma configuração de build é necessária (é servido como está).
   - **GitHub Pages**: suba os arquivos para um repositório e ative o Pages apontando para a raiz.
3. Não há variáveis de ambiente, backend ou banco de dados — o site funciona assim que os arquivos estão publicados.

---

## 11. Próximos passos sugeridos

- Substituir logo, fotos de produtos e foto do estabelecimento pelos originais.
- Preencher endereço, horário de funcionamento e definir o modelo de taxa de entrega em `store-config.js`.
- Substituir o cardápio de exemplo pelo cardápio real da Ponto Mix.
- Coletar e inserir avaliações reais de clientes.
