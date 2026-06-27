import { createFileRoute } from "@tanstack/react-router";
import { StudentProfileEditPage } from "@/pages/StudentProfileEditPage";

export const Route = createFileRoute("/dashboard/profile/edit")({
  component: StudentProfileEditPage,
});
