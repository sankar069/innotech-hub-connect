import { createFileRoute } from "@tanstack/react-router";
import { AdminEventTeamsPage } from "@/pages/AdminEventTeamsPage";

export const Route = createFileRoute("/admin/events/$eventId/teams")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventTeamsPage eventId={eventId} />;
  },
});
