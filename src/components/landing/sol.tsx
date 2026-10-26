import Link from "next/link";
import { ArrowRight, Baby, Car, Laptop, ShoppingBag, Sun, Thermometer, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Titulo } from "@/components/ui/primitivos";

/* Escala de índice UV da OMS: faixas e cores oficiais. */
const ESCALA_UV = [
  { faixa: "0–2", nivel: "Baixo", cor: "#3ea72d", largura: 3 },
  { faixa: "3–5", nivel: "Moderado", cor: "#fff300", largura: 3 },
  { faixa: "6–7", nivel: "Alto", cor: "#f18b00", largura: 2 },
  { faixa: "8–10", nivel: "Muito alto", cor: "#e53210", largura: 3 },
  { faixa: "11+", nivel: "Extremo", cor: "#b567a4", largura: 3 },
];

const NUMEROS = [
  {
    icone: Sun,
    valor: "até 99%",
    titulo: "dos raios UV barrados",
    texto: "Conforme a ficha técnica da linha escolhida. Inclui o UVA, que o vidro comum deixa passar.",
  },
  {
    icone: Thermometer,
    valor: "menos calor",
    titulo: "no banco, no painel e no sofá",
    texto: "Parte da energia do sol volta para fora antes de esquentar o ambiente, e o ar-condicionado trabalha menos.",
  },
  {
    icone: UserRound,
    valor: "pele e olhos",
    titulo: "protegidos todo dia",
    texto: "Menos exposição para quem passa horas no trânsito ou trabalha perto da janela.",
  },
];

const PARA_QUEM = [
  { icone: Car, texto: "Motoristas de app, táxi e quem roda o dia todo" },
  { icone: Baby, texto: "Famílias com crianças no banco de trás" },
  { icone: Laptop, texto: "Home office ao lado da janela" },
  { icone: ShoppingBag, texto: "Lojas e vitrines que desbotam no sol" },
];

/**
 * Seção "Sol do Rio e sua pele": explica o UV de forma simples e honesta, com a escala oficial da OMS,
 * links para as fontes (CPTEC/INPE e INCA) e sem prometer que a película substitui o protetor solar.
 */
export function ProtecaoSolar() {
  return (
    <section id="protecao-uv" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#fbf7ef] via-[#fff6dc] to-[#fbf7ef]">
      <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#ffd76a]/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <figure className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/rio-sol-carro.webp"
            alt="Ilustração de uma motorista sorrindo dentro do carro com película, enquanto o sol forte bate no vidro na orla do Rio"
            loading="lazy"
            className="aspect-square w-full rounded-[3px] object-cover shadow-[0_40px_80px_-40px_rgba(180,120,0,.55)]"
          />
          <figcaption className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-[3px] bg-white px-4 py-3 text-[13px] text-tx shadow-[0_20px_40px_-24px_rgba(14,22,36,.5)] sm:left-auto sm:right-6 sm:max-w-xs">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ffd54a] to-[#f59e0b] text-white">
              <Sun className="h-5 w-5" aria-hidden />
            </span>
            O sol bate no vidro. A película segura o UV e boa parte do calor.
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8">
          <Titulo
            eyebrow="Sol do Rio e sua pele"
            titulo={<>O vidro comum deixa passar <em>o raio que envelhece.</em></>}
            descricao="O vidro do carro e da janela segura boa parte do UVB, mas o UVA atravessa e chega na pele, mesmo com o ar ligado. É ele que causa manchas e envelhecimento precoce. A película certa barra esse raio sem deixar o vidro escuro demais."
          />

          {/* escala UV da OMS com a marca do verão carioca */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-tx4">
              <span>Índice UV</span>
              <span className="text-[#8e3f84]">Rio no verão: 11+</span>
            </div>
            <div className="relative">
              <div className="flex h-3 overflow-hidden rounded-full" aria-hidden>
                {ESCALA_UV.map((e) => (
                  <span key={e.faixa} style={{ background: e.cor, flex: e.largura }} />
                ))}
              </div>
              <span className="absolute -top-1.5 right-[7%] h-6 w-1 rounded-full bg-tx shadow-[0_0_0_3px_#fff]" aria-hidden />
            </div>
            <ul className="grid grid-cols-5 text-[10.5px] leading-tight text-tx3 sm:text-[11.5px]">
              {ESCALA_UV.map((e) => (
                <li key={e.faixa} className="flex flex-col">
                  <span className="font-mono font-semibold text-tx">{e.faixa}</span>
                  {e.nivel}
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {NUMEROS.map((n) => (
              <li key={n.valor} className="flex flex-col gap-2 rounded-[3px] border border-[#f5b301]/25 bg-white/80 p-5 backdrop-blur">
                <n.icone className="h-5 w-5 text-[#e09a00]" strokeWidth={1.6} aria-hidden />
                <p className="font-serif text-[1.9rem] font-normal leading-none text-tx">{n.valor}</p>
                <p className="text-[13px] font-semibold text-tx">{n.titulo}</p>
                <p className="text-[12.5px] leading-relaxed text-tx3">{n.texto}</p>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <p className="rotulo">Para quem faz mais diferença</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {PARA_QUEM.map((p) => (
                <li key={p.texto} className="flex items-center gap-3 text-[14px] text-tx2">
                  <p.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
                  {p.texto}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="#orcamento">
                Quero proteção UV <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="contorno">
              <Link href="/pelicula">Simular preço do carro</Link>
            </Button>
          </div>

          <p className="text-[12px] leading-relaxed text-tx4">
            A película soma proteção onde você passa mais tempo, mas não substitui o protetor solar. O câncer de pele é o tipo mais frequente no Brasil, segundo o{" "}
            <a className="underline underline-offset-2 hover:text-tx" href="https://www.gov.br/inca/pt-br/assuntos/cancer/tipos/pele-nao-melanoma" target="_blank" rel="noreferrer">INCA</a>. Escala de índice UV da OMS; previsão diária no{" "}
            <a className="underline underline-offset-2 hover:text-tx" href="https://satelite.cptec.inpe.br/uv/" target="_blank" rel="noreferrer">CPTEC/INPE</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
