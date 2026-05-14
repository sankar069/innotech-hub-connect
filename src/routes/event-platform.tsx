import { createFileRoute } from "@tanstack/react-router";
import { EventPlatformPage } from "@/pages/EventPlatformPage";

export const Route = createFileRoute("/event-platform")({
  component: EventPlatformPage,
});
