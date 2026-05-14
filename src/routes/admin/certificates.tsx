import { createFileRoute } from "@tanstack/react-router";
import { AdminCertificatesPage } from "@/pages/AdminCertificatesPage";

export const Route = createFileRoute("/admin/certificates")({
  component: AdminCertificatesPage,
});
