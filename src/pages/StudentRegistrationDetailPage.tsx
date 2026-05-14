import { Navbar } from "@/components/site/Navbar";
import type React from "react";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventById, getRegistrations } from "@/lib/events";
import { getMyCertificates } from "@/lib/studentPlatform";

export function StudentRegistrationDetailPage({ registrationId }: { registrationId: string }) {
  return (
    <ProtectedRoute allow="student">
      {(user) => {
        const registration = getRegistrations().find((item) => item.id === registrationId && item.studentEmail === user.email);
        const event = registration ? getEventById(registration.eventId) : undefined;
        const certificate = getMyCertificates(user.email).find((item) => item.registrationId === registrationId);
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-32 pb-20 md:pt-40 md:pb-28">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {!registration ? <div className="glass-strong rounded-2xl p-6 racing-border">Registration not found.</div> : (
                  <div className="space-y-6">
                    <section className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
                      <h1 className="text-4xl md:text-5xl font-bold">{event?.title ?? registration.eventSlug}</h1>
                      <p className="mt-3 text-muted-foreground">{event?.dates?.eventStartDate} · {event?.type} · {event?.category}</p>
                      <div className="flex flex-wrap gap-2 mt-5">
                        <Badge text={registration.registrationStatus} />
                        <Badge text={registration.paymentStatus} />
                      </div>
                    </section>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <Panel title="Student Submitted Details">
                        {["fullName", "email", "phone", "college", "department", "year", "skills", "motivation"].map((key) => <Info key={key} label={key} value={String(registration.studentDetails[key] ?? "-")} />)}
                      </Panel>
                      <Panel title="Team Details">
                        {registration.teamDetails?.teamName ? Object.entries(registration.teamDetails).map(([key, value]) => <Info key={key} label={key} value={typeof value === "string" ? value : JSON.stringify(value)} />) : <p className="text-sm text-muted-foreground">Individual registration.</p>}
                      </Panel>
                      <Panel title="Payment Details">
                        {registration.paymentStatus === "Not Required" ? <p className="text-sm text-muted-foreground">Payment is not required for this event.</p> : Object.entries(registration.paymentDetails).map(([key, value]) => <Info key={key} label={key} value={String(value || "-")} />)}
                        {registration.paymentDetails.screenshotUrl ? <img src={String(registration.paymentDetails.screenshotUrl)} alt="Payment screenshot" className="mt-4 h-48 w-48 rounded-xl object-cover border border-border" /> : null}
                        {registration.adminRemarks ? <p className="text-sm text-primary mt-4">Admin remarks: {registration.adminRemarks}</p> : null}
                      </Panel>
                      <Panel title="Status Timeline">
                        {["Registered", registration.paymentStatus, registration.registrationStatus, certificate ? "Certificate issued" : "Certificate pending"].map((item) => <div key={item} className="rounded-xl border border-border p-3 text-sm text-muted-foreground">{item}</div>)}
                      </Panel>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href={`/events/${registration.eventSlug}`} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">View Event</a>
                      {registration.paymentDetails.screenshotUrl ? <a href={String(registration.paymentDetails.screenshotUrl)} target="_blank" rel="noreferrer" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Download Payment Proof</a> : null}
                      <a href="/contact" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Contact Support</a>
                    </div>
                  </div>
                )}
              </div>
            </main>
            <Footer />
          </div>
        );
      }}
    </ProtectedRoute>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold mb-4">{title}</h2><div className="space-y-3">{children}</div></section>;
}
function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/40 p-3"><div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</div><div className="text-sm font-semibold mt-1">{value}</div></div>;
}
function Badge({ text }: { text: string }) {
  return <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{text}</span>;
}
