import { createFileRoute } from "@tanstack/react-router";
import { AdminEventsPage } from "@/pages/AdminEventsPage";

export const Route = createFileRoute("/admin/events")({
  component: AdminEventsPage,
});
