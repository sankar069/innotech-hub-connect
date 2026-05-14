import { createFileRoute } from "@tanstack/react-router";
import { EventRegistrationPage } from "@/pages/EventRegistrationPage";

export const Route = createFileRoute("/events/$slug/register")({
  component: () => {
    const { slug } = Route.useParams();
    return <EventRegistrationPage slug={slug} />;
  },
});
