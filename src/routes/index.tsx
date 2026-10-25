import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, ShieldCheck, CircleCheck, ChartNoAxesCombined, BellRing, Blocks, LockKeyhole, ChevronRight, RadioTower, ChartColumnIncreasing, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: "SHIELD — Visibilidade e controle para sua operação digital" },
  { name: "description", content: "Centralize ativos digitais, organize conexões e acompanhe sinais operacionais em um único espaço." },
] }), component: LandingPage });

function LandingPage() {
  return <main className="shield-site">
    <header className="shield-nav">
      <Link to="/" className="shield-wordmark"><span className="shield-mark"><ShieldCheck size={19}/></span>SHIELD<span className="shield-wordmark-dot">.</span></Link>
      <nav className="shield-nav-links"><a href="#plataforma">Plataforma</a><a href="#recursos">Recursos</a><a href="#seguranca">Segurança</a></nav>
      <div className="shield-nav-actions"><Link to="/login" className="shield-signin">Entrar</Link><Link to="/cadastro" className="shield-nav-cta">Acessar plataforma <ArrowRight size={14}/></Link></div>
    </header>

    <section className="shield-hero" id="plataforma">
      <div className="shield-hero-copy">
        <div className="shield-eyebrow"><span/> VISIBILIDADE PARA OPERAÇÕES DIGITAIS</div>
        <h1>Controle sua operação.<br/><span>Sem pontos cegos.</span></h1>
        <p className="shield-hero-text">Uma central para organizar suas contas, entender o estado das conexões e enxergar o que precisa de atenção — com transparência sobre cada dado.</p>
        <div className="shield-hero-actions"><Link to="/cadastro" className="shield-btn-primary">Entrar no SHIELD <ArrowRight size={16}/></Link><a href="#recursos" className="shield-btn-quiet">Conhecer a plataforma <ChevronRight size={15}/></a></div>
        <div className="shield-proof"><span><CircleCheck size={14}/> Visão centralizada</span><span><CircleCheck size={14}/> Status identificados</span><span><CircleCheck size={14}/> Dados sem maquiagem</span></div>
      </div>
      <div className="shield-visual">
        <div className="shield-visual-top"><div><span className="shield-live-dot"/><span>SHIELD / WORKSPACE</span></div><span className="shield-preview-tag">PRÉVIA ILUSTRATIVA</span></div>
        <div className="shield-preview-layout">
          <aside className="shield-preview-sidebar"><div className="shield-preview-brand"><ShieldCheck size={17}/> SHIELD</div><span className="preview-nav-active"><Activity size={13}/> Visão geral</span><span><Blocks size={13}/> Integrações</span><span><BellRing size={13}/> Alertas</span><span><ChartNoAxesCombined size={13}/> Relatórios</span><div className="preview-sidebar-bottom"><LockKeyhole size={12}/> Espaço privado</div></aside>
          <div className="shield-preview-main">
            <div className="shield-preview-welcome"><div><small>WORKSPACE / VISÃO GERAL</small><h3>Visão da operação</h3><p>Um lugar para acompanhar seus ativos.</p></div><span className="shield-preview-status"><i/> DEMO</span></div>
            <div className="shield-stat-grid"><div className="shield-stat"><span>CONTAS</span><strong>—</strong><small>Aguardando conexão</small></div><div className="shield-stat"><span>FONTES ATIVAS</span><strong>0</strong><small>Nenhuma autorizada</small></div><div className="shield-stat"><span>ALERTAS</span><strong>—</strong><small>Sem dados conectados</small></div></div>
            <div className="shield-chart-card"><div className="shield-chart-title"><div><span className="shield-mini-label">ATIVIDADE</span><h3>Desempenho ao longo do tempo</h3></div><span className="shield-empty-chip">AGUARDANDO DADOS</span></div><div className="shield-chart"><div className="shield-chart-grid"><i/><i/><i/><i/></div><div className="shield-chart-empty"><ChartColumnIncreasing size={22}/><span>Conecte uma fonte para começar</span></div></div></div>
            <div className="shield-preview-foot"><LockKeyhole size={12}/> Nenhuma métrica real é exibida nesta prévia.</div>
          </div>
        </div>
      </div>
      <div className="shield-orbit shield-orbit-one"/><div className="shield-orbit shield-orbit-two"/>
    </section>

    <section className="shield-marquee"><span>CONTAS EM UM SÓ LUGAR</span><i/><span>CONEXÕES TRANSPARENTES</span><i/><span>ALERTAS COM CONTEXTO</span><i/><span>CONTROLE OPERACIONAL</span></section>
    <section className="shield-features" id="recursos"><div className="shield-section-top"><div><div className="shield-eyebrow"><span/> CONSTRUÍDO PARA DAR CLAREZA</div><h2>Menos improviso.<br/><span>Mais controle.</span></h2></div><p>Uma interface objetiva para acompanhar a saúde da operação. Cada plataforma mostra claramente se está conectada, pendente de autorização ou aguardando configuração.</p></div><div className="shield-feature-grid">
      <article><span className="shield-feature-icon"><Blocks size={20}/></span><small>01 / ORGANIZAÇÃO</small><h3>Seus ativos, organizados</h3><p>Reúna referências de contas e integrações sem misturar informações de fontes diferentes.</p></article>
      <article><span className="shield-feature-icon"><RadioTower size={20}/></span><small>02 / CONECTIVIDADE</small><h3>Status sem ambiguidades</h3><p>Saiba o que está autorizado, o que ainda precisa de configuração e o que está realmente recebendo dados.</p></article>
      <article><span className="shield-feature-icon"><BellRing size={20}/></span><small>03 / ACOMPANHAMENTO</small><h3>Contexto para agir</h3><p>Prepare uma rotina de alertas e leitura operacional para não depender de abas e anotações soltas.</p></article>
    </div></section>
    <section className="shield-security" id="seguranca"><div className="shield-security-icon"><Fingerprint size={25}/></div><div><div className="shield-eyebrow"><span/> TRANSPARÊNCIA POR PADRÃO</div><h2>Conectar é diferente de cadastrar.</h2><p>O SHIELD identifica quando uma integração ainda não foi autorizada. A leitura de métricas reais depende da autenticação oficial e das permissões concedidas à plataforma.</p></div><div className="shield-security-points"><span><CircleCheck size={15}/> Sem métricas inventadas</span><span><CircleCheck size={15}/> Status explícitos</span><span><CircleCheck size={15}/> Integrações por autorização</span></div></section>
    <section className="shield-how"><div className="shield-how-icon"><Activity size={23}/></div><div><div className="shield-eyebrow"><span/> SEU PRÓXIMO PASSO</div><h2>Comece pelo seu workspace.</h2><p>Entre no ambiente, veja a estrutura e confira as integrações disponíveis. Conectores que exigem credenciais externas são identificados com clareza.</p></div><Link to="/cadastro" className="shield-btn-primary">Criar meu acesso <ArrowRight size={16}/></Link></section>
    <footer className="shield-footer"><Link to="/" className="shield-wordmark"><span className="shield-mark"><ShieldCheck size={16}/></span>SHIELD<span className="shield-wordmark-dot">.</span></Link><span>OPERATIONAL VISIBILITY PLATFORM</span><div><Link to="/login">Entrar</Link><Link to="/cadastro">Criar acesso</Link></div></footer>
  </main>;
}