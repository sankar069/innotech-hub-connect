import { useMemo, useState } from "react";
import { ChevronLeft, Download, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById, updatePaymentProof, updateRegistrationStatus, type PaymentProof } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventPaymentsPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);

  const { items: allProofs } = useCmsCollection<PaymentProof>("paymentProofs");
  const { items: allRegistrations } = useCmsCollection("eventRegistrations");

  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState("");

  const proofs = useMemo(() =>
    (Array.isArray(allProofs) ? allProofs : []).filter((p: any) =>
      p.eventId === decodedId || p.eventId === event?.id
    ), [allProofs, decodedId, event?.id]);

  const filtered = useMemo(() => proofs.filter((p: any) => {
    const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === p.registrationId);
    const haystack = `${reg?.studentName ?? ""} ${reg?.studentEmail ?? ""} ${p.transactionId ?? ""}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (!statusFilter || p.status === statusFilter);
  }), [proofs, allRegistrations, query, statusFilter]);

  const verifiedRevenue = useMemo(() =>
    proofs.filter((p: any) => p.status === "Approved").reduce((sum, p: any) => sum + Number(p.amount ?? 0), 0),
    [proofs]);

  const verify = (proof: PaymentProof) => {
    updatePaymentProof(proof.id, { status: "Approved" });
    updateRegistrationStatus(proof.registrationId, { registrationStatus: "Approved", paymentStatus: "Approved" });
    flash("Payment verified.");
  };

  const reject = () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) { flash("Please enter a rejection reason."); return; }
    updatePaymentProof(rejectTarget, { status: "Rejected", adminRemarks: rejectReason });
    flash("Payment rejected.");
    setRejectTarget(null);
    setRejectReason("");
  };

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const exportCsv = () => {
    const rows = [
      ["Registration ID", "Student Name", "Email", "Transaction ID", "Amount", "Status", "Submitted"],
      ...filtered.map((p: any) => {
        const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === p.registrationId);
        return [p.registrationId, reg?.studentName ?? "", reg?.studentEmail ?? "", p.transactionId ?? "", p.amount ?? "", p.status, p.createdAt];
      }),
    ];
    const csv = rows.map((row) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.slug ?? eventId}-payments.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!event) {
    return (
      <AdminLayout title="Event Not Found">
        {() => (
          <div className="glass-strong rounded-2xl p-8 racing-border">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <Link to="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">
              Back to Events
            </Link>
          </div>
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Event Payments">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link to="/admin/events/$eventId" params={{ eventId: event.id }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
                  <ChevronLeft className="h-3.5 w-3.5" /> Event Overview
                </Link>
                <p className="text-xs uppercase tracking-widest font-mono text-primary">Payments</p>
                <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {proofs.length} payment proof{proofs.length !== 1 ? "s" : ""} ·
                  Verified Revenue: <span className="text-primary font-semibold">₹{verifiedRevenue.toLocaleString("en-IN")}</span>
                </p>
              </div>
              <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/50 transition-colors">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
            {message && <p className="mt-3 text-sm text-primary animate-in fade-in slide-in-from-top-1">{message}</p>}
          </div>

          <div className="glass rounded-2xl p-4 grid md:grid-cols-2 gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student, email, transaction ID" className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
              <option value="">All statuses</option>
              {["Under Review", "Approved", "Rejected"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Reject modal */}
          {rejectTarget && (
            <div className="glass-strong rounded-2xl p-6 racing-border space-y-3 border-destructive/30">
              <h3 className="font-bold text-destructive">Reject Payment</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason (required, 1-500 characters)"
                maxLength={500}
                rows={3}
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-destructive"
              />
              <div className="flex gap-3">
                <button onClick={reject} className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">Confirm Reject</button>
                <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 racing-border text-center text-muted-foreground">
                {proofs.length === 0 ? "No payment proofs have been submitted for this event yet." : "No payment proofs match the current filter."}
              </div>
            ) : filtered.map((proof: any) => {
              const reg: any = (Array.isArray(allRegistrations) ? allRegistrations : []).find((r: any) => r.id === proof.registrationId);
              const canAct = proof.status === "Under Review";
              return (
                <div key={proof.id} className="glass-strong rounded-2xl p-5 racing-border">
                  <div className="grid lg:grid-cols-[1fr_160px_auto] gap-5 items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Registration ID: {proof.registrationId}</p>
                      <h3 className="text-lg font-bold">{reg?.studentName ?? "Unknown"}</h3>
                      <p className="text-sm text-muted-foreground">{reg?.studentEmail ?? proof.studentId}</p>
                      <div className="grid sm:grid-cols-3 gap-2 mt-3">
                        <Info label="Amount" value={`₹${proof.amount ?? 0}`} />
                        <Info label="Transaction ID" value={proof.transactionId || "—"} />
                        <Info label="Submitted" value={proof.createdAt ? new Date(proof.createdAt).toLocaleDateString() : "—"} />
                      </div>
                      {proof.adminRemarks && (
                        <p className="text-xs text-muted-foreground mt-2">Remark: {proof.adminRemarks}</p>
                      )}
                    </div>
                    <div>
                      {proof.screenshotUrl ? (
                        <a href={proof.screenshotUrl} target="_blank" rel="noreferrer" className="block group">
                          <img src={proof.screenshotUrl} alt="Payment proof" className="w-full aspect-square rounded-xl border border-border object-cover group-hover:opacity-90 transition-opacity" />
                          <span className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><ExternalLink className="h-3 w-3" /> View full</span>
                        </a>
                      ) : (
                        <div className="w-full aspect-square rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground text-center px-2">
                          No screenshot uploaded
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <StatusBadge status={proof.status} />
                      {canAct && (
                        <>
                          <button onClick={() => verify(proof)} className="px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">Verify</button>
                          <button onClick={() => setRejectTarget(proof.id)} className="px-3 py-2 rounded-lg border border-destructive/40 text-sm text-destructive hover:bg-destructive/10">Reject</button>
                        </>
                      )}
                      <a href={`/admin/events/${event.id}/registrations`} className="px-3 py-2 rounded-lg border border-border text-sm text-center hover:border-primary/50 transition-colors">Registration</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{label}</div>
      <div className="font-semibold text-sm mt-0.5 truncate">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === "Approved" ? "text-green-500 bg-green-500/10" : status === "Rejected" ? "text-destructive bg-destructive/10" : "text-yellow-500 bg-yellow-500/10";
  return <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest ${color}`}>{status}</span>;
}
