import { createFileRoute } from "@tanstack/react-router";
import { MediaPostDetailPage } from "@/pages/MediaPostDetailPage";

export const Route = createFileRoute("/media/$slug/$postSlug")({
  component: () => {
    const { slug, postSlug } = Route.useParams();
    return <MediaPostDetailPage categorySlug={slug} postSlug={postSlug} />;
  },
});
