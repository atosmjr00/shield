import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Ledgerline" }, { name: "description", content: "Configurações: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Configurações — Ledgerline" }, { property: "og:description", content: "Configurações: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Configurações" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
