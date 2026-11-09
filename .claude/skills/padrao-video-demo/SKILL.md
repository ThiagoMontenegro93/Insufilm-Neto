---
name: padrao-video-demo
description: Padrão de vídeo de demonstração de serviço (película, insulfilm, envelopamento, box). Use ao criar qualquer vídeo ou demo interativa de serviço para um cliente: estrutura, formatos, ritmo, legendas e entrega.
---

# Padrão de vídeo de demonstração de serviço

Use junto com uma skill de roteiro do serviço (`roteiro-envelopamento`, `roteiro-insulfilm`, `roteiro-pelicula-box`) e com as skills do Remotion (`remotion-create`, `remotion-best-practices`, `remotion-render`).

## Antes de começar, confirme (ou assuma e declare)
- Cliente: nome, logo, cores, WhatsApp e Instagram. Se não houver, use espaços reservados claros (`LOGO_CLIENTE`, `WHATSAPP_AQUI`).
- Formato: 9:16 (1080x1920) para Reels/Stories/TikTok por padrão; 16:9 (1920x1080) para YouTube e site; 1:1 para feed.
- Duração: 15 s, 30 s (padrão) ou 60 s.
- Fonte das imagens: (a) só animação, (b) filmagens reais do profissional em `assets/videos/`, (c) misto.

## Honestidade visual
- Nunca invente filmagem realista de pessoa trabalhando. Use animação/ilustração/3D, ou as filmagens reais fornecidas.
- Não use logos de marcas de película (3M, Avery, XPEL etc.) sem o cliente confirmar que revende a marca.
- Não prometa garantia, prazo ou preço que o cliente não informou.

## Estrutura (30 s)
1. **Gancho (0–3 s)**: o problema visível. Ex.: carro desbotado, sol forte no vidro, box sem proteção.
2. **Promessa (3–6 s)**: o resultado em uma frase.
3. **Processo (6–22 s)**: 3 a 5 etapas da skill de roteiro, uma cena cada, com legenda curta.
4. **Antes × depois (22–27 s)**: cortina deslizante ou divisão de tela.
5. **Chamada (27–30 s)**: logo, WhatsApp, "Agende sua aplicação".

Para 15 s: gancho, 2 etapas, antes × depois, chamada. Para 60 s: todas as etapas e um bloco de benefícios.

## Ritmo e texto
- Uma ideia por cena; legendas de no máximo 6 palavras, sentence case.
- Sempre legendar: a maioria assiste sem som (use `remotion-captions` quando houver narração).
- Áreas seguras em 9:16: nada importante nos 250 px de cima nem nos 350 px de baixo.
- Corte a cada 1,5–3 s. Câmera lenta só no momento de impacto (vinil assentando, película fechando a borda).

## Visual
- Fundo escuro grafite, acento na cor do cliente, brilho/reflexo especular para sugerir película.
- Movimentos com easing suave; um único "momento uau" por vídeo.

## Versão interativa (página web)
Quando pedirem "demo interativa": página HTML única, mobile-first, com
- comparador antes × depois arrastável;
- etapas navegáveis (toque para avançar) com a animação de cada etapa;
- pontos clicáveis no carro/vidro explicando cada área;
- botão de WhatsApp fixo.
Opcionalmente embutir o vídeo com `@remotion/player` (ver `remotion-interactivity`).

## Entrega
- Composições em `video/src/` (uma por serviço e formato), render em `video/out/<servico>-<formato>.mp4`.
- Comprimir para redes: H.264, CRF 23, preset veryfast, AAC 128k.
- Rodar `npx remotion render` e conferir pelo menos 3 frames (início, meio, fim) antes de declarar pronto.
