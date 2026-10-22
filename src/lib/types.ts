export type Platform = "meta" | "google" | "tiktok";
export type AttributionModel = "first" | "last" | "linear";
export type PeriodDays = 7 | 30 | 90;

export interface Organization {
  id: string;
  name: string;
  plan: string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  price: number;
  /** custo variável unitário (produto, entrega) em % do preço */
  variableCostPct: number;
}

export interface Brand {
  id: string;
  orgId: string;
  name: string;
  currency: "BRL";
  timezone: string;
  domains: string[];
  checkouts: string[];
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  brandId: string;
  grossRevenue: number;
  approvedRevenue: number;
  settledRevenue: number;
  refunds: number;
  chargebacks: number;
  spend: number;
  orders: number;
  visitors: number;
  leads: number;
  checkouts: number;
}

export interface CostRules {
  paymentFeePct: number;
  variableCostPct: number;
  commissionPct: number;
  taxPct: number;
  fixedPerOrder: number;
}

export interface Campaign {
  id: string;
  brandId: string;
  accountId: string;
  platform: Platform;
  name: string;
  adSet: string;
  ad: string;
  channel: string;
  source: string;
  medium: string;
  utmCampaign: string;
  spendWeight: number;
  /** peso relativo de receita/pedidos sob cada modelo, normalizado por marca */
  modelWeight: Record<AttributionModel, number>;
}

export type ConnectionStatus = "connected" | "syncing" | "error" | "disconnected";

export interface AdAccount {
  id: string;
  name: string;
  platform: Platform;
  brandId: string;
  status: ConnectionStatus;
  lastSync: string | null;
  alerts: string[];
}

export type Verification = "observed" | "attributed" | "unknown";

export interface LeadEvent {
  id: string;
  at: string | null;
  type: "first_visit" | "click" | "pageview" | "form" | "checkout" | "purchase" | "refund" | "gap";
  label: string;
  source: string;
  verification: Verification;
  detail?: string;
}

export interface Lead {
  id: string;
  pseudoId: string;
  brandId: string;
  source: string | null;
  campaignId: string | null;
  ad: string | null;
  landingPage: string | null;
  firstAt: string;
  lastAt: string;
  status: "lead" | "checkout" | "purchased" | "refunded";
  value: number | null;
  events: LeadEvent[];
}

export interface AlertItem {
  id: string;
  brandId: string;
  severity: "critical" | "warning";
  title: string;
  description: string;
  action: string;
}

export interface Activity {
  id: string;
  brandId: string;
  at: string;
  text: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: ConnectionStatus;
}
