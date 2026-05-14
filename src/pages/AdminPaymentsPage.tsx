import { useMemo, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById, getRegistrations, saveRegistrations, updatePaymentProof, type PaymentProof } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminPaymentsPage() {
  const { items: proofs } = useCmsCollection<PaymentProof>("paymentProofs");
  const { items: registrations } = useCmsCollection("eventRegistrations");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => proofs.filter((proof) => {
    const registration = registrations.find((item: any) => item.id === proof.registrationId);
    const event = getEventById(proof.eventId);
    const haystack = `${event?.title ?? ""} ${registration?.studentName ?? ""} ${registration?.studentEmail ?? ""} ${proof.transactionId}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (!status || proof.status === status);
  }), [proofs, query, registrations, status]);

  const updatePayment = (proof: PaymentProof, nextStatus: string) => {
    const registrationStatus = nextStatus === "Approved" ? "Approved" : nextStatus === "Rejected" ? "Pending Review" : "Pending Review";
    updatePaymentProof(proof.id, { status: nextStatus });
    saveRegistrations(getRegistrations().map((registration) => (
      registration.id === proof.registrationId
        ? { ...registration, paymentStatus: nextStatus, registrationStatus, updatedAt: new Date().toISOString() }
        : registration
    )));
  };

  return (
    <AdminLayout title="Payment Verification">
      {() => (
        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <CreditCard className="h-3.5 w-3.5" /> Manual Verification
            </div>
            <h2 className="text-3xl font-bold">Payment Verification</h2>
            <p className="text-sm text-muted-foreground mt-2">Review paid event registrations, screenshots, UPI references, and admin remarks.</p>
          </div>

          <div className="glass rounded-2xl p-4 grid md:grid-cols-[1fr_220px] gap-3">
            <label className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, student, email, transaction" className="w-full bg-background/60 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-background/60 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
              <option value="">All payment statuses</option>
              {["Under Review", "Approved", "Rejected"].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="glass-strong rounded-2xl p-6 text-muted-foreground">No payment proofs added yet.</div>
            ) : filtered.map((proof) => {
              const registration: any = registrations.find((item: any) => item.id === proof.registrationId);
              const event = getEventById(proof.eventId);
              return (
                <div key={proof.id} className="glass-strong rounded-2xl p-5 racing-border">
                  <div className="grid lg:grid-cols-[1.2fr_180px_220px] gap-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-mono text-primary">{event?.title ?? "Event"}</p>
                      <h3 className="text-xl font-bold mt-1">{registration?.studentName ?? proof.studentId}</h3>
                      <p className="text-sm text-muted-foreground">{registration?.studentEmail ?? proof.studentId}</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                        <Info label="Amount" value={`${event?.payment?.currency ?? "INR"} ${proof.amount}`} />
                        <Info label="Transaction ID" value={proof.transactionId} />
                        <Info label="Sender" value={proof.senderName || "-"} />
                        <Info label="Payment Date" value={proof.paymentDate || "-"} />
                      </div>
                      <textarea
                        value={proof.adminRemarks ?? ""}
                        onChange={(event) => updatePaymentProof(proof.id, { adminRemarks: event.target.value })}
                        placeholder="Admin remarks or rejection reason"
                        className="mt-4 w-full bg-background/60 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      {proof.screenshotUrl ? (
                        <a href={proof.screenshotUrl} target="_blank" rel="noreferrer">
                          <img src={proof.screenshotUrl} alt="Payment screenshot preview" className="w-full aspect-square rounded-xl border border-border object-cover" />
                        </a>
                      ) : (
                        <div className="w-full aspect-square rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground text-center px-4">No screenshot URL</div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="inline-flex w-fit px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{proof.status}</div>
                      <button onClick={() => updatePayment(proof, "Approved")} className="px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">Approve Payment</button>
                      <button onClick={() => updatePayment(proof, "Rejected")} className="px-3 py-2 rounded-lg border border-destructive/40 text-sm text-destructive hover:bg-destructive/10">Reject Payment</button>
                      <button onClick={() => updatePayment(proof, "Under Review")} className="px-3 py-2 rounded-lg border border-border text-sm hover:border-primary/50">Mark Under Review</button>
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
  return <div className="rounded-xl border border-border bg-background/40 p-3"><div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">{label}</div><div className="font-semibold mt-1">{value}</div></div>;
}
