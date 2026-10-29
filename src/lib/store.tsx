"use client";

/**
 * Estado da plataforma no navegador (modo demonstração).
 * Com DATABASE_URL configurado, o mesmo contrato é servido por /api/config (Prisma).
 * Toda alteração gera um log CONFIG_PLATAFORMA_ALTERADA com snapshot JSON antes/depois.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CONFIG_PADRAO, type PlatformConfig } from "./config";
import { recalcularPrecos } from "./custos";

export interface LogAuditoria {
  id: string;
  acao: "CONFIG_PLATAFORMA_ALTERADA";
  descricao: string;
  usuario: string;
  criadoEm: string;
  antes: unknown;
  depois: unknown;
}

interface Ctx {
  config: PlatformConfig;
  logs: LogAuditoria[];
  pronto: boolean;
  alterar: (descricao: string, mutar: (rascunho: PlatformConfig) => void) => void;
  restaurarPadrao: () => void;
}

const ConfigContext = createContext<Ctx | null>(null);
const CHAVE_CONFIG = "fph.config.v1";
const CHAVE_LOGS = "fph.auditoria.v1";

function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* armazenamento indisponível: segue só em memória */
  }
}

/** Guarda só os ramos que mudaram, para o snapshot ficar legível. */
function diff(antes: PlatformConfig, depois: PlatformConfig) {
  const a: Record<string, unknown> = {};
  const d: Record<string, unknown> = {};
  (Object.keys(depois) as (keyof PlatformConfig)[]).forEach((k) => {
    if (JSON.stringify(antes[k]) !== JSON.stringify(depois[k])) {
      a[k] = antes[k];
      d[k] = depois[k];
    }
  });
  return { antes: a, depois: d };
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(CONFIG_PADRAO);
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const salvo = ler<PlatformConfig | null>(CHAVE_CONFIG, null);
    if (salvo && salvo.versao === CONFIG_PADRAO.versao) setConfig(salvo);
    setLogs(ler<LogAuditoria[]>(CHAVE_LOGS, []));
    setPronto(true);
  }, []);

  const alterar = useCallback<Ctx["alterar"]>((descricao, mutar) => {
    setConfig((atual) => {
      const rascunho = structuredClone(atual);
      mutar(rascunho);
      // itens com "preço pelo custo" são reprecificados a cada mudança de custo ou premissa
      recalcularPrecos(rascunho);
      const { antes, depois } = diff(atual, rascunho);
      if (Object.keys(depois).length === 0) return atual;
      const log: LogAuditoria = {
        id: crypto.randomUUID(),
        acao: "CONFIG_PLATAFORMA_ALTERADA",
        descricao,
        usuario: "super.admin@filmprotect.app",
        criadoEm: new Date().toISOString(),
        antes,
        depois,
      };
      setLogs((l) => {
        const novos = [log, ...l].slice(0, 200);
        gravar(CHAVE_LOGS, novos);
        return novos;
      });
      gravar(CHAVE_CONFIG, rascunho);
      return rascunho;
    });
  }, []);

  const restaurarPadrao = useCallback(() => {
    alterar("Configuração restaurada para o padrão", (r) => Object.assign(r, structuredClone(CONFIG_PADRAO)));
  }, [alterar]);

  const valor = useMemo(() => ({ config, logs, pronto, alterar, restaurarPadrao }), [config, logs, pronto, alterar, restaurarPadrao]);
  return <ConfigContext.Provider value={valor}>{children}</ConfigContext.Provider>;
}

export function usePlataforma() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("usePlataforma precisa do ConfigProvider");
  return ctx;
}
