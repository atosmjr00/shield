import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, BellRing, ChartNoAxesCombined, CheckCircle2, ChevronRight, CircleDot, ShieldCheck, Signal, Zap } from "lucide-react";

export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: "SHIELD — Inteligência operacional para sua operação digital" },
  { name: "description", content: "Monitore contas, integrações, links e incidentes da sua operação digital em um único centro de comando." },
] }), component: LandingPage });

const capabilities = [
  { icon: Signal, title: "Saúde das integrações", description: "Enxergue conexões pendentes, alertas e falhas por ativo, sem misturar demonstração com dados reais." },
  { icon: BellRing, title: "Incidentes em contexto", description: "Organize sinais operacionais e saiba o que precisa de atenção primeiro." },
  { icon: ChartNoAxesCombined, title: "Visão de operação", description: "Construa uma leitura única dos ativos digitais e prepare o caminho para métricas de desempenho." },
];

function LandingPage() {
  return <main className="landing-shell">
    <nav className="landing-nav">
      <Link to="/" className="landing-brand" aria-label="SHIELD início"><span className="landing-logo"><ShieldCheck size={22}/></span><span>SHIELD<span className="landing-brand-dot">.</span><small>OPERATIONAL INTELLIGENCE</small></span></Link>
      <div className="landing-nav-actions"><a href="#capacidades" className="landing-nav-link">Capacidades</a><Link to="/login" className="landing-login">Entrar</Link><Link to="/cadastro" className="landing-nav-cta">Criar acesso <ArrowRight size={15}/></Link></div>
    </nav>
    <section className="landing-hero">
      <div className="landing-copy">
        <div className="landing-kicker"><span className="landing-pulse"/> CENTRO DE COMANDO DIGITAL</div>
        <h1>Menos ruído.<br/><span>Mais controle</span> da operação.</h1>
        <p className="landing-lead">O SHIELD reúne sinais, conexões e incidentes dos seus ativos digitais para você entender o que está acontecendo e agir com prioridade.</p>
        <div className="landing-hero-actions"><Link to="/cadastro" className="landing-primary">Começar agora <ArrowRight size={17}/></Link><a href="#capacidades" className="landing-secondary">Conhecer a plataforma <ChevronRight size={16}/></a></div>
        <div className="landing-trust"><span><CheckCircle2 size={15}/> Visão centralizada</span><span><CheckCircle2 size={15}/> Status transparente</span><span><CheckCircle2 size={15}/> Controle por ativo</span></div>
      </div>
      <div className="landing-console" aria-label="Prévia ilustrativa do painel SHIELD">
        <div className="console-top"><div className="console-brand"><ShieldCheck size={17}/> SHIELD <span>/ OVERVIEW</span></div><span className="console-demo"><i/> PRÉVIA ILUSTRATIVA</span></div>
        <div className="console-heading"><div><small>RESUMO DA OPERAÇÃO</small><h2>Sinais operacionais</h2></div><span className="console-time">VISÃO CONCEITUAL</span></div>
        <div className="console-metrics"><div><small>ATIVOS MONITORADOS</small><strong>01 <em>visão</em></strong><span><CircleDot size={12}/> Estrutura central</span></div><div><small>INTEGRAÇÕES</small><strong>Conectáveis</strong><span>Após configuração</span></div><div><small>ALERTAS</small><strong>Prioridade</strong><span>Contexto por ativo</span></div></div>
        <div className="console-section-title"><Activity size={15}/> CAMADA DE INTELIGÊNCIA <span>PREPARADA PARA INTEGRAÇÕES</span></div>
        {["Contas e APIs","Monitor de links","Central de alertas"].map((label,i)=><div className="console-row" key={label}><span className={"console-row-icon c"+i}>{i===0?<Signal size={16}/>:i===1?<Zap size={16}/>:<BellRing size={16}/>}</span><span>{label}<small>{["Conexões e permissões","Disponibilidade dos ativos","Eventos que exigem ação"][i]}</small></span><em>CONFIGURÁVEL</em><ChevronRight size={15}/></div>)}
        <div className="console-note"><span className="console-note-dot"/> Esta prévia é ilustrativa. Métricas reais aparecem após conectar e configurar as fontes de dados.</div>
      </div>
    </section>
    <section className="landing-capabilities" id="capacidades"><div className="landing-section-heading"><div className="landing-kicker">PROJETADO PARA AGIR</div><h2>Uma operação. Sinais claros.</h2><p>O SHIELD está sendo construído para sair de ferramentas isoladas e dar contexto aos ativos que sustentam sua operação.</p></div><div className="landing-feature-grid">{capabilities.map(({icon:Icon,title,description},i)=><article className="landing-feature" key={title}><div className="landing-feature-icon"><Icon size={20}/></div><small>0{i+1} / CAPACIDADE</small><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="landing-bottom-cta"><div><div className="landing-kicker">SHIELD INTELLIGENCE</div><h2>Assuma o controle do que importa.</h2><p>Crie seu acesso e acompanhe a evolução da plataforma.</p></div><Link to="/cadastro" className="landing-primary">Criar meu acesso <ArrowRight size={16}/></Link></section>
    <footer className="landing-footer"><Link to="/" className="landing-footer-brand"><ShieldCheck size={16}/> SHIELD</Link><span>Inteligência operacional para ativos digitais.</span><div><Link to="/login">Entrar</Link><Link to="/cadastro">Cadastro</Link></div></footer>
  </main>;
}
