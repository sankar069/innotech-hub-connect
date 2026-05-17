import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getMyRegistrations } from "@/lib/events";
import { getMySubmissions, getSubmissions, saveSubmissions, type Submission } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function StudentSubmissionsPage() {
  const { items } = useCmsCollection<Submission>("submissions");
  return (
    <ProtectedRoute allow="student">
      {(user) => <SubmissionPanel email={user.email} submissions={getMySubmissions(user.email).filter((item) => items.some((stored) => stored.id === item.id))} />}
    </ProtectedRoute>
  );
}

function SubmissionPanel({ email, submissions }: { email: string; submissions: Submission[] }) {
  const registrations = getMyRegistrations();
  const [form, setForm] = useState({ eventId: registrations[0]?.eventId ?? "", roundId: "", registrationId: registrations[0]?.id ?? "", projectTitle: "", projectDescription: "", githubLink: "", demoVideoLink: "", pptLink: "", liveProjectLink: "", projectFile: "", pptFile: "", supportingDocument: "", notes: "" });
  const [message, setMessage] = useState("");
  const submit = () => {
    if (!form.eventId || !form.projectTitle) {
      setMessage("Please select an event and add a project title.");
      return;
    }
    const item: Submission = { ...form, id: crypto.randomUUID(), studentId: email, status: "Submitted", createdAt: new Date().toISOString(), active: true, order: Date.now() };
    saveSubmissions([item, ...getSubmissions()]);
    setMessage("Submission saved.");
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6"><h1 className="text-4xl md:text-5xl font-bold">Project Submissions</h1><p className="mt-3 text-muted-foreground">Submit project links and notes for event rounds.</p></div>
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="glass-strong rounded-2xl p-6 racing-border">
              <h2 className="text-2xl font-bold mb-4">New Submission</h2>
              <div className="grid gap-4">
                <label><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Event</span><select value={form.eventId} onChange={(event) => setForm((current) => ({ ...current, eventId: event.target.value, registrationId: registrations.find((item) => item.eventId === event.target.value)?.id ?? "" }))} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm">{registrations.map((item) => <option key={item.id} value={item.eventId}>{item.eventSlug}</option>)}</select></label>
                {["roundId", "projectTitle", "projectDescription", "githubLink", "demoVideoLink", "pptLink", "liveProjectLink", "notes"].map((key) => <Field key={key} label={key} value={String(form[key as keyof typeof form] ?? "")} onChange={(value) => setForm((current) => ({ ...current, [key]: value }))} />)}
                <FileUploadField label="Project Submission File" value={form.projectFile} onChange={(value) => setForm((current) => ({ ...current, projectFile: value }))} accept=".pdf,.doc,.docx,.zip,application/pdf,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" helper="Upload placeholder for project files. Links remain available below." />
                <FileUploadField label="PPT Upload" value={form.pptFile} onChange={(value) => setForm((current) => ({ ...current, pptFile: value }))} accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" helper="Accepted: PDF, PPT, PPTX." />
                <FileUploadField label="Supporting Document Upload" value={form.supportingDocument} onChange={(value) => setForm((current) => ({ ...current, supportingDocument: value }))} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" helper="Accepted: PDF, DOC, DOCX." />
                {message ? <p className="text-sm text-primary">{message}</p> : null}
                <button onClick={submit} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Submit Project</button>
              </div>
            </section>
            <section className="glass-strong rounded-2xl p-6 racing-border">
              <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
              {submissions.length === 0 ? <p className="text-sm text-muted-foreground">No submissions yet.</p> : submissions.map((item) => <div key={item.id} className="rounded-xl border border-border p-4 mb-3"><h3 className="font-bold">{item.projectTitle}</h3><p className="text-sm text-muted-foreground mt-1">{item.status}</p>{item.projectFile ? <a href={item.projectFile} target="_blank" rel="noreferrer" className="text-sm text-primary mt-2 inline-block">Project file</a> : null}{item.pptFile ? <a href={item.pptFile} target="_blank" rel="noreferrer" className="text-sm text-primary mt-2 ml-3 inline-block">PPT file</a> : null}{item.adminNote ? <p className="text-sm text-primary mt-2">{item.adminNote}</p> : null}</div>)}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" /></label>;
}
