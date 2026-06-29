import { createFileRoute } from "@tanstack/react-router";
import { AdminEventOverviewPage } from "@/pages/AdminEventOverviewPage";

export const Route = createFileRoute("/admin/events/$eventId/")({
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventOverviewPage eventId={eventId} />;
  },
});
