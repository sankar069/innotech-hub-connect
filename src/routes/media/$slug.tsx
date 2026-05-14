import { createFileRoute } from "@tanstack/react-router";
import { MediaCategoryPage } from "@/pages/MediaCategoryPage";

export const Route = createFileRoute("/media/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <MediaCategoryPage slug={slug} />;
  },
});
