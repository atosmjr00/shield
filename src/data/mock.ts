import type {
  Activity,
  AdAccount,
  AlertItem,
  Brand,
  Campaign,
  CostRules,
  DailyMetric,
  Integration,
  Lead,
  LeadEvent,
  Organization,
  Product,
} from "@/lib/types";

/** Data de referência fixa do ambiente demonstrativo (evita divergência SSR/cliente). */
export const TODAY = "2026-10-21";

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const organizations: Organization[] = [
  { id: "org-aurora", name: "Grupo Aurora", plan: "Enterprise" },
  { id: "org-nexo", name: "Nexo Commerce", plan: "Growth" },
];

export const brands: Brand[] = [
  { id: "b-lumen", orgId: "org-aurora", name: "Lumen Skin", currency: "BRL", timezone: "America/Sao_Paulo", domains: ["lumenskin.com.br"], checkouts: ["Checkout próprio", "Gateway A"] },
  { id: "b-forma", orgId: "org-aurora", name: "Forma Fit", currency: "BRL", timezone: "America/Sao_Paulo", domains: ["formafit.com.br", "lp.formafit.com.br"], checkouts: ["Plataforma de checkout B"] },
  { id: "b-ateliê", orgId: "org-aurora", name: "Ateliê Casa", currency: "BRL", timezone: "America/Recife", domains: ["ateliecasa.com"], checkouts: ["Gateway A"] },
  { id: "b-vela", orgId: "org-nexo", name: "Vela Academy", currency: "BRL", timezone: "America/Sao_Paulo", domains: ["vela.academy"], checkouts: ["Plataforma de checkout B"] },
  { id: "b-pulso", orgId: "org-nexo", name: "Pulso Nutri", currency: "BRL", timezone: "America/Manaus", domains: ["pulsonutri.com.br"], checkouts: ["Checkout próprio"] },
];

export const products: Product[] = [
  { id: "p1", brandId: "b-lumen", name: "Sérum Vitamina C", price: 189, variableCostPct: 22 },
  { id: "p2", brandId: "b-lumen", name: "Kit Rotina Noturna", price: 349, variableCostPct: 26 },
  { id: "p3", brandId: "b-forma", name: "Programa 12 semanas", price: 297, variableCostPct: 6 },
  { id: "p4", brandId: "b-forma", name: "Whey Isolado 900g", price: 219, variableCostPct: 41 },
  { id: "p5", brandId: "b-ateliê", name: "Jogo de Cama Linho", price: 459, variableCostPct: 38 },
  { id: "p6", brandId: "b-vela", name: "Curso Data Analytics", price: 997, variableCostPct: 4 },
  { id: "p7", brandId: "b-vela", name: "Mentoria em Grupo", price: 2400, variableCostPct: 12 },
  { id: "p8", brandId: "b-pulso", name: "Assinatura Mensal", price: 129, variableCostPct: 34 },
];

export const defaultCostRules: Record<string, CostRules> = {
  "b-lumen": { paymentFeePct: 4.2, variableCostPct: 24, commissionPct: 3, taxPct: 9.5, fixedPerOrder: 6 },
  "b-forma": { paymentFeePct: 4.5, variableCostPct: 20, commissionPct: 5, taxPct: 9.5, fixedPerOrder: 4 },
  "b-ateliê": { paymentFeePct: 3.9, variableCostPct: 38, commissionPct: 2, taxPct: 11, fixedPerOrder: 18 },
  "b-vela": { paymentFeePct: 5.1, variableCostPct: 6, commissionPct: 10, taxPct: 6, fixedPerOrder: 0 },
  "b-pulso": { paymentFeePct: 4.0, variableCostPct: 34, commissionPct: 2, taxPct: 9.5, fixedPerOrder: 9 },
};

const brandProfile: Record<string, { spend: number; roas: number; aov: number; trend: number }> = {
  "b-lumen": { spend: 9200, roas: 3.1, aov: 245, trend: 0.0018 },
  "b-forma": { spend: 6400, roas: 2.6, aov: 260, trend: -0.0012 },
  "b-ateliê": { spend: 3100, roas: 3.6, aov: 470, trend: 0.0006 },
  "b-vela": { spend: 7800, roas: 2.9, aov: 1180, trend: 0.0022 },
  "b-pulso": { spend: 2600, roas: 2.2, aov: 132, trend: -0.002 },
};

function addDays(iso: string, d: number) {
  const dt = new Date(iso + "T12:00:00Z");
  dt.setUTCDate(dt.getUTCDate() + d);
  return dt.toISOString().slice(0, 10);
}

/** 180 dias por marca, permitindo comparar até 90 dias com o período anterior. */
export const dailyMetrics: DailyMetric[] = (() => {
  const out: DailyMetric[] = [];
  brands.forEach((b, bi) => {
    const r = rng(100 + bi * 17);
    const p = brandProfile[b.id]!;
    for (let i = 179; i >= 0; i--) {
      const date = addDays(TODAY, -i);
      const t = 179 - i;
      const weekday = new Date(date + "T12:00:00Z").getUTCDay();
      const season = 1 + (weekday === 0 || weekday === 6 ? -0.12 : 0.04);
      const spend = p.spend * season * (1 + p.trend * t) * (0.85 + r() * 0.3);
      const roas = p.roas * (0.82 + r() * 0.36) * (1 - (b.id === "b-forma" && i < 10 ? 0.25 : 0));
      const gross = spend * roas * 1.12;
      const approved = gross * (0.86 + r() * 0.05);
      const refunds = approved * (0.025 + r() * 0.03);
      const chargebacks = approved * (0.002 + r() * 0.006);
      const settledShare = i < 14 ? 0.55 + (14 - i) * -0.03 + 0.4 : 0.97;
      const settled = approved * Math.max(0.2, Math.min(0.98, settledShare));
      const orders = Math.max(1, Math.round(approved / (p.aov * (0.9 + r() * 0.2))));
      const checkouts = Math.round(orders * (2.2 + r() * 0.8));
      const leads = Math.round(checkouts * (2.6 + r() * 1.2));
      const visitors = Math.round(leads * (6 + r() * 4));
      out.push({ date, brandId: b.id, grossRevenue: gross, approvedRevenue: approved, settledRevenue: settled, refunds, chargebacks, spend, orders, visitors, leads, checkouts });
    }
  });
  return out;
})();

export const adAccounts: AdAccount[] = [
  { id: "acc-1", name: "Lumen | BR Principal", platform: "meta", brandId: "b-lumen", status: "connected", lastSync: "2026-10-21T22:48:00Z", alerts: [] },
  { id: "acc-2", name: "Lumen | Search", platform: "google", brandId: "b-lumen", status: "syncing", lastSync: "2026-10-21T21:10:00Z", alerts: ["Sincronização em andamento"] },
  { id: "acc-3", name: "Forma | Aquisição", platform: "meta", brandId: "b-forma", status: "connected", lastSync: "2026-10-21T22:30:00Z", alerts: ["CPA 31% acima da média de 30 dias"] },
  { id: "acc-4", name: "Forma | YouTube", platform: "google", brandId: "b-forma", status: "error", lastSync: "2026-10-19T08:02:00Z", alerts: ["Token expirado — dados desde 19/10 ausentes"] },
  { id: "acc-5", name: "Ateliê | Shopping", platform: "google", brandId: "b-ateliê", status: "connected", lastSync: "2026-10-21T22:41:00Z", alerts: [] },
  { id: "acc-6", name: "Vela | Lançamentos", platform: "meta", brandId: "b-vela", status: "connected", lastSync: "2026-10-21T22:52:00Z", alerts: [] },
  { id: "acc-7", name: "Vela | TikTok Teste", platform: "tiktok", brandId: "b-vela", status: "disconnected", lastSync: null, alerts: ["Conta sem conexão"] },
  { id: "acc-8", name: "Pulso | Perpétuo", platform: "meta", brandId: "b-pulso", status: "connected", lastSync: "2026-10-21T20:15:00Z", alerts: ["Eventos de compra com 12% sem correspondência"] },
];

/** Participação de cada conta no investimento da marca. */
export const accountSpendShare: Record<string, number> = {
  "acc-1": 0.68, "acc-2": 0.32, "acc-3": 0.8, "acc-4": 0.2, "acc-5": 1, "acc-6": 0.94, "acc-7": 0.06, "acc-8": 1,
};

const campaignSeeds: Array<[string, string, string, string, string, string, number, number, number, number]> = [
  // id, brand, account, name, channel, medium, spendW, first, last, linear
  ["c1", "b-lumen", "acc-1", "VitC | Prospecção Lookalike", "Meta Ads", "paid_social", 0.38, 0.42, 0.31, 0.36],
  ["c2", "b-lumen", "acc-1", "Remarketing 7d Carrinho", "Meta Ads", "paid_social", 0.3, 0.12, 0.33, 0.24],
  ["c3", "b-lumen", "acc-2", "Search Marca", "Google Ads", "cpc", 0.12, 0.08, 0.24, 0.17],
  ["c4", "b-lumen", "acc-2", "Search Genérico Sérum", "Google Ads", "cpc", 0.2, 0.38, 0.12, 0.23],
  ["c5", "b-forma", "acc-3", "Programa 12s | Frio", "Meta Ads", "paid_social", 0.48, 0.5, 0.36, 0.43],
  ["c6", "b-forma", "acc-3", "Whey | Advantage+", "Meta Ads", "paid_social", 0.32, 0.22, 0.4, 0.32],
  ["c7", "b-forma", "acc-4", "YouTube Depoimentos", "Google Ads", "video", 0.2, 0.28, 0.24, 0.25],
  ["c8", "b-ateliê", "acc-5", "Shopping Linho", "Google Ads", "cpc", 0.64, 0.55, 0.7, 0.62],
  ["c9", "b-ateliê", "acc-5", "PMax Casa", "Google Ads", "cpc", 0.36, 0.45, 0.3, 0.38],
  ["c10", "b-vela", "acc-6", "Webinar Captação", "Meta Ads", "paid_social", 0.52, 0.64, 0.28, 0.45],
  ["c11", "b-vela", "acc-6", "Oferta Carrinho Aberto", "Meta Ads", "paid_social", 0.42, 0.2, 0.62, 0.45],
  ["c12", "b-vela", "acc-7", "TikTok Teste Criativo", "TikTok Ads", "paid_social", 0.06, 0.16, 0.1, 0.1],
  ["c13", "b-pulso", "acc-8", "Assinatura | Broad", "Meta Ads", "paid_social", 0.7, 0.66, 0.58, 0.62],
  ["c14", "b-pulso", "acc-8", "Assinatura | Retargeting", "Meta Ads", "paid_social", 0.3, 0.34, 0.42, 0.38],
];

export const campaigns: Campaign[] = campaignSeeds.map(([id, brandId, accountId, name, channel, medium, sw, f, l, li], i) => {
  const acc = adAccounts.find((a) => a.id === accountId)!;
  return {
    id, brandId, accountId, platform: acc.platform, name,
    adSet: ["Interesses amplos", "Público quente", "Palavra-chave exata", "Lookalike 3%"][i % 4]!,
    ad: `AD-${String(100 + i * 7)} ${["Vídeo UGC", "Carrossel", "Texto RSA", "Estático"][i % 4]}`,
    channel, source: acc.platform === "meta" ? "facebook" : acc.platform === "google" ? "google" : "tiktok",
    medium, utmCampaign: name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    spendWeight: sw, modelWeight: { first: f, last: l, linear: li },
  };
});

function ev(id: string, at: string | null, type: LeadEvent["type"], label: string, source: string, verification: LeadEvent["verification"], detail?: string): LeadEvent {
  return detail === undefined ? { id, at, type, label, source, verification } : { id, at, type, label, source, verification, detail };
}

export const leads: Lead[] = (() => {
  const r = rng(42);
  const list: Lead[] = [];
  const pages = ["/oferta", "/webinar", "/produto/serum", "/lp/12-semanas", "/colecao/linho", "/assine"];
  for (let i = 0; i < 64; i++) {
    const c = campaigns[Math.floor(r() * campaigns.length)]!;
    const known = r() > 0.18;
    const daysAgo = Math.floor(r() * 28);
    const first = addDays(TODAY, -daysAgo - 3) + `T${String(8 + Math.floor(r() * 12)).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}:00Z`;
    const roll = r();
    const status: Lead["status"] = roll > 0.62 ? (roll > 0.93 ? "refunded" : "purchased") : roll > 0.42 ? "checkout" : "lead";
    const prod = products.filter((p) => p.brandId === c.brandId)[0]!;
    const value = status === "purchased" || status === "refunded" ? prod.price : null;
    const base = new Date(first).getTime();
    const t = (m: number) => new Date(base + m * 60000).toISOString();
    const lp = known ? pages[i % pages.length]! : null;
    const events: LeadEvent[] = [];
    if (known) {
      events.push(ev(`${i}-1`, t(0), "first_visit", "Primeiro acesso registrado", "Pixel do site", "observed", lp ?? undefined));
      events.push(ev(`${i}-2`, t(0), "click", "Clique com parâmetros de campanha", c.channel, "observed", `utm_source=${c.source} · utm_medium=${c.medium} · utm_campaign=${c.utmCampaign}`));
    } else {
      events.push(ev(`${i}-0`, null, "gap", "Origem não identificada", "—", "unknown", "Nenhum parâmetro de campanha ou referenciador foi capturado."));
      events.push(ev(`${i}-1`, t(0), "first_visit", "Primeiro acesso registrado", "Pixel do site", "observed", "Acesso direto"));
    }
    events.push(ev(`${i}-3`, t(2), "pageview", "Página visualizada", "Pixel do site", "observed", lp ?? "/"));
    events.push(ev(`${i}-4`, t(6), "form", "Formulário enviado", "Formulário do site", "observed", "Campos: e-mail, telefone (pseudonimizados)"));
    if (i % 5 === 0) events.push(ev(`${i}-g`, null, "gap", "Intervalo sem rastreamento", "—", "unknown", "Sessões entre o formulário e o checkout não foram registradas (possível troca de dispositivo)."));
    if (status !== "lead") events.push(ev(`${i}-5`, t(60 * 26), "checkout", "Checkout iniciado", c.brandId === "b-vela" ? "Plataforma de checkout B" : "Checkout próprio", "observed"));
    if (status === "purchased" || status === "refunded") {
      events.push(ev(`${i}-6`, t(60 * 26 + 4), "purchase", "Compra aprovada", "Gateway (webhook)", "observed", `Valor ${prod.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`));
      events.push(ev(`${i}-7`, t(60 * 26 + 4), "click", known ? `Atribuído a ${c.name}` : "Atribuição indisponível", "Modelo de atribuição", known ? "attributed" : "unknown", known ? "Inferido pelo modelo selecionado; não é um evento observado." : undefined));
    }
    if (status === "refunded") events.push(ev(`${i}-8`, t(60 * 24 * 6), "refund", "Reembolso processado", "Gateway (webhook)", "observed"));
    const lastAt = [...events].reverse().find((e) => e.at)!.at!;
    list.push({
      id: `lead-${i}`,
      pseudoId: `ld_${(Math.floor(r() * 0xffffff)).toString(16).padStart(6, "0")}`,
      brandId: c.brandId,
      source: known ? `${c.source} / ${c.medium}` : null,
      campaignId: known ? c.id : null,
      ad: known && r() > 0.2 ? c.ad : null,
      landingPage: lp,
      firstAt: first,
      lastAt,
      status,
      value,
      events,
    });
  }
  return list.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
})();

export const alerts: AlertItem[] = [
  { id: "al1", brandId: "b-forma", severity: "critical", title: "CPA subiu 31% em 7 dias", description: "Programa 12s | Frio — CPA acima da média de 30 dias com investimento estável.", action: "Revisar campanha" },
  { id: "al2", brandId: "b-pulso", severity: "warning", title: "12% das compras sem correspondência", description: "Compras aprovadas no gateway sem evento de compra recebido da Meta.", action: "Ver eventos" },
  { id: "al3", brandId: "b-forma", severity: "critical", title: "Conta Forma | YouTube sem dados", description: "Token expirado desde 19/10. Investimento do período pode estar subestimado.", action: "Reconectar conta" },
  { id: "al4", brandId: "b-lumen", severity: "warning", title: "Margem de contribuição caiu 4,1 p.p.", description: "Aumento de reembolsos no Kit Rotina Noturna nas últimas 2 semanas.", action: "Abrir Lucro Real" },
  { id: "al5", brandId: "b-vela", severity: "warning", title: "Divergência Meta x gateway: +18%", description: "Meta reporta mais conversões que vendas aprovadas no gateway.", action: "Comparar fontes" },
];

export const activities: Activity[] = [
  { id: "a1", brandId: "b-lumen", at: "2026-10-21T22:48:00Z", text: "Sincronização Meta concluída — Lumen | BR Principal" },
  { id: "a2", brandId: "b-vela", at: "2026-10-21T21:30:00Z", text: "Regra de comissão de afiliados atualizada para 10%" },
  { id: "a3", brandId: "b-forma", at: "2026-10-21T19:05:00Z", text: "Alerta crítico de CPA gerado para Programa 12s | Frio" },
  { id: "a4", brandId: "b-pulso", at: "2026-10-21T16:40:00Z", text: "Webhook de gateway recebeu 214 eventos" },
  { id: "a5", brandId: "b-ateliê", at: "2026-10-21T14:12:00Z", text: "Novo produto cadastrado: Jogo de Cama Linho" },
  { id: "a6", brandId: "b-forma", at: "2026-10-19T08:02:00Z", text: "Falha de autenticação — Forma | YouTube" },
];

export const integrations: Integration[] = [
  { id: "meta", name: "Meta Ads", category: "Mídia", description: "Investimento, campanhas, conjuntos, anúncios e eventos de conversão.", status: "connected" },
  { id: "google", name: "Google Ads", category: "Mídia", description: "Campanhas de pesquisa, Shopping, PMax e YouTube.", status: "error" },
  { id: "tiktok", name: "TikTok Ads", category: "Mídia", description: "Campanhas e investimento diário.", status: "disconnected" },
  { id: "gateway", name: "Gateways de pagamento", category: "Vendas", description: "Transações aprovadas, liquidadas, taxas, reembolsos e chargebacks.", status: "syncing" },
  { id: "checkout", name: "Plataformas de checkout", category: "Vendas", description: "Checkouts iniciados, abandonos e ofertas.", status: "connected" },
  { id: "webhooks", name: "Webhooks", category: "Dados", description: "Receba eventos de qualquer sistema via endpoint dedicado.", status: "disconnected" },
  { id: "crm", name: "CRM", category: "Dados", description: "Status de leads, oportunidades e vendas consultivas.", status: "disconnected" },
  { id: "api", name: "API própria de eventos", category: "Dados", description: "Envie eventos server-side com identificadores pseudonimizados.", status: "disconnected" },
];
