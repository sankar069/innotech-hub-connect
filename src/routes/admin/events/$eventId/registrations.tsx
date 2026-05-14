import { createFileRoute } from "@tanstack/react-router";
import { AdminEventRegistrationsPage } from "@/pages/AdminEventRegistrationsPage";

export const Route = createFileRoute("/admin/events/$eventId/registrations")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventRegistrationsPage eventId={eventId} />;
  },
});
