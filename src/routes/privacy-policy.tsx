import { createFileRoute } from "@tanstack/react-router";
import { CmsStaticPage } from "@/pages/CmsStaticPage";

export const Route = createFileRoute("/privacy-policy")({
  component: () => <CmsStaticPage slug="privacy-policy" />,
});
