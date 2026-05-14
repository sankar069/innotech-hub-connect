import { createFileRoute } from "@tanstack/react-router";
import { StudentSubmissionsPage } from "@/pages/StudentSubmissionsPage";

export const Route = createFileRoute("/student/submissions")({
  component: StudentSubmissionsPage,
});
