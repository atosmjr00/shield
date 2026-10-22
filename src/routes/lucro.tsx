import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/lucro")({
  head: () => ({ meta: [{ title: "Lucro Real — Ledgerline" }, { name: "description", content: "Lucro Real: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Lucro Real — Ledgerline" }, { property: "og:description", content: "Lucro Real: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Lucro Real" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
