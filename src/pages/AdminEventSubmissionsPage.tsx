import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventSubmissionsPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);
  const { items: allSubmissions } = useCmsCollection("submissions");
  const { items: allRegistrations } = useCmsCollection("eventRegistrations");
  const [query, setQuery] = useState("");

  const submissions = useMemo(() =>
    (Array.isArray(allSubmissions) ? allSubmissions : []).filter((s: any) =>
      s.eventId === decodedId || s.eventId === event?.id
    ), [allSubmissions, decodedId, event?.id]);

  const filtered = useMemo(() =>
    submissions.filter((s: any) => {
      const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === s.registrationId);
      const haystack = `${s.title ?? ""} ${reg?.studentName ?? ""} ${reg?.studentEmail ?? ""}`.toLowerCase();
      return !query || haystack.includes(query.toLowerCase());
    }), [submissions, allRegistrations, query]);

  if (!event) {
    return (
      <AdminLayout title="Event Not Found">
        {() => (
          <div className="glass-strong rounded-2xl p-8 racing-border">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <Link to="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">Back to Events</Link>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Event Submissions">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <Link to="/admin/events/$eventId" params={{ eventId: event.id }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
              <ChevronLeft className="h-3.5 w-3.5" /> Event Overview
            </Link>
            <p className="text-xs uppercase tracking-widest font-mono text-primary">Submissions</p>
            <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search submissions by title or student"
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 racing-border text-center text-muted-foreground">
                {submissions.length === 0 ? "No submissions have been made for this event yet." : "No submissions match your search."}
              </div>
            ) : filtered.map((sub: any) => {
              const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === sub.registrationId);
              return (
                <div key={sub.id} className="glass-strong rounded-2xl p-5 racing-border">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">{sub.title ?? "Untitled Submission"}</h3>
                      <p className="text-sm text-muted-foreground">{reg?.studentName ?? "Unknown"} · {reg?.studentEmail ?? "—"}</p>
                      {sub.description && <p className="text-sm text-muted-foreground mt-1">{sub.description}</p>}
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "—"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary h-fit">
                      {sub.status ?? "Submitted"}
                    </span>
                  </div>
                  {Array.isArray(sub.fileUrls) && sub.fileUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {sub.fileUrls.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-2">
                          File {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
