import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Info, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/lib/types";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function InfoTip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label="Explicação" className="text-muted-foreground hover:text-foreground">
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{children}</TooltipContent>
    </Tooltip>
  );
}

export function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  const good = invert ? value < 0 : value > 0;
  const neutral = Math.abs(value) < 0.005;
  const Icon = value >= 0 ? ArrowUp : ArrowDown;
  return (
    <span className={cn("num inline-flex items-center gap-0.5 text-xs", neutral ? "text-muted-foreground" : good ? "text-positive" : "text-negative")}>
      <Icon className="h-3 w-3" />
      {Math.abs(value * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
    </span>
  );
}

export function Kpi({ label, value, delta, invert, tip, loading }: { label: string; value: string; delta?: number; invert?: boolean; tip?: ReactNode; loading?: boolean }) {
  return (
    <div className="flex flex-col gap-2 bg-card p-4">
      <div className="flex items-center gap-1.5">
        <span className="label-xs">{label}</span>
        {tip && <InfoTip>{tip}</InfoTip>}
      </div>
      {loading ? <Skeleton className="h-7 w-28" /> : <span className="num text-2xl font-medium">{value}</span>}
      {delta !== undefined && !loading && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Delta value={delta} invert={invert ?? false} /> vs. período anterior</span>
      )}
    </div>
  );
}

/** Grade de KPIs com divisórias de 1px em vez de cartões separados. */
export function KpiGrid({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-lg border bg-border grid-cols-2", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {children}
    </div>
  );
}

export function Section({ title, tip, actions, children, className }: { title: string; tip?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("panel", className)}>
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {tip && <InfoTip>{tip}</InfoTip>}
        </div>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

const statusMap: Record<ConnectionStatus, { label: string; cls: string }> = {
  connected: { label: "Conectado", cls: "text-positive bg-positive/10" },
  syncing: { label: "Sincronizando", cls: "text-info bg-info/10" },
  error: { label: "Erro de sincronização", cls: "text-negative bg-negative/10" },
  disconnected: { label: "Não conectado", cls: "text-muted-foreground bg-muted" },
};

export function StatusPill({ status }: { status: ConnectionStatus }) {
  const s = statusMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status === "syncing" && "animate-pulse")} />
      {s.label}
    </span>
  );
}

export function Tag({ tone = "neutral", children }: { tone?: "neutral" | "positive" | "negative" | "warning" | "info"; children: ReactNode }) {
  const cls = {
    neutral: "bg-muted text-muted-foreground",
    positive: "bg-positive/10 text-positive",
    negative: "bg-negative/10 text-negative",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
  }[tone];
  return <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap", cls)}>{children}</span>;
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function ErrorState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-negative/30 bg-negative/5 px-6 py-8 text-center">
      <AlertTriangle className="h-5 w-5 text-negative" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
    </div>
  );
}

export function SortHeader<K extends string>({ label, k, sort, onSort, align = "left" }: { label: string; k: K; sort: { key: K; dir: "asc" | "desc" }; onSort: (k: K) => void; align?: "left" | "right" }) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button type="button" onClick={() => onSort(k)} className={cn("inline-flex items-center gap-1 hover:text-foreground", align === "right" && "flex-row-reverse", active && "text-foreground")}>
      {label}
      <Icon className="h-3 w-3" />
    </button>
  );
}

export function useSortToggle<K extends string>(sort: { key: K; dir: "asc" | "desc" }, setSort: (s: { key: K; dir: "asc" | "desc" }) => void) {
  return (k: K) => setSort(sort.key === k ? { key: k, dir: sort.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "desc" });
}

export function sortBy<T>(rows: T[], get: (r: T) => number | string, dir: "asc" | "desc") {
  return [...rows].sort((a, b) => {
    const x = get(a), y = get(b);
    const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
    return dir === "asc" ? c : -c;
  });
}

export const th = "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
export const td = "px-4 py-2.5 text-sm";
