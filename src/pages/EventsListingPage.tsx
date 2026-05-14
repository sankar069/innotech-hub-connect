import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { EventPlatform, Footer } from "@/components/site/Sections";
import { getAuthUser, getDashboardPath } from "@/lib/auth";
import { eventCategories, eventTypes, getPublicEvents, paymentTypes, type EventItem } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function EventsListingPage() {
  useCmsCollection("events");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const events = useMemo(() => getPublicEvents().filter((event) => {
    const matchesSearch = !query || event.title.toLowerCase().includes(query.toLowerCase()) || event.shortDescription.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || event.category === category;
    const normalizedStatus = event.status === "Completed" ? "Completed" : event.status === "Ongoing" ? "Ongoing" : "Upcoming";
    const matchesStatus = !status || normalizedStatus === status;
    const matchesType = !type || event.type === type;
    const matchesPayment = !paymentType || event.payment?.type === paymentType;
    return matchesSearch && matchesCategory && matchesStatus && matchesType && matchesPayment;
  }), [query, category, status, type, paymentType]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Calendar className="h-3.5 w-3.5" /> Event Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Explore <span className="text-gradient-racing">Events</span></h1>
            <p className="mt-4 text-muted-foreground">Discover hackathons, workshops, webinars, summits, podcasts, and student-first learning opportunities.</p>
          </div>

          <div className="glass-strong rounded-2xl p-5 racing-border mb-8">
            <div className="grid md:grid-cols-5 gap-3">
              <label className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="w-full bg-background/60 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary" />
              </label>
              <Filter value={category} onChange={setCategory} options={eventCategories} placeholder="Category" />
              <Filter value={status} onChange={setStatus} options={["Upcoming", "Ongoing", "Completed"]} placeholder="Status" />
              <Filter value={type} onChange={setType} options={eventTypes} placeholder="Type" />
              <Filter value={paymentType} onChange={setPaymentType} options={paymentTypes} placeholder="Free/Paid" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.length === 0 && <div className="glass rounded-2xl p-6 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">No items added yet</div>}
            {events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
          </div>
        </section>
        <EventPlatform />
      </main>
      <Footer />
    </div>
  );
}

function Filter({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

export function getRegisterHref(event: EventItem) {
  const user = getAuthUser();
  if (!user) return "/auth";
  if (user.role === "admin") return `/admin/events/${event.id}/registrations`;
  return `/events/${event.slug}/register`;
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-strong rounded-2xl p-5 racing-border hover:-translate-y-1 transition-transform">
      {event.media?.thumbnail ? <img src={event.media.thumbnail} alt={event.title} className="aspect-video w-full rounded-xl object-cover border border-border mb-5" /> : <div className="aspect-video rounded-xl border border-border bg-card/50 mb-5 flex items-center justify-center text-xs font-mono text-muted-foreground">{event.category}</div>}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">{event.category}</span>
        <span className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{event.type}</span>
        <span className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{String(event.payment?.type ?? "Free Event")}</span>
      </div>
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{event.shortDescription}</p>
      <p className="mt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">{event.dates?.eventStartDate ?? ""} · {event.status}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={`/events/${event.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">View Details</a>
        <a href={getRegisterHref(event)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Register Now <ArrowRight className="h-4 w-4" /></a>
      </div>
    </motion.article>
  );
}
