import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, Bell, Check, CheckCircle2, ChevronDown, Clock3, Cloud, ExternalLink, Globe2, Link2, LockKeyhole, Menu, Radio, RefreshCw, Search, Send, Settings2, Shield, ShieldAlert, ShieldCheck, Signal, Terminal, Webhook, X, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "SHIELD — Central de Comando" }] }), component: ShieldApp });
type Section = "overview" | "integrations" | "links" | "alerts";
type Connector = { id: string; name: string; detail: string; initials: string; color: string; state: "connected" | "warning" | "disconnected"; count: string };
const initialConnectors: Connector[] = [
 { id: "meta", name: "Meta Ads", detail: "Contas de anúncios · BM · Pixel", initials: "M", color: "#3B82F6", state: "connected", count: "02 contas" },
 { id: "whatsapp", name: "WhatsApp", detail: "Instâncias de contingência", initials: "W", color: "#22C55E", state: "warning", count: "01 instância" },
 { id: "telegram", name: "Telegram", detail: "Bots, grupos e canais", initials: "T", color: "#38BDF8", state: "connected", count: "01 bot" },
 { id: "tiktok", name: "TikTok Ads", detail: "Marketing API", initials: "♪", color: "#F472B6", state: "disconnected", count: "Não conectado" },
 { id: "meli", name: "Mercado Livre", detail: "Pedidos e saúde da conta", initials: "ML", color: "#FBBF24", state: "disconnected", count: "Não conectado" },
];
const initialEvents = [
 { time: "17:04:32", level: "ok", source: "SYSTEM", message: "Verificação de SSL concluída · checkout.store.com" },
 { time: "17:03:18", level: "warn", source: "META ADS", message: "BM_02 · revisão de conta detectada" },
 { time: "17:01:47", level: "ok", source: "TELEGRAM", message: "Bot_Vendas_01 respondeu ao health check" },
 { time: "16:58:09", level: "bad", source: "WHATSAPP", message: "Instância WA-02 sem sinal há 4 minutos" },
 { time: "16:54:51", level: "info", source: "MONITOR", message: "Ping concluído · api.minhaloja.com · 84 ms" },
];
const statusText = { connected: "Conectado", warning: "Atenção", disconnected: "Pendente" };

function ShieldApp() {
 const [section, setSection] = useState<Section>("overview");
 const [connectors, setConnectors] = useState(initialConnectors);
 const [modal, setModal] = useState<Connector | null>(null);
 const [events, setEvents] = useState(initialEvents);
 const [search, setSearch] = useState("");
 const [domain, setDomain] = useState("checkout.minhaloja.com");
 const [links, setLinks] = useState([{ url: "checkout.minhaloja.com", type: "Checkout", state: "Protegido", latency: "84 ms" }, { url: "api.minhaloja.com", type: "API", state: "Protegido", latency: "112 ms" }, { url: "lp-oferta.com.br", type: "Landing page", state: "Atenção", latency: "—" }]);
 const [alerts, setAlerts] = useState({ telegram: true, webhook: false, push: true });
 const [filter, setFilter] = useState("Todos");
 const [mobileNav, setMobileNav] = useState(false);
 const [token, setToken] = useState("");
 const [accountId, setAccountId] = useState("");
 const [chatId, setChatId] = useState("");
 const [apiUrl, setApiUrl] = useState("");
 const [saving, setSaving] = useState(false);
 const [showToken, setShowToken] = useState(false);
 const titles: Record<Section, string> = { overview: "Visão geral", integrations: "Hub de integrações", links: "Monitor de links", alerts: "Central de alertas" };
 const currentTitle = titles[section];
 const filteredEvents = useMemo(() => events.filter((e) => (filter === "Todos" || e.level === filter) && (e.source + e.message).toLowerCase().includes(search.toLowerCase())), [events, filter, search]);
 function addEvent(level: string, source: string, message: string) {
  setEvents((old) => [{ time: new Date().toLocaleTimeString("pt-BR", { hour12: false }), level, source, message }, ...old].slice(0, 12));
 }
 function testConnector(c: Connector) {
  addEvent("info", c.name.toUpperCase(), "Teste de conexão solicitado · resultado demonstrativo");
  toast.info("Teste simulado. Conecte as credenciais reais para validar a API.");
 }
 function saveConnector() {
  if (!modal) return;
  if (!token.trim()) { toast.error("Informe a credencial para continuar."); return; }
  setSaving(true);
  const chosen = modal;
  window.setTimeout(() => {
   setConnectors((old) => old.map((c) => c.id === chosen.id ? { ...c, state: "warning", count: "Credencial cadastrada" } : c));
   addEvent("info", chosen.name.toUpperCase(), "Credencial salva localmente no protótipo · validar conexão real pendente");
   setSaving(false); setModal(null); setToken(""); setAccountId(""); setChatId(""); setApiUrl("");
   toast.success("Configuração registrada na demonstração.");
  }, 350);
 }
 function addLink() {
  const clean = domain.trim().replace(/^https?:\/\//, "");
  if (!clean || !clean.includes(".")) { toast.error("Digite um domínio válido."); return; }
  setLinks((old) => [{ url: clean, type: "Domínio", state: "Aguardando teste", latency: "—" }, ...old]);
  addEvent("info", "LINK MONITOR", "Novo alvo adicionado · " + clean);
  setDomain(""); toast.success("Alvo adicionado à lista demonstrativa.");
 }
 function testLink(url: string) {
  setLinks((old) => old.map((l) => l.url === url ? { ...l, state: "Teste solicitado", latency: "..." } : l));
  addEvent("info", "LINK MONITOR", "Teste manual solicitado · " + url);
  toast.info("Teste visual simulado; nenhum ping externo foi executado.");
 }
 const nav = [
  { id: "overview" as const, label: "Dashboard & eventos", icon: Activity },
  { id: "integrations" as const, label: "Hub de integrações", icon: Radio },
  { id: "links" as const, label: "Monitor de links", icon: Link2 },
  { id: "alerts" as const, label: "Notificações", icon: Bell },
 ];
 const activeCount = connectors.filter((c) => c.state === "connected" || c.state === "warning").length + links.length;
 const incidentCount = events.filter((e) => e.level === "bad" || e.level === "warn").length;
 return <div className="shield-app">
  <aside className={"shield-sidebar " + (mobileNav ? "mobile-open" : "")}>
   <div className="shield-brand"><div className="shield-mark"><ShieldCheck size={22} strokeWidth={2.2}/></div><div><div className="shield-wordmark">SHIELD<span>.</span></div><div className="shield-brand-sub">COMMAND CENTER</div></div><button className="shield-icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Fechar menu"><X size={17}/></button></div>
   <div className="shield-workspace"><div className="workspace-avatar">S</div><div className="workspace-copy"><strong>Minha operação</strong><span>Workspace principal</span></div><ChevronDown size={15} className="muted-icon"/></div>
   <div className="shield-nav-label">WORKSPACE</div>
   <nav className="shield-nav">{nav.map((item) => <button key={item.id} className={"shield-nav-item " + (section === item.id ? "active" : "")} onClick={() => { setSection(item.id); setMobileNav(false); }}><item.icon size={17}/><span>{item.label}</span>{item.id === "alerts" && incidentCount > 0 && <span className="nav-count">{incidentCount}</span>}</button>)}</nav>
   <div className="sidebar-spacer"/>
   <div className="shield-protection-card"><div className="protection-icon"><Shield size={17}/></div><div><strong>Camada de proteção</strong><span>Monitoramento demonstrativo</span></div><span className="live-dot"/></div>
   <div className="shield-profile"><div className="profile-avatar">A</div><div className="profile-copy"><strong>Administrador</strong><span>Plano de demonstração</span></div><Settings2 size={16} className="muted-icon"/></div>
  </aside>
  <main className="shield-main">
   <header className="shield-topbar"><button className="shield-icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Abrir menu"><Menu size={19}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{currentTitle}</strong></div><div className="topbar-right"><div className="environment-pill"><span className="live-dot"/> DEMO ENVIRONMENT</div><button className="shield-icon-button notification-button" onClick={() => setSection("alerts")} aria-label="Notificações"><Bell size={17}/><i/></button><div className="topbar-avatar">A</div></div></header>
   <div className="shield-content">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> CONTINGENCY & OBSERVABILITY</div><h1>{currentTitle}</h1><p>{section === "overview" ? "Saúde operacional dos seus ativos digitais em um só lugar." : section === "integrations" ? "Conecte provedores e centralize o estado dos seus ativos." : section === "links" ? "Acompanhe a disponibilidade dos domínios críticos da operação." : "Defina como receber alertas quando algo exigir sua atenção."}</p></div>{section === "integrations" ? <button className="primary-button" onClick={() => { setModal(connectors[0]); setToken(""); }}><Zap size={16}/> Nova integração</button> : section === "links" ? <button className="primary-button" onClick={addLink}><Link2 size={16}/> Adicionar domínio</button> : section === "overview" ? <button className="secondary-button" onClick={() => { addEvent("info", "SYSTEM", "Verificação manual solicitada · execução demonstrativa"); toast.success("Verificação demonstrativa iniciada."); }}><RefreshCw size={15}/> Executar verificação</button> : null}</div>
    {section === "overview" && <div className="dashboard-view">
     <div className="system-banner"><div className="banner-shield"><ShieldCheck size={22}/></div><div className="banner-copy"><strong>Seu centro de operações está ativo</strong><span>Dados de demonstração. Conecte suas integrações para habilitar verificações reais.</span></div><span className="banner-status"><span className="live-dot"/> MONITORAMENTO DEMO</span></div>
     <div className="metrics-grid"><Metric icon={<Cloud size={18}/>} label="Ativos monitorados" value={String(activeCount).padStart(2, "0")} trend="Contas, bots e domínios" tone="blue"/><Metric icon={<ShieldAlert size={18}/>} label="Alertas nas últimas 24h" value={String(incidentCount).padStart(2, "0")} trend="Eventos de atenção no feed" tone="red"/><Metric icon={<Activity size={18}/>} label="Tempo médio de resposta" value="93 ms" trend="Valor ilustrativo de ping" tone="green"/><Metric icon={<CheckCircle2 size={18}/>} label="Conectores ativos" value={String(connectors.filter((c) => c.state === "connected").length).padStart(2, "0")} trend="Credenciais ainda não verificadas" tone="violet"/></div>
     <div className="dashboard-columns">
      <section className="surface-panel events-panel"><div className="panel-heading"><div><h2><Terminal size={17}/> Eventos do sistema</h2><p>Registro recente de atividades e mudanças de estado</p></div><span className="live-badge"><span className="live-dot"/> LIVE DEMO</span></div>
       <div className="event-toolbar"><div className="search-field"><Search size={15}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar eventos..."/></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar eventos"><option value="Todos">Todos os níveis</option><option value="ok">Protegido</option><option value="warn">Atenção</option><option value="bad">Queda</option><option value="info">Informativo</option></select></div>
       <div className="event-list">{filteredEvents.map((ev, i) => <div className="event-row" key={ev.time + "-" + i}><div className={"event-symbol " + ev.level}>{ev.level === "ok" ? <Check size={14}/> : ev.level === "warn" ? <AlertTriangle size={14}/> : ev.level === "bad" ? <X size={14}/> : <Activity size={14}/>}</div><div className="event-body"><div className="event-meta"><span className={"event-source " + ev.level}>{ev.source}</span><time>{ev.time}</time></div><p>{ev.message}</p></div></div>)}{filteredEvents.length === 0 && <div className="empty-state">Nenhum evento corresponde à busca.</div>}</div>
       <button className="panel-footer-action" onClick={() => setSection("alerts")}>Abrir central de alertas <ArrowRight size={14}/></button>
      </section>
      <section className="surface-panel status-panel"><div className="panel-heading"><div><h2><Signal size={17}/> Saúde das integrações</h2><p>Visão rápida dos conectores</p></div><button className="text-action" onClick={() => setSection("integrations")}>Ver todos <ArrowRight size={13}/></button></div>
       <div className="connector-mini-list">{connectors.slice(0, 4).map((c) => <button className="connector-mini" key={c.id} onClick={() => { setModal(c); setToken(""); }}><span className="connector-avatar" style={{ "--connector-color": c.color } as React.CSSProperties}>{c.initials}</span><span className="connector-mini-copy"><strong>{c.name}</strong><small>{c.count}</small></span><StatusPill state={c.state}/><ArrowRight size={14} className="muted-icon"/></button>)}</div>
       <div className="uptime-box"><div className="uptime-top"><span>Disponibilidade demonstrativa</span><strong>99,92%</strong></div><div className="uptime-bars">{Array.from({ length: 28 }, (_, i) => <span key={i} className={i === 18 || i === 19 ? "uptime-warn" : "uptime-ok"}/>)}</div><div className="uptime-foot"><span>Últimas 24 horas</span><span><i className="live-dot"/> Sem telemetria real</span></div></div>
      </section>
     </div>
     <section className="surface-panel quick-actions"><div className="panel-heading"><div><h2><Zap size={17}/> Acesso rápido</h2><p>Ações comuns para manter sua operação sob controle</p></div></div><div className="quick-action-grid"><QuickAction icon={<Radio size={18}/>} title="Conectar uma conta" desc="Adicione um provedor ao workspace" onClick={() => setSection("integrations")}/><QuickAction icon={<Globe2 size={18}/>} title="Monitorar um domínio" desc="Inclua um link na lista de saúde" onClick={() => setSection("links")}/><QuickAction icon={<Webhook size={18}/>} title="Configurar alertas" desc="Escolha seus canais de notificação" onClick={() => setSection("alerts")}/></div></section>
    </div>}
    {section === "integrations" && <section className="integrations-view"><div className="section-intro"><div><h2>Provedores conectados</h2><p>Gerencie credenciais e acompanhe o estado de cada integração.</p></div><span className="subtle-count">{connectors.length} provedores</span></div><div className="integration-grid">{connectors.map((c) => <article className="integration-card" key={c.id}><div className="integration-card-top"><span className="connector-avatar large" style={{ "--connector-color": c.color } as React.CSSProperties}>{c.initials}</span><StatusPill state={c.state}/></div><h3>{c.name}</h3><p>{c.detail}</p><div className="integration-card-meta"><span><span className={"state-dot " + c.state}/>{statusText[c.state]}</span><span>{c.count}</span></div><div className="integration-card-actions"><button className="secondary-button compact" onClick={() => testConnector(c)}><RefreshCw size={13}/> Testar conexão</button><button className="primary-button compact" onClick={() => { setModal(c); setToken(""); setAccountId(""); setChatId(""); setApiUrl(""); }}>Configurar <ArrowRight size={13}/></button></div></article>)}</div><div className="security-note"><LockKeyhole size={17}/><div><strong>Proteja suas credenciais</strong><p>Esta interface é um protótipo. As credenciais inseridas não são enviadas para APIs nem armazenadas em um cofre seguro. Não utilize tokens reais até implementar um backend seguro.</p></div></div></section>}
    {section === "links" && <section className="surface-panel links-panel"><div className="links-add-row"><div className="links-add-copy"><h2>Alvos monitorados</h2><p>Cadastre domínios críticos para organizar suas verificações.</p></div><form className="add-domain-form" onSubmit={(e) => { e.preventDefault(); addLink(); }}><Globe2 size={16}/><input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="exemplo.com.br" aria-label="Domínio para monitorar"/><button className="primary-button compact" type="submit">Adicionar</button></form></div><div className="table-scroll"><table className="shield-table"><thead><tr><th>DOMÍNIO / ATIVO</th><th>TIPO</th><th>STATUS</th><th>LATÊNCIA</th><th></th></tr></thead><tbody>{links.map((l) => <tr key={l.url}><td><div className="domain-cell"><span className="domain-icon"><Globe2 size={15}/></span><strong>{l.url}</strong><button aria-label="Abrir domínio" className="inline-icon" onClick={() => toast.info("Abertura externa desabilitada nesta demonstração.")}><ExternalLink size={12}/></button></div></td><td>{l.type}</td><td><span className={"link-status " + (l.state === "Protegido" ? "healthy" : "attention")}><span/> {l.state}</span></td><td className="mono">{l.latency}</td><td><button className="secondary-button compact" onClick={() => testLink(l.url)}><RefreshCw size={13}/> Verificar</button></td></tr>)}</tbody></table></div><div className="table-bottom"><span>Exibindo {links.length} alvos</span><span>As verificações de rede ainda não estão ativadas.</span></div></section>}
    {section === "alerts" && <div className="alerts-view"><section className="surface-panel alert-settings"><div className="panel-heading"><div><h2><Bell size={17}/> Canais de notificação</h2><p>Escolha como o SHIELD deve avisar quando detectar uma falha.</p></div><span className="subtle-count">Preferências locais</span></div><AlertToggle icon={<Send size={18}/>} title="Telegram Bot" description="Receba alertas críticos em um chat ou canal." enabled={alerts.telegram} onChange={(v) => setAlerts((a) => ({ ...a, telegram: v }))} badge="Recomendado"/><AlertToggle icon={<Webhook size={18}/>} title="Webhook · Make / n8n / Zapier" description="Envie eventos para seu fluxo de automação." enabled={alerts.webhook} onChange={(v) => setAlerts((a) => ({ ...a, webhook: v }))}/><AlertToggle icon={<Bell size={18}/>} title="Push do navegador" description="Notificações nesta sessão do navegador." enabled={alerts.push} onChange={(v) => setAlerts((a) => ({ ...a, push: v }))}/><div className="alert-config-fields"><label>URL do Webhook<input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://hooks.seu-fluxo.com/..."/></label><label>Chat ID do Telegram<input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="-100123456789"/></label></div><div className="alert-test-row"><div><strong>Teste de alerta emergencial</strong><p>Dispare um evento de teste na interface para validar o fluxo visual.</p></div><button className="primary-button" onClick={() => { addEvent("warn", "ALERT TEST", "Alerta emergencial de demonstração solicitado"); toast.success("Alerta de demonstração registrado no feed. Nenhuma mensagem externa foi enviada."); }}><Send size={15}/> Enviar teste</button></div></section><section className="alert-preview"><div className="preview-icon"><Bell size={20}/></div><div><span className="eyebrow">PRÉVIA DE ALERTA</span><h3>Falha crítica detectada</h3><p>O ativo <strong>checkout.minhaloja.com</strong> não respondeu à última verificação.</p><div className="preview-meta"><span><Clock3 size={13}/> Agora · simulação</span><span><ShieldAlert size={13}/> Severidade alta</span></div></div></section></div>}
    <footer className="shield-page-footer"><span><Shield size={13}/> SHIELD COMMAND CENTER</span><span>Ambiente de demonstração · Nenhuma API real conectada</span></footer>
   </div>
  </main>
  {modal && <div className="shield-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}><section className="shield-modal" role="dialog" aria-modal="true" aria-labelledby="connector-modal-title"><div className="modal-header"><div><span className="eyebrow">CONFIGURAÇÃO DO PROVEDOR</span><h2 id="connector-modal-title">Conectar {modal.name}</h2><p>Insira os dados de acesso para preparar a integração.</p></div><button className="shield-icon-button" onClick={() => setModal(null)} aria-label="Fechar"><X size={18}/></button></div><form onSubmit={(e) => { e.preventDefault(); saveConnector(); }}><div className="modal-provider-row"><span className="connector-avatar large" style={{ "--connector-color": modal.color } as React.CSSProperties}>{modal.initials}</span><div><strong>{modal.name}</strong><span>{modal.detail}</span></div><StatusPill state={modal.state}/></div>
   {modal.id === "meta" ? <><label className="form-label">Access Token<input value={token} onChange={(e) => setToken(e.target.value)} type={showToken ? "text" : "password"} placeholder="Cole o token de acesso" required/><button type="button" className="show-secret" onClick={() => setShowToken((s) => !s)}>{showToken ? "Ocultar" : "Mostrar"}</button></label><label className="form-label">ID da conta de anúncios<input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="act_123456789"/></label><label className="form-label">Business Manager / Pixel ID<input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="Opcional"/></label></> : modal.id === "whatsapp" ? <><label className="form-label">Método de conexão<select value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}><option value="">Selecione um método</option><option value="official">API oficial · Access Token</option><option value="evolution">Evolution API / Z-API</option><option value="qr">Conectar por QR Code (futuro)</option></select></label><label className="form-label">Token / chave da instância<input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token do provedor" required/></label><label className="form-label">URL da instância<input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="https://api.seu-provedor.com"/></label></> : modal.id === "telegram" ? <><label className="form-label">Bot Token · BotFather<input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456:ABC-..." required/></label><label className="form-label">Chat ID / Canal<input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="-100123456789"/></label></> : <><label className="form-label">API Key / App ID<input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Identificador da aplicação"/></label><label className="form-label">App Secret / Access Token<input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Credencial privada" required/></label></>}
   <div className="modal-security"><LockKeyhole size={15}/><span>Protótipo visual: os campos não chamam APIs e não salvam credenciais em um cofre seguro.</span></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Salvando..." : <><CheckCircle2 size={15}/> Salvar configuração</>}</button></div></form></section></div>}
 </div>;
}

function Metric({ icon, label, value, trend, tone }: { icon: React.ReactNode; label: string; value: string; trend: string; tone: string }) {
 return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={"metric-icon " + tone}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-trend"><span className={"metric-trend-dot " + tone}/>{trend}</div><div className={"metric-accent " + tone}/></article>;
}
function StatusPill({ state }: { state: Connector["state"] }) {
 return <span className={"status-pill " + state}><span className="state-dot"/>{statusText[state]}</span>;
}
function QuickAction({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
 return <button className="quick-action" onClick={onClick}><span className="quick-action-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><ArrowRight size={15} className="muted-icon"/></button>;
}
function AlertToggle({ icon, title, description, enabled, onChange, badge }: { icon: React.ReactNode; title: string; description: string; enabled: boolean; onChange: (value: boolean) => void; badge?: string }) {
 return <div className="alert-toggle-row"><span className="alert-channel-icon">{icon}</span><div className="alert-toggle-copy"><div className="alert-toggle-title">{title}{badge && <span className="recommended-badge">{badge}</span>}</div><p>{description}</p></div><button type="button" role="switch" aria-checked={enabled} aria-label={title} className={"switch-control " + (enabled ? "enabled" : "")} onClick={() => onChange(!enabled)}><span/></button></div>;
}
