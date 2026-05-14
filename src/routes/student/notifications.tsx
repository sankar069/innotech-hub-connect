import { createFileRoute } from "@tanstack/react-router";
import { StudentNotificationsPage } from "@/pages/StudentNotificationsPage";

export const Route = createFileRoute("/student/notifications")({
  component: StudentNotificationsPage,
});
