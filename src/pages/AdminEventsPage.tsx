import { useMemo, useState } from "react";
import type React from "react";
import { Download, Plus, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { eventCategories, eventStatuses, eventTypes, getEvents, participationModes, paymentTypes, registrationsToCsv, saveEvents, type EventItem } from "@/lib/events";
import { slugify, useCmsCollection } from "@/lib/cms";

const blankEvent = (): EventItem => ({
  id: crypto.randomUUID(),
  title: "",
  slug: "",
  category: "",
  type: "",
  participationMode: "",
  shortDescription: "",
  fullDescription: "",
  organizerName: "",
  organizerLogo: "",
  hostedBy: "",
  externalLink: "",
  status: "Draft",
  featured: false,
  active: true,
  order: getEvents().length + 1,
  dates: { registrationStartDate: "", registrationStartTime: "", registrationEndDate: "", registrationEndTime: "", eventStartDate: "", eventStartTime: "", eventEndDate: "", eventEndTime: "", resultDate: "", resultTime: "", timeZone: "Asia/Kolkata" },
  location: { meetingPlatform: "", meetingLink: "", backupLink: "", communityLink: "", venueName: "", collegeName: "", address: "", city: "", state: "", pincode: "", mapsLink: "" },
  media: { banner: "", poster: "", thumbnail: "", mobileBanner: "" },
  rounds: [],
  rules: { eligibility: "", regulations: "", guidelines: "", teamSize: "", submissionFormat: "", judgingCriteria: "", disqualification: "", conduct: "", notes: "", documents: "" },
  rewards: { totalPrizePool: "", winnerPrize: "", runnerUpPrize: "", secondRunnerUpPrize: "", specialPrizes: "", certificates: "", goodies: "", internship: "", mentorship: "", sponsorRewards: "", benefits: "" },
  contact: { name: "", role: "", email: "", phone: "", whatsapp: "", discord: "", telegram: "", message: "" },
  payment: { type: "Free Event", amount: 0, currency: "INR", upiId: "", qrImage: "", instructions: "", deadline: "", refundPolicy: "", verificationNote: "" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function AdminEventsPage() {
  const { items: events } = useCmsCollection<EventItem>("events");
  const { items: registrations } = useCmsCollection("eventRegistrations");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => events.filter((event) => {
    const matchesQuery = !query || event.title.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!category || event.category === category) && (!status || event.status === status) && (!type || event.type === type) && (!paymentType || event.payment?.type === paymentType);
  }), [events, query, category, status, type, paymentType]);

  const save = () => {
    if (!editing) return;
    if (!editing.title || !editing.category || !editing.type || !editing.participationMode || !editing.dates?.registrationStartDate || !editing.dates?.registrationEndDate || !editing.dates?.eventStartDate || !editing.dates?.eventEndDate) {
      setMessage("Title, category, type, participation mode, registration dates, and event dates are required.");
      return;
    }
    const next = { ...editing, slug: editing.slug || slugify(editing.title), updatedAt: new Date().toISOString() };
    saveEvents(events.some((event) => event.id === next.id) ? events.map((event) => event.id === next.id ? next : event) : [next, ...events]);
    setEditing(null);
    setMessage("Event saved.");
  };

  const remove = (event: EventItem) => {
    if (!window.confirm("Delete this event?")) return;
    saveEvents(events.filter((item) => item.id !== event.id));
  };

  const update = (key: keyof EventItem, value: unknown) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const updateNested = (group: "dates" | "location" | "media" | "rules" | "rewards" | "contact" | "payment", key: string, value: unknown) => setEditing((current) => current ? { ...current, [group]: { ...(current[group] as Record<string, unknown>), [key]: value } } : current);

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
              <button onClick={() => setEditing(blankEvent())} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Create Event</button>
            </div>
            {message && <p className="mt-4 text-sm text-primary">{message}</p>}
            <div className="grid md:grid-cols-5 gap-3 mt-5">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm" />
              <Select value={category} onChange={setCategory} options={eventCategories} placeholder="Category" />
              <Select value={status} onChange={setStatus} options={eventStatuses} placeholder="Status" />
              <Select value={type} onChange={setType} options={eventTypes} placeholder="Type" />
              <Select value={paymentType} onChange={setPaymentType} options={paymentTypes} placeholder="Payment" />
            </div>
          </div>

          {editing && (
            <div className="glass-strong rounded-2xl p-6 racing-border space-y-8">
              <h3 className="text-2xl font-bold">Create / Edit Event</h3>
              <FormGrid title="Basic Details">
                <Field label="Event Title" value={editing.title} onChange={(v) => update("title", v)} />
                <Field label="Event Slug" value={editing.slug} onChange={(v) => update("slug", v)} />
                <Select label="Event Category" value={editing.category} onChange={(v) => update("category", v)} options={eventCategories} placeholder="Select category" />
                <Select label="Event Type" value={editing.type} onChange={(v) => update("type", v)} options={eventTypes} placeholder="Select type" />
                <Select label="Participation Mode" value={editing.participationMode} onChange={(v) => update("participationMode", v)} options={participationModes} placeholder="Select mode" />
                <Select label="Event Status" value={editing.status} onChange={(v) => update("status", v)} options={eventStatuses} placeholder="Select status" />
                <Field label="Short Description" value={editing.shortDescription} onChange={(v) => update("shortDescription", v)} textarea />
                <Field label="Full Event Description" value={editing.fullDescription ?? ""} onChange={(v) => update("fullDescription", v)} textarea />
                <Field label="Organizer Name" value={editing.organizerName ?? ""} onChange={(v) => update("organizerName", v)} />
                <Field label="Organizer Logo/Image" value={editing.organizerLogo ?? ""} onChange={(v) => update("organizerLogo", v)} />
                <Field label="Hosted By / College / Company / Community" value={editing.hostedBy ?? ""} onChange={(v) => update("hostedBy", v)} />
                <Field label="Event Website / External Link" value={editing.externalLink ?? ""} onChange={(v) => update("externalLink", v)} />
                <CheckField label="Featured Event" checked={Boolean(editing.featured)} onChange={(v) => update("featured", v)} />
                <CheckField label="Active" checked={editing.active !== false} onChange={(v) => update("active", v)} />
              </FormGrid>

              <FormGrid title="Date & Time Details">
                {["registrationStartDate", "registrationStartTime", "registrationEndDate", "registrationEndTime", "eventStartDate", "eventStartTime", "eventEndDate", "eventEndTime", "resultDate", "resultTime", "timeZone"].map((key) => <Field key={key} label={key} value={String(editing.dates?.[key] ?? "")} onChange={(v) => updateNested("dates", key, v)} />)}
              </FormGrid>

              <FormGrid title="Location / Meeting Details">
                {["meetingPlatform", "meetingLink", "backupLink", "communityLink", "venueName", "collegeName", "address", "city", "state", "pincode", "mapsLink"].map((key) => <Field key={key} label={key} value={String(editing.location?.[key] ?? "")} onChange={(v) => updateNested("location", key, v)} />)}
              </FormGrid>

              <FormGrid title="Event Banner / Poster Upload">
                <Help text="Banner: 1920 x 1080 px, JPG/PNG/WebP. Used on event detail page hero." />
                <Help text="Poster: 1080 x 1350 px. Square thumbnail: 1080 x 1080 px. Mobile banner: 1080 x 1920 px. File storage can later connect to Vercel Blob, Supabase Storage, Firebase Storage, or Cloudinary." />
                {["banner", "poster", "thumbnail", "mobileBanner"].map((key) => <Field key={key} label={key} value={String(editing.media?.[key] ?? "")} onChange={(v) => updateNested("media", key, v)} preview />)}
              </FormGrid>

              <FormGrid title="Rounds / Stages">
                <Field label="Rounds JSON" value={JSON.stringify(editing.rounds ?? [], null, 2)} onChange={(v) => { try { update("rounds", JSON.parse(v)); } catch { update("rounds", editing.rounds ?? []); } }} textarea />
              </FormGrid>

              <FormGrid title="Rules, Eligibility & Guidelines">
                {["eligibility", "regulations", "guidelines", "teamSize", "submissionFormat", "judgingCriteria", "disqualification", "conduct", "notes", "documents"].map((key) => <Field key={key} label={key} value={String(editing.rules?.[key] ?? "")} onChange={(v) => updateNested("rules", key, v)} textarea={["regulations", "guidelines", "notes"].includes(key)} />)}
              </FormGrid>

              <FormGrid title="Rewards / Certificates">
                {["totalPrizePool", "winnerPrize", "runnerUpPrize", "secondRunnerUpPrize", "specialPrizes", "certificates", "goodies", "internship", "mentorship", "sponsorRewards", "benefits"].map((key) => <Field key={key} label={key} value={String(editing.rewards?.[key] ?? "")} onChange={(v) => updateNested("rewards", key, v)} />)}
              </FormGrid>

              <FormGrid title="Contact / Support Details">
                {["name", "role", "email", "phone", "whatsapp", "discord", "telegram", "message"].map((key) => <Field key={key} label={key} value={String(editing.contact?.[key] ?? "")} onChange={(v) => updateNested("contact", key, v)} />)}
              </FormGrid>

              <FormGrid title="Free / Paid Event Option">
                <Select label="Payment Type" value={String(editing.payment?.type ?? "Free Event")} onChange={(v) => updateNested("payment", "type", v)} options={paymentTypes} placeholder="Select payment type" />
                <Field label="Registration Fee Amount" value={String(editing.payment?.amount ?? 0)} onChange={(v) => updateNested("payment", "amount", Number(v))} />
                {["currency", "upiId", "qrImage", "instructions", "deadline", "refundPolicy", "verificationNote"].map((key) => <Field key={key} label={key} value={String(editing.payment?.[key] ?? "")} onChange={(v) => updateNested("payment", key, v)} textarea={["instructions", "refundPolicy", "verificationNote"].includes(key)} preview={key === "qrImage"} />)}
              </FormGrid>

              <div className="flex flex-wrap gap-3">
                <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save Event</button>
                <button onClick={() => setEditing(null)} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filtered.map((event) => (
              <div key={event.id} className="glass-strong rounded-2xl p-5 racing-border">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.category} · {event.type} · {event.status} · {String(event.payment?.type ?? "Free Event")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`/admin/events/${event.id}/registrations`} className="rounded-lg border border-border px-3 py-2 text-sm">Registrations</a>
                    <button onClick={() => exportCsv(event)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm"><Download className="h-3.5 w-3.5" /> CSV</button>
                    <button onClick={() => setEditing(event)} className="rounded-lg border border-border px-3 py-2 text-sm">Edit</button>
                    <button onClick={() => saveEvents(events.map((item) => item.id === event.id ? { ...item, status: item.status === "Published" ? "Draft" : "Published" } : item))} className="rounded-lg border border-border px-3 py-2 text-sm">{event.status === "Published" ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => saveEvents(events.map((item) => item.id === event.id ? { ...item, status: "Completed" } : item))} className="rounded-lg border border-border px-3 py-2 text-sm">Complete</button>
                    <button onClick={() => remove(event)} className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive">Delete</button>
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

function FormGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h4 className="text-xl font-bold mb-4">{title}</h4><div className="grid md:grid-cols-2 gap-4">{children}</div></section>;
}

function Field({ label, value, onChange, textarea, preview }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; preview?: boolean }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary";
  return <label className={textarea ? "md:col-span-2" : ""}><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span>{textarea ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={className} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={className} />}{preview && value ? <img src={value} alt="" className="mt-3 h-24 w-24 rounded-xl object-cover border border-border" /> : null}</label>;
}

function Select({ label, value, onChange, options, placeholder }: { label?: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  const select = <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"><option value="">{placeholder}</option>{options.map((option) => <option key={option}>{option}</option>)}</select>;
  return label ? <label><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span>{select}</label> : select;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-primary" />{label}</label>;
}

function Help({ text }: { text: string }) {
  return <div className="rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">{text}</div>;
}
