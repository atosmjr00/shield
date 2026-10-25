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
  async function signInWithGoogle() {
    setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) { setMessage("Login com Google ainda não está configurado. Configure o Supabase e o provedor Google primeiro."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/painel` },
    });
    if (error) { setBusy(false); setMessage(error.message); }
  }
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
  return <main className="auth-shell"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Voltar ao início</Link><section className="auth-card"><Link to="/" className="landing-brand auth-brand"><span className="landing-logo"><ShieldCheck size={22}/></span><span>SHIELD<span className="landing-brand-dot">.</span><small>OPERATIONAL INTELLIGENCE</small></span></Link><div className="auth-kicker">ACESSO À PLATAFORMA</div><h1>Bem-vindo de volta.</h1><p className="auth-description">Entre para acessar seu centro de comando.</p><button type="button" className="auth-google-button" onClick={signInWithGoogle} disabled={busy}><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.46 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.88 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.55-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>Continuar com Google <ArrowRight size={15}/></button><form onSubmit={submit} className="auth-form"><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com"/></label><label>Senha<input type="password" autoComplete="current-password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></label>{message&&<p className="auth-message" role="alert">{message}</p>}<button className="landing-primary auth-submit" type="submit" disabled={busy}>{busy?"Entrando...":"Entrar no SHIELD"} <ArrowRight size={16}/></button></form><p className="auth-switch">Ainda não tem acesso? <Link to="/cadastro">Criar conta</Link></p>{demoAvailable && <div className="auth-demo-divider"><span>OU</span></div>}{demoAvailable && <button type="button" className="auth-demo-button" onClick={enterDemo}><FlaskConical size={15}/> Entrar em modo demonstração <ArrowRight size={14}/></button>}<p className="auth-footnote">{demoAvailable ? "Modo demonstração: dados ilustrativos, sem conexão real com contas de anúncios." : "A autenticação é gerenciada pelo Supabase."}</p></section></main>;
}
