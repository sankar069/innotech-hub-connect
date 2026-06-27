import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CmsModule } from "@/components/admin/CmsModule";
import { logout } from "@/lib/auth";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

export function AdminSettingsPage() {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [theme, setLocalTheme] = useState<Theme>(() => getTheme());
  const [message, setMessage] = useState("");

  const save = () => {
    setTheme(theme);
    setMessage("Settings saved.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <AdminLayout title="Admin Settings">
      {(user) => (
        <div className="space-y-8">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-sm text-muted-foreground">Role: Super Admin</p>
            <div className="grid md:grid-cols-3 gap-3 mt-6">
              {["Current Password", "New Password", "Confirm New Password"].map((label) => {
                const key = label.toLowerCase().replaceAll(" ", "-");
                return <PasswordField key={key} label={label} visible={Boolean(showPasswords[key])} onToggle={() => setShowPasswords((current) => ({ ...current, [key]: !current[key] }))} />;
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Change Password Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Payment Settings Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Storage Integration Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Google Auth Integration Placeholder</button>
              <button onClick={() => { logout(); window.location.href = "/"; }} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Logout</button>
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as Theme[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setLocalTheme(item)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize ${item === theme ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            {message ? <div className="text-sm text-primary mt-4">{message}</div> : null}
            <button
              onClick={save}
              className="mt-6 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Save Theme
            </button>
          </div>
          <CmsModule
            title="Website Settings"
            description="Manage basic website name, contact email, and social links placeholders."
            collection="settings"
            fields={[
              { key: "websiteName", label: "Website Name", required: true },
              { key: "contactEmail", label: "Website Contact Email", required: true },
              { key: "socialLinks", label: "Social Links Placeholder", type: "textarea" },
              { key: "active", label: "Active", type: "checkbox" },
            ]}
          />
        </div>
      )}
    </AdminLayout>
  );
}

function PasswordField({ label, visible, onToggle }: { label: string; visible: boolean; onToggle: () => void }) {
  return (
    <label>
      <span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span>
      <span className="relative block">
        <input type={visible ? "text" : "password"} className="w-full bg-background/60 border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-primary" aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}
