import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventCertificatesPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);
  const { items: allCertificates } = useCmsCollection("certificates");
  const { items: allRegistrations } = useCmsCollection("eventRegistrations");
  const [query, setQuery] = useState("");

  const certificates = useMemo(() =>
    (Array.isArray(allCertificates) ? allCertificates : []).filter((c: any) =>
      c.eventId === decodedId || c.eventId === event?.id
    ), [allCertificates, decodedId, event?.id]);

  const filtered = useMemo(() =>
    certificates.filter((c: any) => {
      const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === c.registrationId);
      const haystack = `${reg?.studentName ?? ""} ${reg?.studentEmail ?? ""} ${c.certificateNumber ?? ""}`.toLowerCase();
      return !query || haystack.includes(query.toLowerCase());
    }), [certificates, allRegistrations, query]);

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
    <AdminLayout title="Event Certificates">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <Link to="/admin/events/$eventId" params={{ eventId: event.id }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
              <ChevronLeft className="h-3.5 w-3.5" /> Event Overview
            </Link>
            <p className="text-xs uppercase tracking-widest font-mono text-primary">Certificates</p>
            <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{certificates.length} certificate{certificates.length !== 1 ? "s" : ""} issued</p>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student name, email, or certificate number"
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 racing-border text-center text-muted-foreground">
                {certificates.length === 0 ? "No certificates have been issued for this event yet." : "No certificates match your search."}
              </div>
            ) : filtered.map((cert: any) => {
              const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === cert.registrationId);
              return (
                <div key={cert.id} className="glass-strong rounded-2xl p-5 racing-border">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold">{reg?.studentName ?? "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">{reg?.studentEmail ?? "—"}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">Certificate #: {cert.certificateNumber ?? cert.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{cert.status ?? "Issued"}</span>
                      {cert.certificateUrl && (
                        <a href={cert.certificateUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-2">Download PDF</a>
                      )}
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
