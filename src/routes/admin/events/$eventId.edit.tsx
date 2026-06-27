import { createFileRoute } from "@tanstack/react-router";
import { AdminEventEditPage } from "@/pages/AdminEventEditPage";

export const Route = createFileRoute("/admin/events/$eventId/edit")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventEditPage eventId={eventId} />;
  },
});
