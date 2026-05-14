import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Save, Upload, UserRound } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getCurrentStudentProfile, saveStudentProfile, type StudentProfile } from "@/lib/studentPlatform";

export function StudentProfilePage() {
  return (
    <ProtectedRoute allow="student">
      {() => <ProfileEditor />}
    </ProtectedRoute>
  );
}

function ProfileEditor() {
  const [profile, setProfile] = useState<StudentProfile>(() => getCurrentStudentProfile() as StudentProfile);
  const [message, setMessage] = useState("");

  const update = (key: keyof StudentProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!profile.name || !profile.phone || !profile.college) {
      setMessage("Please complete full name, phone, and college / organization.");
      return;
    }
    const saved = saveStudentProfile(profile);
    setProfile(saved);
    setMessage("Profile saved successfully.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                  <UserRound className="h-3.5 w-3.5" /> Student Profile
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Student Profile</h1>
                <p className="mt-3 text-muted-foreground">{profile.email}</p>
              </div>
              <div className="min-w-[180px]">
                <div className="text-sm text-muted-foreground mb-2">Profile Completion</div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${profile.profileCompletion ?? 0}%` }} /></div>
                <div className="text-2xl font-bold mt-2">{profile.profileCompletion ?? 0}%</div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            <div className="glass-strong rounded-2xl p-6 racing-border h-fit">
              {profile.profilePhoto ? <img src={profile.profilePhoto} alt="Profile preview" className="h-36 w-36 rounded-2xl object-cover border border-border mx-auto" /> : <div className="h-36 w-36 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto"><UserRound className="h-12 w-12 text-primary-foreground" /></div>}
              <Field label="Profile Photo URL" value={profile.profilePhoto ?? ""} onChange={(value) => update("profilePhoto", value)} />
              <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                <Upload className="h-4 w-4 inline mr-2" /> Upload placeholder. Connect Vercel Blob, Supabase Storage, Firebase Storage, or Cloudinary later.
              </div>
            </div>

            <div className="space-y-6">
              <FormSection title="Basic Details">
                <Field label="Full Name" value={profile.name ?? ""} onChange={(value) => update("name", value)} required />
                <Field label="Email" value={profile.email ?? ""} onChange={() => undefined} readonly required />
                <Field label="Phone Number" value={profile.phone ?? ""} onChange={(value) => update("phone", value)} required />
                <Field label="College / Organization" value={profile.college ?? ""} onChange={(value) => update("college", value)} required />
                <Field label="Roll Number / Student ID" value={profile.rollNumber ?? ""} onChange={(value) => update("rollNumber", value)} />
                <Field label="Department / Branch" value={profile.department ?? ""} onChange={(value) => update("department", value)} />
                <Field label="Year of Study" value={profile.year ?? ""} onChange={(value) => update("year", value)} />
                <Field label="City" value={profile.city ?? ""} onChange={(value) => update("city", value)} />
                <Field label="State" value={profile.state ?? ""} onChange={(value) => update("state", value)} />
              </FormSection>

              <FormSection title="Professional Details">
                <Field label="Skills" value={profile.skills ?? ""} onChange={(value) => update("skills", value)} textarea />
                <Field label="Interests" value={profile.interests ?? ""} onChange={(value) => update("interests", value)} textarea />
                <Field label="LinkedIn URL" value={profile.linkedIn ?? ""} onChange={(value) => update("linkedIn", value)} />
                <Field label="GitHub URL" value={profile.github ?? ""} onChange={(value) => update("github", value)} />
                <Field label="Portfolio URL" value={profile.portfolio ?? ""} onChange={(value) => update("portfolio", value)} />
                <Field label="Resume URL" value={profile.resumeUrl ?? ""} onChange={(value) => update("resumeUrl", value)} />
                <Field label="Short Bio" value={profile.bio ?? ""} onChange={(value) => update("bio", value)} textarea />
              </FormSection>

              <FormSection title="Achievement Details">
                <Field label="Hackathons Participated" value={profile.hackathons ?? ""} onChange={(value) => update("hackathons", value)} />
                <Field label="Projects Submitted" value={profile.projects ?? ""} onChange={(value) => update("projects", value)} />
                <Field label="Certificates Earned" value={String(profile.profileCompletion ? "" : "")} onChange={() => undefined} readonly />
                <Field label="Workshops Attended" value={profile.workshops ?? ""} onChange={(value) => update("workshops", value)} />
                <Field label="Preferred Event Categories" value={profile.preferredCategories ?? ""} onChange={(value) => update("preferredCategories", value)} textarea />
              </FormSection>

              {message ? <div className="glass rounded-xl p-4 text-sm text-primary">{message}</div> : null}
              <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><Save className="h-4 w-4" /> Save Profile</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold mb-5">{title}</h2><div className="grid md:grid-cols-2 gap-4">{children}</div></section>;
}

function Field({ label, value, onChange, textarea, readonly, required }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; readonly?: boolean; required?: boolean }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary disabled:opacity-70";
  return <label className={textarea ? "md:col-span-2" : ""}><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}{required ? " *" : ""}</span>{textarea ? <textarea rows={4} value={value} disabled={readonly} onChange={(event) => onChange(event.target.value)} className={className} /> : <input value={value} disabled={readonly} onChange={(event) => onChange(event.target.value)} className={className} />}</label>;
}
