import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById } from "@/lib/events";

export const Route = createFileRoute("/admin/events/$eventId")({
  component: () => {
    const { eventId } = Route.useParams();
    const event = getEventById(eventId);

    return (
      <AdminLayout title="Event Detail">
        {() => (
          <div className="space-y-6">
            {!event ? (
              <section className="glass-strong rounded-2xl p-6 racing-border">
                <h2 className="text-2xl font-bold">Event not found</h2>
                <a href="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">
                  Back to Events
                </a>
              </section>
            ) : (
              <section className="glass-strong rounded-2xl p-6 racing-border">
                <p className="text-xs uppercase tracking-widest font-mono text-primary">Event Detail</p>
                <h2 className="text-2xl font-bold mt-2">{event.title ?? "N/A"}</h2>
                <p className="text-sm text-muted-foreground mt-2">{event.shortDescription ?? "N/A"}</p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <a href="/admin/events" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Back to Events</a>
                  <a href={`/admin/events/${event.id}/registrations`} className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Registrations</a>
                </div>
              </section>
            )}
          </div>
        )}
      </AdminLayout>
    );
  },
});
