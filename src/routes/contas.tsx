import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertCircle, ArrowRight, BadgeCheck, Building2, Check, ChevronDown, CirclePlus, Facebook, Link2, RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { adAccounts, brands } from "@/data/mock";
import { accountSpend } from "@/lib/calc";
import { money } from "@/lib/format";
import { useFilters } from "@/lib/filters";
import { StatusPill } from "@/components/app/ui-bits";
import { toast } from "sonner";

export const Route = createFileRoute("/contas")({ head: () => ({ meta: [{ title: "Contas de anúncios — Ledgerline" }, { name: "description", content: "Organize e conecte suas contas de anúncios." }] }), component: AccountsPage });

const platformName: Record<string, string> = { meta: "Meta Ads", google: "Google Ads", tiktok: "TikTok Ads" };
const platformStyle: Record<string, string> = { meta: "border-blue-400/25 bg-blue-400/10 text-blue-300", google: "border-amber-300/25 bg-amber-300/10 text-amber-200", tiktok: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-200" };

function AccountsPage() {
  const f = useFilters();
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [showConnect, setShowConnect] = useState(false);
  const accounts = useMemo(() => adAccounts.filter((a) => f.brandIds.includes(a.brandId) && (platform === "all" || a.platform === platform) && (!query || a.name.toLowerCase().includes(query.toLowerCase()) || platformName[a.platform].toLowerCase().includes(query.toLowerCase()))), [f.brandIds, platform, query]);
  const metaCount = accounts.filter((a) => a.platform === "meta").length;
  const connected = accounts.filter((a) => a.status === "connected").length;
  const issues = accounts.filter((a) => a.status === "error" || a.status === "disconnected").length;
  const spend = accounts.reduce((sum, a) => sum + accountSpend(a.id, a.brandId, f.period), 0);

  return <div className="command-page mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-blue-300"><Building2 className="h-3.5 w-3.5" /> Ativos de mídia</div><h1 className="text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Contas de anúncios <span className="text-muted-foreground">sob controle.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Centralize acesso, marca, integridade da conexão e investimento por conta. A autorização oficial da Meta será feita com login seguro, sem pedir sua senha do Facebook.</p></div>
      <button onClick={() => setShowConnect(true)} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-300 xl:self-auto"><CirclePlus className="h-4 w-4" /> Conectar conta</button>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Contas visíveis" value={String(accounts.length)} detail="Dentro dos filtros atuais" icon={<Building2 className="h-4 w-4" />} />
      <Metric label="Meta Ads" value={String(metaCount)} detail="Contas da plataforma Meta" icon={<Facebook className="h-4 w-4" />} blue />
      <Metric label="Conexões saudáveis" value={String(connected)} detail="Status registrado na demonstração" icon={<ShieldCheck className="h-4 w-4" />} />
      <Metric label="Precisam de atenção" value={String(issues)} detail={money(spend) + " investidos no período"} icon={<AlertCircle className="h-4 w-4" />} />
    </section>

    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/40">
      <div className="flex flex-col gap-3 border-b border-border/80 p-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-sm font-semibold">Contas conectadas e descobertas</h2><p className="mt-1 text-xs text-muted-foreground">Cada conta fica vinculada a uma marca para separar investimento e resultado.</p></div><div className="flex flex-wrap gap-2"><label className="relative min-w-[190px] flex-1 lg:flex-none"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por conta ou plataforma" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-blue-400/60" /></label><div className="relative"><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs outline-none focus:border-blue-400/60"><option value="all">Todas as plataformas</option><option value="meta">Meta Ads</option><option value="google">Google Ads</option><option value="tiktok">TikTok Ads</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /></div></div></div>
      <div className="divide-y divide-border/60">
        {accounts.map((account) => {
          const brand = brands.find((b) => b.id === account.brandId);
          const accountSpendValue = accountSpend(account.id, account.brandId, f.period);
          return <article key={account.id} className="grid gap-4 p-4 transition hover:bg-blue-400/[.025] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5">
            <div className="flex min-w-0 items-start gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${platformStyle[account.platform]}`}>{account.platform === "meta" ? <Facebook className="h-5 w-5" /> : <Activity className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">{account.name}</h3><StatusPill status={account.status} /><span className={`rounded-md border px-2 py-0.5 text-[10px] ${platformStyle[account.platform]}`}>{platformName[account.platform]}</span></div><div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground"><span>Marca: <b className="font-medium text-foreground/80">{brand?.name ?? "—"}</b></span><span>Última sincronização: {account.lastSync ? new Date(account.lastSync).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }) : "Nunca"}</span></div>{account.alerts.length > 0 && <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-200/90"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{account.alerts.join(" · ")}</span></div>}</div></div>
            <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-3 md:justify-end md:border-0 md:pt-0"><div className="md:text-right"><div className="text-[10px] text-muted-foreground">Investimento · {f.period}d</div><div className="num mt-1 text-sm font-semibold">{money(accountSpendValue)}</div></div><button onClick={() => toast.info("Detalhes e sincronização real estarão disponíveis após conectar a API da plataforma.")} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px] text-muted-foreground transition hover:border-blue-400/40 hover:text-blue-200">Detalhes <ArrowRight className="h-3 w-3" /></button></div>
          </article>;
        })}
        {accounts.length === 0 && <div className="px-6 py-14 text-center"><Search className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Nenhuma conta encontrada</p><p className="mt-1 text-xs text-muted-foreground">Tente mudar a busca ou o filtro.</p></div>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-4 py-3 text-[10px] text-muted-foreground"><span>{accounts.length} contas · escopo: {f.orgBrands.length} marcas disponíveis</span><span>Dados simulados · API Meta ainda não conectada</span></div>
    </section>

    {showConnect && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowConnect(false); }}><section role="dialog" aria-modal="true" aria-labelledby="connect-title" className="w-full max-w-lg rounded-2xl border border-blue-300/20 bg-card p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300"><Link2 className="h-5 w-5" /></div><button onClick={() => setShowConnect(false)} aria-label="Fechar" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button></div><h2 id="connect-title" className="mt-4 text-xl font-semibold">Conecte sua Meta Business</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">A conexão final será feita pelo fluxo oficial de autorização da Meta. Você escolhe quais negócios e contas de anúncios autorizar; sua senha não passa pela Ledgerline.</p><div className="mt-5 space-y-3 rounded-xl border border-border bg-background/60 p-4"><Step icon={<BadgeCheck className="h-4 w-4" />} title="1. Entrar com a Meta" detail="OAuth oficial e permissões mínimas necessárias." /><Step icon={<Check className="h-4 w-4" />} title="2. Escolher Business Manager e contas" detail="Importar apenas os ativos que você autorizar." /><Step icon={<RefreshCw className="h-4 w-4" />} title="3. Sincronizar campanhas e métricas" detail="Investimento, status, campanhas e resultados." /></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button onClick={() => setShowConnect(false)} className="h-10 rounded-xl border border-border px-4 text-sm text-muted-foreground hover:bg-secondary">Fechar</button><button onClick={() => { setShowConnect(false); toast.info("OAuth ainda não configurado. O próximo passo é criar o app Meta, definir redirect URI e implementar o backend de tokens."); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-400 px-4 text-sm font-semibold text-slate-950 hover:bg-blue-300">Preparar conexão <ArrowRight className="h-4 w-4" /></button></div></section></div>}
  </div>;
}

function Metric({ label, value, detail, icon, blue = false }: { label: string; value: string; detail: string; icon: ReactNode; blue?: boolean }) { return <div className="rounded-xl border border-border/80 bg-card/50 p-4"><div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">{label}<span className={blue ? "text-blue-300" : ""}>{icon}</span></div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-[11px] text-muted-foreground">{detail}</div></div>; }
function Step({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) { return <div className="flex items-start gap-3"><div className="mt-0.5 text-blue-300">{icon}</div><div><div className="text-sm font-medium">{title}</div><div className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</div></div></div>; }
