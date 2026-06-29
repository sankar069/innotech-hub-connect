import { createFileRoute } from "@tanstack/react-router";
import { AdminEventCertificatesPage } from "@/pages/AdminEventCertificatesPage";

export const Route = createFileRoute("/admin/events/$eventId/certificates")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventCertificatesPage eventId={eventId} />;
  },
});
