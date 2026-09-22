/**
 * ==========================================================================
 * CONFIGURAÇÃO CENTRAL DA LOJA — PONTO MIX
 * ==========================================================================
 * Este é o ÚNICO lugar que o proprietário precisa editar para atualizar
 * informações da loja (nome, contato, endereço, formas de pedido, etc.).
 * Nenhum outro arquivo deve ter esses dados "hardcoded".
 *
 * TODO: SUBSTITUIR PELO DADO REAL onde indicado abaixo. Os campos marcados
 * como TODO não foram fornecidos no briefing e usam texto provisório.
 * ==========================================================================
 */

window.STORE_CONFIG = {
  // Identidade
  name: "Ponto Mix",
  tagline: "Sabores que conquistam.",
  logo: {
    // TODO: SUBSTITUIR PELO DADO REAL — logo extraída do Instagram da loja
    src: "images/logo/logo-ponto-mix.svg",
    alt: "Ponto Mix — Hamburgueria Artesanal",
  },

  // Contato
  phone: {
    display: "(74) 99160-8952",
    whatsapp: "5574991608952", // formato internacional, sem espaços ou símbolos
  },
  instagram: {
    handle: "@ponto.mix",
    url: "https://instagram.com/ponto.mix",
  },

  // Endereço — TODO: SUBSTITUIR PELO DADO REAL (não informado no briefing)
  address: {
    street: "TODO: SUBSTITUIR PELO DADO REAL — Rua/Av. e número",
    neighborhood: "TODO: SUBSTITUIR PELO DADO REAL — Bairro",
    city: "TODO: SUBSTITUIR PELO DADO REAL — Cidade/UF",
    mapsUrl: "", // TODO: SUBSTITUIR PELO DADO REAL — link do Google Maps
  },

  // Horário de funcionamento — TODO: SUBSTITUIR PELO DADO REAL
  hours: [
    { days: "Terça a Domingo", time: "TODO: SUBSTITUIR PELO DADO REAL" },
  ],

  // Modalidades de pedido disponíveis (liga/desliga funcionalidades)
  orderTypes: {
    delivery: {
      enabled: true,
      label: "Entrega",
      icon: "truck", // chave do sprite de ícones (ver index.html #icon-sprite)
      description: "Receba no conforto da sua casa",
      // Taxa de entrega: mantenha null até que o proprietário defina valores reais.
      // Estrutura pronta para taxas por bairro quando esse dado existir.
      feeMode: "unset", // "unset" | "flat" | "byNeighborhood"
      flatFee: null,
      feesByNeighborhood: {
        // "Centro": 5.0,
      },
    },
    pickup: {
      enabled: true,
      label: "Retirada no local",
      icon: "pin",
      description: "Retire seu pedido diretamente no balcão",
    },
    dineIn: {
      enabled: true,
      label: "Comer no local",
      icon: "dine",
      description: "Peça e aproveite no nosso espaço",
    },
  },

  // Redes e avaliações — deixe preparado para inserir avaliações reais depois
  reviewsAreMock: true,

  // SEO
  seo: {
    title: "Ponto Mix — Hamburgueria Artesanal | Peça pelo WhatsApp",
    description:
      "Hambúrgueres artesanais, combos, porções e sobremesas da Ponto Mix. Monte seu pedido online e finalize direto pelo WhatsApp. Entrega, retirada ou consumo no local.",
    keywords:
      "hamburgueria, hambúrguer artesanal, lanches, delivery de hambúrguer, combo, Ponto Mix",
  },
};
