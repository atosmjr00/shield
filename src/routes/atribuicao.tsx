import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/atribuicao")({
  head: () => ({ meta: [{ title: "Atribuição — Ledgerline" }, { name: "description", content: "Atribuição: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Atribuição — Ledgerline" }, { property: "og:description", content: "Atribuição: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Atribuição" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
