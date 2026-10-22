import { accountSpendShare, campaigns, dailyMetrics, TODAY } from "@/data/mock";
import type { AttributionModel, Campaign, CostRules, DailyMetric } from "./types";

export interface Totals {
  grossRevenue: number;
  approvedRevenue: number;
  settledRevenue: number;
  refunds: number;
  chargebacks: number;
  spend: number;
  orders: number;
  visitors: number;
  leads: number;
  checkouts: number;
}

export const emptyTotals = (): Totals => ({
  grossRevenue: 0, approvedRevenue: 0, settledRevenue: 0, refunds: 0, chargebacks: 0,
  spend: 0, orders: 0, visitors: 0, leads: 0, checkouts: 0,
});

function shift(iso: string, d: number) {
  const dt = new Date(iso + "T12:00:00Z");
  dt.setUTCDate(dt.getUTCDate() + d);
  return dt.toISOString().slice(0, 10);
}

export function periodRange(days: number, offset = 0) {
  const end = shift(TODAY, -offset * days);
  const start = shift(end, -(days - 1));
  return { start, end };
}

export function filterMetrics(brandIds: string[], days: number, offset = 0): DailyMetric[] {
  const { start, end } = periodRange(days, offset);
  const set = new Set(brandIds);
  return dailyMetrics.filter((m) => set.has(m.brandId) && m.date >= start && m.date <= end);
}

export function sumMetrics(rows: DailyMetric[]): Totals {
  const t = emptyTotals();
  for (const r of rows) {
    (Object.keys(t) as (keyof Totals)[]).forEach((k) => (t[k] += r[k]));
  }
  return t;
}

export interface Pnl {
  gross: number;
  approved: number;
  settled: number;
  paymentFees: number;
  refunds: number;
  chargebacks: number;
  netRevenue: number;
  spend: number;
  variableCosts: number;
  commissions: number;
  taxes: number;
  fixedPerOrder: number;
  contributionMargin: number;
  contributionMarginPct: number;
  operatingProfit: number;
}

/**
 * Demonstrativo por marca. Receita líquida = aprovada − taxas − reembolsos − chargebacks.
 * Margem de contribuição = receita líquida − custos variáveis − comissões − impostos − custo fixo por pedido.
 * Lucro operacional estimado = margem de contribuição − investimento em mídia.
 */
export function computePnl(t: Totals, rules: CostRules): Pnl {
  const paymentFees = (t.approvedRevenue * rules.paymentFeePct) / 100;
  const netRevenue = t.approvedRevenue - paymentFees - t.refunds - t.chargebacks;
  const variableCosts = (t.approvedRevenue * rules.variableCostPct) / 100;
  const commissions = (t.approvedRevenue * rules.commissionPct) / 100;
  const taxes = (t.approvedRevenue * rules.taxPct) / 100;
  const fixedPerOrder = t.orders * rules.fixedPerOrder;
  const contributionMargin = netRevenue - variableCosts - commissions - taxes - fixedPerOrder;
  const operatingProfit = contributionMargin - t.spend;
  return {
    gross: t.grossRevenue, approved: t.approvedRevenue, settled: t.settledRevenue,
    paymentFees, refunds: t.refunds, chargebacks: t.chargebacks, netRevenue, spend: t.spend,
    variableCosts, commissions, taxes, fixedPerOrder, contributionMargin,
    contributionMarginPct: t.approvedRevenue ? contributionMargin / t.approvedRevenue : 0,
    operatingProfit,
  };
}

export function addPnl(a: Pnl, b: Pnl): Pnl {
  const out = { ...a };
  (Object.keys(a) as (keyof Pnl)[]).forEach((k) => {
    if (k !== "contributionMarginPct") out[k] = a[k] + b[k];
  });
  out.contributionMarginPct = out.approved ? out.contributionMargin / out.approved : 0;
  return out;
}

/** P&L consolidado: aplica as regras de cada marca separadamente e depois soma. */
export function consolidatedPnl(brandIds: string[], days: number, rules: Record<string, CostRules>, offset = 0): Pnl {
  return brandIds
    .map((id) => computePnl(sumMetrics(filterMetrics([id], days, offset)), rules[id]!))
    .reduce((acc, p) => (acc ? addPnl(acc, p) : p), null as Pnl | null) ?? computePnl(emptyTotals(), { paymentFeePct: 0, variableCostPct: 0, commissionPct: 0, taxPct: 0, fixedPerOrder: 0 });
}

export function dailySeries(brandIds: string[], days: number, rules: Record<string, CostRules>) {
  const rows = filterMetrics(brandIds, days);
  const byDate = new Map<string, DailyMetric[]>();
  rows.forEach((r) => byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]));
  return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, list]) => {
    const pnl = list.map((m) => computePnl(sumMetrics([m]), rules[m.brandId]!)).reduce(addPnl);
    return { date, receita: pnl.approved, investimento: pnl.spend, lucro: pnl.operatingProfit };
  });
}

export interface CampaignResult {
  campaign: Campaign;
  spend: number;
  conversions: number;
  revenue: number;
  cpa: number;
  roas: number;
  margin: number;
}

/**
 * Distribui investimento, pedidos e receita aprovados da marca entre campanhas,
 * conforme o modelo. Para qualquer modelo, a soma por marca = total real da marca.
 */
export function campaignResults(brandIds: string[], days: number, model: AttributionModel, rules: Record<string, CostRules>): CampaignResult[] {
  const out: CampaignResult[] = [];
  for (const brandId of brandIds) {
    const t = sumMetrics(filterMetrics([brandId], days));
    const list = campaigns.filter((c) => c.brandId === brandId);
    const sw = list.reduce((s, c) => s + c.spendWeight, 0);
    const mw = list.reduce((s, c) => s + c.modelWeight[model], 0);
    const r = rules[brandId]!;
    for (const c of list) {
      const spend = (t.spend * c.spendWeight) / sw;
      const share = c.modelWeight[model] / mw;
      const conversions = t.orders * share;
      const revenue = t.approvedRevenue * share;
      const contribution = revenue * (1 - (r.paymentFeePct + r.variableCostPct + r.commissionPct + r.taxPct) / 100) - (t.refunds + t.chargebacks) * share - conversions * r.fixedPerOrder;
      out.push({
        campaign: c, spend, conversions, revenue,
        cpa: conversions ? spend / conversions : 0,
        roas: spend ? revenue / spend : 0,
        margin: revenue ? (contribution - spend) / revenue : 0,
      });
    }
  }
  return out;
}

export function accountSpend(accountId: string, brandId: string, days: number) {
  return sumMetrics(filterMetrics([brandId], days)).spend * (accountSpendShare[accountId] ?? 0);
}

export const pctChange = (cur: number, prev: number) => (prev ? (cur - prev) / Math.abs(prev) : 0);
