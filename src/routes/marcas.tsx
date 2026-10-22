import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/app/ui-bits";

export const Route = createFileRoute("/marcas")({
  head: () => ({ meta: [{ title: "Marcas e Produtos — Ledgerline" }, { name: "description", content: "Marcas e Produtos: módulo da plataforma Ledgerline." }, { property: "og:title", content: "Marcas e Produtos — Ledgerline" }, { property: "og:description", content: "Marcas e Produtos: módulo da plataforma Ledgerline." }] }),
  component: Page,
});

function Page() {
  return (
    <div>
      <PageHeader title="Marcas e Produtos" />
      <div className="panel"><EmptyState title="Módulo em construção" description="Esta página ainda não foi implementada neste protótipo." /></div>
    </div>
  );
}
