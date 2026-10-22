/**
 * Camada de serviços. Hoje retorna dados demonstrativos; cada função pode ser
 * substituída por chamadas reais (ex.: Lovable Cloud) mantendo as assinaturas.
 */
import * as mock from "@/data/mock";
import type { AdAccount, Brand, Integration, Lead, Organization, Product } from "@/lib/types";

export interface AnalyticsService {
  listOrganizations(): Organization[];
  listBrands(orgId: string): Brand[];
  listProducts(brandId: string): Product[];
  listAdAccounts(brandIds: string[]): AdAccount[];
  listLeads(brandIds: string[]): Lead[];
  listIntegrations(): Integration[];
}

export const api: AnalyticsService = {
  listOrganizations: () => mock.organizations,
  listBrands: (orgId) => mock.brands.filter((b) => b.orgId === orgId),
  listProducts: (brandId) => mock.products.filter((p) => p.brandId === brandId),
  listAdAccounts: (ids) => mock.adAccounts.filter((a) => ids.includes(a.brandId)),
  listLeads: (ids) => mock.leads.filter((l) => ids.includes(l.brandId)),
  listIntegrations: () => mock.integrations,
};
