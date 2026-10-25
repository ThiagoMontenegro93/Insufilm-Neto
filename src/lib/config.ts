/**
 * Configuração da plataforma editada no Creator Hub.
 * É a única fonte de preços e taxas: calculadoras, reels e dashboards leem daqui.
 */

export type UnidadePreco = "m2" | "fixo";

export interface ItemPreco {
  id: string;
  nome: string;
  descricao: string;
  unidade: UnidadePreco;
  preco: number; // em reais
}

/** Linha de película antivandalismo vendida como pacote (carro) ou por m² (imóvel). */
export interface LinhaAntivandalismo {
  id: string;
  nome: string;
  uso: string;
  unidade: "veiculo" | "m2";
  especificacoes: string[];
  garantiaAnos: number;
  /** Preço à vista (PIX ou espécie), em reais. 0 = sob consulta. */
  precoVista: number;
  /** Preço no cartão, em reais. 0 = sem opção parcelada exibida. */
  precoCartao: number;
  parcelas: number;
}

export interface Acabamento {
  id: string;
  nome: string;
  adicionalM2: number;
}

export type StatusApi = "OK" | "NAO_CONFIGURADO";

export interface IntegracaoApi {
  id: string;
  nome: string;
  finalidade: string;
  envVar: string;
  status: StatusApi;
  chaveMascarada: string;
  oficial: boolean;
}

export interface Nicho {
  id: string;
  nome: string;
  ativo: boolean;
  mensagemModelo: string;
}

export interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface PlatformConfig {
  versao: number;
  taxas: {
    plataformaPct: number;
    indicadorPct: number;
    mensalidadeFilial: number;
    descontoCupomPct: number;
  };
  servicos: {
    peliculaSeguranca: ItemPreco[];
    envelopamento: {
      marcas: ItemPreco[];
      acabamentos: Acabamento[];
      m2MedioTotal: number;
    };
    arquitetonico: ItemPreco[];
    antivandalismo: LinhaAntivandalismo[];
  };
  financeiro: {
    saqueMinimo: number;
    idadeMinima: number;
    duplaConfirmacaoPix: boolean;
    kycObrigatorio: boolean;
    autoAprovacaoAte: number;
  };
  apis: IntegracaoApi[];
  nichos: Nicho[];
  prospeccao: {
    areaPadrao: string;
    scoreMinimo: number;
    exigirOptOut: boolean;
  };
  site: {
    nome: string;
    slogan: string;
    whatsappComercial: string;
    garantiaAnos: number;
    /** Região atendida em domicílio (casa, empresa, garagem). */
    areaDomicilio: string;
    /** Endereços dos pontos de instalação fixos. Vazio = "consulte o mais próximo". */
    pontosInstalacao: { nome: string; endereco: string }[];
  };
  modulos: Modulo[];
}

export const CONFIG_PADRAO: PlatformConfig = {
  versao: 3,
  taxas: {
    plataformaPct: 30,
    indicadorPct: 5,
    mensalidadeFilial: 97,
    descontoCupomPct: 0,
  },
  servicos: {
    peliculaSeguranca: [
      { id: "jateada", nome: "Jateada", descricao: "Privacidade com luz natural", unidade: "m2", preco: 90 },
      { id: "antivandalismo", nome: "Antivandalismo", descricao: "Protege contra impactos e riscos", unidade: "m2", preco: 120 },
      { id: "alta-rigidez", nome: "Alta Rigidez", descricao: "Ultra resistente, o vidro não estilhaça", unidade: "m2", preco: 180 },
    ],
    envelopamento: {
      marcas: [
        { id: "3m-1080", nome: "3M 1080", descricao: "Vinil cast premium", unidade: "m2", preco: 120 },
        { id: "avery", nome: "Avery Dennison", descricao: "Supreme Wrapping Film", unidade: "m2", preco: 110 },
        { id: "oracal", nome: "Oracal", descricao: "Linha 970 RA", unidade: "m2", preco: 100 },
      ],
      acabamentos: [
        { id: "brilho", nome: "Brilho", adicionalM2: 0 },
        { id: "fosco", nome: "Fosco", adicionalM2: 10 },
        { id: "cromado", nome: "Cromado", adicionalM2: 40 },
      ],
      m2MedioTotal: 15,
    },
    arquitetonico: [
      { id: "parede", nome: "Parede", descricao: "Mármore, madeira, cimento queimado", unidade: "m2", preco: 90 },
      { id: "movel", nome: "Móvel / Armário", descricao: "Portas, gavetas e laterais", unidade: "m2", preco: 110 },
      { id: "objeto", nome: "Objeto", descricao: "Bancadas, ilhas e peças avulsas", unidade: "m2", preco: 100 },
      { id: "geladeira", nome: "Geladeira", descricao: "Envelopamento completo, valor fechado", unidade: "fixo", preco: 650 },
      { id: "porta", nome: "Porta", descricao: "Uma folha, frente e verso", unidade: "fixo", preco: 180 },
    ],
    // Preços em 0 = "sob consulta" até o dono definir no Creator Hub.
    antivandalismo: [
      {
        id: "carro",
        nome: "Carros",
        uso: "Vidros laterais e traseiro",
        unidade: "veiculo",
        especificacoes: ["Poliéster de segurança transparente ou fumê", "Segura os cacos se o vidro for quebrado", "Dentro da transparência exigida pelo CONTRAN", "Aplicação no mesmo dia, com hora marcada"],
        garantiaAnos: 5,
        precoVista: 0,
        precoCartao: 0,
        parcelas: 10,
      },
      {
        id: "casa",
        nome: "Casas e apartamentos",
        uso: "Janelas, portas de vidro e varandas",
        unidade: "m2",
        especificacoes: ["Transparente, quase invisível", "Protege a família de estilhaços", "Bloqueia até 99% dos raios UV", "Aplicação sem tirar o vidro do lugar"],
        garantiaAnos: 5,
        precoVista: 0,
        precoCartao: 0,
        parcelas: 10,
      },
      {
        id: "loja",
        nome: "Lojas e vitrines",
        uso: "Vitrines, portas e divisórias de vidro",
        unidade: "m2",
        especificacoes: ["Atrasa a abertura do vão em tentativa de furto", "Opção com controle solar para a vitrine não desbotar", "Aplicação fora do horário de funcionamento", "Vitrine continua limpa e transparente"],
        garantiaAnos: 5,
        precoVista: 0,
        precoCartao: 0,
        parcelas: 10,
      },
      {
        id: "fachada",
        nome: "Fachadas de vidro",
        uso: "Prédios, portarias, halls e condomínios",
        unidade: "m2",
        especificacoes: ["Visita técnica e medição no local", "Opções transparente, fumê ou espelhada", "Execução por etapas, sem parar o prédio", "Registro com fotos de cada vão aplicado"],
        garantiaAnos: 5,
        precoVista: 0,
        precoCartao: 0,
        parcelas: 10,
      },
    ],
  },
  financeiro: {
    saqueMinimo: 20,
    idadeMinima: 18,
    duplaConfirmacaoPix: true,
    kycObrigatorio: true,
    autoAprovacaoAte: 100,
  },
  apis: [
    { id: "mapbox", nome: "Mapbox", finalidade: "Mapas e rotas, cálculo de deslocamento", envVar: "MAPBOX_TOKEN", status: "OK", chaveMascarada: "pk.eyJ1I…", oficial: true },
    { id: "google-places", nome: "Google Places API", finalidade: "Busca por área e avaliações", envVar: "GOOGLE_PLACES_API_KEY", status: "OK", chaveMascarada: "AIza…", oficial: true },
    { id: "brasilapi", nome: "BrasilAPI / Minha Receita", finalidade: "Dados públicos de CNPJ", envVar: "", status: "OK", chaveMascarada: "pública", oficial: true },
    { id: "whatsapp-cloud", nome: "WhatsApp Cloud API", finalidade: "Mensagens modelo aprovadas, com opt-out", envVar: "WHATSAPP_CLOUD_TOKEN", status: "NAO_CONFIGURADO", chaveMascarada: "", oficial: true },
    { id: "email", nome: "E-mail transacional (SMTP/Resend)", finalidade: "Contato com o e-mail público do site", envVar: "SMTP_URL", status: "NAO_CONFIGURADO", chaveMascarada: "", oficial: true },
    { id: "r2", nome: "Cloudflare R2", finalidade: "Fotos antes/depois e vídeos", envVar: "R2_ACCESS_KEY_ID", status: "OK", chaveMascarada: "r2-…", oficial: true },
    { id: "stripe", nome: "Stripe", finalidade: "Recorrência por filial e Clube Condomínio", envVar: "STRIPE_SECRET_KEY", status: "NAO_CONFIGURADO", chaveMascarada: "", oficial: true },
  ],
  nichos: [
    { id: "oficina", nome: "Oficina mecânica", ativo: true, mensagemModelo: "Olá, {empresa}! Vi a nota {avaliacao} de vocês no Google. Seus clientes perguntam sobre película e envelopamento?" },
    { id: "condominio", nome: "Condomínio", ativo: true, mensagemModelo: "Olá, {empresa}! Temos película de segurança para portarias e áreas comuns, com garantia de 5 anos." },
    { id: "autopecas", nome: "Autopeças", ativo: true, mensagemModelo: "Olá, {empresa}! Que tal indicar película e envelopamento e ganhar 5% por serviço fechado?" },
    { id: "consultorio", nome: "Consultório", ativo: false, mensagemModelo: "Olá, {empresa}! Película jateada dá privacidade à recepção sem perder a luz natural." },
    { id: "envelopamento", nome: "Envelopamento automotivo", ativo: true, mensagemModelo: "Olá, {empresa}! A JR Filmes tem programa de indicação com repasse por PIX. Vamos conversar?" },
    { id: "marcenaria", nome: "Marcenaria", ativo: true, mensagemModelo: "Olá, {empresa}! Envelopamento arquitetônico renova móveis sem obra. Vamos conversar?" },
    { id: "vidracaria", nome: "Vidraçaria", ativo: true, mensagemModelo: "Olá, {empresa}! Indique película de segurança aos seus clientes e receba comissão." },
    { id: "geladeira", nome: "Assistência de geladeira", ativo: false, mensagemModelo: "Olá, {empresa}! Envelopamos geladeiras por valor fechado. Parceria?" },
    { id: "arquiteto", nome: "Arquiteto", ativo: true, mensagemModelo: "Olá, {empresa}! Temos vinis de mármore e madeira para seus projetos, aplicados em 1 dia." },
  ],
  prospeccao: {
    areaPadrao: "Tijuca, Rio de Janeiro",
    scoreMinimo: 70,
    exigirOptOut: true,
  },
  site: {
    nome: "JR Filmes",
    slogan: "Proteção • Estilo • Sofisticação",
    whatsappComercial: "5521000000000",
    garantiaAnos: 5,
    areaDomicilio: "Rio de Janeiro e região",
    pontosInstalacao: [],
  },
  modulos: [
    { id: "agenda", nome: "Agenda de aplicação", descricao: "Encaixe de horários por filial e aplicador", ativo: true },
    { id: "clube", nome: "Clube Condomínio", descricao: "Plano recorrente para condomínios via Stripe", ativo: false },
    { id: "garantia", nome: "Garantia digital", descricao: "Certificado com QR Code por serviço", ativo: true },
    { id: "galeria", nome: "Galeria antes/depois", descricao: "Fotos e vídeos no Cloudflare R2", ativo: true },
    { id: "rotas", nome: "Rotas Mapbox", descricao: "Taxa de deslocamento calculada pela distância", ativo: false },
    { id: "avaliacoes", nome: "Avaliações Google", descricao: "Pedido de avaliação após o serviço", ativo: false },
    { id: "estoque", nome: "Estoque de bobinas", descricao: "Metros por marca e lote", ativo: false },
    { id: "ranking", nome: "Ranking de parceiros", descricao: "Quem mais indica no mês", ativo: true },
    { id: "cupons", nome: "Cupons de indicação", descricao: "Desconto ao cliente indicado", ativo: true },
    { id: "relatorios", nome: "Relatórios financeiros", descricao: "Split, repasses e mensalidades por filial", ativo: false },
  ],
};

/** Itens de preço por id, procurando em todas as linhas de serviço. */
export function encontrarItem(config: PlatformConfig, id: string): ItemPreco | undefined {
  const { peliculaSeguranca, envelopamento, arquitetonico } = config.servicos;
  return [...peliculaSeguranca, ...envelopamento.marcas, ...arquitetonico].find((i) => i.id === id);
}
