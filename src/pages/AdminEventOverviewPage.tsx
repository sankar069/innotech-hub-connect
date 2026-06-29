import type React from "react";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Edit, Users, CreditCard, FileText, Award, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEventById, getRegistrations, getPaymentProofs } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

export function AdminEventOverviewPage({ eventId }: { eventId: string }) {
  const decodedId = decodeURIComponent(eventId);
  const event = getEventById(decodedId);

  const { items: allRegistrations } = useCmsCollection("eventRegistrations");
  const { items: allProofs } = useCmsCollection("paymentProofs");
  const { items: allSubmissions } = useCmsCollection("submissions");
  const { items: allCertificates } = useCmsCollection("certificates");

  const registrations = useMemo(() =>
    (Array.isArray(allRegistrations) ? allRegistrations : []).filter((r: any) =>
      r.eventId === decodedId || r.eventId === event?.id || r.eventSlug === event?.slug
    ), [allRegistrations, decodedId, event?.id, event?.slug]);

  const proofs = useMemo(() =>
    (Array.isArray(allProofs) ? allProofs : []).filter((p: any) =>
      p.eventId === decodedId || p.eventId === event?.id
    ), [allProofs, decodedId, event?.id]);

  const submissions = useMemo(() =>
    (Array.isArray(allSubmissions) ? allSubmissions : []).filter((s: any) =>
      s.eventId === decodedId || s.eventId === event?.id
    ), [allSubmissions, decodedId, event?.id]);

  const certificates = useMemo(() =>
    (Array.isArray(allCertificates) ? allCertificates : []).filter((c: any) =>
      c.eventId === decodedId || c.eventId === event?.id
    ), [allCertificates, decodedId, event?.id]);

  const stats = useMemo(() => {
    const regs = registrations as any[];
    const prs = proofs as any[];
    const totalReg = regs.length;
    const approved = regs.filter((r) => r.registrationStatus === "Approved").length;
    const rejected = regs.filter((r) => r.registrationStatus === "Rejected").length;
    const pending = regs.filter((r) => ["Pending Review", "Registered"].includes(r.registrationStatus)).length;
    const cancelled = regs.filter((r) => r.registrationStatus === "Cancelled").length;
    const teams = new Set(regs.filter((r) => r.teamDetails?.teamName).map((r: any) => r.teamDetails.teamName)).size;
    const payVerified = prs.filter((p) => p.status === "Approved").length;
    const payRejected = prs.filter((p) => p.status === "Rejected").length;
    const payPending = prs.filter((p) => p.status === "Under Review").length;
    const verifiedRevenue = prs
      .filter((p) => p.status === "Approved")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);
    return { totalReg, approved, rejected, pending, cancelled, teams, payVerified, payRejected, payPending, verifiedRevenue };
  }, [registrations, proofs]);

  if (!event) {
    return (
      <AdminLayout title="Event Not Found">
        {() => (
          <div className="glass-strong rounded-2xl p-8 racing-border text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Event not found</h2>
            <p className="text-sm text-muted-foreground">No event with ID <code className="font-mono bg-background/60 px-2 py-0.5 rounded">{decodedId}</code> exists.</p>
            <Link to="/admin/events" className="inline-flex mt-4 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary/50 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Events
            </Link>
          </div>
        )}
      </AdminLayout>
    );
  }

  const eId = event.id;

  return (
    <AdminLayout title="Event Overview">
      {() => (
        <div className="space-y-6">
          {/* Header */}
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link to="/admin/events" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-3">
                  <ChevronLeft className="h-3.5 w-3.5" /> Events
                </Link>
                <p className="text-xs uppercase tracking-widest font-mono text-primary">{event.category} · {event.type}</p>
                <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{event.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest ${event.status === "Published" || event.status === "Registration Open" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                    {event.status}
                  </span>
                  <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    {event.participationMode}
                  </span>
                </div>
              </div>
              <Link
                to="/admin/events/$eventId/edit"
                params={{ eventId: eId }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Edit className="h-4 w-4" /> Edit Event
              </Link>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Registrations"
              value={stats.totalReg}
              icon={<Users className="h-5 w-5" />}
              href={`/admin/events/${eId}/registrations`}
            />
            <MetricCard
              label="Approved"
              value={stats.approved}
              icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
              href={`/admin/events/${eId}/registrations`}
              accent="green"
            />
            <MetricCard
              label="Pending Review"
              value={stats.pending}
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
              href={`/admin/events/${eId}/registrations`}
              accent="yellow"
            />
            <MetricCard
              label="Rejected"
              value={stats.rejected}
              icon={<XCircle className="h-5 w-5 text-destructive" />}
              href={`/admin/events/${eId}/registrations`}
              accent="red"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Verified Payments"
              value={stats.payVerified}
              icon={<CreditCard className="h-5 w-5 text-green-500" />}
              href={`/admin/events/${eId}/payments`}
              accent="green"
            />
            <MetricCard
              label="Payments Pending"
              value={stats.payPending}
              icon={<CreditCard className="h-5 w-5 text-yellow-500" />}
              href={`/admin/events/${eId}/payments`}
              accent="yellow"
            />
            <MetricCard
              label="Verified Revenue"
              value={`₹${stats.verifiedRevenue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
              icon={<CreditCard className="h-5 w-5 text-primary" />}
              href={`/admin/events/${eId}/payments`}
            />
            <MetricCard
              label="Teams"
              value={stats.teams}
              icon={<Users className="h-5 w-5" />}
              href={`/admin/events/${eId}/teams`}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Participants"
              value={stats.approved}
              icon={<Users className="h-5 w-5" />}
              href={`/admin/events/${eId}/participants`}
            />
            <MetricCard
              label="Submissions"
              value={submissions.length}
              icon={<FileText className="h-5 w-5" />}
              href={`/admin/events/${eId}/submissions`}
            />
            <MetricCard
              label="Certificates"
              value={certificates.length}
              icon={<Award className="h-5 w-5" />}
              href={`/admin/events/${eId}/certificates`}
            />
            <MetricCard
              label="Rejected Payments"
              value={stats.payRejected}
              icon={<XCircle className="h-5 w-5 text-destructive" />}
              href={`/admin/events/${eId}/payments`}
              accent="red"
            />
          </div>

          {/* Quick nav */}
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <h3 className="text-lg font-bold mb-4">Quick Navigation</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Registrations", href: `/admin/events/${eId}/registrations` },
                { label: "Payments", href: `/admin/events/${eId}/payments` },
                { label: "Participants", href: `/admin/events/${eId}/participants` },
                { label: "Submissions", href: `/admin/events/${eId}/submissions` },
                { label: "Teams", href: `/admin/events/${eId}/teams` },
                { label: "Certificates", href: `/admin/events/${eId}/certificates` },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm font-semibold text-center hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function MetricCard({
  label,
  value,
  icon,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  accent?: "green" | "yellow" | "red";
}) {
  const accentClass =
    accent === "green"
      ? "border-green-500/20 hover:border-green-500/40"
      : accent === "yellow"
        ? "border-yellow-500/20 hover:border-yellow-500/40"
        : accent === "red"
          ? "border-destructive/20 hover:border-destructive/40"
          : "hover:border-primary/30";

  return (
    <a
      href={href}
      className={`glass-strong rounded-2xl p-5 racing-border group block transition-colors ${accentClass}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</span>
        <span className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </a>
  );
}
