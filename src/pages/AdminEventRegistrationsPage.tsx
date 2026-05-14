import { useMemo, useState } from "react";
import type React from "react";
import { Download, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById, getRegistrations, registrationsToCsv, saveRegistrations, updateRegistrationStatus, type EventRegistration } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventRegistrationsPage({ eventId }: { eventId: string }) {
  const event = getEventById(eventId);
  const { items } = useCmsCollection<EventRegistration>("eventRegistrations");
  const [query, setQuery] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [college, setCollege] = useState("");
  const [mode, setMode] = useState("");

  const registrations = useMemo(() => items.filter((registration) => {
    const haystack = `${registration.studentName} ${registration.studentEmail} ${registration.studentDetails.phone ?? ""}`.toLowerCase();
    const registrationMode = String(registration.teamDetails?.registrationType ?? "Individual");
    return registration.eventId === eventId
      && (!query || haystack.includes(query.toLowerCase()))
      && (!registrationStatus || registration.registrationStatus === registrationStatus)
      && (!paymentStatus || registration.paymentStatus === paymentStatus)
      && (!college || String(registration.studentDetails.college ?? "").toLowerCase().includes(college.toLowerCase()))
      && (!mode || registrationMode === mode);
  }), [college, eventId, items, mode, paymentStatus, query, registrationStatus]);

  const setStatus = (registration: EventRegistration, status: string) => {
    const patch: Partial<EventRegistration> = { registrationStatus: status };
    if (status === "Approved" && registration.paymentStatus === "Under Review") patch.paymentStatus = "Approved";
    updateRegistrationStatus(registration.id, patch);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this registration?")) return;
    saveRegistrations(getRegistrations().filter((registration) => registration.id !== id));
  };

  const exportCsv = () => {
    const blob = new Blob([registrationsToCsv(registrations)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event?.slug ?? "event"}-registrations.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="Event Registrations">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-mono text-primary">Registrations</p>
                <h2 className="text-2xl font-bold mt-2">{event?.title ?? "Event not found"}</h2>
                <p className="text-sm text-muted-foreground mt-1">{registrations.length} registration(s) found</p>
              </div>
              <button onClick={exportCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 grid md:grid-cols-5 gap-3">
            <Field icon={<Search className="h-4 w-4" />} value={query} onChange={setQuery} placeholder="Search name/email/phone" />
            <Select value={registrationStatus} onChange={setRegistrationStatus} options={["Registered", "Pending Review", "Approved", "Rejected", "Cancelled"]} placeholder="Registration status" />
            <Select value={paymentStatus} onChange={setPaymentStatus} options={["Not Required", "Pending Upload", "Under Review", "Approved", "Rejected"]} placeholder="Payment status" />
            <Field value={college} onChange={setCollege} placeholder="College" />
            <Select value={mode} onChange={setMode} options={["Individual", "Team"]} placeholder="Individual/Team" />
          </div>

          <div className="grid gap-4">
            {registrations.length === 0 ? (
              <div className="glass-strong rounded-2xl p-6 text-muted-foreground">No registrations added yet.</div>
            ) : registrations.map((registration) => (
              <div key={registration.id} className="glass-strong rounded-2xl p-5 racing-border">
                <div className="grid lg:grid-cols-[1.4fr_1fr_auto] gap-5">
                  <div>
                    <h3 className="text-xl font-bold">{registration.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{registration.studentEmail} · {registration.studentDetails.phone}</p>
                    <p className="text-sm text-muted-foreground mt-2">{registration.studentDetails.college} · {registration.studentDetails.department} · {registration.studentDetails.year}</p>
                    {registration.teamDetails?.teamName ? <p className="text-sm text-primary mt-2">Team: {String(registration.teamDetails.teamName)}</p> : null}
                    <p className="text-xs text-muted-foreground mt-3">Submitted {new Date(registration.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge label={`Registration: ${registration.registrationStatus}`} />
                    <Badge label={`Payment: ${registration.paymentStatus}`} />
                    <textarea
                      value={registration.adminRemarks ?? ""}
                      onChange={(event) => updateRegistrationStatus(registration.id, { adminRemarks: event.target.value })}
                      placeholder="Admin remarks"
                      className="w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-wrap lg:flex-col gap-2">
                    <Action label="Approve" onClick={() => setStatus(registration, "Approved")} />
                    <Action label="Reject" onClick={() => setStatus(registration, "Rejected")} />
                    <Action label="Mark Pending" onClick={() => setStatus(registration, "Pending Review")} />
                    <button onClick={() => remove(registration.id)} className="px-3 py-2 rounded-lg border border-destructive/40 text-sm text-destructive hover:bg-destructive/10">Delete</button>
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

function Field({ value, onChange, placeholder, icon }: { value: string; onChange: (value: string) => void; placeholder: string; icon?: React.ReactNode }) {
  return <label className="relative">{icon ? <span className="absolute left-3 top-3 text-muted-foreground">{icon}</span> : null}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`w-full bg-background/60 border border-border rounded-xl py-2.5 text-sm focus:outline-none focus:border-primary ${icon ? "pl-9 pr-3" : "px-3"}`} /></label>;
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}

function Badge({ label }: { label: string }) {
  return <div className="inline-flex px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mr-2">{label}</div>;
}

function Action({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="px-3 py-2 rounded-lg border border-border text-sm hover:border-primary/50 transition-colors">{label}</button>;
}
