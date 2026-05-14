import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/pages/StudentDashboardPage";

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboardPage,
});
