import { createFileRoute } from "@tanstack/react-router";
import { AdminEventEditPage } from "@/pages/AdminEventEditPage";

export const Route = createFileRoute("/admin/events/new")({
  component: () => <AdminEventEditPage eventId="new" />,
});
