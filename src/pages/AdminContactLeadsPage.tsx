import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { type CmsItem, useCmsCollection } from "@/lib/cms";

export function AdminContactLeadsPage() {
  const { items, setItems } = useCmsCollection("contactLeads");
  const [status, setStatus] = useState("");
  const [interest, setInterest] = useState("");

  const filtered = useMemo(() => items.filter((lead) => {
    const matchesStatus = !status || String(lead.status ?? "New") === status;
    const matchesInterest = !interest || String(lead.interest_type ?? lead.interestType ?? "") === interest;
    return matchesStatus && matchesInterest;
  }), [items, status, interest]);

  const updateLead = (lead: CmsItem, patch: Partial<CmsItem>) => {
    setItems(items.map((item) => (item.id === lead.id ? { ...item, ...patch } : item)));
  };

  const removeLead = (lead: CmsItem) => {
    if (!window.confirm("Delete this lead?")) return;
    setItems(items.filter((item) => item.id !== lead.id));
  };

  return (
    <AdminLayout title="Contact Leads">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <h2 className="text-2xl font-bold">Contact Leads</h2>
            <p className="mt-2 text-sm text-muted-foreground">View and manage contact form submissions when lead data is available.</p>
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm">
                <option value="">All statuses</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Closed</option>
              </select>
              <input value={interest} onChange={(event) => setInterest(event.target.value)} placeholder="Filter by interest type" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>

          {filtered.length === 0 && <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">No items added yet</div>}
          {filtered.map((lead) => (
            <div key={lead.id} className="glass-strong rounded-2xl p-5 racing-border">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="font-bold">{String(lead.name ?? "Lead")}</h3>
                  <p className="text-sm text-muted-foreground">{String(lead.email ?? "")}</p>
                  <p className="text-sm text-muted-foreground">{String(lead.organization ?? "")} · {String(lead.role ?? "")}</p>
                  <p className="mt-3 text-sm">{String(lead.message ?? "")}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{String(lead.created_at ?? lead.createdAt ?? "")}</p>
                </div>
                <div className="flex flex-col gap-2 min-w-40">
                  <button onClick={() => updateLead(lead, { status: "Contacted" })} className="rounded-lg border border-border px-3 py-2 text-sm">Mark as contacted</button>
                  <button onClick={() => updateLead(lead, { status: "Closed" })} className="rounded-lg border border-border px-3 py-2 text-sm">Mark as closed</button>
                  <textarea value={String(lead.adminNotes ?? "")} onChange={(event) => updateLead(lead, { adminNotes: event.target.value })} placeholder="Admin notes" className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm" />
                  <button onClick={() => removeLead(lead)} className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive">Delete lead</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
