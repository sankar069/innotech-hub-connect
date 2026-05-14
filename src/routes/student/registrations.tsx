import { createFileRoute } from "@tanstack/react-router";
import { StudentRegistrationsPage } from "@/pages/StudentRegistrationsPage";

export const Route = createFileRoute("/student/registrations")({
  component: StudentRegistrationsPage,
});
