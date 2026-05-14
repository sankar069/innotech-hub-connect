import { createFileRoute } from "@tanstack/react-router";
import { AdminContactLeadsPage } from "@/pages/AdminContactLeadsPage";

export const Route = createFileRoute("/admin/contact-leads")({
  component: AdminContactLeadsPage,
});
