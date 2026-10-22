import { createFileRoute } from "@tanstack/react-router";
import { Activity, ChevronDown, CircleHelp, Filter, Layers3, Pause, Play, Search, SlidersHorizontal, Sparkles, Target, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { brands, adAccounts } from "@/data/mock";
import { campaignResults } from "@/lib/calc";
import { money } from "@/lib/format";
import { useFilters } from "@/lib/filters";
import type { AttributionModel } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/campanhas")({ head: () => ({ meta: [{ title: "Campanhas — Ledgerline" }, { name: "description", content: "Operação e análise de campanhas de anúncios." }] }), component: CampaignsPage });

const modelLabels: Record<AttributionModel, string> = { first: "Primeiro toque", last: "Último toque", linear: "Linear" };
const platformClass: Record<string, string> = { meta: "bg-blue-400/10 text-blue-300 border-blue-400/20", google: "bg-amber-300/10 text-amber-200 border-amber-300/20", tiktok: "bg-fuchsia-300/10 text-fuchsia-200 border-fuchsia-300/20" };

function CampaignsPage() {
  const f = useFilters();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [model, setModel] = useState<AttributionModel>("last");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
  const results = useMemo(() => campaignResults(f.brandIds, f.period, model, f.costRules).filter((r) => {
    const q = query.toLowerCase();
    const account = adAccounts.find((a) => a.id === r.campaign.accountId);
    const matchesQuery = !q || r.campaign.name.toLowerCase().includes(q) || account?.name.toLowerCase().includes(q) || r.campaign.channel.toLowerCase().includes(q);
    const isPaused = statusOverrides[r.campaign.id] ?? ["c4", "c7", "c12"].includes(r.campaign.id);
    return matchesQuery && (status === "all" || (status === "active" ? !isPaused : isPaused));
  }), [f.brandIds, f.period, f.costRules, model, query, status, statusOverrides]);
  const totals = results.reduce((a, r) => ({ spend: a.spend + r.spend, revenue: a.revenue + r.revenue, conversions: a.conversions + r.conversions, profit: a.profit + (r.margin * r.revenue) }), { spend: 0, revenue: 0, conversions: 0, profit: 0 });
  const roas = totals.spend ? totals.revenue / totals.spend : 0;
  const activeCount = results.filter((r) => !(statusOverrides[r.campaign.id] ?? ["c4", "c7", "c12"].includes(r.campaign.id))).length;

  return <div className="command-page mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-blue-300"><Activity className="h-3.5 w-3.5" /> Operação de mídia</div><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Campanhas <span className="text-muted-foreground">em contexto.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Veja investimento, retorno e margem na mesma leitura. A camada de dados já está organizada para receber a API do Meta Ads.</p></div>
      <button onClick={() => toast.info("A conexão oficial com a Meta será habilitada após configurar o app, OAuth e permissões da API.")} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-300 xl:self-auto"><span className="text-base">+</span> Conectar Meta Ads</button>
    </header>

    <section className="overflow-hidden rounded-2xl border border-blue-400/20 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,.16),transparent_48%),linear-gradient(120deg,rgba(12,25,45,.96),rgba(13,19,32,.92))]">
      <div className="flex flex-col gap-5 p-5 sm:p-7 xl:flex-row xl:items-center xl:justify-between">
        <div><div className="flex items-center gap-2 text-sm text-blue-100/70"><Wallet className="h-4 w-4" /> Investimento no período <span className="rounded-md border border-blue-300/20 px-2 py-0.5 text-[10px]">{f.period} dias</span></div><div className="mt-3 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">{money(totals.spend)}</div><p className="mt-2 text-xs text-blue-100/55">Soma estimada das campanhas visíveis · dados demonstrativos</p></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:min-w-[510px]">
          <div className="rounded-xl border border-white/10 bg-white/[.035] p-3.5"><div className="text-xs text-blue-100/60">Receita atribuída</div><div className="mt-2 text-lg font-semibold text-white">{money(totals.revenue)}</div></div>
          <div className="rounded-xl border border-white/10 bg-white/[.035] p-3.5"><div className="text-xs text-blue-100/60">ROAS atribuído</div><div className="mt-2 flex items-center gap-1.5 text-lg font-semibold text-white">{roas.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}x <TrendingUp className="h-3.5 w-3.5 text-blue-300" /></div></div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[.035] p-3.5 sm:col-span-1"><div className="text-xs text-blue-100/60">Conversões atribuídas</div><div className="mt-2 text-lg font-semibold text-white">{Math.round(totals.conversions).toLocaleString("pt-BR")}</div></div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-5 py-3 text-[11px] text-blue-100/65 sm:px-7"><Sparkles className="h-3.5 w-3.5 text-blue-300" /> O retorno é calculado com o modelo de atribuição selecionado — não é uma promessa de lucro real.</div>
    </section>

    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border/80 bg-card/50 p-4"><div className="flex items-center justify-between text-xs text-muted-foreground">Campanhas listadas <Layers3 className="h-4 w-4" /></div><div className="mt-2 text-2xl font-semibold">{results.length}</div><div className="mt-1 text-[11px] text-muted-foreground">Dentro da marca e do período selecionados</div></div>
      <div className="rounded-xl border border-border/80 bg-card/50 p-4"><div className="flex items-center justify-between text-xs text-muted-foreground">Ativas na visualização <Play className="h-4 w-4" /></div><div className="mt-2 text-2xl font-semibold">{activeCount}</div><div className="mt-1 text-[11px] text-muted-foreground">Status de demonstração até a conexão</div></div>
      <div className="rounded-xl border border-border/80 bg-card/50 p-4"><div className="flex items-center justify-between text-xs text-muted-foreground">CPA médio ponderado <Target className="h-4 w-4" /></div><div className="mt-2 text-2xl font-semibold">{totals.conversions ? money(totals.spend / totals.conversions) : "—"}</div><div className="mt-1 text-[11px] text-muted-foreground">Investimento ÷ conversões atribuídas</div></div><div className="rounded-xl border border-border/80 bg-card/50 p-4"><div className="flex items-center justify-between text-xs text-muted-foreground">Margem atribuída <Wallet className="h-4 w-4" /></div><div className={`mt-2 text-2xl font-semibold ${totals.profit >= 0 ? "text-blue-300" : "text-rose-300"}`}>{money(totals.profit)}</div><div className="mt-1 text-[11px] text-muted-foreground">Estimativa antes de validação financeira</div></div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/40">
      <div className="flex flex-col gap-3 border-b border-border/80 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-sm font-semibold">Todas as campanhas</h2><p className="mt-1 text-xs text-muted-foreground">Uma linha por campanha; compare custo, conversão e retorno sem trocar de tela.</p></div>
        <div className="flex flex-wrap gap-2">
          <label className="relative min-w-[190px] flex-1 lg:flex-none"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar campanha ou conta" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-blue-400/60" /></label>
          <div className="relative"><Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 appearance-none rounded-lg border border-border bg-background pl-8 pr-8 text-xs outline-none focus:border-blue-400/60"><option value="all">Todos os status</option><option value="active">Ativas</option><option value="paused">Pausadas</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /></div>
          <div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><select value={model} onChange={(e) => setModel(e.target.value as AttributionModel)} className="h-9 appearance-none rounded-lg border border-border bg-background pl-8 pr-8 text-xs outline-none focus:border-blue-400/60">{Object.entries(modelLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead><tr className="border-b border-border/80 bg-background/50 text-[10px] uppercase tracking-[.12em] text-muted-foreground"><th className="px-4 py-3 font-medium">Campanha</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Investimento</th><th className="px-4 py-3 text-right font-medium">Conversões</th><th className="px-4 py-3 text-right font-medium">CPA</th><th className="px-4 py-3 text-right font-medium">Receita atribuída</th><th className="px-4 py-3 text-right font-medium">ROAS</th><th className="px-4 py-3 text-right font-medium">Ação</th></tr></thead>
          <tbody>{results.map((r) => {
            const campaign = r.campaign;
            const account = adAccounts.find((a) => a.id === campaign.accountId);
            const brand = brands.find((b) => b.id === campaign.brandId);
            const isPaused = paused.includes(campaign.id) || ["c4", "c7", "c12"].includes(campaign.id);
            return <tr key={campaign.id} className="border-b border-border/50 transition hover:bg-blue-400/[.035] last:border-0">
              <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-400/15 bg-blue-400/[.07] text-blue-300"><Layers3 className="h-4 w-4" /></div><div className="min-w-0"><div className="max-w-[280px] truncate text-xs font-semibold">{campaign.name}</div><div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground"><span>{brand?.name ?? "Marca"}</span><span>·</span><span>{account?.name ?? "Conta"}</span><span className={`rounded border px-1.5 py-0.5 ${platformClass[campaign.platform]}`}>{campaign.channel}</span></div></div></div></td>
              <td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${isPaused ? "bg-muted text-muted-foreground" : "bg-blue-400/10 text-blue-300"}`}><span className={`h-1.5 w-1.5 rounded-full ${isPaused ? "bg-muted-foreground" : "bg-blue-300"}`} />{isPaused ? "Pausada" : "Ativa"}</span></td>
              <td className="num px-4 py-3.5 text-right text-xs">{money(r.spend)}</td><td className="num px-4 py-3.5 text-right text-xs">{r.conversions.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</td><td className="num px-4 py-3.5 text-right text-xs">{money(r.cpa)}</td><td className="num px-4 py-3.5 text-right text-xs">{money(r.revenue)}</td><td className="num px-4 py-3.5 text-right text-xs"><span className={r.roas >= 2 ? "text-blue-300" : "text-amber-200"}>{r.roas.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}x</span></td>
              <td className="px-4 py-3.5 text-right"><button onClick={() => { setStatusOverrides((old) => ({ ...old, [campaign.id]: !isPaused })); toast.info("Alteração apenas visual neste protótipo; a API ainda não está conectada."); }} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[10px] text-muted-foreground transition hover:border-blue-400/40 hover:text-blue-200">{isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}{isPaused ? "Ativar" : "Pausar"}</button></td>
            </tr>;
          })}</tbody>
        </table>
        {results.length === 0 && <div className="px-6 py-14 text-center"><Search className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Nenhuma campanha encontrada</p><p className="mt-1 text-xs text-muted-foreground">Tente outro termo ou altere os filtros.</p></div>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-4 py-3 text-[10px] text-muted-foreground"><span>{results.length} campanhas · atribuição: {modelLabels[model]}</span><span className="inline-flex items-center gap-1.5"><CircleHelp className="h-3 w-3" /> Métricas simuladas; nenhum comando é enviado à Meta.</span></div>
    </section>
  </div>;
}
