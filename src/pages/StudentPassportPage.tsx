import { Award, BriefcaseBusiness, Rocket } from "lucide-react";
import type React from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getCurrentStudentProfile, getMyCertificates, getMySubmissions, getStudentStats } from "@/lib/studentPlatform";
import { getMyRegistrations } from "@/lib/events";

export function StudentPassportPage() {
  return (
    <ProtectedRoute allow="student">
      {(user) => {
        const profile = getCurrentStudentProfile();
        const stats = getStudentStats(user.email);
        const certificates = getMyCertificates(user.email);
        const submissions = getMySubmissions(user.email);
        const registrations = getMyRegistrations();
        const readiness = Math.min(100, Math.round((stats.profileCompletion + stats.achievements * 10 + submissions.length * 12) / 2));
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-32 pb-20 md:pt-40 md:pb-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <section className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4"><Rocket className="h-3.5 w-3.5" /> Innovation Passport</div>
                  <h1 className="text-4xl md:text-5xl font-bold">{profile?.name ?? user.name}</h1>
                  <p className="mt-3 text-muted-foreground">{profile?.college ?? user.college ?? "Student"} · {profile?.skills ?? "Skills can be added from profile"}</p>
                </section>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Stat label="Events Attended" value={stats.completed} />
                  <Stat label="Hackathons Participated" value={profile?.hackathons || registrations.filter((item) => item.teamDetails?.teamName).length} />
                  <Stat label="Projects Submitted" value={submissions.length} />
                  <Stat label="Certificates Earned" value={certificates.length} />
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <Panel title="Growth Percentage" icon={<Award className="h-5 w-5" />}>
                    {[
                      ["Skills gained", Math.min(100, stats.skillsAdded * 20)],
                      ["Team participation history", Math.min(100, registrations.filter((item) => item.teamDetails?.teamName).length * 35)],
                      ["Career readiness score", readiness],
                      ["Growth percentage", Math.min(100, stats.profileCompletion + certificates.length * 5)],
                    ].map(([label, value]) => <Progress key={label} label={String(label)} value={Number(value)} />)}
                  </Panel>
                  <Panel title="Timeline" icon={<BriefcaseBusiness className="h-5 w-5" />}>
                    {registrations.length === 0 ? <p className="text-sm text-muted-foreground">No timeline entries yet.</p> : registrations.map((item) => <div key={item.id} className="rounded-xl border border-border p-3 text-sm text-muted-foreground">{item.eventSlug} · {item.registrationStatus}</div>)}
                    <div className="rounded-xl border border-border p-3 text-sm text-muted-foreground">AI tool usage placeholder will connect with future activity tracking.</div>
                  </Panel>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        );
      }}
    </ProtectedRoute>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="glass-strong rounded-2xl p-5 racing-border"><p className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</p><div className="text-3xl font-bold mt-2">{value}</div></div>;
}
function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="flex items-center gap-2 text-2xl font-bold mb-5">{icon}{title}</h2><div className="space-y-4">{children}</div></section>;
}
function Progress({ label, value }: { label: string; value: number }) {
  return <div><div className="flex justify-between text-sm mb-2"><span>{label}</span><span>{value}%</span></div><div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${value}%` }} /></div></div>;
}
