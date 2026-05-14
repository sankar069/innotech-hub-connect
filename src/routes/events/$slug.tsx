import { createFileRoute } from "@tanstack/react-router";
import { EventDetailPage } from "@/pages/EventDetailPage";

export const Route = createFileRoute("/events/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <EventDetailPage slug={slug} />;
  },
});
