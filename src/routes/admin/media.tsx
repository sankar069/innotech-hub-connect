import { createFileRoute } from "@tanstack/react-router";
import { AdminMediaCmsPage } from "@/pages/AdminCmsPage";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaCmsPage,
});
