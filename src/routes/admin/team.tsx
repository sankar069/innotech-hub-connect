import { createFileRoute } from "@tanstack/react-router";
import { AdminTeamCmsPage } from "@/pages/AdminCmsPage";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeamCmsPage,
});
