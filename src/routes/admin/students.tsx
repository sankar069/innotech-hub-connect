import { createFileRoute } from "@tanstack/react-router";
import { AdminStudentsPage } from "@/pages/AdminStudentsPage";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudentsPage,
});
