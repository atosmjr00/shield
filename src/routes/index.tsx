import { createFileRoute } from "@tanstack/react-router";
import { Kpi, KpiGrid, PageHeader } from "@/components/app/ui-bits";
import { useFilters } from "@/lib/filters";
import { consolidatedPnl, pctChange, sumMetrics, filterMetrics } from "@/lib/calc";
import { money, num, pct, ratio } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview — Ledgerline" }, { name: "description", content: "Command Center: receita, investimento e lucro operacional por marca." }, { property: "og:title", content: "Overview — Ledgerline" }, { property: "og:description", content: "Command Center: receita, investimento e lucro operacional por marca." }] }),
  component: Overview,
});

function Overview() {
  const f = useFilters();
  const cur = consolidatedPnl(f.brandIds, f.period, f.costRules);
  const prev = consolidatedPnl(f.brandIds, f.period, f.costRules, 1);
  const t = sumMetrics(filterMetrics(f.brandIds, f.period));
  const tp = sumMetrics(filterMetrics(f.brandIds, f.period, 1));
  const L = f.loading;
  return (
    <div>
      <PageHeader title="Command Center" description={`Últimos ${f.period} dias · estimativas baseadas nas regras de custo configuradas.`} />
      <KpiGrid>
        <Kpi loading={L} label="Receita aprovada" value={money(cur.approved)} delta={pctChange(cur.approved, prev.approved)} />
        <Kpi loading={L} label="Receita líquida" value={money(cur.netRevenue)} delta={pctChange(cur.netRevenue, prev.netRevenue)} tip="Aprovada − taxas − reembolsos − chargebacks." />
        <Kpi loading={L} label="Investimento em mídia" value={money(cur.spend)} delta={pctChange(cur.spend, prev.spend)} invert />
        <Kpi loading={L} label="Lucro operacional est." value={money(cur.operatingProfit)} delta={pctChange(cur.operatingProfit, prev.operatingProfit)} />
        <Kpi loading={L} label="Margem de contribuição" value={pct(cur.contributionMarginPct)} />
        <Kpi loading={L} label="ROAS" value={ratio(t.spend ? t.approvedRevenue / t.spend : 0)} delta={pctChange(t.approvedRevenue / t.spend, tp.approvedRevenue / tp.spend)} />
        <Kpi loading={L} label="CPA" value={money(t.orders ? t.spend / t.orders : 0)} delta={pctChange(t.spend / t.orders, tp.spend / tp.orders)} invert />
        <Kpi loading={L} label="Pedidos aprovados" value={num(t.orders)} delta={pctChange(t.orders, tp.orders)} />
      </KpiGrid>
    </div>
  );
}
