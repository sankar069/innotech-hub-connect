import { createFileRoute } from "@tanstack/react-router";
import { AdminEventPaymentsPage } from "@/pages/AdminEventPaymentsPage";

export const Route = createFileRoute("/admin/events/$eventId/payments")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventPaymentsPage eventId={eventId} />;
  },
});
