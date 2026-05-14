import { createFileRoute } from "@tanstack/react-router";
import { CertificateVerifyPage } from "@/pages/CertificateVerifyPage";

export const Route = createFileRoute("/certificate/verify/$certificateId")({
  component: () => {
    const { certificateId } = Route.useParams();
    return <CertificateVerifyPage certificateId={certificateId} />;
  },
});
