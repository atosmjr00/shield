// Starts Meta OAuth for the currently authenticated SHIELD user.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SHIELD_APP_URL") ?? "http://localhost:8080",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return json({ error: "Autenticação necessária." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const appId = Deno.env.get("META_APP_ID");
  const redirectUri = Deno.env.get("META_REDIRECT_URI");
  const graphVersion = Deno.env.get("META_GRAPH_API_VERSION");
  if (!supabaseUrl || !anonKey || !serviceKey || !appId || !redirectUri || !graphVersion) {
    return json({ error: "O conector Meta ainda não está configurado no servidor." }, 503);
  }

  const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${jwt}` } }, auth: { persistSession: false } });
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return json({ error: "Sessão inválida ou expirada." }, 401);

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const state = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const { error: insertError } = await admin.from("meta_oauth_states").insert({
    state_hash: await sha256(state),
    user_id: user.id,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (insertError) return json({ error: "Não foi possível iniciar a autorização. Confira a migração do SHIELD." }, 500);

  const url = new URL(`https://www.facebook.com/${graphVersion}/dialog/oauth`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "ads_read,read_insights");
  return json({ url: url.toString() });
});
