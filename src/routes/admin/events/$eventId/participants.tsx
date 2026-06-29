import { createFileRoute } from "@tanstack/react-router";
import { AdminEventParticipantsPage } from "@/pages/AdminEventParticipantsPage";

export const Route = createFileRoute("/admin/events/$eventId/participants")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventParticipantsPage eventId={eventId} />;
  },
});
