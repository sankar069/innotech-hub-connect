import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminEventOverviewPage } from "@/pages/AdminEventOverviewPage";

// This route is BOTH a layout (parent of /edit, /registrations, etc.)
// AND renders the event overview when the path is exactly /:eventId.
// The index.tsx child handles the overview content while this file provides
// the Outlet so nested routes render correctly.
export const Route = createFileRoute("/admin/events/$eventId")({
  component: AdminEventIdLayout,
});

function AdminEventIdLayout() {
  return <Outlet />;
}

export { AdminEventOverviewPage };
