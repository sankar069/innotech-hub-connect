import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminEventEditPage } from "@/pages/AdminEventEditPage";

export const Route = createFileRoute("/admin/events/$eventId/edit")({
  // If someone navigates to /admin/events/new/edit, redirect to /admin/events/new
  beforeLoad: ({ params }) => {
    if (params.eventId === "new") {
      throw redirect({ to: "/admin/events/new", replace: true });
    }
  },
  component: () => {
    const { eventId } = Route.useParams();
    return <AdminEventEditPage eventId={eventId} />;
  },
});
