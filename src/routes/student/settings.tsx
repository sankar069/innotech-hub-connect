import { createFileRoute } from "@tanstack/react-router";
import { StudentSettingsPage } from "@/pages/StudentSettingsPage";

export const Route = createFileRoute("/student/settings")({
  component: StudentSettingsPage,
});
