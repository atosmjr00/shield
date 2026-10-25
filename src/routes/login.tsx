import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, FlaskConical } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/login")({ head: () => ({ meta: [{ title: "Entrar — SHIELD" }] }), component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [demoAvailable] = useState(() => !getSupabaseClient());
  async function enterDemo() { setMessage(""); await navigate({ to: "/painel" }); }
  async function submit(e: FormEvent) {
    e.preventDefault(); setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) { setMessage("Autenticação ainda não configurada. Adicione as variáveis do Supabase no arquivo .env e reinicie o servidor."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    await navigate({ to: "/painel" });
  }
  return <main className="auth-shell"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Voltar ao início</Link><section className="auth-card"><Link to="/" className="landing-brand auth-brand"><span className="landing-logo"><ShieldCheck size={22}/></span><span>SHIELD<span className="landing-brand-dot">.</span><small>OPERATIONAL INTELLIGENCE</small></span></Link><div className="auth-kicker">ACESSO À PLATAFORMA</div><h1>Bem-vindo de volta.</h1><p className="auth-description">Entre para acessar seu centro de comando.</p><form onSubmit={submit} className="auth-form"><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com"/></label><label>Senha<input type="password" autoComplete="current-password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></label>{message&&<p className="auth-message" role="alert">{message}</p>}<button className="landing-primary auth-submit" type="submit" disabled={busy}>{busy?"Entrando...":"Entrar no SHIELD"} <ArrowRight size={16}/></button></form><p className="auth-switch">Ainda não tem acesso? <Link to="/cadastro">Criar conta</Link></p>{demoAvailable && <div className="auth-demo-divider"><span>OU</span></div>}{demoAvailable && <button type="button" className="auth-demo-button" onClick={enterDemo}><FlaskConical size={15}/> Entrar em modo demonstração <ArrowRight size={14}/></button>}<p className="auth-footnote">{demoAvailable ? "Modo demonstração: dados ilustrativos, sem conexão real com contas de anúncios." : "A autenticação é gerenciada pelo Supabase."}</p></section></main>;
}
