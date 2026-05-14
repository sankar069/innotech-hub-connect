import { Bell } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getMyNotifications, getNotifications, saveNotifications, type NotificationItem } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function StudentNotificationsPage() {
  const { items } = useCmsCollection<NotificationItem>("notifications");
  return (
    <ProtectedRoute allow="student">
      {(user) => {
        const notifications = getMyNotifications(user.email).filter((item) => items.some((stored) => stored.id === item.id));
        const markAll = () => saveNotifications(getNotifications().map((item) => item.userId === user.email || item.userId === "all-students" ? { ...item, read: true } : item));
        const updateOne = (id: string, patch: Partial<NotificationItem>) => saveNotifications(getNotifications().map((item) => item.id === id ? { ...item, ...patch } : item));
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-32 pb-20 md:pt-40 md:pb-28">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div><h1 className="text-4xl md:text-5xl font-bold">Notifications</h1><p className="mt-3 text-muted-foreground">Registration, payment, event, certificate, and announcement updates.</p></div>
                    <button onClick={markAll} className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Mark All Read</button>
                  </div>
                </div>
                {notifications.length === 0 ? <div className="glass-strong rounded-2xl p-6 racing-border text-muted-foreground">No notifications yet.</div> : (
                  <div className="space-y-4">
                    {notifications.map((item) => (
                      <article key={item.id} className="glass-strong rounded-2xl p-5 racing-border">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-3"><Bell className="h-3.5 w-3.5" /> {item.type}</div>
                            <h2 className="text-xl font-bold">{item.title}</h2>
                            <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
                            <p className="text-xs text-muted-foreground mt-3">{new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.actionLink ? <a href={item.actionLink} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">Open</a> : null}
                            <button onClick={() => updateOne(item.id, { read: true })} className="rounded-lg border border-border px-3 py-2 text-sm">{item.read ? "Read" : "Mark Read"}</button>
                            <button onClick={() => saveNotifications(getNotifications().filter((notification) => notification.id !== item.id))} className="rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive">Delete</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </main>
            <Footer />
          </div>
        );
      }}
    </ProtectedRoute>
  );
}
