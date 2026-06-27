import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { eventCategories, eventStatuses, eventTypes, getEvents, paymentTypes, registrationsToCsv, saveEvents, type EventItem } from "@/lib/events";
import { Link } from "@tanstack/react-router";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventsPage() {
  const { items: storedEvents } = useCmsCollection<EventItem>("events");
  const events = Array.isArray(storedEvents) ? storedEvents : [];
  const { items: storedRegistrations } = useCmsCollection("eventRegistrations");
  const registrations = Array.isArray(storedRegistrations) ? storedRegistrations : [];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => events.filter((event) => {
    const matchesQuery = !query || String(event?.title ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!category || event?.category === category) && (!status || event?.status === status) && (!type || event?.type === type) && (!paymentType || event?.payment?.type === paymentType);
  }), [events, query, category, status, type, paymentType]);

  const remove = (event: EventItem) => {
    if (!window.confirm("Delete this event?")) return;
    saveEvents(events.filter((item) => item.id !== event.id));
    setMessage("Event deleted.");
    setTimeout(() => setMessage(""), 3000);
  };

  const exportCsv = (event: EventItem) => {
    const csv = registrationsToCsv(registrations.filter((registration) => registration.eventId === event.id) as any);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleStatus = (event: EventItem, newStatus: string) => {
    saveEvents(events.map((item) => item.id === event.id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item));
    setMessage(`Event status updated to ${newStatus}.`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <AdminLayout title="Events CMS">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Event Management</h2>
                <p className="mt-2 text-sm text-muted-foreground">Create, edit, publish, complete, and manage registrations for events.</p>
              </div>
              <Link to="/admin/events/$eventId/edit" params={{ eventId: "new" }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Plus className="h-4 w-4" /> Create Event
              </Link>
            </div>
            {message && <p className="mt-4 text-sm text-primary animate-in fade-in slide-in-from-top-1">{message}</p>}
            <div className="grid md:grid-cols-5 gap-3 mt-5">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              <Select value={category} onChange={setCategory} options={eventCategories} placeholder="Category" />
              <Select value={status} onChange={setStatus} options={eventStatuses} placeholder="Status" />
              <Select value={type} onChange={setType} options={eventTypes} placeholder="Type" />
              <Select value={paymentType} onChange={setPaymentType} options={paymentTypes} placeholder="Payment" />
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-12 racing-border text-center">
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            ) : filtered.map((event) => (
              <div key={event.id} className="glass-strong rounded-2xl p-5 racing-border group hover:bg-card/20 transition-colors">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{event?.title ?? "Untitled Event"}</h3>
                    <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider">
                      <span className="text-muted-foreground">{event?.category}</span>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-muted-foreground">{event?.type}</span>
                      <span className="text-muted-foreground/30">•</span>
                      <span className={`px-2 py-0.5 rounded-full ${event?.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {event?.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`/admin/events/${event.id}/registrations`} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-card transition-colors">Registrations</a>
                    <button onClick={() => exportCsv(event)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-card transition-colors"><Download className="h-3.5 w-3.5" /> CSV</button>
                    <Link to="/admin/events/$eventId/edit" params={{ eventId: event.id }} className="rounded-lg border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary transition-colors">Edit</Link>
                    {event.status !== "Published" && (
                      <button onClick={() => toggleStatus(event, "Published")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors text-primary border-primary/30">Publish</button>
                    )}
                    {event.status === "Published" && (
                      <button onClick={() => toggleStatus(event, "Draft")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-card transition-colors">Unpublish</button>
                    )}
                    <button onClick={() => toggleStatus(event, "Completed")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-card transition-colors">Complete</button>
                    <button onClick={() => remove(event)} className="rounded-lg border border-destructive/20 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
