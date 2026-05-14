import { createFileRoute } from "@tanstack/react-router";
import { AdminSubmissionsPage } from "@/pages/AdminSubmissionsPage";

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissionsPage,
});
