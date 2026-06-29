import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventTeamsPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);
  const { items: allRegistrations } = useCmsCollection("eventRegistrations");
  const [query, setQuery] = useState("");

  // Derive teams from team registrations for this event
  const teams = useMemo(() => {
    const regs = (Array.isArray(allRegistrations) ? allRegistrations : []) as any[];
    const eventRegs = regs.filter((r) =>
      (r.eventId === decodedId || r.eventId === event?.id || r.eventSlug === event?.slug) &&
      r.teamDetails?.teamName
    );
    // Group by team name
    const teamMap = new Map<string, any[]>();
    for (const reg of eventRegs) {
      const name = String(reg.teamDetails.teamName);
      if (!teamMap.has(name)) teamMap.set(name, []);
      teamMap.get(name)!.push(reg);
    }
    return Array.from(teamMap.entries()).map(([name, members]) => ({ name, members }));
  }, [allRegistrations, decodedId, event?.id, event?.slug]);

  const filtered = useMemo(() =>
    teams.filter((t) => !query || t.name.toLowerCase().includes(query.toLowerCase())),
    [teams, query]);

  if (!event) {
    return (
      <AdminLayout title="Event Not Found">
        {() => (
          <div className="glass-strong rounded-2xl p-8 racing-border">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <Link to="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">Back to Events</Link>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Event Teams">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <Link to="/admin/events/$eventId" params={{ eventId: event.id }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
              <ChevronLeft className="h-3.5 w-3.5" /> Event Overview
            </Link>
            <p className="text-xs uppercase tracking-widest font-mono text-primary">Teams</p>
            <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{teams.length} team{teams.length !== 1 ? "s" : ""} registered</p>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams by name"
            className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          />

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 racing-border text-center text-muted-foreground">
                {teams.length === 0 ? "No team registrations found for this event yet." : "No teams match your search."}
              </div>
            ) : filtered.map(({ name, members }) => (
              <div key={name} className="glass-strong rounded-2xl p-5 racing-border">
                <h3 className="text-lg font-bold">{name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{members.length} member{members.length !== 1 ? "s" : ""}</p>
                <div className="grid gap-2">
                  {members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm">
                      <div>
                        <span className="font-medium">{member.studentName ?? "Unknown"}</span>
                        <span className="text-muted-foreground ml-2">{member.studentEmail}</span>
                        {member.teamDetails?.role && (
                          <span className="ml-2 px-2 py-0.5 rounded-full glass text-xs font-mono text-primary">{member.teamDetails.role}</span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${member.registrationStatus === "Approved" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                        {member.registrationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
