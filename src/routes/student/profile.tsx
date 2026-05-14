import { createFileRoute } from "@tanstack/react-router";
import { StudentProfilePage } from "@/pages/StudentProfilePage";

export const Route = createFileRoute("/student/profile")({
  component: StudentProfilePage,
});
