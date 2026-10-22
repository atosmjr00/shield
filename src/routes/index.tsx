import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeAlert, CircleDollarSign,
  MousePointer2, Radio, ScanSearch, Sparkles, TrendingUp, WalletCards,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { brands } from "@/data/mock";
import { useFilters } from "@/lib/filters";
import { campaignResults, consolidatedPnl, dailySeries, filterMetrics, pctChange, sumMetrics } from "@/lib/calc";
import { money, moneyCompact, num, pct, ratio, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Command Center — Ledgerline" }, { name: "description", content: "Visão financeira e operacional multi-marca." }] }),
  component: Overview,
});

function Overview() {
  const f = useFilters();
  const current = consolidatedPnl(f.brandIds, f.period, f.costRules);
  const previous = consolidatedPnl(f.brandIds, f.period, f.costRules, 1);
  const totals = sumMetrics(filterMetrics(f.brandIds, f.period));
  const priorTotals = sumMetrics(filterMetrics(f.brandIds, f.period, 1));
  const series = dailySeries(f.brandIds, f.period, f.costRules).map((d) => ({ ...d, label: shortDate(d.date) }));
  const campaigns = campaignResults(f.brandIds, f.period, "last", f.costRules).sort((a, b) => b.margin - a.margin).slice(0, 4);
  const selectedBrands = brands.filter((b) => f.brandIds.includes(b.id));
  const profitDelta = pctChange(current.operatingProfit, previous.operatingProfit);
  const roas = totals.spend ? totals.approvedRevenue / totals.spend : 0;
  const cpa = totals.orders ? totals.spend / totals.orders : 0;
  const hasProfit = current.operatingProfit >= 0;

  return (
    <div className="command-page space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.65)]" />
            Visão executiva <span className="text-border">/</span> Ambiente de demonstração
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Bom dia. Aqui está o jogo.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Um panorama do que suas marcas faturam, investem e realmente mantêm no caixa.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3 text-xs text-muted-foreground">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            Dados de demonstração
          </div>
          <button onClick={() => toast.info("A exportação será habilitada quando houver dados conectados.")} className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 text-xs font-medium transition hover:bg-secondary">
            <WalletCards className="h-3.5 w-3.5" /> Exportar visão
          </button>
        </div>
      </div>

      <section className="profit-stage relative overflow-hidden rounded-2xl border border-white/[0.09]">
        <div className="profit-grid absolute inset-0 opacity-40" />
        <div className="relative grid xl:grid-cols-[1.12fr_.88fr]">
          <div className="flex flex-col justify-between gap-8 p-5 sm:p-7 lg:p-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                Lucro operacional estimado
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">Após custos</span>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="hero-number text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">{money(current.operatingProfit)}</span>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", profitDelta >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300")}>
                  {profitDelta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {pct(Math.abs(profitDelta))} <span className="font-normal opacity-70">vs. período anterior</span>
                </span>
              </div>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                Receita aprovada menos taxas, reembolsos, chargebacks, custos operacionais e mídia. Estimativa baseada nas regras configuradas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MiniMetric label="Receita aprovada" value={moneyCompact(current.approved)} />
              <MiniMetric label="Investimento" value={moneyCompact(current.spend)} />
              <MiniMetric label="Margem contribuição" value={pct(current.contributionMarginPct)} className="col-span-2 sm:col-span-1" />
            </div>
          </div>
          <div className="relative min-h-[230px] border-t border-white/[0.08] px-3 pb-4 pt-5 sm:px-6 xl:border-l xl:border-t-0">
            <div className="mb-2 flex items-center justify-between px-2">
              <div>
                <div className="text-xs font-medium text-slate-300">Trajetória do lucro</div>
                <div className="mt-1 text-[11px] text-slate-500">Últimos {f.period} dias</div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Lucro/dia</div>
            </div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 12, right: 6, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6EE7B7" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#84909e", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip contentStyle={{ background: "#101916", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, color: "#f0f7f3", fontSize: 12 }} formatter={(v) => [money(Number(v)), "Lucro estimado"]} labelStyle={{ color: "#8fa39a", marginBottom: 4 }} />
                  <Area type="monotone" dataKey="lucro" stroke="#6EE7B7" strokeWidth={2.5} fill="url(#profitFill)" activeDot={{ r: 4, strokeWidth: 0, fill: "#d1fae5" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-rail grid grid-cols-2 overflow-hidden rounded-2xl border border-border/80 bg-card/45 md:grid-cols-4">
        <RailMetric label="ROAS consolidado" value={ratio(roas)} delta={pctChange(totals.spend ? totals.approvedRevenue / totals.spend : 0, priorTotals.spend ? priorTotals.approvedRevenue / priorTotals.spend : 0)} />
        <RailMetric label="Custo por pedido" value={money(cpa)} delta={pctChange(totals.orders ? totals.spend / totals.orders : 0, priorTotals.orders ? priorTotals.spend / priorTotals.orders : 0)} invert />
        <RailMetric label="Pedidos aprovados" value={num(totals.orders)} delta={pctChange(totals.orders, priorTotals.orders)} />
        <RailMetric label="Reembolsos + chargebacks" value={money(current.refunds + current.chargebacks)} detail={current.approved ? pct((current.refunds + current.chargebacks) / current.approved) + " da receita aprovada" : "Sem receita no período"} invert />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="command-panel overflow-hidden rounded-2xl border border-border/80 bg-card/45">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-sky-300" /> Desempenho por marca</div>
              <p className="mt-1 text-xs text-muted-foreground">Veja onde o resultado está sendo criado.</p>
            </div>
            <button onClick={() => toast.info("A visão detalhada por marca está na próxima etapa.")} className="inline-flex items-center gap-1 text-xs font-medium text-sky-300 transition hover:text-sky-200">Ver análise <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="divide-y divide-border/60">
            {selectedBrands.map((brand, index) => {
              const p = consolidatedPnl([brand.id], f.period, f.costRules);
              const m = sumMetrics(filterMetrics([brand.id], f.period));
              const brandRoas = m.spend ? m.approvedRevenue / m.spend : 0;
              const share = current.operatingProfit > 0 ? Math.max(0, Math.min(100, (p.operatingProfit / current.operatingProfit) * 100)) : 0;
              return (
                <div key={brand.id} className="brand-row group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1fr)_110px_110px_100px] sm:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs font-bold", ["border-violet-400/20 bg-violet-400/10 text-violet-200", "border-cyan-400/20 bg-cyan-400/10 text-cyan-200", "border-amber-400/20 bg-amber-400/10 text-amber-200", "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"][index % 4])}>{brand.name.slice(0, 1)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{brand.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground"><span>{num(m.orders)} pedidos</span><span className="text-border">•</span><span>{moneyCompact(m.spend)} em mídia</span></div>
                      <div className="mt-2 h-1 w-full max-w-[180px] overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-sky-300/80 transition-all duration-500" style={{ width: share + "%" }} /></div>
                    </div>
                  </div>
                  <div className="col-start-2 text-right sm:col-start-auto sm:text-left"><div className="text-[10px] text-muted-foreground sm:hidden">Lucro est.</div><div className={cn("num text-sm font-semibold", p.operatingProfit >= 0 ? "text-emerald-300" : "text-rose-300")}>{money(p.operatingProfit)}</div></div>
                  <div className="hidden sm:block"><div className="text-[10px] text-muted-foreground">ROAS</div><div className="num mt-1 text-sm">{ratio(brandRoas)}</div></div>
                  <div className="hidden sm:block"><div className="text-[10px] text-muted-foreground">Margem</div><div className="num mt-1 text-sm">{pct(p.contributionMarginPct)}</div></div>
                </div>
              );
            })}
            {selectedBrands.length === 0 && <div className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhuma marca encontrada para os filtros atuais.</div>}
          </div>
        </section>

        <section className="command-panel overflow-hidden rounded-2xl border border-border/80 bg-card/45">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><ScanSearch className="h-4 w-4 text-amber-300" /> Sinais para investigar</div>
              <p className="mt-1 text-xs text-muted-foreground">Pontos que podem mudar a decisão de investimento.</p>
            </div>
            <span className="rounded-lg border border-amber-300/20 bg-amber-300/[0.08] px-2 py-1 text-[10px] font-medium text-amber-200">DEMO</span>
          </div>
          <div className="space-y-3 p-4">
            <Signal icon={<BadgeAlert className="h-4 w-4" />} tone="warning" title="Qualidade de dados" description="Há contas com sincronização pendente ou eventos sem correspondência." action="Revisar integrações" onClick={() => toast.info("A área de integrações será construída na próxima etapa.")} />
            <Signal icon={<TrendingUp className="h-4 w-4" />} tone="positive" title={campaigns[0]?.campaign.name ?? "Campanhas"} description={campaigns[0] ? `Melhor margem estimada entre as campanhas filtradas: ${pct(campaigns[0].margin)}.` : "Sem campanhas para os filtros atuais."} action="Explorar campanha" onClick={() => toast.info("A análise de campanhas será aberta quando a página de atribuição estiver pronta.")} />
            <Signal icon={<Sparkles className="h-4 w-4" />} tone="info" title="A próxima camada" description="Conectar vendas, custos e eventos para trocar estimativas por dados conciliados." action="Ver plano de dados" onClick={() => toast.info("Nenhuma plataforma está conectada. Esta é uma interface demonstrativa.")} />
          </div>
          <div className="mx-4 mb-4 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <MousePointer2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div><div className="text-xs font-medium text-slate-200">Decisão com contexto</div><p className="mt-1 text-xs leading-5 text-muted-foreground">O objetivo é chegar do sinal à causa: qual anúncio trouxe o lead, qual checkout converteu e qual venda virou lucro.</p></div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/45">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div><div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-emerald-300" /> Campanhas em destaque</div><p className="mt-1 text-xs text-muted-foreground">Ordenadas pela margem estimada · atribuição de último toque.</p></div>
          <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-[10px] text-muted-foreground">DADOS FICTÍCIOS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead><tr className="border-b border-border/60 text-[10px] uppercase tracking-[0.13em] text-muted-foreground"><th className="px-5 py-3 font-medium">Campanha</th><th className="px-4 py-3 text-right font-medium">Investimento</th><th className="px-4 py-3 text-right font-medium">Receita</th><th className="px-4 py-3 text-right font-medium">ROAS</th><th className="px-5 py-3 text-right font-medium">Margem est.</th></tr></thead>
            <tbody className="divide-y divide-border/50">{campaigns.map((c) => <tr key={c.campaign.id} className="transition hover:bg-white/[0.025]"><td className="max-w-[280px] px-5 py-3.5"><div className="truncate text-xs font-medium">{c.campaign.name}</div><div className="mt-1 text-[10px] text-muted-foreground">{brands.find((b) => b.id === c.campaign.brandId)?.name ?? "Marca"}</div></td><td className="num px-4 py-3.5 text-right text-xs text-muted-foreground">{money(c.spend)}</td><td className="num px-4 py-3.5 text-right text-xs">{money(c.revenue)}</td><td className="num px-4 py-3.5 text-right text-xs">{ratio(c.roas)}</td><td className={cn("num px-5 py-3.5 text-right text-xs font-semibold", c.margin >= 0 ? "text-emerald-300" : "text-rose-300")}>{pct(c.margin)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <p className="px-1 text-[11px] leading-5 text-muted-foreground">Os números exibidos são fictícios e servem para validar a experiência. Lucro operacional e margens são estimativas; nenhuma conta de anúncios ou checkout está conectado.</p>
    </div>
  );
}

function MiniMetric({ label, value, className }: { label: string; value: string; className?: string }) {
  return <div className={cn("rounded-xl border border-white/[0.08] bg-black/15 px-3.5 py-3", className)}><div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div><div className="num mt-1.5 text-lg font-medium tracking-tight text-slate-100">{value}</div></div>;
}

function RailMetric({ label, value, delta, detail, invert = false }: { label: string; value: string; delta?: number; detail?: string; invert?: boolean }) {
  const good = delta === undefined ? false : invert ? delta <= 0 : delta >= 0;
  return <div className="border-b border-r border-border/60 px-4 py-4 last:border-r-0 md:border-b-0 md:px-5"><div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-2 flex flex-wrap items-baseline gap-2"><span className="num text-xl font-semibold tracking-tight">{value}</span>{delta !== undefined && <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold", Math.abs(delta) < 0.005 ? "text-muted-foreground" : good ? "text-emerald-300" : "text-rose-300")}>{delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{pct(Math.abs(delta))}</span>}</div>{detail && <div className="mt-1.5 text-[10px] text-muted-foreground">{detail}</div>}</div>;
}

function Signal({ icon, tone, title, description, action, onClick }: { icon: ReactNode; tone: "warning" | "positive" | "info"; title: string; description: string; action: string; onClick: () => void }) {
  const styles = { warning: "border-amber-300/20 bg-amber-300/[0.06] text-amber-200", positive: "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200", info: "border-sky-300/20 bg-sky-300/[0.06] text-sky-200" };
  return <div className="rounded-xl border border-border/70 bg-background/40 p-3.5"><div className="flex gap-3"><div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border", styles[tone])}>{icon}</div><div className="min-w-0 flex-1"><div className="text-xs font-semibold">{title}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p><button onClick={onClick} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/80 transition hover:text-foreground">{action}<ArrowRight className="h-3 w-3" /></button></div></div></div>;
}
