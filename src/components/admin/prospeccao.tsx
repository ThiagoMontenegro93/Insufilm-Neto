"use client";

/**
 * Prospecção por área ou CNPJ com dupla validação (Google Places + site oficial).
 * Disparo só com score >= mínimo, as duas validações e sem opt-out.
 */
import { useState } from "react";
import { Globe, Instagram, Loader2, Mail, MapPin, MessageCircle, Radar, ScanSearch, ShieldCheck, Star, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campo, Cartao, Selo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import { LEADS_EXEMPLO } from "@/lib/leads-exemplo";
import { podeProspectar, pontuarLead, preencherMensagem, type Lead } from "@/lib/prospect";
import { cn } from "@/lib/utils";

const FONTES = [
  { nome: "Google Places API", origem: "google · oficial", uso: "Nome, endereço, telefone, nota e avaliações" },
  { nome: "BrasilAPI / minha-receita", origem: "BrasilAPI · cuducos", uso: "Dados públicos de CNPJ" },
  { nome: "Leitura do site oficial", origem: "fetch + regex, respeita robots.txt", uso: "E-mail e WhatsApp publicados pela empresa" },
  { nome: "WhatsApp Cloud API", origem: "Meta · oficial", uso: "Mensagem modelo aprovada, com opt-out" },
  { nome: "E-mail transacional", origem: "SMTP / Resend", uso: "Contato no e-mail público, com descadastro" },
  { nome: "Instagram", origem: "link manual", uso: "Perfil aberto para contato humano, sem raspagem" },
];

const VALIDACOES = [
  { icone: MapPin, titulo: "Validação 1 · Google", texto: "Google Places confirma nome, endereço, telefone, nota e total de avaliações.", pontos: "+40 encontrado · +10 nota > 4,0 · +10 > 20 avaliações" },
  { icone: Globe, titulo: "Validação 2 · Site oficial", texto: "Lemos a página pública da empresa para achar o e-mail e o WhatsApp que ela mesma divulga.", pontos: "+20 site no ar · +10 e-mail · +10 WhatsApp" },
  { icone: ScanSearch, titulo: "Contatos extras", texto: "Instagram e LinkedIn entram só como link para contato manual. Nada de raspagem.", pontos: "sem pontos" },
  { icone: ShieldCheck, titulo: "Pode prospectar", texto: "Só dispara com as duas validações, score mínimo e sem pedido de opt-out. A nota do Google personaliza a mensagem.", pontos: "score ≥ mínimo configurado" },
];

export function PainelProspeccao() {
  const { config } = usePlataforma();
  const minimo = config.prospeccao.scoreMinimo;
  const [area, setArea] = useState(config.prospeccao.areaPadrao);
  const [categoria, setCategoria] = useState(config.nichos[0].id);
  const [cnpjs, setCnpjs] = useState("");
  const [leads, setLeads] = useState<Lead[]>(LEADS_EXEMPLO);
  const [carregando, setCarregando] = useState<"area" | "cnpj" | null>(null);
  const [aviso, setAviso] = useState<string | null>("Mostrando dados de exemplo. Configure GOOGLE_PLACES_API_KEY para buscar de verdade.");
  const [previa, setPrevia] = useState<Lead | null>(null);

  async function buscar(tipo: "area" | "cnpj") {
    setCarregando(tipo);
    setAviso(null);
    try {
      const r = await fetch(`/api/prospeccao/${tipo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tipo === "area" ? { area, categoria } : { cnpjs: cnpjs.split(/\s+/).filter(Boolean) }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro ?? "Falha na busca");
      setLeads(dados.leads);
      if (dados.aviso) setAviso(dados.aviso);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Falha na busca");
    } finally {
      setCarregando(null);
    }
  }

  const modelo = config.nichos.find((n) => n.id === (previa?.categoria ?? categoria))?.mensagemModelo ?? config.nichos[0].mensagemModelo;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <Cartao className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-neon" aria-hidden />
            <h3 className="font-semibold text-tx">Captação por área</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo rotulo="Área / bairro" htmlFor="pros-area">
              <input id="pros-area" className="campo" value={area} onChange={(e) => setArea(e.target.value)} />
            </Campo>
            <Campo rotulo="Categoria" htmlFor="pros-cat">
              <select id="pros-cat" className="campo" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {config.nichos.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nome}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
          <Button onClick={() => buscar("area")} disabled={!!carregando}>
            {carregando === "area" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />} Buscar por área + dupla validação
          </Button>
        </Cartao>

        <Cartao className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ScanSearch className="h-5 w-5 text-neon" aria-hidden />
            <h3 className="font-semibold text-tx">Captação por CNPJ</h3>
          </div>
          <Campo rotulo="CNPJs, um por linha" htmlFor="pros-cnpj">
            <textarea id="pros-cnpj" rows={3} className="campo resize-none font-mono text-sm" placeholder="12.345.678/0001-90" value={cnpjs} onChange={(e) => setCnpjs(e.target.value)} />
          </Campo>
          <Button variante="vidro" onClick={() => buscar("cnpj")} disabled={!!carregando || !cnpjs.trim()}>
            {carregando === "cnpj" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />} Enriquecer CNPJs + dupla validação
          </Button>
        </Cartao>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {VALIDACOES.map((v, i) => {
          const Icone = v.icone;
          return (
            <Cartao key={v.titulo} className={cn("flex flex-col gap-3 p-5", i === 3 && "border-esmeralda/30")}>
              <Icone className={cn("h-5 w-5", i === 3 ? "text-esmeralda" : "text-neon")} aria-hidden />
              <span className="font-semibold text-tx">{v.titulo}</span>
              <p className="text-sm leading-relaxed text-tx3">{v.texto}</p>
              <span className="mt-auto font-mono text-[11px] text-tx4">{v.pontos}</span>
            </Cartao>
          );
        })}
      </div>

      <Cartao className="flex flex-col gap-4 p-0 sm:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
          <h3 className="font-semibold text-tx">Leads validados</h3>
          <span className="font-mono text-xs text-tx4">mínimo para disparo: {minimo}/100</span>
        </div>
        {aviso && <p className="mx-5 rounded-2xl border border-alerta/20 bg-alerta/[0.06] px-4 py-2.5 text-sm text-alerta sm:mx-6">{aviso}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-linha/[0.06] text-tx4">
                {["Empresa", "Contatos captados", "Google", "Dupla validação", "Score", "Disparo"].map((h) => (
                  <th key={h} className="rotulo px-5 py-3 font-normal first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const p = pontuarLead(l);
                const ok = podeProspectar(l, minimo);
                return (
                  <tr key={l.id} className="border-b border-linha/[0.04] align-top last:border-0">
                    <td className="max-w-[240px] px-5 py-4 pl-6">
                      <p className="font-medium text-tx">{l.empresa}</p>
                      <p className="text-xs text-tx4">{l.endereco}</p>
                      {l.site && <p className="mt-1 font-mono text-xs text-neon/80">{l.site}</p>}
                      {l.cnpj && <p className="mt-1 font-mono text-xs text-tx4">{l.cnpj}</p>}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-tx2">
                      <div className="flex flex-col gap-1">
                        {l.email && <span>{l.email}</span>}
                        {l.whatsapp && <span>{l.whatsapp}</span>}
                        {l.instagram && <span>@{l.instagram}</span>}
                        {!l.email && !l.whatsapp && !l.instagram && <span className="text-tx4">nenhum</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {l.google?.encontrado ? (
                        <span className="num flex items-center gap-1 text-tx">
                          <Star className="h-3.5 w-3.5 fill-alerta text-alerta" aria-hidden />
                          {l.google.avaliacao?.toFixed(1).replace(".", ",")} <span className="text-xs text-tx4">({l.google.totalAvaliacoes})</span>
                        </span>
                      ) : (
                        <span className="text-tx4">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        {[
                          { k: "Google Maps", v: p.validadoGoogle },
                          { k: "Site oficial", v: p.validadoSite },
                        ].map((x) => (
                          <span key={x.k} className={cn("flex items-center gap-1.5", x.v ? "text-esmeralda-soft" : "text-tx4")}>
                            {x.v ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />} {x.k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Selo tom={p.total >= minimo ? "esmeralda" : "perigo"} title={p.detalhes.map((d) => `${d.rotulo} +${d.pontos}`).join("\n")}>
                        {p.total}/100
                      </Selo>
                      {l.optOut && <p className="mt-1.5 text-xs text-tx4">opt-out</p>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <Button tamanho="icone" variante={ok.ok ? "esmeralda" : "vidro"} disabled={!ok.ok || !l.whatsapp} onClick={() => setPrevia(l)} aria-label={`WhatsApp para ${l.empresa}`} title={ok.motivo}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button tamanho="icone" variante="vidro" disabled={!ok.ok || !l.email} onClick={() => setPrevia(l)} aria-label={`E-mail para ${l.empresa}`} title={ok.motivo}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button tamanho="icone" variante="vidro" disabled={!l.instagram} asChild={!!l.instagram} aria-label={`Instagram de ${l.empresa}`}>
                          {l.instagram ? (
                            <a href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noreferrer">
                              <Instagram className="h-4 w-4" />
                            </a>
                          ) : (
                            <Instagram className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {!ok.ok && <p className="mt-1.5 max-w-[150px] text-xs text-tx4">{ok.motivo}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cartao>

      {previa && (
        <Cartao forte className="flex flex-col gap-4 border-esmeralda/30">
          <div className="flex items-center justify-between">
            <span className="rotulo">Prévia da mensagem · {previa.empresa}</span>
            <button className="text-tx4 hover:text-tx" onClick={() => setPrevia(null)} aria-label="Fechar prévia">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="rounded-2xl bg-zinc-950/70 p-4 text-[15px] leading-relaxed text-tx">
            {preencherMensagem(modelo, previa)}
            <span className="mt-3 block text-xs text-tx4">Responda SAIR para não receber mais mensagens.</span>
          </p>
          <p className="text-sm text-tx3">
            O envio sai pela WhatsApp Cloud API como mensagem modelo aprovada. Status atual:{" "}
            <span className="font-mono text-alerta">{config.apis.find((a) => a.id === "whatsapp-cloud")?.status}</span>.
          </p>
        </Cartao>
      )}

      <section className="flex flex-col gap-3">
        <span className="rotulo">Fontes e integrações usadas</span>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FONTES.map((f) => (
            <div key={f.nome} className="flex flex-col gap-1 rounded-2xl border border-linha/[0.06] bg-zinc-950/50 p-4 font-mono">
              <span className="text-sm text-tx">{f.nome}</span>
              <span className="text-[11px] text-neon/80">{f.origem}</span>
              <span className="text-[11px] text-tx4">{f.uso}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
