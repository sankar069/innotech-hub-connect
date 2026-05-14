import { createFileRoute } from "@tanstack/react-router";
import { CmsStaticPage } from "@/pages/CmsStaticPage";

export const Route = createFileRoute("/rules")({
  component: () => <CmsStaticPage slug="rules" />,
});
