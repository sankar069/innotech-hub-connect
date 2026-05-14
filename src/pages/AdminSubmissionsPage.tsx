import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getSubmissions, saveSubmissions, type Submission } from "@/lib/studentPlatform";
import { getEventById } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminSubmissionsPage() {
  const { items } = useCmsCollection<Submission>("submissions");
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => `${item.projectTitle} ${item.studentId} ${getEventById(item.eventId)?.title ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const patch = (id: string, update: Partial<Submission>) => saveSubmissions(getSubmissions().map((item) => item.id === id ? { ...item, ...update } : item));
  return (
    <AdminLayout title="Submissions">
      {() => (
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold">Project Submissions</h2><p className="text-sm text-muted-foreground mt-2">Review submissions, add notes, and mark status.</p></section>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search submissions" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm" />
          {filtered.length === 0 ? <div className="glass-strong rounded-2xl p-6 racing-border text-muted-foreground">No submissions yet.</div> : filtered.map((submission) => (
            <article key={submission.id} className="glass-strong rounded-2xl p-5 racing-border">
              <div className="grid lg:grid-cols-[1fr_220px] gap-4">
                <div><h3 className="text-xl font-bold">{submission.projectTitle}</h3><p className="text-sm text-muted-foreground mt-1">{getEventById(submission.eventId)?.title ?? submission.eventId} · {submission.studentId}</p><p className="text-sm text-muted-foreground mt-3">{submission.projectDescription}</p></div>
                <div className="space-y-2">
                  <select value={submission.status} onChange={(event) => patch(submission.id, { status: event.target.value as Submission["status"] })} className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-sm">{["Submitted", "Reviewed", "Shortlisted", "Rejected"].map((item) => <option key={item}>{item}</option>)}</select>
                  <textarea value={submission.adminNote ?? ""} onChange={(event) => patch(submission.id, { adminNote: event.target.value })} placeholder="Evaluation note" className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
