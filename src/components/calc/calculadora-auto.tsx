"use client";

/**
 * Envelopamento automotivo: m² × (valor base da marca + adicional do acabamento).
 */
import { useState } from "react";
import { usePlataforma } from "@/lib/store";
import { brl, precoEnvelopamento } from "@/lib/pricing";
import { cn, num } from "@/lib/utils";
import { ResumoOrcamento } from "./resumo-orcamento";

export function Opcao({ on, onClick, titulo, valor, sub }: { on: boolean; onClick: () => void; titulo: string; valor: string; sub?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150",
        on ? "border-neon/60 bg-neon/[0.08] shadow-neon" : "border-linha/[0.08] bg-linha/[0.02] hover:border-linha/20",
      )}
    >
      <span className="font-semibold text-tx">{titulo}</span>
      <span className="num font-mono text-xs text-neon">{valor}</span>
      {sub && <span className="text-xs text-tx4">{sub}</span>}
    </button>
  );
}

export function CalculadoraAuto() {
  const { config } = usePlataforma();
  const { marcas, acabamentos, m2MedioTotal } = config.servicos.envelopamento;
  // Portes com área cadastrada no Creator Hub; os sem área (caminhão, frota) ficam sob consulta.
  const portes = config.servicos.portes.filter((x) => x.m2Envelopamento > 0);
  const semArea = config.servicos.portes.filter((x) => x.m2Envelopamento <= 0);
  const inicial = portes.find((x) => x.id === "seda") ?? portes[0];
  const [marca, setMarca] = useState(marcas[0].id);
  const [acab, setAcab] = useState("fosco");
  const [porte, setPorte] = useState(inicial?.id ?? "");
  const [area, setArea] = useState(inicial?.m2Envelopamento ?? m2MedioTotal);
  const [modelo, setModelo] = useState("Honda Civic");

  const p = precoEnvelopamento(config, marca, acab, area);

  const escolherPorte = (id: string) => {
    setPorte(id);
    const x = portes.find((y) => y.id === id);
    if (x) setArea(x.m2Envelopamento);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        <section className="vidro flex flex-col gap-4 p-5">
          <span className="rotulo">01 · Veículo</span>
          <label className="flex flex-col gap-2">
            <span className="sr-only">Modelo</span>
            <input id="modelo" className="campo" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo do carro" />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Porte">
            {portes.map((x) => (
              <Opcao key={x.id} on={porte === x.id} onClick={() => escolherPorte(x.id)} titulo={x.nome} valor={`≈ ${num(x.m2Envelopamento, 1)} m²`} sub={x.exemplos} />
            ))}
          </div>
          {semArea.length > 0 && (
            <p className="text-xs text-tx4">{semArea.map((x) => x.nome).join(", ")}: sob consulta, com medição no local.</p>
          )}
          <label className="flex flex-col gap-3">
            <span className="flex items-baseline justify-between">
              <span className="rotulo">Área total</span>
              <span className="num font-mono text-2xl font-semibold text-tx">{num(area, 1)} m²</span>
            </span>
            <input id="area" type="range" min={2} max={30} step={0.5} value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full accent-[#1A5FD8]" />
            <span className="text-xs text-tx4">Área média do porte escolhido. Para teto, capô ou retrovisores, reduza a área.</span>
          </label>
        </section>

        <section className="vidro flex flex-col gap-4 p-5">
          <span className="rotulo">02 · Marca do vinil</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Marca">
            {marcas.map((m) => (
              <Opcao key={m.id} on={marca === m.id} onClick={() => setMarca(m.id)} titulo={m.nome} valor={`${brl(m.preco)}/m²`} sub={m.descricao} />
            ))}
          </div>
        </section>

        <section className="vidro flex flex-col gap-4 p-5">
          <span className="rotulo">03 · Acabamento</span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Acabamento">
            {acabamentos.map((a) => (
              <Opcao key={a.id} on={acab === a.id} onClick={() => setAcab(a.id)} titulo={a.nome} valor={a.adicionalM2 ? `+${brl(a.adicionalM2)}/m²` : "incluso"} />
            ))}
          </div>
          <p className="num font-mono text-sm text-tx3">
            {num(area, 1)} m² × ({brl(p.marca.preco)} + {brl(p.acabamento.adicionalM2)}) = <span className="text-neon">{brl(p.total)}</span>
          </p>
        </section>
      </div>

      <ResumoOrcamento
        servico={`envelopamento ${p.acabamento.nome.toLowerCase()} ${p.marca.nome} (${modelo})`}
        total={p.total}
        areaM2={area}
        linhas={[{ rotulo: `${modelo} · ${p.marca.nome} ${p.acabamento.nome} · ${num(area, 1)} m² × ${brl(p.valorM2)}`, valor: p.total }]}
      />
    </div>
  );
}
