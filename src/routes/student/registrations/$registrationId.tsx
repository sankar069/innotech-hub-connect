import { createFileRoute } from "@tanstack/react-router";
import { StudentRegistrationDetailPage } from "@/pages/StudentRegistrationDetailPage";

export const Route = createFileRoute("/student/registrations/$registrationId")({
  component: () => {
    const { registrationId } = Route.useParams();
    return <StudentRegistrationDetailPage registrationId={registrationId} />;
  },
});
