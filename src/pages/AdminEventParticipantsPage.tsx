import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventParticipantsPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);
  const { items: allRegistrations } = useCmsCollection("eventRegistrations");
  const { items: allSubmissions } = useCmsCollection("submissions");
  const { items: allCertificates } = useCmsCollection("certificates");
  const [query, setQuery] = useState("");

  // Participants = registrations that have been approved for this event
  const participants = useMemo(() => {
    const regs = (Array.isArray(allRegistrations) ? allRegistrations : []) as any[];
    return regs.filter((r) =>
      (r.eventId === decodedId || r.eventId === event?.id || r.eventSlug === event?.slug) &&
      r.registrationStatus === "Approved"
    );
  }, [allRegistrations, decodedId, event?.id, event?.slug]);

  const filtered = useMemo(() =>
    participants.filter((p: any) => {
      const haystack = `${p.studentName ?? ""} ${p.studentEmail ?? ""} ${p.studentDetails?.college ?? ""}`.toLowerCase();
      return !query || haystack.includes(query.toLowerCase());
    }), [participants, query]);

  if (!event) {
    return (
      <AdminLayout title="Event Not Found">
        {() => (
          <div className="glass-strong rounded-2xl p-8 racing-border">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <Link to="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">
              Back to Events
            </Link>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Event Participants">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <Link to="/admin/events/$eventId" params={{ eventId: event.id }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
              <ChevronLeft className="h-3.5 w-3.5" /> Event Overview
            </Link>
            <p className="text-xs uppercase tracking-widest font-mono text-primary">Participants</p>
            <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{participants.length} approved participant{participants.length !== 1 ? "s" : ""}</p>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search participants by name, email, or college"
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 racing-border text-center text-muted-foreground">
                {participants.length === 0
                  ? "No approved participants yet. Registrations must be approved before participants appear here."
                  : "No participants match your search."}
              </div>
            ) : filtered.map((participant: any) => {
              const sd = participant.studentDetails ?? {};
              const hasSubmission = (Array.isArray(allSubmissions) ? allSubmissions : []).some((s: any) =>
                s.registrationId === participant.id
              );
              const hasCertificate = (Array.isArray(allCertificates) ? allCertificates : []).some((c: any) =>
                c.registrationId === participant.id
              );
              return (
                <div key={participant.id} className="glass-strong rounded-2xl p-5 racing-border">
                  <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">{participant.studentName ?? "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">{participant.studentEmail} · {sd.phone ?? "—"}</p>
                      <p className="text-sm text-muted-foreground">{sd.college ?? "—"} · {sd.department ?? "—"} · Year {sd.year ?? "—"}</p>
                      {participant.teamDetails?.teamName && (
                        <p className="text-sm text-primary">Team: {String(participant.teamDetails.teamName)}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill label="Registration" value="Approved" color="green" />
                      <StatusPill label="Payment" value={participant.paymentStatus ?? "—"} color={participant.paymentStatus === "Approved" ? "green" : "yellow"} />
                      <StatusPill label="Submission" value={hasSubmission ? "Submitted" : "Not Submitted"} color={hasSubmission ? "green" : "muted"} />
                      <StatusPill label="Certificate" value={hasCertificate ? "Issued" : "Not Issued"} color={hasCertificate ? "green" : "muted"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatusPill({ label, value, color }: { label: string; value: string; color: "green" | "yellow" | "muted" }) {
  const colorClass = color === "green" ? "text-green-500 bg-green-500/10" : color === "yellow" ? "text-yellow-500 bg-yellow-500/10" : "text-muted-foreground bg-background/60";
  return (
    <div className="text-center">
      <div className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground">{label}</div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${colorClass}`}>{value}</span>
    </div>
  );
}
