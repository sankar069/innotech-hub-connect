import { createFileRoute } from "@tanstack/react-router";
import { AdminCmsPage } from "@/pages/AdminCmsPage";

export const Route = createFileRoute("/admin/sponsors")({
  component: () => <AdminCmsPage module="sponsors" />,
});
