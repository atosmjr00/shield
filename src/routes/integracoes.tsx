import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — Ledgerline" }, { name: "description", content: "Integrações: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Integrações — Ledgerline" }, { property: "og:description", content: "Integrações: módulo da plataforma Ledgerline." }] }),
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
