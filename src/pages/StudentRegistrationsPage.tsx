import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { Calendar, CreditCard } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventById, getMyRegistrations, type EventRegistration } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function StudentRegistrationsPage() {
  const { items } = useCmsCollection<EventRegistration>("eventRegistrations");
  const [filter, setFilter] = useState("All");

  return (
    <ProtectedRoute allow="student">
      {() => {
        const allRegistrations = getMyRegistrations().filter((registration) => items.some((item) => item.id === registration.id));
        const registrations = allRegistrations.filter((registration) => {
          const event = getEventById(registration.eventId);
          if (filter === "Payment Pending") return ["Pending Upload", "Under Review", "Rejected"].includes(registration.paymentStatus);
          if (filter === "Payment Approved") return registration.paymentStatus === "Approved" || registration.paymentStatus === "Not Required";
          if (filter === "Completed") return event?.status === "Completed";
          if (filter === "Upcoming") return new Date(`${event?.dates?.eventStartDate ?? "2999-01-01"}T00:00`) >= new Date();
          return true;
        });
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-32 pb-20 md:pt-40 md:pb-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                    <Calendar className="h-3.5 w-3.5" /> Event Platform
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold">My Registered Events</h1>
                  <p className="mt-4 text-muted-foreground text-base md:text-lg">Track registrations, payment status, event details, certificates, and updates.</p>
                </motion.div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["All", "Upcoming", "Completed", "Payment Pending", "Payment Approved", "Certificates Available"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${filter === item ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{item}</button>)}
                </div>

                {allRegistrations.length === 0 ? (
                  <div className="glass-strong rounded-2xl p-6 racing-border">
                    <p className="text-muted-foreground">You have not registered for any events yet.</p>
                    <a href="/events" className="inline-flex mt-4 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold">Explore Events</a>
                  </div>
                ) : registrations.length === 0 ? <div className="glass-strong rounded-2xl p-6 racing-border text-muted-foreground">No events match this filter.</div> : (
                  <div className="grid md:grid-cols-2 gap-5">
                    {registrations.map((registration, index) => <RegistrationCard key={registration.id} registration={registration} index={index} />)}
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

function RegistrationCard({ registration, index }: { registration: EventRegistration; index: number }) {
  const event = getEventById(registration.eventId);
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="glass-strong rounded-2xl p-5 racing-border">
      <div className="flex items-start gap-4">
        {event?.media?.thumbnail ? <img src={String(event.media.thumbnail)} alt="" className="h-20 w-20 rounded-xl object-cover border border-border" /> : <div className="h-20 w-20 rounded-xl bg-gradient-primary flex items-center justify-center"><Calendar className="h-6 w-6 text-primary-foreground" /></div>}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest font-mono text-primary">{event?.category ?? "Event"}</p>
          <h2 className="text-xl font-bold mt-1">{event?.title ?? registration.eventSlug}</h2>
          <p className="text-sm text-muted-foreground mt-1">{event?.dates?.eventStartDate ?? "Date to be announced"}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        <Status icon={<Calendar className="h-4 w-4" />} label="Registration" value={registration.registrationStatus} />
        <Status icon={<CreditCard className="h-4 w-4" />} label="Payment" value={registration.paymentStatus} />
      </div>
      {registration.adminRemarks ? <p className="mt-4 text-sm text-muted-foreground">Admin remarks: {registration.adminRemarks}</p> : null}
      <div className="flex flex-wrap gap-2 mt-5">
        <a href={`/events/${registration.eventSlug}`} className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:border-primary/50">View Event</a>
        <a href={`/student/registrations/${registration.id}`} className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">View Registration</a>
      </div>
    </motion.article>
  );
}

function Status({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/40 p-3"><div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{icon}{label}</div><div className="font-semibold mt-1">{value}</div></div>;
}
