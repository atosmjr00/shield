import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { brands, defaultCostRules, organizations } from "@/data/mock";
import type { CostRules, PeriodDays } from "./types";

interface FilterState {
  orgId: string;
  setOrgId: (id: string) => void;
  brandId: string; // "all" ou id
  setBrandId: (id: string) => void;
  period: PeriodDays;
  setPeriod: (p: PeriodDays) => void;
  brandIds: string[];
  orgBrands: typeof brands;
  costRules: Record<string, CostRules>;
  setCostRule: (brandId: string, rules: CostRules) => void;
  loading: boolean;
}

const Ctx = createContext<FilterState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrg] = useState(organizations[0].id);
  const [brandId, setBrandId] = useState("all");
  const [period, setPeriod] = useState<PeriodDays>(30);
  const [costRules, setRules] = useState(defaultCostRules);
  const [loading, setLoading] = useState(true);

  const orgBrands = useMemo(() => brands.filter((b) => b.orgId === orgId), [orgId]);
  const brandIds = useMemo(() => (brandId === "all" ? orgBrands.map((b) => b.id) : [brandId]), [brandId, orgBrands]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [orgId, brandId, period]);

  const value: FilterState = {
    orgId,
    setOrgId: (id) => { setOrg(id); setBrandId("all"); },
    brandId, setBrandId, period, setPeriod, brandIds, orgBrands, costRules,
    setCostRule: (id, r) => setRules((prev) => ({ ...prev, [id]: r })),
    loading,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFilters() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFilters fora do FiltersProvider");
  return c;
}
