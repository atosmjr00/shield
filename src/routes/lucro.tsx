import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, RotateCcw, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFilters } from "@/lib/filters";
import { consolidatedPnl, filterMetrics, sumMetrics } from "@/lib/calc";
import { money, pct } from "@/lib/format";
import type { CostRules } from "@/lib/types";

export const Route = createFileRoute("/lucro")({ head: () => ({ meta: [{ title: "Lucro real — Nexora" }] }), component: ProfitTool });

const fields: { key: keyof CostRules; label: string; suffix: string }[] = [
  { key: "paymentFeePct", label: "Taxa de pagamento", suffix: "%" },
  { key: "variableCostPct", label: "Custo variável", suffix: "%" },
  { key: "commissionPct", label: "Comissões", suffix: "%" },
  { key: "taxPct", label: "Impostos", suffix: "%" },
  { key: "fixedPerOrder", label: "Custo fixo por pedido", suffix: "R$" },
];

function ProfitTool() {
  const f = useFilters();
  const [brandId, setBrandId] = useState(f.orgBrands[0]?.id ?? "");
  const rules = f.costRules[brandId];
  const [draft, setDraft] = useState<CostRules>(rules ?? { paymentFeePct: 0, variableCostPct: 0, commissionPct: 0, taxPct: 0, fixedPerOrder: 0 });
  useEffect(() => { setBrandId(f.brandId !== "all" ? f.brandId : (f.orgBrands[0]?.id ?? "")); }, [f.brandId, f.orgId, f.orgBrands]);
  useEffect(() => { if (f.costRules[brandId]) setDraft(f.costRules[brandId]!); }, [brandId, f.costRules]);
  const pnl = consolidatedPnl([brandId], f.period, f.costRules);
  const orders = sumMetrics(filterMetrics([brandId], f.period)).orders;
  const save = () => { f.setCostRule(brandId, draft); toast.success("Custos atualizados para esta marca."); };

  return <div className="mx-auto max-w-5xl space-y-7 py-3">
    <div><Link to="/" className="mb-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Todas as ferramentas</Link>
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-300/20 bg-blue-300/10 text-blue-200"><Wallet className="h-5 w-5" /></div><div><div className="text-xs text-muted-foreground">FERRAMENTA FINANCEIRA</div><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Lucro real</h1></div></div>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Ajuste os custos e descubra quanto realmente sobra. Sem métricas que não ajudam a tomar a decisão.</p>
    </div>

    <div className="flex flex-wrap items-center gap-3"><label htmlFor="profit-brand" className="text-xs text-muted-foreground">Marca</label><select id="profit-brand" value={brandId} onChange={(e) => setBrandId(e.target.value)} className="h-10 min-w-48 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-blue-300/50">{f.orgBrands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select><span className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground">Últimos {f.period} dias</span></div>

    <section className="rounded-2xl border border-blue-300/20 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,.09),transparent_65%)] bg-card/50 p-5 sm:p-7">
      <div className="text-sm text-muted-foreground">Lucro operacional estimado</div><div className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{money(pnl.operatingProfit)}</div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/70 pt-5 sm:grid-cols-3"><Metric label="Receita aprovada" value={money(pnl.approved)} /><Metric label="Investimento em anúncios" value={money(pnl.spend)} /><Metric label="Margem de contribuição" value={pct(pnl.contributionMarginPct)} /></div>
    </section>

    <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
      <section className="rounded-2xl border border-border/80 bg-card/35 p-5">
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Regras de custo</h2><p className="mt-1 text-xs text-muted-foreground">Mude os valores e aplique para recalcular.</p></div><button onClick={() => setDraft(f.costRules[brandId]!)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" title="Descartar alterações"><RotateCcw className="h-4 w-4" /></button></div>
        <div className="mt-5 space-y-4">{fields.map((field) => <label key={field.key} className="flex items-center justify-between gap-4"><span className="text-sm">{field.label}</span><span className="flex h-10 w-32 items-center rounded-xl border border-border bg-background px-3 focus-within:border-blue-300/50"><input type="number" min="0" step="0.1" value={draft[field.key]} onChange={(e) => setDraft((prev) => ({ ...prev, [field.key]: Math.max(0, Number(e.target.value)) }))} className="w-full min-w-0 bg-transparent text-right text-sm outline-none" /><span className="ml-2 text-xs text-muted-foreground">{field.suffix}</span></span></label>)}</div>
        <button onClick={save} className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-200"><Check className="h-4 w-4" /> Aplicar custos</button>
      </section>
      <section className="rounded-2xl border border-border/80 bg-card/35 p-5"><h2 className="text-sm font-semibold">Composição do lucro</h2><p className="mt-1 text-xs text-muted-foreground">Só os custos que afetam o resultado.</p>
        <div className="mt-5 space-y-4"><Line label="Receita aprovada" value={pnl.approved} /><Line label="Taxas de pagamento" value={-pnl.paymentFees} muted /><Line label="Reembolsos" value={-pnl.refunds} muted /><Line label="Chargebacks" value={-pnl.chargebacks} muted /><Line label="Custos variáveis" value={-pnl.variableCosts} muted /><Line label="Comissões" value={-pnl.commissions} muted /><Line label="Impostos" value={-pnl.taxes} muted /><Line label="Custo fixo por pedido" value={-pnl.fixedPerOrder} muted /><Line label="Investimento em mídia" value={-pnl.spend} muted /><div className="border-t border-border pt-4"><Line label="Lucro operacional" value={pnl.operatingProfit} strong /></div></div>
        <p className="mt-5 text-[11px] leading-5 text-muted-foreground">{orders.toLocaleString("pt-BR")} pedidos no período. Estimativa baseada em dados fictícios e regras configuradas.</p>
      </section>
    </div>
  </div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-base font-semibold">{value}</div></div>; }
function Line({ label, value, muted = false, strong = false }: { label: string; value: number; muted?: boolean; strong?: boolean }) { return <div className={`flex items-center justify-between gap-4 ${strong ? "text-sm font-semibold" : "text-xs"}`}><span className={muted ? "text-muted-foreground" : ""}>{label}</span><span className={`tabular-nums ${strong ? value >= 0 ? "text-blue-300" : "text-rose-300" : muted ? "text-muted-foreground" : ""}`}>{money(value)}</span></div>; }
