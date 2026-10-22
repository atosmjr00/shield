import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/contas")({
  head: () => ({ meta: [{ title: "Contas de Anúncios — Ledgerline" }, { name: "description", content: "Contas de Anúncios: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Contas de Anúncios — Ledgerline" }, { property: "og:description", content: "Contas de Anúncios: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Contas de Anúncios" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
