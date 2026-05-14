import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { CreditCard, Upload } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventBySlug, submitRegistration } from "@/lib/events";

const emptyTeamMember = { name: "", email: "", phone: "" };

export function EventRegistrationPage({ slug }: { slug: string }) {
  const event = getEventBySlug(slug);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState([emptyTeamMember]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    rollNumber: "",
    department: "",
    year: "",
    city: "",
    state: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: "",
    experience: "",
    motivation: "",
    registrationType: "Individual",
    teamName: "",
    teamLeaderName: "",
    teamLeaderEmail: "",
    screenshotUrl: "",
    transactionId: "",
    senderName: "",
    paymentDate: "",
    paymentNotes: "",
    agreeRules: false,
    consentCommunication: false,
    confirmCorrect: false,
  });

  if (!event) {
    return <div className="min-h-screen bg-background text-foreground"><Navbar /><main className="pt-32 max-w-4xl mx-auto px-4"><div className="glass-strong rounded-2xl p-6 racing-border">Event not found.</div></main><Footer /></div>;
  }

  const isPaid = event.payment?.type === "Paid Event";
  const allowsTeam = event.participationMode !== "Individual";

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (studentEmail: string) => {
    setMessage("");
    const effectiveEmail = form.email || studentEmail;
    const required = [form.fullName, effectiveEmail, form.phone, form.college, form.department, form.year, form.city, form.state, form.motivation];
    if (required.some((value) => !value) || !form.agreeRules || !form.consentCommunication || !form.confirmCorrect) {
      setMessage("Please complete all required fields and agreements.");
      return;
    }
    if (isPaid && (!form.screenshotUrl || !form.transactionId)) {
      setMessage("Payment screenshot and transaction ID are required for paid events.");
      return;
    }

    submitRegistration(event, {
      studentEmail: effectiveEmail,
      studentName: form.fullName,
      studentDetails: {
        fullName: form.fullName,
        email: effectiveEmail,
        phone: form.phone,
        college: form.college,
        rollNumber: form.rollNumber,
        department: form.department,
        year: form.year,
        city: form.city,
        state: form.state,
        linkedin: form.linkedin,
        github: form.github,
        portfolio: form.portfolio,
        skills: form.skills,
        experience: form.experience,
        motivation: form.motivation,
      },
      teamDetails: {
        registrationType: form.registrationType,
        teamName: form.teamName,
        teamLeaderName: form.teamLeaderName,
        teamLeaderEmail: form.teamLeaderEmail,
        members: teamMembers,
      },
      paymentDetails: {
        screenshotUrl: form.screenshotUrl,
        transactionId: form.transactionId,
        senderName: form.senderName,
        paymentDate: form.paymentDate,
        paymentNotes: form.paymentNotes,
        amount: Number(event.payment?.amount ?? 0),
      },
      agreement: {
        agreeRules: form.agreeRules,
        consentCommunication: form.consentCommunication,
        confirmCorrect: form.confirmCorrect,
      },
    });

    navigate({ to: "/student/registrations" });
  };

  return (
    <ProtectedRoute allow="student">
      {(user) => (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
                <h1 className="text-4xl md:text-5xl font-bold">Register for {event.title}</h1>
                <p className="mt-3 text-muted-foreground">{event.shortDescription}</p>
                {message && <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{message}</p>}
                <div className="mt-8 space-y-8">
                  <FormGrid title="Basic Student Details">
                    <Field label="Full Name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
                    <Field label="Email" type="email" value={form.email || user.email} onChange={(v) => update("email", v)} required />
                    <Field label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} required />
                    <Field label="College / Organization" value={form.college} onChange={(v) => update("college", v)} required />
                    <Field label="Roll Number / Student ID" value={form.rollNumber} onChange={(v) => update("rollNumber", v)} />
                    <Field label="Department / Branch" value={form.department} onChange={(v) => update("department", v)} required />
                    <Field label="Year of Study" value={form.year} onChange={(v) => update("year", v)} required />
                    <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
                    <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
                  </FormGrid>

                  <FormGrid title="Profile Links">
                    <Field label="LinkedIn Profile" value={form.linkedin} onChange={(v) => update("linkedin", v)} />
                    <Field label="GitHub Profile" value={form.github} onChange={(v) => update("github", v)} />
                    <Field label="Portfolio Link" value={form.portfolio} onChange={(v) => update("portfolio", v)} />
                  </FormGrid>

                  <FormGrid title="Skill and Motivation">
                    <Field label="Skill Set" value={form.skills} onChange={(v) => update("skills", v)} textarea />
                    <Field label="Previous Experience" value={form.experience} onChange={(v) => update("experience", v)} textarea />
                    <Field label="Why do you want to join this event?" value={form.motivation} onChange={(v) => update("motivation", v)} textarea required />
                  </FormGrid>

                  {allowsTeam && (
                    <FormGrid title="Team Details">
                      <Field label="Register as Individual or Team" value={form.registrationType} onChange={(v) => update("registrationType", v)} />
                      <Field label="Team Name" value={form.teamName} onChange={(v) => update("teamName", v)} />
                      <Field label="Team Leader Name" value={form.teamLeaderName} onChange={(v) => update("teamLeaderName", v)} />
                      <Field label="Team Leader Email" value={form.teamLeaderEmail} onChange={(v) => update("teamLeaderEmail", v)} />
                      <div className="md:col-span-2 space-y-3">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="grid md:grid-cols-3 gap-3">
                            <Field label="Member Name" value={member.name} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, name: v } : item))} />
                            <Field label="Member Email" value={member.email} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, email: v } : item))} />
                            <Field label="Member Phone" value={member.phone} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, phone: v } : item))} />
                          </div>
                        ))}
                        <button type="button" onClick={() => setTeamMembers((current) => [...current, emptyTeamMember])} className="rounded-xl border border-border px-4 py-2 text-sm">Add team member</button>
                      </div>
                    </FormGrid>
                  )}

                  {isPaid && (
                    <FormGrid title="Payment Details">
                      <div className="md:col-span-2 rounded-xl border border-border bg-card/40 p-4">
                        <div className="flex items-center gap-2 font-bold"><CreditCard className="h-4 w-4 text-primary" /> Registration Fee: {String(event.payment?.currency ?? "INR")} {String(event.payment?.amount ?? "")}</div>
                        <p className="mt-2 text-sm text-muted-foreground">UPI ID: {String(event.payment?.upiId ?? "")}</p>
                        <p className="text-sm text-muted-foreground">{String(event.payment?.instructions ?? "")}</p>
                        {event.payment?.qrImage ? <img src={String(event.payment.qrImage)} alt="Payment QR" className="mt-4 h-40 w-40 rounded-xl object-cover border border-border" /> : null}
                      </div>
                      <Field label="Payment Screenshot URL" value={form.screenshotUrl} onChange={(v) => update("screenshotUrl", v)} required />
                      <label>
                        <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">File Upload Placeholder</span>
                        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground"><Upload className="h-4 w-4 inline mr-2" />Connect Vercel Blob, Supabase Storage, Firebase Storage, or Cloudinary later.</div>
                      </label>
                      <Field label="UPI Transaction ID / Reference Number" value={form.transactionId} onChange={(v) => update("transactionId", v)} required />
                      <Field label="Payment Sender Name" value={form.senderName} onChange={(v) => update("senderName", v)} />
                      <Field label="Payment Date" type="date" value={form.paymentDate} onChange={(v) => update("paymentDate", v)} />
                      <Field label="Payment Notes" value={form.paymentNotes} onChange={(v) => update("paymentNotes", v)} textarea />
                    </FormGrid>
                  )}

                  <div className="space-y-3">
                    <CheckField label="I agree to event rules and regulations" checked={form.agreeRules} onChange={(v) => update("agreeRules", v)} />
                    <CheckField label="I consent to receive event communication" checked={form.consentCommunication} onChange={(v) => update("consentCommunication", v)} />
                    <CheckField label="I confirm all information is correct" checked={form.confirmCorrect} onChange={(v) => update("confirmCorrect", v)} />
                  </div>

                  <button onClick={() => submit(user.email)} className="w-full rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground">Submit Registration</button>
                </div>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}

function FormGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-2xl font-bold mb-4">{title}</h2><div className="grid md:grid-cols-2 gap-4">{children}</div></section>;
}

function Field({ label, value, onChange, textarea, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string; required?: boolean }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary";
  return <label className={textarea ? "md:col-span-2" : ""}><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}{required ? " *" : ""}</span>{textarea ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={className} /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={className} />}</label>;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-primary" />{label}</label>;
}
