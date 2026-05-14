import { createFileRoute } from "@tanstack/react-router";
import { CmsStaticPage } from "@/pages/CmsStaticPage";

export const Route = createFileRoute("/terms")({
  component: () => <CmsStaticPage slug="terms" />,
});
