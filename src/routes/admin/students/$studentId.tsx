import { createFileRoute } from "@tanstack/react-router";
import { AdminStudentDetailPage } from "@/pages/AdminStudentsPage";

export const Route = createFileRoute("/admin/students/$studentId")({
  component: () => {
    const { studentId } = Route.useParams();
    return <AdminStudentDetailPage studentId={studentId} />;
  },
});
