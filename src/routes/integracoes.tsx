import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — Nexora" }, { name: "description", content: "Integrações: módulo da plataforma Nexora." }, { property: "og:title", content: "Integrações — Nexora" }, { property: "og:description", content: "Integrações: módulo da plataforma Nexora." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Integrações" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
