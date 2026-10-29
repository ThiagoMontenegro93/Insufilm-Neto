# JR Filmes // NEXUS

**Proteção • Estilo • Sofisticação** · *Seu estilo, nossa expertise.*

Site e plataforma de indicação e gestão da JR Filmes: insulfilm automotivo, envelopamento automotivo e de superfícies, películas residenciais e comerciais e revestimentos decorativos. Atendimento **em domicílio** ou **em pontos de instalação**. Interface 100% em português do Brasil, valores em reais (R$).

## Identidade visual

- Preto profundo (`#050505`), metal escovado prata (gradiente `--cromo`) e acento dourado (`#D4AF6A`, gradiente `--ouro`).
- Tipografia: Saira expandida, itálica e extra negrito para títulos e logotipo (`.display`), Montserrat no corpo, Great Vibes só na assinatura "Seu estilo, nossa expertise.", JetBrains Mono para códigos e valores.
- Logotipo "JR FILMES" desenhado em CSS (texto cromado + corte dourado), sem arquivo de imagem. Para usar o logotipo oficial em vetor, troque o componente `Logo` em `src/components/layout/navegacao.tsx`.
- Tokens em `tailwind.config.ts` (`ouro`, `prata`; `neon` é um apelido do dourado) e `src/app/globals.css`.

## Status: Etapa 1

| Área | Rota | Estado |
| --- | --- | --- |
| Landing (logotipo cromado, faixa de 6 benefícios, 5 serviços em painéis diagonais, atendimento em domicílio ou em ponto de instalação com pedido de orçamento, stories Proteção/Estilo/Sofisticação, sequências antes/depois, comparativo de películas, timeline de indicação, dúvidas frequentes, bottom nav) | `/` | Pronta |
| Calculadora película de segurança | `/pelicula` | Pronta |
| Calculadora envelopamento automotivo | `/envelopamento` | Pronta |
| Calculadora envelopamento arquitetônico | `/arquitetonico` | Pronta |
| Creator Hub (9 abas, SUPER_ADMIN) | `/admin/creator` | Pronta (modo demonstração) |
| Auditoria `CONFIG_PLATAFORMA_ALTERADA` | `/admin/auditoria` | Pronta (modo demonstração) |
| Prospecção por área / CNPJ com dupla validação | `/admin/prospeccao` | Interface pronta; Google Places e BrasilAPI ligados no servidor |
| Painel do parceiro (saldo, PIX com dupla confirmação, indicar, timeline) | `/parceiro/dashboard` | Pronto com dados de exemplo |
| Banco (Prisma), login (NextAuth), API de config | `prisma/`, `src/app/api` | Base pronta |

**Modo demonstração:** sem `DATABASE_URL` e `NEXTAUTH_SECRET`, a configuração do Creator Hub fica no navegador (localStorage) e o `/admin` fica aberto, com aviso na tela. Isso permite revisar o produto inteiro sem infraestrutura. Em produção, defina as variáveis e o middleware passa a exigir `SUPER_ADMIN`.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Componentes no estilo shadcn (Radix + `class-variance-authority`), Framer Motion, ícones Lucide
- Prisma + PostgreSQL · NextAuth (credenciais, JWT com papel)
- Integrações oficiais: Google Places API, BrasilAPI/minha-receita, WhatsApp Cloud API, Cloudflare R2, Stripe, Mapbox
- Testes de regra de negócio com Vitest

## Estrutura

```
src/
  app/
    page.tsx                      landing
    pelicula/ envelopamento/ arquitetonico/   calculadoras
    admin/creator|prospeccao|auditoria        painel SUPER_ADMIN
    parceiro/dashboard            painel do indicador
    entrar/                       login
    api/config                    GET público / PUT com auditoria
    api/prospeccao/area|cnpj      Google Places / BrasilAPI + validação do site
    api/auth/[...nextauth]
  components/
    ui/          Button, Cartao, Selo, Campo, Interruptor, BarraProgresso
    layout/      NavTopo, NavInferior (glass, 5 ícones), Rodape, CabecalhoPagina
    landing/     Hero, StoriesPilares, TimelineEtapas, Reel/GaleriaReels
    calc/        CalculadoraM2, CalculadoraAuto, ResumoOrcamento
    admin/       CreatorHub, PainelProspeccao, ListaAuditoria
    parceiro/    DashboardParceiro
  lib/
    config.ts    configuração padrão (taxas, preços, regras, APIs, nichos, módulos)
    pricing.ts   split e preços em centavos
    referral.ts  telefone normalizado + código IND-AAAAMMDD-CODIGO-NNN
    payout.ts    regras de saque PIX, CPF, tipo de chave
    prospect.ts  score da dupla validação, CNPJ
    store.tsx    estado da config + log de auditoria (modo demonstração)
    server/      Prisma, NextAuth, leitura do site oficial
prisma/schema.prisma
```

## Regras de negócio (testadas em `src/lib/__tests__`)

- **Split:** serviço R$ 1.000 = plataforma 30% (R$ 300) + indicador 5% (R$ 50) + locatário 65% (R$ 650). O locatário fica com o resto, então a soma sempre fecha. Cálculo em centavos inteiros.
- **Envelopamento:** `m² × (valor base da marca + adicional do acabamento)`. Civic total fosco 3M: 15 m² × (120 + 10) = R$ 1.950 → você R$ 585 + indicador R$ 97,50.
- **Arquitetônico:** geladeira R$ 650 fixo → R$ 195 + R$ 32,50. Parede 3 × 2 m = 6 m² × R$ 90 = R$ 540 → R$ 162 + R$ 27.
- **Rastreio:** telefone normalizado (`21999998888`, sem máscara e sem 55) preso ao código `IND-20240512-JORG-001`. Telefone já indicado não gera nova indicação (a primeira ganha).
- **PIX:** mínimo R$ 20, idade mínima 18, KYC (selfie + CPF) antes do primeiro saque, dupla confirmação (o parceiro digita os 4 últimos caracteres da chave), aprovação automática até R$ 100 e manual acima disso.
- **Prospecção:** só dispara com as duas validações (Google + site oficial), score ≥ 70 e sem opt-out.
- **Auditoria:** toda alteração salva gera `CONFIG_PLATAFORMA_ALTERADA` com snapshot JSON do antes e do depois.

## Prospecção e LGPD

Por decisão do projeto, a prospecção usa **somente APIs oficiais e dados públicos**:

- Google Places API (nome, endereço, nota, avaliações)
- BrasilAPI / minha-receita (dados públicos de CNPJ)
- Página inicial do site oficial da empresa (respeita `robots.txt`, timeout curto, bloqueio de endereços internos) para achar e-mail e WhatsApp que a própria empresa publica
- WhatsApp Cloud API com mensagem modelo aprovada e opção "SAIR" (opt-out)

Instagram e LinkedIn aparecem apenas como link para contato humano. Não há raspagem dessas redes nem disparo por WhatsApp não oficial (Baileys/WPPConnect), que violam os termos das plataformas e arriscam o banimento do número.

Outros cuidados: KYC fica em bucket privado do R2; o CPF é guardado como hash + 2 últimos dígitos; usuários têm soft delete para anonimização; leads com opt-out ficam bloqueados para sempre.

## Como rodar

```bash
npm install          # também roda prisma generate
cp .env.example .env.local   # opcional no modo demonstração
npm run dev          # http://localhost:3000
npm test             # regras de negócio
npm run build        # build de produção
```

Com banco:

```bash
# defina DATABASE_URL e NEXTAUTH_SECRET em .env.local
npm run db:push
```

## Deploy na Vercel

1. Importe o repositório na Vercel (framework Next.js detectado automaticamente).
2. Em *Settings → Environment Variables*, cadastre as variáveis do `.env.example` (sem aspas).
3. Banco: Neon, Supabase ou Vercel Postgres. Depois do primeiro deploy, rode `npx prisma db push` apontando para o banco de produção.
4. Crie o primeiro usuário `SUPER_ADMIN` direto no banco com a senha em hash bcrypt.

## Erros comuns

| Sintoma | Causa | Solução |
| --- | --- | --- |
| `/admin` abre sem login | `NEXTAUTH_SECRET` ausente (modo demonstração) | Defina a variável |
| Prospecção mostra dados de exemplo | `GOOGLE_PLACES_API_KEY` ausente | Crie a chave no Google Cloud com a Places API (New) ativa |
| `PUT /api/config` responde 503 | `DATABASE_URL` ausente | Configure o banco |
| `@prisma/client did not initialize` | `prisma generate` não rodou | `npm install` ou `npx prisma generate` |

## Próximas etapas

- **Etapa 2:** ligar Creator Hub e painel do parceiro ao banco (API de indicações, saques e lançamentos), login por papel, upload de KYC para o R2.
- **Etapa 3:** disparo pela WhatsApp Cloud API (templates, webhooks de status, opt-out automático), fila de leads.
- **Etapa 4:** Stripe (R$ 97/filial e Clube Condomínio), módulos da aba Módulos, relatórios financeiros.
