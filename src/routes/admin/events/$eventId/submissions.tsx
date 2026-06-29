import { createFileRoute } from "@tanstack/react-router";
import { AdminEventSubmissionsPage } from "@/pages/AdminEventSubmissionsPage";

export const Route = createFileRoute("/admin/events/$eventId/submissions")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventSubmissionsPage eventId={eventId} />;
  },
});
