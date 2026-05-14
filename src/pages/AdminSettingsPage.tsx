import { AdminLayout } from "@/components/admin/AdminLayout";
import { CmsModule } from "@/components/admin/CmsModule";
import { logout } from "@/lib/auth";

export function AdminSettingsPage() {
  return (
    <AdminLayout title="Admin Settings">
      {(user) => (
        <div className="space-y-8">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-sm text-muted-foreground">Role: Super Admin</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Change Password Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Payment Settings Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Storage Integration Placeholder</button>
              <button className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Google Auth Integration Placeholder</button>
              <button onClick={() => { logout(); window.location.href = "/"; }} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Logout</button>
            </div>
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
