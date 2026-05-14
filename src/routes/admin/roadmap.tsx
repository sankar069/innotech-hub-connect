import { createFileRoute } from "@tanstack/react-router";
import { AdminRoadmapCmsPage } from "@/pages/AdminCmsPage";

export const Route = createFileRoute("/admin/roadmap")({
  component: AdminRoadmapCmsPage,
});
