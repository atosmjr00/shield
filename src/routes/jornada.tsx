import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/jornada")({
  head: () => ({ meta: [{ title: "Jornada do Lead — Nexora" }, { name: "description", content: "Jornada do Lead: módulo da plataforma Nexora." }, { property: "og:title", content: "Jornada do Lead — Nexora" }, { property: "og:description", content: "Jornada do Lead: módulo da plataforma Nexora." }] }),
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
