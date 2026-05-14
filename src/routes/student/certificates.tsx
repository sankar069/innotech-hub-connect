import { createFileRoute } from "@tanstack/react-router";
import { StudentCertificatesPage } from "@/pages/StudentCertificatesPage";

export const Route = createFileRoute("/student/certificates")({
  component: StudentCertificatesPage,
});
