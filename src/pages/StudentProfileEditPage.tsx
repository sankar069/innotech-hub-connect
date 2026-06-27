import React, { useState, useEffect } from "react";
import { Save, User, BookOpen, SwatchBook, Globe, Code, Award, Layout, FileText, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getCurrentStudentProfile, saveStudentProfile, type StudentProfile } from "@/lib/studentPlatform";
import { FileUploadField } from "@/components/admin/FileUploadField";

export function StudentProfileEditPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(getCurrentStudentProfile());
  }, []);

  const handleSave = () => {
    if (!profile) return;
    saveStudentProfile(profile);
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setProfile((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  if (!profile) return null;

  return (
    <ProtectedRoute allow="student">
      {(user) => (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <a href="/student/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                  </a>
                  <h1 className="text-4xl font-bold">Edit Profile</h1>
                  <p className="text-muted-foreground mt-2">Manage your personal, academic, and professional details.</p>
                </div>
                <button 
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>

              {message && (
                <div className="glass rounded-xl p-4 text-sm text-primary mb-6 animate-in fade-in slide-in-from-top-2">
                  {message}
                </div>
              )}

              <div className="space-y-8">
                {/* Personal Information */}
                <ProfileSection title="Personal Information" icon={User}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Full Name" value={profile.name} onChange={(v) => update("name", v)} />
                    <Field label="Email" value={profile.email} readOnly />
                    <Field label="Phone" value={profile.phone ?? ""} onChange={(v) => update("phone", v)} />
                    <Field label="Headline" value={profile.bio ?? ""} onChange={(v) => update("bio", v)} placeholder="e.g. Full Stack Developer | Final Year CSE" />
                  </div>
                </ProfileSection>

                {/* Academic Information */}
                <ProfileSection title="Academic Details" icon={BookOpen}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="College / University" value={profile.college ?? ""} onChange={(v) => update("college", v)} />
                    <Field label="Degree / Branch" value={profile.degree ?? ""} onChange={(v) => update("degree", v)} />
                    <Field label="Year of Graduation" value={profile.graduationYear ?? ""} onChange={(v) => update("graduationYear", v)} />
                  </div>
                </ProfileSection>

                {/* Professional Links & Resume */}
                <ProfileSection title="Links & Professional" icon={Globe}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="GitHub URL" value={profile.links?.github ?? ""} onChange={(v) => update("links", { ...profile.links, github: v })} />
                    <Field label="LinkedIn URL" value={profile.links?.linkedin ?? ""} onChange={(v) => update("links", { ...profile.links, linkedin: v })} />
                    <Field label="Portfolio URL" value={profile.links?.portfolio ?? ""} onChange={(v) => update("links", { ...profile.links, portfolio: v })} />
                    <FileUploadField 
                      label="Resume (PDF)" 
                      value={profile.resumeUrl ?? ""} 
                      onChange={(v) => update("resumeUrl", v)} 
                      accept="application/pdf"
                      helper="Upload your latest professional resume."
                    />
                  </div>
                </ProfileSection>

                {/* Skills & Experience */}
                <ProfileSection title="Skills & Projects" icon={Code}>
                  <div className="space-y-4">
                    <Field 
                      label="Skills (Comma separated)" 
                      value={(profile.skills ?? []).join(", ")} 
                      onChange={(v) => update("skills", v.split(",").map(s => s.trim()).filter(Boolean))} 
                    />
                    <Field 
                      label="Recent Projects" 
                      textarea 
                      value={profile.projectsSummary ?? ""} 
                      onChange={(v) => update("projectsSummary", v)} 
                      placeholder="Briefly describe your key projects..."
                    />
                  </div>
                </ProfileSection>

                 {/* Achievements & Team Preferences */}
                 <ProfileSection title="Achievements & Preferences" icon={Award}>
                  <div className="space-y-4">
                    <Field 
                      label="Achievements" 
                      textarea 
                      value={profile.achievementsSummary ?? ""} 
                      onChange={(v) => update("achievementsSummary", v)} 
                    />
                    <Field 
                      label="Team Role Preferences" 
                      value={profile.teamRolePreferences ?? ""} 
                      onChange={(v) => update("teamRolePreferences", v)} 
                      placeholder="e.g. Backend Lead, UI/UX Designer"
                    />
                  </div>
                </ProfileSection>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}

function ProfileSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <section className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, readOnly, textarea, placeholder, type = "text" }: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; textarea?: boolean; placeholder?: string; type?: string }) {
  const className = "w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  return (
    <div>
      <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2 ml-1">{label}</label>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange?.(e.target.value)} readOnly={readOnly} placeholder={placeholder} className={className} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} readOnly={readOnly} placeholder={placeholder} className={className} />
      )}
    </div>
  );
}
