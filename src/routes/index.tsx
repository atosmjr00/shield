import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, ChevronRight, CircleAlert, CircleCheck, Clock3, Download, MousePointerClick, RefreshCw, ShieldCheck } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Kpi, KpiGrid, PageHeader, Section, Tag, td, th } from "@/components/app/ui-bits";
import { alerts, activities, brands } from "@/data/mock";
import { campaignResults, consolidatedPnl, filterMetrics, pctChange, sumMetrics } from "@/lib/calc";
import { useFilters } from "@/lib/filters";
import { money, moneyCompact, num, pct, ratio, shortDate } from "@/lib/format";

export const Route = createFileRoute("/")({ component: Overview });

function Overview() {
  const f = useFilters();
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const current = useMemo(() => sumMetrics(filterMetrics(f.brandIds, f.period)), [f.brandIds, f.period]);
  const previous = useMemo(() => sumMetrics(filterMetrics(f.brandIds, f.period, 1)), [f.brandIds, f.period]);
  const pnl = useMemo(() => consolidatedPnl(f.brandIds, f.period, f.costRules), [f.brandIds, f.period, f.costRules]);
  const prevPnl = useMemo(() => consolidatedPnl(f.brandIds, f.period, f.costRules, 1), [f.brandIds, f.period, f.costRules]);
  const series = useMemo(() => {
    const rows = filterMetrics(f.brandIds, f.period);
    const byDate = new Map<string, typeof rows>();
    rows.forEach((r) => byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]));
    return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, list]) => {
      const approved = list.reduce((s, r) => s + r.approvedRevenue, 0);
      const spend = list.reduce((s, r) => s + r.spend, 0);
      const profit = list.reduce((s, r) => s + (r.approvedRevenue * (1 - ((f.costRules[r.brandId]?.paymentFeePct ?? 0) + (f.costRules[r.brandId]?.variableCostPct ?? 0) + (f.costRules[r.brandId]?.commissionPct ?? 0) + (f.costRules[r.brandId]?.taxPct ?? 0)) / 100) - r.refunds - r.chargebacks - r.orders * (f.costRules[r.brandId]?.fixedPerOrder ?? 0) - r.spend), 0);
      return { date, label: shortDate(date), receita: Math.round(approved), investimento: Math.round(spend), lucro: Math.round(profit) };
    });
  }, [f.brandIds, f.period, f.costRules]);
  const results = useMemo(() => campaignResults(f.brandIds, f.period, "last", f.costRules).sort((a, b) => b.spend - a.spend), [f.brandIds, f.period, f.costRules]);
  const brandRows = useMemo(() => f.brandIds.map((id) => {
    const b = brands.find((x) => x.id === id)!;
    const t = sumMetrics(filterMetrics([id], f.period));
    const p = consolidatedPnl([id], f.period, f.costRules);
    return { id, name: b.name, revenue: t.approvedRevenue, spend: t.spend, profit: p.operatingProfit, roas: t.spend ? t.approvedRevenue / t.spend : 0, orders: t.orders };
  }).sort((a, b) => b.revenue - a.revenue), [f.brandIds, f.period, f.costRules]);
  const activeAlerts = alerts.filter((a) => f.brandIds.includes(a.brandId));
  const activeActivities = activities.filter((a) => f.brandIds.includes(a.brandId)).slice(0, 5);
  const margin = current.approvedRevenue ? pnl.operatingProfit / current.approvedRevenue : 0;
  const roas = current.spend ? current.approvedRevenue / current.spend : 0;
  const cpa = current.orders ? current.spend / current.orders : 0;
  const priorRoas = previous.spend ? previous.approvedRevenue / previous.spend : 0;
  const priorCpa = previous.orders ? previous.spend / previous.orders : 0;
  const priorMargin = previous.approvedRevenue ? prevPnl.operatingProfit / previous.approvedRevenue : 0;
  const visibleCampaigns = showAllCampaigns ? results : results.slice(0, 6);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader title="Command Center" description="Visão consolidada de performance, atribuição e resultado financeiro."
        actions={<><button onClick={() => toast.success("Relatório demonstrativo preparado para exportação futura.")} className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-accent"><Download className="h-4 w-4" /> Exportar</button><button onClick={() => toast.info("Os dados exibidos são fictícios e não há sincronização ativa.")} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"><RefreshCw className="h-4 w-4" /> Atualizar dados</button></>} />
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded border px-2 py-1"><span className="h-1.5 w-1.5 rounded-full bg-positive" /> Ambiente demonstrativo</span>
        <span>Período: últimos {f.period} dias</span><span>·</span><span>{f.orgBrands.find((b) => f.brandIds.includes(b.id))?.timezone ?? "Fuso por marca"}</span>
      </div>

      <KpiGrid>
        <Kpi label="Receita aprovada" value={moneyCompact(current.approvedRevenue)} delta={pctChange(current.approvedRevenue, previous.approvedRevenue)} tip="Valor dos pedidos aprovados no período. Ainda não significa que todo o valor foi liquidado." />
        <Kpi label="Receita líquida" value={moneyCompact(pnl.netRevenue)} delta={pctChange(pnl.netRevenue, prevPnl.netRevenue)} tip="Receita aprovada menos taxas de pagamento, reembolsos e chargebacks." />
        <Kpi label="Investimento em mídia" value={moneyCompact(current.spend)} delta={pctChange(current.spend, previous.spend)} invert tip="Gastos de mídia simulados, distribuídos pelas marcas selecionadas." />
        <Kpi label="Lucro operacional estimado" value={moneyCompact(pnl.operatingProfit)} delta={pctChange(pnl.operatingProfit, prevPnl.operatingProfit)} tip="Margem de contribuição estimada menos investimento em mídia. Não equivale ao lucro contábil." />
        <Kpi label="Margem de contribuição" value={pct(pnl.contributionMarginPct)} delta={pctChange(pnl.contributionMarginPct, prevPnl.contributionMarginPct)} tip="Margem após taxas, reembolsos, chargebacks, custos variáveis, comissões e impostos configurados." />
        <Kpi label="ROAS" value={ratio(roas)} delta={pctChange(roas, priorRoas)} tip="Receita aprovada dividida pelo investimento em mídia." />
        <Kpi label="CPA médio" value={money(cpa)} delta={pctChange(cpa, priorCpa)} invert tip="Investimento em mídia dividido pelo total de pedidos aprovados usados como aproximação de conversões." />
        <Kpi label="Pedidos aprovados" value={num(current.orders)} delta={pctChange(current.orders, previous.orders)} tip="Quantidade estimada de pedidos aprovados nos dados demonstrativos." />
      </KpiGrid>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <Section title="Desempenho ao longo do tempo" tip="Valores agregados por dia. O lucro é uma estimativa baseada nas regras financeiras configuradas para cada marca." actions={<span className="text-xs text-muted-foreground">BRL · diário</span>}>
          <div className="flex flex-wrap gap-4 px-4 pt-4 text-xs">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Receita aprovada</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Investimento</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-positive" /> Lucro estimado</span>
          </div>
          <div className="h-[280px] w-full px-2 pb-3 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 14, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.18} /><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-positive)" stopOpacity={0.14} /><stop offset="95%" stopColor="var(--color-positive)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={26} />
                <YAxis tickFormatter={(v) => moneyCompact(Number(v))} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} tickLine={false} axisLine={false} width={62} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-foreground)", fontSize: 12 }} formatter={(v) => money(Number(v))} labelFormatter={(label) => `Data: ${label}`} />
                <Area type="monotone" dataKey="receita" name="Receita aprovada" stroke="var(--color-primary)" strokeWidth={2} fill="url(#revenueFill)" />
                <Area type="monotone" dataKey="investimento" name="Investimento" stroke="var(--color-muted-foreground)" strokeWidth={1.5} fill="transparent" />
                <Area type="monotone" dataKey="lucro" name="Lucro estimado" stroke="var(--color-positive)" strokeWidth={1.5} fill="url(#profitFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Integridade dos dados" tip="Indicadores ilustrativos de saúde do ambiente demonstrativo. Não representam conexões reais.">
          <div className="space-y-0">
            <div className="flex items-start gap-3 border-b px-4 py-4"><ShieldCheck className="mt-0.5 h-4 w-4 text-positive" /><div className="min-w-0 flex-1"><div className="text-sm font-medium">Cálculos financeiros</div><p className="mt-1 text-xs text-muted-foreground">Regras por marca aplicadas</p></div><Tag tone="positive">Disponível</Tag></div>
            <div className="flex items-start gap-3 border-b px-4 py-4"><Activity className="mt-0.5 h-4 w-4 text-primary" /><div className="min-w-0 flex-1"><div className="text-sm font-medium">Eventos de conversão</div><p className="mt-1 text-xs text-muted-foreground">Alguns eventos sem correspondência</p></div><Tag tone="warning">Atenção</Tag></div>
            <div className="flex items-start gap-3 border-b px-4 py-4"><Clock3 className="mt-0.5 h-4 w-4 text-warning" /><div className="min-w-0 flex-1"><div className="text-sm font-medium">Última sincronização</div><p className="mt-1 text-xs text-muted-foreground">Horários simulados para demonstração</p></div><Tag>Simulado</Tag></div>
            <div className="px-4 py-4"><p className="text-xs leading-relaxed text-muted-foreground">Os indicadores só devem ser tratados como resultados reais após conectar as fontes e validar a conciliação de vendas, pagamentos e custos.</p></div>
          </div>
        </Section>
      </div>

      <Section title="Desempenho por marca" tip="Cada marca mantém suas próprias regras de custo. O consolidado respeita o filtro de organização e marca.">
        <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr>{["Marca","Receita aprovada","Investimento","Lucro estimado","ROAS","Pedidos"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>
          {brandRows.map((b) => <tr key={b.id} className="border-t transition-colors hover:bg-accent/30"><td className={td}><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">BRL · período selecionado</div></td><td className={td+" num"}>{money(b.revenue)}</td><td className={td+" num"}>{money(b.spend)}</td><td className={td+" num"}><span className={b.profit >= 0 ? "text-positive" : "text-negative"}>{money(b.profit)}</span></td><td className={td+" num"}>{ratio(b.roas)}</td><td className={td+" num"}>{num(b.orders)}</td></tr>)}
        </tbody></table></div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <Section title="Campanhas em destaque" tip="Receita distribuída pelo modelo de último contato. São valores de atribuição simulados, não vendas independentes adicionais." actions={<button onClick={() => setShowAllCampaigns((v) => !v)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">{showAllCampaigns ? "Mostrar menos" : "Ver todas"} <ChevronRight className="h-3 w-3" /></button>}>
          <div className="overflow-x-auto"><table className="w-full min-w-[660px]"><thead><tr>{["Campanha","Gasto","Receita atribuída","CPA","ROAS","Margem"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead><tbody>
            {visibleCampaigns.map((r) => <tr key={r.campaign.id} className="border-t hover:bg-accent/30"><td className={td}><div className="max-w-[220px] truncate font-medium">{r.campaign.name}</div><div className="text-xs text-muted-foreground">{r.campaign.channel}</div></td><td className={td+" num"}>{money(r.spend)}</td><td className={td+" num"}>{money(r.revenue)}</td><td className={td+" num"}>{money(r.cpa)}</td><td className={td+" num"}>{ratio(r.roas)}</td><td className={td+" num"}><span className={r.margin >= 0 ? "text-positive" : "text-negative"}>{pct(r.margin)}</span></td></tr>)}
          </tbody></table></div>
        </Section>
        <Section title="Alertas acionáveis" tip="Alertas demonstrativos para ilustrar como a operação pode priorizar divergências e riscos.">
          <div className="divide-y">
            {activeAlerts.length ? activeAlerts.slice(0, 4).map((a) => <button key={a.id} onClick={() => toast(a.title, { description: a.description })} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-accent/30"><CircleAlert className={a.severity === "critical" ? "mt-0.5 h-4 w-4 shrink-0 text-negative" : "mt-0.5 h-4 w-4 shrink-0 text-warning"} /><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{a.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{a.description}</span><span className="mt-2 inline-flex items-center text-xs text-primary">{a.action} <ChevronRight className="ml-1 h-3 w-3" /></span></span></button>) : <div className="px-4 py-8 text-center text-sm text-muted-foreground"><CircleCheck className="mx-auto mb-2 h-5 w-5 text-positive" />Nenhum alerta para os filtros selecionados.</div>}
          </div>
        </Section>
      </div>

      <Section title="Atividade recente" actions={<span className="text-xs text-muted-foreground">Últimos eventos demonstrativos</span>}>
        <div className="divide-y">
          {activeActivities.length ? activeActivities.map((a) => <div key={a.id} className="flex items-start gap-3 px-4 py-3"><div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary"><MousePointerClick className="h-3.5 w-3.5 text-muted-foreground" /></div><div className="min-w-0 flex-1"><p className="text-sm">{a.text}</p><p className="mt-1 text-xs text-muted-foreground">{brands.find((b) => b.id === a.brandId)?.name ?? "Marca"} · {new Date(a.at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p></div><ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" /></div>) : <div className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma atividade no período.</div>}
        </div>
      </Section>
      <p className="text-xs leading-relaxed text-muted-foreground">Nota financeira: receita líquida, margem e lucro são estimativas derivadas de dados fictícios e regras configuradas. A liquidação efetiva e os custos contábeis completos exigem conciliação com as fontes reais.</p>
    </div>
  );
}
