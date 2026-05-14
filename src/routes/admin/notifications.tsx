import { createFileRoute } from "@tanstack/react-router";
import { AdminNotificationsPage } from "@/pages/AdminNotificationsPage";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
});
