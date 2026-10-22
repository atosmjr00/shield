import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Fingerprint, GitBranch, ScanSearch, Wallet, WandSparkles } from "lucide-react";
import { useFilters } from "@/lib/filters";
import { consolidatedPnl } from "@/lib/calc";
import { money } from "@/lib/format";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "Início — Ledgerline" }] }), component: Home });

const tools = [
  { title: "Lucro real", description: "Descubra quanto sobra depois dos custos.", icon: Wallet, to: "/lucro", ready: true },
  { title: "Jornada do lead", description: "Rastreie o caminho até a compra.", icon: Fingerprint, ready: false },
  { title: "Atribuição", description: "Compare o crédito de cada canal.", icon: GitBranch, ready: false },
  { title: "Diagnóstico de tracking", description: "Encontre eventos sem correspondência.", icon: ScanSearch, ready: false },
];

function Home() {
  const f = useFilters();
  const pnl = consolidatedPnl(f.brandIds, f.period, f.costRules);
  return <div className="mx-auto w-full max-w-5xl space-y-10 py-4 sm:py-10">
    <header className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><WandSparkles className="h-4 w-4 text-emerald-300" /> SEU CENTRO DE OPERAÇÕES</div>
      <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Menos ruído. <span className="text-muted-foreground">Decisões melhores.</span></h1>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Escolha o que precisa resolver. Cada ferramenta responde uma pergunta específica, sem afogar você em métricas.</p>
    </header>
    <Link to="/lucro" className="group flex flex-col gap-5 rounded-2xl border border-emerald-300/20 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,.10),transparent_55%)] bg-card/50 p-5 transition hover:border-emerald-300/40 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200"><Wallet className="h-5 w-5" /></div>
        <div><div className="text-xs text-muted-foreground">VISÃO RÁPIDA · {f.period} DIAS</div><h2 className="mt-1 text-lg font-semibold">Lucro operacional estimado</h2><div className="mt-2 text-3xl font-semibold tracking-tight">{money(pnl.operatingProfit)}</div><p className="mt-1 text-xs text-muted-foreground">Estimativa com as regras de custo atuais.</p></div>
      </div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-sm font-medium">Abrir ferramenta</span><span className="grid h-9 w-9 place-items-center rounded-full border border-border transition group-hover:translate-x-1 group-hover:border-emerald-300/40"><ArrowRight className="h-4 w-4" /></span></div>
    </Link>
    <section className="space-y-4"><div className="flex items-end justify-between gap-3"><div><h2 className="text-sm font-semibold">Ferramentas</h2><p className="mt-1 text-xs text-muted-foreground">Abra uma ferramenta só quando precisar dela.</p></div><span className="text-[10px] uppercase tracking-wider text-muted-foreground">01 disponível</span></div>
      <div className="grid gap-3 sm:grid-cols-2">{tools.map((tool) => { const Icon = tool.icon; const body = <><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-secondary/50 text-foreground/80"><Icon className="h-[18px] w-[18px]" /></div><span className={tool.ready ? "text-muted-foreground transition group-hover:translate-x-0.5" : "rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground"}>{tool.ready ? <ArrowRight className="h-4 w-4" /> : "EM BREVE"}</span></div><div><h3 className="text-sm font-semibold">{tool.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.description}</p></div></>; return tool.ready ? <Link key={tool.title} to={tool.to!} className="group flex min-h-36 flex-col justify-between gap-5 rounded-2xl border border-border/80 bg-card/35 p-4 transition hover:border-border hover:bg-card/80">{body}</Link> : <div key={tool.title} aria-disabled="true" className="flex min-h-36 flex-col justify-between gap-5 rounded-2xl border border-border/60 bg-card/20 p-4 opacity-65">{body}</div>; })}</div>
    </section>
    <p className="text-[11px] text-muted-foreground">Ambiente demonstrativo. Os dados ainda são fictícios; integrações reais serão ativadas separadamente.</p>
  </div>;
}
