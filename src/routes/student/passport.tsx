import { createFileRoute } from "@tanstack/react-router";
import { StudentPassportPage } from "@/pages/StudentPassportPage";

export const Route = createFileRoute("/student/passport")({
  component: StudentPassportPage,
});
