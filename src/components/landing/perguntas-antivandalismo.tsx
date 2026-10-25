"use client";

import { ListaPerguntas } from "@/components/landing/marca";
import { usePlataforma } from "@/lib/store";

export function PerguntasAntivandalismo() {
  const { config } = usePlataforma();
  const itens = [
    { p: "A película antivandalismo é blindagem?", r: "Não. Ela não para tiros e não deixa o vidro inquebrável. O que ela faz é segurar os cacos quando o vidro quebra, dificultar e atrasar a abertura do vão e evitar ferimentos com estilhaços." },
    { p: "Pode ser aplicada no carro?", r: "Sim, nos vidros laterais e no traseiro, respeitando os limites de transparência do CONTRAN. Existem versões transparentes e versões com escurecimento, para quem também quer privacidade e menos calor." },
    { p: "Muda a aparência da fachada ou da vitrine?", r: "A versão transparente fica quase invisível e não altera a fachada. Também é possível combinar com controle solar ou com efeito espelhado, se o objetivo for reduzir calor e aumentar a privacidade." },
    { p: "Quanto custa?", r: "O valor depende da metragem, do tipo de vidro e da espessura da película. Mande fotos e medidas pelo WhatsApp ou peça uma visita técnica, e o orçamento sai no mesmo dia." },
    { p: "Precisa tirar o vidro do lugar?", r: "Não. A aplicação é feita no vidro instalado, pelo lado de dentro, sem obra e sem quebra-quebra. Em fachadas grandes, combinamos o melhor horário para não atrapalhar o movimento." },
    { p: "Tem garantia?", r: `Sim, até ${config.site.garantiaAnos} anos conforme a linha escolhida, com certificado de garantia entregue na instalação.` },
  ];
  return <ListaPerguntas itens={itens} />;
}
