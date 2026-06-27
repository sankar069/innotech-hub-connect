import React, { useState, useEffect } from "react";
import { Save, ChevronLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { 
  eventCategories, 
  eventStatuses, 
  eventTypes, 
  getEventById, 
  saveEvents, 
  getEvents,
  participationModes, 
  paymentTypes, 
  type EventItem 
} from "@/lib/events";
import { slugify } from "@/lib/cms";
import { createId } from "@/lib/id";

const blankEvent = (): EventItem => ({
  id: createId("event"),
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
  rules: { eligibility: "", regulations: "", guidelines: "", teamSize: "", submissionFormat: "", judgingCriteria: "", disqualification: "", conduct: "", notes: "", documents: "", ruleDocument: "", brochureDocument: "" },
  rewards: { totalPrizePool: "", winnerPrize: "", runnerUpPrize: "", secondRunnerUpPrize: "", specialPrizes: "", certificates: "", goodies: "", internship: "", mentorship: "", sponsorRewards: "", benefits: "" },
  contact: { name: "", role: "", email: "", phone: "", whatsapp: "", discord: "", telegram: "", message: "" },
  payment: { type: "Free Event", amount: 0, currency: "INR", upiId: "", qrImage: "", instructions: "", deadline: "", refundPolicy: "", verificationNote: "" },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

interface Props {
  eventId?: string;
}

export function AdminEventEditPage({ eventId }: Props) {
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (eventId && eventId !== "new") {
      const event = getEventById(eventId);
      if (event) {
        setEditing({
          ...blankEvent(),
          ...event,
          dates: { ...blankEvent().dates, ...event.dates },
          location: { ...blankEvent().location, ...event.location },
          media: { ...blankEvent().media, ...event.media },
          rules: { ...blankEvent().rules, ...event.rules },
          rewards: { ...blankEvent().rewards, ...event.rewards },
          contact: { ...blankEvent().contact, ...event.contact },
          payment: { ...blankEvent().payment, ...event.payment },
        });
      }
    } else {
      setEditing(blankEvent());
    }
  }, [eventId]);

  const save = () => {
    if (!editing) return;
    if (!editing.title || !editing.category || !editing.type || !editing.participationMode || !editing.dates?.registrationStartDate || !editing.dates?.registrationEndDate || !editing.dates?.eventStartDate || !editing.dates?.eventEndDate) {
      setMessage("Title, category, type, participation mode, registration dates, and event dates are required.");
      return;
    }
    const events = getEvents();
    const next = { ...editing, slug: editing.slug || slugify(editing.title), updatedAt: new Date().toISOString() };
    saveEvents(events.some((e) => e.id === next.id) ? events.map((e) => e.id === next.id ? next : e) : [next, ...events]);
    setMessage("Event saved successfully.");
    setTimeout(() => {
      window.location.href = "/admin/events";
    }, 1500);
  };

  const update = <K extends keyof EventItem>(key: K, value: EventItem[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const updateNested = <G extends keyof EventItem, K extends keyof NonNullable<EventItem[G]>>(group: G, key: K, value: any) => setEditing((current) => {
    if (!current) return null;
    const g = (current[group] as any) || {};
    return { ...current, [group]: { ...g, [key]: value } };
  });

  if (!editing) return <AdminLayout title="Loading...">{() => <div>Loading...</div>}</AdminLayout>;

  return (
    <AdminLayout title={eventId === "new" ? "Create Event" : "Edit Event"}>
      {() => (
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <a href="/admin/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to List
            </a>
            <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>

          {message && <div className="glass rounded-xl p-4 text-sm text-primary animate-in fade-in slide-in-from-top-2">{message}</div>}

          <div className="glass-strong rounded-2xl p-6 racing-border space-y-8">
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
              <FileUploadField label="Organizer Logo" value={editing.organizerLogo ?? ""} onChange={(v) => update("organizerLogo", v)} helper="JPG, PNG, WebP accepted." />
              <Field label="Hosted By" value={editing.hostedBy ?? ""} onChange={(v) => update("hostedBy", v)} />
              <Field label="External Link" value={editing.externalLink ?? ""} onChange={(v) => update("externalLink", v)} />
              <CheckField label="Featured Event" checked={Boolean(editing.featured)} onChange={(v) => update("featured", v)} />
              <CheckField label="Active" checked={editing.active !== false} onChange={(v) => update("active", v)} />
            </FormGrid>

            <FormGrid title="Registration & Event Dates">
              {(["registrationStartDate", "registrationStartTime", "registrationEndDate", "registrationEndTime", "eventStartDate", "eventStartTime", "eventEndDate", "eventEndTime", "resultDate", "resultTime", "timeZone"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.dates?.[key] ?? "")} onChange={(v) => updateNested("dates", key, v)} type={key.toLowerCase().includes("date") ? "date" : key.toLowerCase().includes("time") ? "time" : "text"} />
              ))}
            </FormGrid>

            <FormGrid title="Location & Platform">
              {(["meetingPlatform", "meetingLink", "backupLink", "communityLink", "venueName", "collegeName", "address", "city", "state", "pincode", "mapsLink"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.location?.[key] ?? "")} onChange={(v) => updateNested("location", key, v)} />
              ))}
            </FormGrid>

            <FormGrid title="Media Assets">
              <FileUploadField label="Event Banner" value={String(editing.media?.banner ?? "")} onChange={(v) => updateNested("media", "banner", v)} helper="1920x1080px" />
              <FileUploadField label="Event Poster" value={String(editing.media?.poster ?? "")} onChange={(v) => updateNested("media", "poster", v)} helper="1080x1350px" />
              <FileUploadField label="Thumbnail" value={String(editing.media?.thumbnail ?? "")} onChange={(v) => updateNested("media", "thumbnail", v)} helper="1080x1080px" />
              <FileUploadField label="Mobile Banner" value={String(editing.media?.mobileBanner ?? "")} onChange={(v) => updateNested("media", "mobileBanner", v)} helper="1080x1920px" />
            </FormGrid>

            <FormGrid title="Rules & Guidelines">
              {(["eligibility", "regulations", "guidelines", "teamSize", "submissionFormat", "judgingCriteria", "disqualification", "conduct", "notes", "documents"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.rules?.[key] ?? "")} onChange={(v) => updateNested("rules", key, v)} textarea={["regulations", "guidelines", "notes"].includes(key)} />
              ))}
              <FileUploadField label="Rule Document (PDF)" value={String(editing.rules?.ruleDocument ?? "")} onChange={(v) => updateNested("rules", "ruleDocument", v)} accept="application/pdf" />
              <FileUploadField label="Brochure (PDF)" value={String(editing.rules?.brochureDocument ?? "")} onChange={(v) => updateNested("rules", "brochureDocument", v)} accept="application/pdf" />
            </FormGrid>

            <FormGrid title="Prizes & Rewards">
              {(["totalPrizePool", "winnerPrize", "runnerUpPrize", "secondRunnerUpPrize", "specialPrizes", "certificates", "goodies", "internship", "mentorship", "sponsorRewards", "benefits"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.rewards?.[key] ?? "")} onChange={(v) => updateNested("rewards", key, v)} />
              ))}
            </FormGrid>

            <FormGrid title="Payment Details">
              <Select label="Payment Type" value={String(editing.payment?.type ?? "Free Event")} onChange={(v) => updateNested("payment", "type", v)} options={paymentTypes} placeholder="Select payment type" />
              <Field label="Amount" value={String(editing.payment?.amount ?? 0)} onChange={(v) => updateNested("payment", "amount", Number(v))} type="number" />
              <Field label="Currency" value={String(editing.payment?.currency ?? "INR")} onChange={(v) => updateNested("payment", "currency", v)} />
              <Field label="UPI ID" value={String(editing.payment?.upiId ?? "")} onChange={(v) => updateNested("payment", "upiId", v)} />
              <FileUploadField label="UPI QR Image" value={String(editing.payment?.qrImage ?? "")} onChange={(v) => updateNested("payment", "qrImage", v)} />
              {(["instructions", "deadline", "refundPolicy", "verificationNote"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.payment?.[key] ?? "")} onChange={(v) => updateNested("payment", key, v)} textarea={["instructions", "refundPolicy"].includes(key)} />
              ))}
            </FormGrid>

            <FormGrid title="Contact Information">
              {(["name", "role", "email", "phone", "whatsapp", "discord", "telegram"] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(editing.contact?.[key] ?? "")} onChange={(v) => updateNested("contact", key, v)} />
              ))}
            </FormGrid>

            <FormGrid title="Rounds / Timeline">
               <div className="md:col-span-2">
                 <p className="text-sm text-muted-foreground mb-4 font-mono">Input rounds as JSON array for flexibility.</p>
                 <Field label="Rounds JSON" value={JSON.stringify(editing.rounds ?? [], null, 2)} onChange={(v) => { try { update("rounds", JSON.parse(v)); } catch { /* ignore invalid json */ } }} textarea />
               </div>
            </FormGrid>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function FormGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 pt-6 border-t border-border first:pt-0 first:border-0">
      <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        {title}
      </h4>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value, onChange, textarea, type = "text" }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors hover:border-muted-foreground/30";
  return (
    <label className={textarea ? "md:col-span-2" : ""}>
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2 ml-1">{label}</span>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      )}
    </label>
  );
}

function Select({ label, value, onChange, options, placeholder }: { label?: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  const select = (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors hover:border-muted-foreground/30">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
  return label ? (
    <label>
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2 ml-1">{label}</span>
      {select}
    </label>
  ) : select;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary" />
      <span className="font-medium group-hover:text-primary transition-colors">{label}</span>
    </label>
  );
}
