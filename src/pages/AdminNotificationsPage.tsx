import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { createNotification, getNotifications, saveNotifications, type NotificationItem } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function AdminNotificationsPage() {
  const { items } = useCmsCollection<NotificationItem>("notifications");
  const [form, setForm] = useState({ userId: "all-students", title: "", message: "", type: "Announcement", actionLink: "" });
  const [message, setMessage] = useState("");
  const send = () => {
    if (!form.title || !form.message) {
      setMessage("Title and message are required.");
      return;
    }
    createNotification(form);
    setForm({ userId: "all-students", title: "", message: "", type: "Announcement", actionLink: "" });
    setMessage("Announcement sent.");
  };
  return (
    <AdminLayout title="Notifications">
      {() => (
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
            <div className="grid gap-4">
              {["userId", "title", "message", "type", "actionLink"].map((key) => <Field key={key} label={key} value={String(form[key as keyof typeof form])} onChange={(value) => setForm((current) => ({ ...current, [key]: value }))} />)}
              <p className="text-sm text-muted-foreground">Future backend integrations can connect email, SMS, and WhatsApp delivery here.</p>
              {message ? <p className="text-sm text-primary">{message}</p> : null}
              <button onClick={send} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Send Notification</button>
            </div>
          </section>
          <section className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold mb-4">Sent Announcements</h2>
            {items.length === 0 ? <p className="text-sm text-muted-foreground">No notifications yet.</p> : items.map((item) => <div key={item.id} className="rounded-xl border border-border p-4 mb-3"><div className="font-semibold">{item.title}</div><div className="text-sm text-muted-foreground">{item.message}</div><button onClick={() => saveNotifications(getNotifications().filter((notification) => notification.id !== item.id))} className="mt-3 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive">Delete</button></div>)}
          </section>
        </div>
      )}
    </AdminLayout>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" /></label>;
}
