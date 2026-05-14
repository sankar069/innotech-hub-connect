import { createFileRoute } from "@tanstack/react-router";
import { AdminTractionCmsPage } from "@/pages/AdminCmsPage";

export const Route = createFileRoute("/admin/traction")({
  component: AdminTractionCmsPage,
});
