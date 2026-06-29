import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminEventsPage } from "@/pages/AdminEventsPage";

// This route acts as a layout for all /admin/events/* children.
// It renders <AdminEventsPage /> when the path is exactly /admin/events,
// and renders <Outlet /> so child routes (/new, /:eventId, /:eventId/edit, etc.)
// can render their own components without being replaced by the events list.
export const Route = createFileRoute("/admin/events")({
  component: AdminEventsLayout,
});

function AdminEventsLayout() {
  return <Outlet />;
}

// Named export so the index child can reuse it
export { AdminEventsPage };
