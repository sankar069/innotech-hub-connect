import { motion } from "framer-motion";
import { Calendar, Check, MapPin, Trophy } from "lucide-react";
import type React from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { getAuthUser } from "@/lib/auth";
import { getEventBySlug, getRegistrationForEvent, getRegistrationStatus, type EventItem } from "@/lib/events";

export function EventDetailPage({ slug }: { slug: string }) {
  const event = getEventBySlug(slug);

  if (!event) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">Event not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const user = getAuthUser();
  const registration = getRegistrationForEvent(event.id);
  const registrationOpen = getRegistrationStatus(event) === "Registration Open";
  const registerHref = !user ? "/auth" : user.role === "admin" ? `/admin/events/${event.id}/registrations` : `/events/${event.slug}/register`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
            {event.media?.banner ? <img src={event.media.banner} alt={event.title} className="aspect-video w-full rounded-xl object-cover border border-border mb-8" /> : null}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{event.category}</Badge>
              <Badge>{event.type}</Badge>
              <Badge>{event.participationMode}</Badge>
              <Badge>{String(event.payment?.type ?? "Free Event")}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">{event.title}</h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl">{event.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {event.dates?.eventStartDate} {event.dates?.eventStartTime}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.type}</span>
              <span>{getRegistrationStatus(event)}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {registration ? (
                <>
                  <a href="/student/dashboard" className="rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground">Go to Dashboard</a>
                  <a href="/student/registrations" className="rounded-xl border border-border px-5 py-3 font-semibold">View Registration</a>
                </>
              ) : (
                <a aria-disabled={!registrationOpen} href={registrationOpen ? registerHref : "#"} className={`rounded-xl px-5 py-3 font-semibold ${registrationOpen ? "bg-gradient-primary text-primary-foreground" : "border border-border text-muted-foreground pointer-events-none"}`}>
                  {registrationOpen ? "Register Now" : "Registration Closed"}
                </a>
              )}
            </div>
          </motion.section>

          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <InfoCard title="Full Description">{event.fullDescription}</InfoCard>
              <Rounds event={event} />
              <InfoCard title="Rules & Guidelines">
                <List values={event.rules} />
              </InfoCard>
            </div>
            <div className="space-y-6">
              <InfoCard title="Organizer">
                <p>{event.organizerName}</p>
                <p className="text-muted-foreground">{event.hostedBy}</p>
              </InfoCard>
              <InfoCard title="Rewards">
                <List values={event.rewards} />
              </InfoCard>
              {event.payment?.type === "Paid Event" && (
                <InfoCard title="Payment Info">
                  <p className="text-2xl font-display font-bold text-gradient-primary">{String(event.payment.currency ?? "INR")} {String(event.payment.amount ?? "")}</p>
                  <p className="mt-2 text-muted-foreground">{String(event.payment.instructions ?? "")}</p>
                  <p className="mt-2 text-sm">UPI: {String(event.payment.upiId ?? "")}</p>
                </InfoCard>
              )}
              <InfoCard title="Contact / Support">
                <List values={event.contact} />
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">{children}</span>;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold mb-4">{title}</h2><div className="text-sm text-muted-foreground space-y-2">{children}</div></section>;
}

function List({ values }: { values?: Record<string, unknown> }) {
  return (
    <ul className="space-y-2">
      {Object.entries(values ?? {}).filter(([, value]) => value).map(([key, value]) => (
        <li key={key} className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><span className="text-foreground">{key}: </span>{String(value)}</span></li>
      ))}
    </ul>
  );
}

function Rounds({ event }: { event: EventItem }) {
  return (
    <InfoCard title="Rounds / Stages">
      {(event.rounds ?? []).length === 0 ? <p>No rounds added yet.</p> : (
        <div className="space-y-3">
          {(event.rounds ?? []).map((round) => (
            <div key={String(round.id ?? round.title)} className="rounded-xl border border-border bg-card/40 p-4">
              <div className="flex items-center gap-2 font-bold text-foreground"><Trophy className="h-4 w-4 text-primary" />{String(round.title ?? "")}</div>
              <p className="mt-2">{String(round.description ?? "")}</p>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
}
