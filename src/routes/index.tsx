import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight, ArrowRight, BadgeDollarSign, Banknote, Blocks, CheckCircle2,
  CircleDot, Fingerprint, GitBranch, Layers3, MousePointerClick, RadioTower,
  ScanSearch, ShoppingBag, Wallet, WandSparkles,
} from "lucide-react";
import { useFilters } from "@/lib/filters";
import { consolidatedPnl } from "@/lib/calc";
import { money } from "@/lib/format";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "Início — Ledgerline" }] }), component: Home });

type Tool = {
  title: string;
  description: string;
  icon: typeof Wallet;
  state: "available" | "planned";
  to?: "/lucro" | "/integracoes" | "/contas" | "/jornada" | "/atribuicao";
  note?: string;
};

const groups: { id: string; title: string; subtitle: string; icon: typeof Wallet; tools: Tool[] }[] = [
  {
    id: "operate", title: "Operação de anúncios", subtitle: "Controlar o que está rodando", icon: RadioTower,
    tools: [
      { title: "Campanhas", description: "Criar, pausar, editar e acompanhar campanhas do Meta Ads.", icon: Layers3, state: "planned", note: "Meta Ads" },
      { title: "Contas de anúncios", description: "Conectar contas, conferir acesso e alternar entre operações.", icon: Blocks, state: "planned", note: "Contas separadas" },
      { title: "Comprar uma conta", description: "Encontrar ofertas, conferir condições e acompanhar pedidos.", icon: ShoppingBag, state: "planned", note: "Marketplace" },
    ],
  },
  {
    id: "money", title: "Dinheiro da operação", subtitle: "Saber para onde cada real foi", icon: Wallet,
    tools: [
      { title: "Lucro real", description: "Calcular o que sobra depois dos custos e do investimento.", icon: BadgeDollarSign, state: "available", to: "/lucro", note: "Ferramenta disponível" },
      { title: "Saldo de mídia", description: "Acompanhar valores adicionados, utilização e movimentações.", icon: Banknote, state: "planned", note: "Extrato próprio" },
    ],
  },
  {
    id: "understand", title: "Inteligência de conversão", subtitle: "Entender o que gera vendas", icon: Fingerprint,
    tools: [
      { title: "Jornada do lead", description: "Seguir o caminho do clique até a compra.", icon: MousePointerClick, state: "planned" },
      { title: "Atribuição", description: "Comparar canais e entender a contribuição de cada origem.", icon: GitBranch, state: "planned" },
      { title: "Diagnóstico de tracking", description: "Encontrar eventos ausentes e divergências de dados.", icon: ScanSearch, state: "planned" },
    ],
  },
];

function Home() {
  const f = useFilters();
  const pnl = consolidatedPnl(f.brandIds, f.period, f.costRules);
  return <div className="mx-auto w-full max-w-6xl space-y-9 py-3 sm:py-7">
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"><WandSparkles className="h-4 w-4 text-emerald-300" /> Centro de operações</div>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">Sua operação inteira. <span className="text-muted-foreground">Um caminho claro.</span></h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Anúncios, dinheiro e conversões conectados — cada coisa no seu lugar, sem transformar tudo em um painel interminável.</p>
      </div>
      <Link to="/lucro" className="group flex shrink-0 items-center gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-3 transition hover:border-emerald-300/40">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-300/10 text-emerald-200"><Wallet className="h-4 w-4" /></div>
        <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lucro estimado · {f.period} dias</div><div className="mt-0.5 text-lg font-semibold tracking-tight">{money(pnl.operatingProfit)}</div></div>
        <ArrowRight className="ml-1 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
      </Link>
    </header>

    <section className="relative space-y-4">
      <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Mapa de ferramentas</h2><p className="mt-1 text-xs text-muted-foreground">Três áreas conectadas. Você entra direto na tarefa.</p></div><div className="hidden items-center gap-2 text-[10px] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Disponível <span className="ml-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> Planejado</div></div>
      <div className="grid gap-4 xl:grid-cols-3">
        {groups.map((group, index) => {
          const GroupIcon = group.icon;
          return <section key={group.id} className="relative flex min-w-0 flex-col rounded-2xl border border-border/80 bg-card/25 p-3 sm:p-4">
            <div className="mb-3 flex items-start gap-3 px-1 pt-1">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-secondary/50 text-foreground/80"><GroupIcon className="h-4 w-4" /></div>
              <div className="min-w-0"><h3 className="text-sm font-semibold">{group.title}</h3><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{group.subtitle}</p></div>
              <span className="ml-auto pt-1 font-mono text-[10px] text-muted-foreground/70">0{index + 1}</span>
            </div>
            <div className="relative flex flex-1 flex-col gap-2">
              <div className="absolute bottom-5 left-[17px] top-5 w-px bg-border/80" />
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const inner = <><div className="relative z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition group-hover:text-foreground">{tool.state === "available" ? <Icon className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</div><div className="min-w-0 flex-1 py-0.5"><div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-medium">{tool.title}</span>{tool.state === "available" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">Planejado</span>}</div><p className="mt-1 text-[11px] leading-[1.45] text-muted-foreground">{tool.description}</p>{tool.note && <p className="mt-1.5 text-[10px] text-muted-foreground/70">{tool.note}</p>}</div>{tool.state === "available" ? <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" /> : <CircleDot className="mt-1 h-3 w-3 shrink-0 text-muted-foreground/50" />}</>;
                return tool.state === "available" && tool.to
                  ? <Link key={tool.title} to={tool.to} className="group relative flex min-h-[94px] items-start gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.035] p-3 transition hover:border-emerald-300/35 hover:bg-emerald-300/[0.06]">{inner}</Link>
                  : <div key={tool.title} aria-disabled="true" className="relative flex min-h-[94px] items-start gap-3 rounded-xl border border-border/60 bg-background/30 p-3 opacity-80">{inner}</div>;
              })}
            </div>
          </section>;
        })}
      </div>
      <div className="flex items-start gap-2 rounded-xl border border-border/60 px-3 py-3 text-[11px] leading-5 text-muted-foreground"><ArrowDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0" /> As ferramentas vão se conectar por dados compartilhados, mas continuarão separadas por tarefa. Contas, saldo de mídia e lucro não serão tratados como a mesma coisa.</div>
    </section>
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-[10px] text-muted-foreground"><span>Ledgerline · Ambiente demonstrativo</span><span>Os dados exibidos ainda são fictícios. Meta Ads e movimentações reais não estão conectados.</span></footer>
  </div>;
}
