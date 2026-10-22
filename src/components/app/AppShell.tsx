import { Link, useRouterState } from "@tanstack/react-router";
import {
  Blocks, Building2, ChevronsLeft, ChevronsRight, CircleDollarSign, GitBranch,
  Menu, RadioTower, Route as RouteIcon, Search, ScanSearch, ShoppingBag, Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { organizations } from "@/data/mock";
import { useFilters } from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { PeriodDays } from "@/lib/types";
import { toast } from "sonner";

const navGroups = [
  { label: "ANÚNCIOS", items: [
    { to: "/campanhas", label: "Campanhas", icon: RadioTower },
    { to: "/contas", label: "Contas de anúncios", icon: Building2 },
    { label: "Comprar uma conta", icon: ShoppingBag, disabled: true },
  ] },
  { label: "FINANCEIRO", items: [
    { to: "/lucro", label: "Lucro real", icon: CircleDollarSign },
    { label: "Saldo de mídia", icon: Wallet, disabled: true },
  ] },
  { label: "INTELIGÊNCIA", items: [
    { to: "/jornada", label: "Jornada do lead", icon: RouteIcon },
    { to: "/atribuicao", label: "Atribuição", icon: GitBranch },
    { label: "Diagnóstico de tracking", icon: ScanSearch, disabled: true },
  ] },
  { label: "SISTEMA", items: [
    { to: "/integracoes", label: "Integrações", icon: Blocks },
  ] },
] as const;

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-4 px-2">
      {navGroups.map((group) => (
        <section key={group.label} className="space-y-1">
          {!collapsed && <div className="px-2.5 pb-1 pt-1 text-[9px] font-semibold tracking-[0.16em] text-sidebar-foreground/40">{group.label}</div>}
          {group.items.map((n) => {
            const active = "to" in n && n.to && (n.to === "/" ? path === "/" : path.startsWith(n.to));
            const disabled = "disabled" in n && n.disabled;
            const classes = cn("flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              disabled && "cursor-not-allowed opacity-40");
            const contents = <><n.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />{!collapsed && <span className="truncate">{n.label}</span>}</>;
            return "to" in n && n.to
              ? <Link key={n.label} to={n.to} onClick={onNavigate} title={collapsed ? n.label : undefined} className={classes}>{contents}</Link>
              : <div key={n.label} title={collapsed ? n.label : undefined} aria-disabled="true" className={classes}>{contents}</div>;
          })}
        </section>
      ))}
    </nav>
  );
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-14 items-center gap-2.5 px-4">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-primary/40 bg-primary/10">
        <span className="num text-xs font-semibold text-primary">Δ</span>
      </div>
      {!collapsed && <span className="text-[15px] font-semibold tracking-tight">Ledgerline</span>}
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const f = useFilters();
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b bg-background/95 px-4 py-2.5 backdrop-blur">
      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden" onClick={onMenu} aria-label="Abrir menu">
        <Menu className="h-5 w-5" />
      </button>
      <Select value={f.orgId} onValueChange={f.setOrgId}>
        <SelectTrigger className="h-8 w-auto min-w-36 gap-2 text-sm"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /><SelectValue /></SelectTrigger>
        <SelectContent>{organizations.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={f.brandId} onValueChange={f.setBrandId}>
        <SelectTrigger className="h-8 w-auto min-w-36 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as marcas</SelectItem>
          {f.orgBrands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="flex h-8 items-center rounded-md border p-0.5">
        {([7, 30, 90] as PeriodDays[]).map((p) => (
          <button key={p} onClick={() => f.setPeriod(p)}
            className={cn("num h-full rounded px-2.5 text-xs", f.period === p ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {p}d
          </button>
        ))}
      </div>
      <div className="relative ml-auto hidden lg:block">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar (em breve)" className="h-8 w-56 pl-8 text-sm"
          onKeyDown={(e) => { if (e.key === "Enter") toast.info("Busca global ainda indisponível neste protótipo."); }} />
      </div>
      <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex lg:ml-0 ml-auto">
        <span className={cn("h-1.5 w-1.5 rounded-full", f.loading ? "bg-warning animate-pulse" : "bg-positive")} />
        {f.loading ? "Atualizando…" : "Atualizado 21/10 22:52"}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="grid h-8 w-8 place-items-center rounded-full border bg-secondary text-xs font-semibold">AJ</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal"><div className="text-sm">Atos M. Junior</div><div className="text-xs text-muted-foreground">Administrador</div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/configuracoes">Configurações</Link></DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Login ainda não disponível no ambiente demonstrativo.")}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-sidebar transition-[width] md:flex", collapsed ? "w-14" : "w-56")}>
        <Logo collapsed={collapsed} />
        <div className="flex-1 overflow-y-auto py-2"><NavList collapsed={collapsed} /></div>
        <button onClick={() => setCollapsed((c) => !c)} className="m-2 flex h-8 items-center justify-center gap-2 rounded-md text-xs text-muted-foreground hover:bg-sidebar-accent"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Recolher</>}
        </button>
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navegação</SheetTitle>
          <Logo collapsed={false} />
          <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        <footer className="border-t px-6 py-3 text-center text-[11px] text-muted-foreground">Ambiente demonstrativo — dados fictícios</footer>
      </div>
    </div>
  );
}
