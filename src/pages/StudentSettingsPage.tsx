import { useState } from "react";
import type React from "react";
import { Eye, EyeOff, LogOut, Settings } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { logout } from "@/lib/auth";
import { getCurrentStudentProfile, saveStudentProfile, type StudentProfile } from "@/lib/studentPlatform";

export function StudentSettingsPage() {
  return (
    <ProtectedRoute allow="student">
      {() => <SettingsPanel />}
    </ProtectedRoute>
  );
}

function SettingsPanel() {
  const [profile, setProfile] = useState<StudentProfile>(() => getCurrentStudentProfile() as StudentProfile);
  const [message, setMessage] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [prefs, setPrefs] = useState({ reminders: true, payments: true, certificates: true, announcements: true, visible: false, recommendations: true, consent: true });

  const updateProfile = (key: keyof StudentProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const save = () => {
    saveStudentProfile(profile);
    setMessage("Settings saved. Password and theme integrations are placeholders until backend support is connected.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Settings className="h-3.5 w-3.5" /> Account Controls
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Student Settings</h1>
            <p className="mt-3 text-muted-foreground">Manage your Event Platform account preferences.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Account Settings">
              <Field label="Name" value={profile.name ?? ""} onChange={(value) => updateProfile("name", value)} />
              <Field label="Email" value={profile.email ?? ""} onChange={() => undefined} readonly />
              <Field label="Phone" value={profile.phone ?? ""} onChange={(value) => updateProfile("phone", value)} />
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Current Password" value="" onChange={() => undefined} type={visiblePasswords.current ? "text" : "password"} passwordToggle={{ visible: Boolean(visiblePasswords.current), onToggle: () => setVisiblePasswords((current) => ({ ...current, current: !current.current })) }} />
                <Field label="New Password" value="" onChange={() => undefined} type={visiblePasswords.next ? "text" : "password"} passwordToggle={{ visible: Boolean(visiblePasswords.next), onToggle: () => setVisiblePasswords((current) => ({ ...current, next: !current.next })) }} />
                <Field label="Confirm New Password" value="" onChange={() => undefined} type={visiblePasswords.confirm ? "text" : "password"} passwordToggle={{ visible: Boolean(visiblePasswords.confirm), onToggle: () => setVisiblePasswords((current) => ({ ...current, confirm: !current.confirm })) }} />
              </div>
            </Panel>

            <Panel title="Theme Settings">
              <div className="grid grid-cols-3 gap-3">
                {["Light", "Dark", "System"].map((item) => <button key={item} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${item === "Dark" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{item}</button>)}
              </div>
              <p className="text-sm text-muted-foreground mt-3">Dark remains the active default for the current premium theme.</p>
            </Panel>

            <Panel title="Notification Preferences">
              <Toggle label="Event reminders" checked={prefs.reminders} onChange={(value) => setPrefs((current) => ({ ...current, reminders: value }))} />
              <Toggle label="Payment updates" checked={prefs.payments} onChange={(value) => setPrefs((current) => ({ ...current, payments: value }))} />
              <Toggle label="Certificate updates" checked={prefs.certificates} onChange={(value) => setPrefs((current) => ({ ...current, certificates: value }))} />
              <Toggle label="Announcements" checked={prefs.announcements} onChange={(value) => setPrefs((current) => ({ ...current, announcements: value }))} />
            </Panel>

            <Panel title="Privacy Settings">
              <Toggle label="Show profile visibility option" checked={prefs.visible} onChange={(value) => setPrefs((current) => ({ ...current, visible: value }))} />
              <Toggle label="Allow event recommendations" checked={prefs.recommendations} onChange={(value) => setPrefs((current) => ({ ...current, recommendations: value }))} />
              <Toggle label="Communication consent" checked={prefs.consent} onChange={(value) => setPrefs((current) => ({ ...current, consent: value }))} />
            </Panel>

            <Panel title="Legal Links">
              <div className="flex flex-wrap gap-3">
                <a href="/privacy-policy" className="rounded-xl border border-border px-4 py-3 text-sm font-semibold">Privacy Policy</a>
                <a href="/terms" className="rounded-xl border border-border px-4 py-3 text-sm font-semibold">Terms & Conditions</a>
                <a href="/rules" className="rounded-xl border border-border px-4 py-3 text-sm font-semibold">Rules & Regulations</a>
              </div>
            </Panel>

            <Panel title="Danger Zone">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { logout(); window.location.href = "/"; }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"><LogOut className="h-4 w-4" /> Logout</button>
                <button className="rounded-xl border border-destructive/40 px-5 py-3 text-sm font-semibold text-destructive">Delete Account Placeholder</button>
              </div>
            </Panel>
          </div>

          {message ? <div className="glass rounded-xl p-4 text-sm text-primary mt-6">{message}</div> : null}
          <button onClick={save} className="mt-6 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Save Settings</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold mb-4">{title}</h2><div className="space-y-4">{children}</div></section>;
}

function Field({ label, value, onChange, type = "text", readonly, passwordToggle }: { label: string; value: string; onChange: (value: string) => void; type?: string; readonly?: boolean; passwordToggle?: { visible: boolean; onToggle: () => void } }) {
  return <label><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span><span className="relative block"><input type={type} value={value} disabled={readonly} onChange={(event) => onChange(event.target.value)} className={`w-full bg-background/60 border border-border rounded-xl py-3 text-sm focus:outline-none focus:border-primary disabled:opacity-70 pl-4 ${passwordToggle ? "pr-12" : "pr-4"}`} />{passwordToggle ? <button type="button" onClick={passwordToggle.onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-primary" aria-label={passwordToggle.visible ? "Hide password" : "Show password"}>{passwordToggle.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button> : null}</span></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/40 p-3 text-sm"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}
