import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/jornada")({
  head: () => ({ meta: [{ title: "Jornada do Lead — Ledgerline" }, { name: "description", content: "Jornada do Lead: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Jornada do Lead — Ledgerline" }, { property: "og:description", content: "Jornada do Lead: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Jornada do Lead" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
