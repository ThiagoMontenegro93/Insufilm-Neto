"use client";

/**
 * Insulfilm automotivo: valor fechado pelo porte do veículo, definido pelo dono no Creator Hub.
 * Porte sem preço (caminhão, frota) vira "sob consulta" e o botão leva direto ao WhatsApp.
 */
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";
import { brl } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Opcao } from "./calculadora-auto";
import { ResumoOrcamento } from "./resumo-orcamento";

export function CalculadoraInsulfilm() {
  const { config } = usePlataforma();
  const { portes } = config.servicos;
  const [porteId, setPorteId] = useState((portes.find((x) => x.id === "seda") ?? portes[0])?.id ?? "");
  const [comAntivandalismo, setComAntivandalismo] = useState(false);
  const [modelo, setModelo] = useState("");

  const porte = portes.find((x) => x.id === porteId) ?? portes[0];
  if (!porte) return null;

  const temAv = porte.precoAntivandalismo > 0;
  const linhas = [
    ...(porte.precoInsulfilm > 0 ? [{ rotulo: `Insulfilm · ${porte.nome}${modelo ? ` (${modelo})` : ""}`, valor: porte.precoInsulfilm }] : []),
    ...(comAntivandalismo && temAv ? [{ rotulo: `Antivandalismo · ${porte.nome}`, valor: porte.precoAntivandalismo }] : []),
  ];
  const total = linhas.reduce((t, l) => t + l.valor, 0);
  const wa = `https://wa.me/${config.site.whatsappComercial}?text=${encodeURIComponent(`Olá, JR Filmes! Quero orçamento de insulfilm para ${porte.nome.toLowerCase()}${modelo ? ` (${modelo})` : ""}.`)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        <section className="vidro flex flex-col gap-4 p-5">
          <span className="rotulo">01 · Porte do veículo</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Porte do veículo">
            {portes.map((x) => (
              <Opcao
                key={x.id}
                on={porteId === x.id}
                onClick={() => setPorteId(x.id)}
                titulo={x.nome}
                valor={x.precoInsulfilm > 0 ? brl(x.precoInsulfilm) : "sob consulta"}
                sub={x.exemplos}
              />
            ))}
          </div>
          <label className="flex flex-col gap-2">
            <span className="sr-only">Modelo</span>
            <input className="campo" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo do carro (opcional)" />
          </label>
        </section>

        {temAv && (
          <section className="vidro flex flex-col gap-3 p-5">
            <span className="rotulo">02 · Proteção extra</span>
            <button
              type="button"
              role="switch"
              aria-checked={comAntivandalismo}
              onClick={() => setComAntivandalismo((v) => !v)}
              className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color] duration-150",
                comAntivandalismo ? "border-neon/60 bg-neon/[0.08]" : "border-linha/[0.08] bg-linha/[0.02] hover:border-linha/20",
              )}
            >
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-tx">Somar película antivandalismo</span>
                <span className="text-xs text-tx4">Segura os cacos se o vidro for quebrado</span>
              </span>
              <span className="num shrink-0 font-mono text-sm text-neon">+{brl(porte.precoAntivandalismo)}</span>
            </button>
          </section>
        )}
      </div>

      {total > 0 ? (
        <ResumoOrcamento servico={`insulfilm automotivo (${porte.nome})`} total={total} linhas={linhas} />
      ) : (
        <aside className="vidro-forte flex flex-col gap-4 p-5 sm:p-6 lg:sticky lg:top-24">
          <span className="rotulo">Seu orçamento</span>
          <p className="text-2xl font-bold tracking-tight text-tx">Sob consulta</p>
          <p className="text-sm leading-relaxed text-tx3">
            {porte.nome} tem vidros e área muito diferentes de um carro para outro. Mande o modelo e fotos dos vidros e receba o valor no mesmo dia.
          </p>
          <Button asChild variante="esmeralda" tamanho="lg">
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden /> Pedir valor no WhatsApp
            </a>
          </Button>
        </aside>
      )}
    </div>
  );
}
