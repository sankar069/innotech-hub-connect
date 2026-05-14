import { createFileRoute } from "@tanstack/react-router";
import { AdminPaymentsPage } from "@/pages/AdminPaymentsPage";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});
