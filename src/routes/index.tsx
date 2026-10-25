import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, BarChart3, Bell, Check, ChevronRight, CircleDollarSign, Command, Layers3, LockKeyhole, MousePointerClick, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";

export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: "SHIELD — Controle sua operação de tráfego" },
  { name: "description", content: "Centralize contas, campanhas e alertas em um só painel." },
] }), component: LandingPage });

function LandingPage() {
  return <main className="shield-site">
    <header className="shield-nav">
      <Link to="/" className="shield-wordmark"><span className="shield-mark"><Shield size={19}/></span>SHIELD<span className="shield-wordmark-dot">/</span></Link>
      <nav className="shield-nav-links"><a href="#produto">Produto</a><a href="#recursos">Recursos</a><a href="#como-funciona">Como funciona</a></nav>
      <div className="shield-nav-actions"><Link to="/login" className="shield-signin">Entrar</Link><Link to="/cadastro" className="shield-nav-cta">Acessar plataforma <ArrowRight size={14}/></Link></div>
    </header>
    <section className="shield-hero" id="produto">
      <div className="shield-hero-copy">
        <div className="shield-eyebrow"><span/> INTELIGÊNCIA PARA OPERAÇÕES DIGITAIS</div>
        <h1>Seu tráfego.<br/>Sua operação.<br/><span>Sob controle.</span></h1>
        <p className="shield-hero-text">Uma central para acompanhar suas contas, identificar o que precisa de atenção e tomar decisões sem ficar pulando entre plataformas.</p>
        <div className="shield-hero-actions"><Link to="/cadastro" className="shield-btn-primary">Conhecer o SHIELD <ArrowRight size={16}/></Link><Link to="/login" className="shield-btn-quiet">Já tenho acesso <ChevronRight size={15}/></Link></div>
        <div className="shield-proof"><span><Check size={13}/> Visão centralizada</span><span><Check size={13}/> Alertas operacionais</span><span><Check size={13}/> Feito para escalar</span></div>
      </div>
      <div className="shield-visual">
        <div className="shield-visual-top"><div><span className="shield-live-dot"/> <span>SHIELD / COMMAND CENTER</span></div><span className="shield-preview-tag">PRÉVIA DO PRODUTO</span></div>
        <div className="shield-dash-head"><div><span className="shield-mini-label">VISÃO GERAL</span><h2>Bom dia, operador.</h2><p>Acompanhe os sinais da sua operação.</p></div><button type="button" className="shield-date-pill"><Command size={12}/> DEMONSTRAÇÃO</button></div>
        <div className="shield-stat-grid"><div className="shield-stat"><span>CONTAS</span><strong>—</strong><small>Aguardando conexão</small></div><div className="shield-stat"><span>INVESTIMENTO</span><strong>R$ —</strong><small>Sem dados conectados</small></div><div className="shield-stat"><span>ALERTAS</span><strong>—</strong><small>Monitoramento pendente</small></div></div>
        <div className="shield-chart-card"><div className="shield-chart-title"><div><span className="shield-mini-label">ATIVIDADE DA OPERAÇÃO</span><h3>Desempenho ao longo do tempo</h3></div><span className="shield-empty-chip">SEM DADOS REAIS</span></div><div className="shield-chart"><div className="shield-chart-grid"><i/><i/><i/><i/></div><svg viewBox="0 0 560 125" preserveAspectRatio="none" aria-label="Gráfico ilustrativo sem dados reais"><defs><linearGradient id="shieldFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity=".25"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs><path d="M0 105 C35 98 44 80 70 86 S112 100 140 66 S180 75 205 60 S250 82 275 45 S320 55 350 36 S390 54 415 29 S455 50 480 24 S525 36 560 8 L560 125 L0 125Z" fill="url(#shieldFill)"/><path d="M0 105 C35 98 44 80 70 86 S112 100 140 66 S180 75 205 60 S250 82 275 45 S320 55 350 36 S390 54 415 29 S455 50 480 24 S525 36 560 8" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/></svg><div className="shield-chart-empty">Conecte uma fonte de dados para visualizar suas métricas</div></div><div className="shield-chart-axis"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div></div>
        <div className="shield-bottom-widgets"><div className="shield-widget"><span className="shield-widget-icon purple"><Bell size={15}/></span><div><strong>Alertas inteligentes</strong><small>Eventos que merecem atenção</small></div><ChevronRight size={14}/></div><div className="shield-widget"><span className="shield-widget-icon green"><TrendingUp size={15}/></span><div><strong>Visão de desempenho</strong><small>Indicadores em um só lugar</small></div><ChevronRight size={14}/></div></div>
        <div className="shield-preview-foot"><LockKeyhole size={12}/> Prévia visual — os dados serão exibidos após configurar integrações.</div>
      </div>
      <div className="shield-orbit shield-orbit-one"/><div className="shield-orbit shield-orbit-two"/>
    </section>
    <section className="shield-marquee"><span>MENOS ABAS ABERTAS</span><i/> <span>MAIS CONTEXTO</span><i/> <span>DECISÕES MAIS RÁPIDAS</span><i/> <span>OPERAÇÃO EM UM LUGAR</span></section>
    <section className="shield-features" id="recursos"><div className="shield-section-top"><div><div className="shield-eyebrow"><span/> UM CENTRO DE COMANDO</div><h2>Enxergue o todo.<br/><span>Atue no detalhe.</span></h2></div><p>O SHIELD está sendo construído para transformar informações espalhadas em uma visão operacional clara — sem inventar métricas nem esconder o que ainda não foi conectado.</p></div><div className="shield-feature-grid"><article><span className="shield-feature-icon"><Layers3 size={20}/></span><small>01 / CENTRALIZAÇÃO</small><h3>Contas em contexto</h3><p>Organize seus ativos e acompanhe o estado das conexões em uma visão única.</p><ArrowDownRight size={18}/></article><article><span className="shield-feature-icon"><Zap size={20}/></span><small>02 / MONITORAMENTO</small><h3>Alertas que importam</h3><p>Prepare uma rotina para destacar falhas, pendências e eventos que pedem ação.</p><ArrowDownRight size={18}/></article><article><span className="shield-feature-icon"><BarChart3 size={20}/></span><small>03 / INTELIGÊNCIA</small><h3>Dados para decidir</h3><p>Estruture o caminho para cruzar investimento, desempenho e saúde da operação.</p><ArrowDownRight size={18}/></article></div></section>
    <section className="shield-how" id="como-funciona"><div className="shield-how-icon"><Sparkles size={23}/></div><div><div className="shield-eyebrow"><span/> SIMPLES NA ORIGEM</div><h2>Conecte. Entenda. <span>Decida.</span></h2><p>Entre no painel, configure suas fontes de dados e acompanhe a operação. As integrações reais são habilitadas à medida que cada conector é configurado.</p></div><Link to="/cadastro" className="shield-btn-primary">Criar meu acesso <ArrowRight size={16}/></Link></section>
    <footer className="shield-footer"><Link to="/" className="shield-wordmark"><span className="shield-mark"><Shield size={16}/></span>SHIELD<span className="shield-wordmark-dot">/</span></Link><span>INTELLIGENCE FOR DIGITAL OPERATIONS</span><div><Link to="/login">Entrar</Link><Link to="/cadastro">Criar acesso</Link></div></footer>
  </main>;
}
