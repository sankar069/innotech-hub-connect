import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { CreditCard, AlertCircle } from "lucide-react";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventBySlug, getRegistrationForEvent, submitRegistration } from "@/lib/events";

const emptyTeamMember = { name: "", email: "", phone: "" };

// Simple email validation regex
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function EventRegistrationPage({ slug }: { slug: string }) {
  const event = getEventBySlug(slug);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("error");
  const [teamMembers, setTeamMembers] = useState([emptyTeamMember]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Check if already registered
  const existingRegistration = getRegistrationForEvent(event.id);
  if (existingRegistration) {
    return <div className="min-h-screen bg-background text-foreground"><Navbar /><main className="pt-32 max-w-4xl mx-auto px-4"><div className="glass-strong rounded-2xl p-6 racing-border"><div className="flex gap-3 items-start"><AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" /><div><h2 className="font-semibold text-lg">Already Registered</h2><p className="text-muted-foreground mt-2">You have already registered for this event. <a href="/student/registrations" className="text-primary underline hover:text-primary/80">View your registration</a></p></div></div></div></main><Footer /></div>;
  }

  const isPaid = event.payment?.type === "Paid Event";
  const allowsTeam = event.participationMode !== "Individual";

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const validateForm = (): { valid: boolean; error?: string } => {
    const effectiveEmail = form.email || "";
    const required = [form.fullName, effectiveEmail, form.phone, form.college, form.department, form.year, form.city, form.state, form.motivation];
    
    if (required.some((value) => !value)) {
      return { valid: false, error: "Please complete all required fields." };
    }

    if (!isValidEmail(effectiveEmail)) {
      return { valid: false, error: "Please enter a valid email address." };
    }

    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      return { valid: false, error: "Please enter a valid 10-digit phone number." };
    }

    if (!form.agreeRules || !form.consentCommunication || !form.confirmCorrect) {
      return { valid: false, error: "Please accept all agreements." };
    }

    if (isPaid && (!form.screenshotUrl || !form.transactionId)) {
      return { valid: false, error: "Payment screenshot and transaction ID are required for paid events." };
    }

    // Validate team members if registering as team
    if (allowsTeam && form.registrationType === "Team") {
      const validMembers = teamMembers.filter((m) => m.name && m.email && m.phone);
      if (validMembers.length === 0) {
        return { valid: false, error: "Please add at least one team member for team registration." };
      }
      for (const member of validMembers) {
        if (!isValidEmail(member.email)) {
          return { valid: false, error: `Invalid email for team member: ${member.name}` };
        }
        if (!/^\d{10}$/.test(member.phone.replace(/\D/g, ""))) {
          return { valid: false, error: `Invalid phone number for team member: ${member.name}` };
        }
      }
    }

    return { valid: true };
  };

  const submit = (studentEmail: string) => {
    setMessage("");
    setIsSubmitting(true);

    try {
      const validation = validateForm();
      if (!validation.valid) {
        setMessage(validation.error || "Validation failed.");
        setMessageType("error");
        setIsSubmitting(false);
        return;
      }

      const effectiveEmail = form.email || studentEmail;
      const filteredMembers = teamMembers.filter((m) => m.name && m.email && m.phone);

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
          members: filteredMembers,
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

      setMessage("Registration submitted successfully! Redirecting to your dashboard...");
      setMessageType("success");
      setTimeout(() => {
        navigate({ to: "/student/registrations" });
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      setIsSubmitting(false);
    }
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
                {message && (
                  <div className={`mt-5 rounded-xl border px-4 py-3 text-sm flex gap-3 items-start ${
                    messageType === "error" 
                      ? "border-destructive/30 bg-destructive/5 text-destructive" 
                      : messageType === "success"
                      ? "border-primary/30 bg-primary/5 text-primary"
                      : "border-muted text-muted-foreground"
                  }`}>
                    {messageType === "error" && <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                    <span>{message}</span>
                  </div>
                )}
                <div className="mt-8 space-y-8">
                  <FormGrid title="Basic Student Details">
                    <Field label="Full Name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
                    <Field label="Email" type="email" value={form.email || user.email} onChange={(v) => update("email", v)} required />
                    <Field label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} required helper="10-digit number" />
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
                      {form.registrationType === "Team" && (
                        <>
                          <Field label="Team Name" value={form.teamName} onChange={(v) => update("teamName", v)} required />
                          <Field label="Team Leader Name" value={form.teamLeaderName} onChange={(v) => update("teamLeaderName", v)} />
                          <Field label="Team Leader Email" value={form.teamLeaderEmail} onChange={(v) => update("teamLeaderEmail", v)} />
                          <div className="md:col-span-2 space-y-3">
                            <p className="text-sm text-muted-foreground">Add team members (name, email, and phone all required)</p>
                            {teamMembers.map((member, index) => (
                              <div key={index} className="grid md:grid-cols-3 gap-3 p-3 rounded-xl border border-border/50 bg-background/50">
                                <Field label="Member Name" value={member.name} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, name: v } : item))} />
                                <Field label="Member Email" value={member.email} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, email: v } : item))} />
                                <Field label="Member Phone" value={member.phone} onChange={(v) => setTeamMembers((current) => current.map((item, i) => i === index ? { ...item, phone: v } : item))} />
                              </div>
                            ))}
                            <button type="button" onClick={() => setTeamMembers((current) => [...current, emptyTeamMember])} className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-background/50 transition-colors">+ Add Another Member</button>
                          </div>
                        </>
                      )}
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
                      <FileUploadField label="Payment Screenshot Upload" value={form.screenshotUrl} onChange={(v) => update("screenshotUrl", v)} required helper="Required for paid events. Accepted: JPG, PNG, WebP." accept="image/jpeg,image/png,image/webp" />
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

                  <button onClick={() => submit(user.email)} disabled={isSubmitting} className="w-full rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-wait">{isSubmitting ? "Submitting..." : "Submit Registration"}</button>
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

function Field({ label, value, onChange, textarea, type = "text", required, helper }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string; required?: boolean; helper?: string }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary";
  return <label className={textarea ? "md:col-span-2" : ""}><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}{required ? " *" : ""}</span>{textarea ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={className} /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={className} />}{helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}</label>;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-primary" />{label}</label>;
}
