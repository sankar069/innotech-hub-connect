import { createFileRoute } from "@tanstack/react-router";
import { TeamCategoryPage } from "@/pages/TeamCategoryPage";

export const Route = createFileRoute("/team/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <TeamCategoryPage slug={slug} />;
  },
});
