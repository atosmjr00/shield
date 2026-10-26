// Meta OAuth callback. Exchanges the authorization code on the server and stores the token behind RLS.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function html(message: string, status = 200) {
  return new Response(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SHIELD · Meta Ads</title><body style="font:16px system-ui;background:#09090b;color:#fafafa;display:grid;place-items:center;min-height:100vh;margin:0"><main style="max-width:520px;padding:32px"><h1>SHIELD · Meta Ads</h1><p>${message}</p><p>Você pode fechar esta janela e voltar ao SHIELD.</p></main></body></html>`, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const metaError = requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
  const appUrl = Deno.env.get("SHIELD_APP_URL") ?? "http://localhost:8080";
  if (metaError) return Response.redirect(new URL("/painel?meta_error=authorization_denied", appUrl), 302);
  if (!code || !state) return html("A Meta não retornou os parâmetros necessários. Volte ao SHIELD e tente novamente.", 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const appId = Deno.env.get("META_APP_ID");
  const appSecret = Deno.env.get("META_APP_SECRET");
  const redirectUri = Deno.env.get("META_REDIRECT_URI");
  const graphVersion = Deno.env.get("META_GRAPH_API_VERSION");
  if (!supabaseUrl || !serviceKey || !appId || !appSecret || !redirectUri || !graphVersion) return html("O conector Meta ainda não está configurado no servidor.", 503);

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const stateHash = await sha256(state);
  const { data: stateRow, error: stateError } = await admin.from("meta_oauth_states")
    .select("state_hash,user_id,expires_at,used_at")
    .eq("state_hash", stateHash).maybeSingle();
  if (stateError || !stateRow || stateRow.used_at || new Date(stateRow.expires_at).getTime() < Date.now()) {
    return html("A sessão de autorização expirou ou já foi usada. Volte ao SHIELD e inicie a conexão novamente.", 400);
  }

  const { data: claimed, error: claimError } = await admin.from("meta_oauth_states")
    .update({ used_at: new Date().toISOString() })
    .eq("state_hash", stateHash).is("used_at", null).select("user_id").maybeSingle();
  if (claimError || !claimed) return html("Esta autorização já foi processada. Volte ao SHIELD para conferir o estado da conexão.", 400);

  const tokenUrl = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);
  const shortTokenResponse = await fetch(tokenUrl);
  const shortToken = await shortTokenResponse.json();
  if (!shortTokenResponse.ok || !shortToken.access_token) return html("A Meta recusou a troca do código. Verifique as credenciais e a URI de retorno configurada no servidor.", 502);

  const longUrl = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
  longUrl.searchParams.set("grant_type", "fb_exchange_token");
  longUrl.searchParams.set("client_id", appId);
  longUrl.searchParams.set("client_secret", appSecret);
  longUrl.searchParams.set("fb_exchange_token", shortToken.access_token);
  const longResponse = await fetch(longUrl);
  const longToken = await longResponse.json();
  const token = longResponse.ok && longToken.access_token ? longToken : shortToken;
  const expiresAt = token.expires_in ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString() : null;

  const profileUrl = new URL(`https://graph.facebook.com/${graphVersion}/me`);
  profileUrl.searchParams.set("fields", "id,name");
  profileUrl.searchParams.set("access_token", token.access_token);
  const profileResponse = await fetch(profileUrl);
  const profile = profileResponse.ok ? await profileResponse.json() : {};

  const { error: saveError } = await admin.from("meta_connections").upsert({
    user_id: claimed.user_id,
    meta_user_id: profile.id ?? null,
    meta_user_name: profile.name ?? null,
    access_token: token.access_token,
    token_type: "bearer",
    expires_at: expiresAt,
    scopes: ["ads_read", "read_insights"],
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (saveError) return html("A autorização foi recebida, mas não foi possível guardar a conexão com segurança. Verifique a migração do SHIELD.", 500);

  return Response.redirect(new URL("/painel?meta_connected=1", appUrl), 302);
});
