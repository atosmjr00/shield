import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/cadastro")({ head: () => ({ meta: [{ title: "Criar acesso — SHIELD" }] }), component: SignupPage });

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault(); setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) { setMessage("Cadastro ainda não configurado. Adicione as variáveis do Supabase no arquivo .env e reinicie o servidor."); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    if (data.session) await navigate({ to: "/painel" });
    else setMessage("Cadastro recebido. Confira seu e-mail para confirmar a conta antes de entrar.");
  }
  return <main className="auth-shell"><Link to="/" className="auth-back"><ArrowLeft size={15}/> Voltar ao início</Link><section className="auth-card"><Link to="/" className="landing-brand auth-brand"><span className="landing-logo"><ShieldCheck size={22}/></span><span>SHIELD<span className="landing-brand-dot">.</span><small>OPERATIONAL INTELLIGENCE</small></span></Link><div className="auth-kicker">NOVO WORKSPACE</div><h1>Crie seu acesso.</h1><p className="auth-description">Prepare seu espaço de operação no SHIELD.</p><form onSubmit={submit} className="auth-form"><label>Nome<input autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome"/></label><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com"/></label><label>Senha<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres"/></label>{message&&<p className="auth-message" role="status">{message}</p>}<button className="landing-primary auth-submit" type="submit" disabled={busy}>{busy?"Criando acesso...":"Criar conta"} <ArrowRight size={16}/></button></form><p className="auth-switch">Já tem acesso? <Link to="/login">Entrar</Link></p><p className="auth-footnote">O cadastro só funciona depois de configurar um projeto Supabase.</p></section></main>;
}
