import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getRegistrations } from "@/lib/events";
import { getCertificates, issueCertificate, saveCertificates, type Certificate } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function AdminCertificatesPage() {
  const { items: storedItems } = useCmsCollection<Certificate>("certificates");
  const items = Array.isArray(storedItems) ? storedItems : [];
  const registrations = getRegistrations().filter((item) => {
    const registrationStatus = String(item.registrationStatus ?? "").toLowerCase();
    const paymentStatus = String(item.paymentStatus ?? "").toLowerCase();
    const registrationReady = registrationStatus === "approved" || registrationStatus === "registered";
    const paymentReady = !paymentStatus || paymentStatus === "approved" || paymentStatus === "not required" || paymentStatus === "not_required";
    return registrationReady && paymentReady;
  });
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => `${item.studentName ?? ""} ${item.eventTitle ?? ""} ${item.certificateId ?? ""}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return (
    <AdminLayout title="Certificates">
      {() => (
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold">Certificate Management</h2><p className="text-sm text-muted-foreground mt-2">Issue, revoke, and verify student certificates.</p></section>
          <section className="glass-strong rounded-2xl p-6 racing-border">
            <h3 className="text-xl font-bold mb-4">Completed / Approved Participants</h3>
            {registrations.length === 0 ? <p className="text-sm text-muted-foreground">No approved participants yet.</p> : registrations.map((registration) => (
              <div key={registration.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-border p-4 mb-3">
                <div><div className="font-semibold">{registration.studentName}</div><div className="text-sm text-muted-foreground">{registration.eventSlug} · {registration.studentEmail}</div></div>
                <button onClick={() => issueCertificate(registration)} className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Issue Certificate</button>
              </div>
            ))}
          </section>
          <section className="glass-strong rounded-2xl p-6 racing-border">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search certificates" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm mb-4" />
            {filtered.length === 0 ? <p className="text-sm text-muted-foreground">No certificates issued yet.</p> : filtered.map((certificate) => (
              <div key={certificate.id} className="rounded-xl border border-border p-4 mb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div><div className="font-semibold">{certificate.studentName}</div><div className="text-sm text-muted-foreground">{certificate.eventTitle} · {certificate.certificateType} · {certificate.certificateId}</div></div>
                  <div className="flex gap-2"><a href={certificate.verificationUrl} className="rounded-lg border border-border px-3 py-2 text-sm">Verify</a><button onClick={() => saveCertificates(getCertificates().map((item) => item.id === certificate.id ? { ...item, status: item.status === "Revoked" ? "Issued" : "Revoked" } : item))} className="rounded-lg border border-border px-3 py-2 text-sm">{certificate.status === "Revoked" ? "Restore" : "Revoke"}</button></div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
