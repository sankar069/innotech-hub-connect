import { useMemo, useState } from "react";
import type React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getRegistrations } from "@/lib/events";
import { getCertificates, getStudentProfiles, type StudentProfile } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function AdminStudentsPage() {
  const { items: storedItems } = useCmsCollection<StudentProfile>("studentProfiles");
  const items = Array.isArray(storedItems) ? storedItems : [];
  const [query, setQuery] = useState("");
  const registrations = getRegistrations();
  const certificates = getCertificates();
  const students = useMemo(() => items.filter((student) => `${student.name ?? ""} ${student.email ?? ""} ${student.college ?? ""}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return (
    <AdminLayout title="Students">
      {() => (
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold">Student Management</h2><p className="text-sm text-muted-foreground mt-2">View student users, registrations, payments, certificates, and account status.</p></section>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm" />
          {students.length === 0 ? <div className="glass-strong rounded-2xl p-6 racing-border text-muted-foreground">No student profiles saved yet.</div> : students.map((student) => {
            const mine = registrations.filter((registration) => registration.studentEmail === student.email);
            return (
              <article key={student.id} className="glass-strong rounded-2xl p-5 racing-border">
                <div className="grid lg:grid-cols-[1fr_auto] gap-4">
                  <div><h3 className="text-xl font-bold">{student.name}</h3><p className="text-sm text-muted-foreground">{student.email} · {student.phone} · {student.college}</p><p className="text-sm text-muted-foreground mt-1">{student.department} · {student.year}</p></div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`/admin/students/${encodeURIComponent(student.email)}`} className="rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground">View Profile</a>
                    <span className="rounded-lg border border-border px-3 py-2 text-sm">Active</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-4 gap-3 mt-4">
                  <Mini label="Registered Events" value={mine.length} />
                  <Mini label="Certificates" value={certificates.filter((cert) => cert.studentId === student.email).length} />
                  <Mini label="Payment Pending" value={mine.filter((registration) => ["Pending Upload", "Under Review", "Rejected"].includes(registration.paymentStatus)).length} />
                  <Mini label="Completion" value={`${student.profileCompletion ?? 0}%`} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

export function AdminStudentDetailPage({ studentId }: { studentId: string }) {
  const decodedStudentId = decodeURIComponent(studentId);
  const student = getStudentProfiles().find((item) => item.id === decodedStudentId || item.email === decodedStudentId);
  const lookupId = student?.email ?? decodedStudentId;
  const registrations = getRegistrations().filter((item) => item.studentEmail === lookupId);
  const certificates = getCertificates().filter((item) => item.studentId === lookupId);
  return (
    <AdminLayout title="Student Detail">
      {() => (
        <div className="space-y-6">
          {!student ? <div className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold">Student not found</h2><a href="/admin/students" className="inline-flex mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold">Back to Students</a></div> : (
            <>
              <section className="glass-strong rounded-2xl p-6 racing-border"><h2 className="text-2xl font-bold">{student.name}</h2><p className="text-sm text-muted-foreground mt-2">{student.email} · {student.college}</p><p className="text-sm text-muted-foreground mt-2">{student.bio}</p></section>
              <section className="glass-strong rounded-2xl p-6 racing-border"><h3 className="text-xl font-bold mb-4">Registered Events</h3>{registrations.map((item) => <div key={item.id} className="rounded-xl border border-border p-3 mb-2 text-sm">{item.eventSlug} · {item.registrationStatus} · {item.paymentStatus}</div>)}</section>
              <section className="glass-strong rounded-2xl p-6 racing-border"><h3 className="text-xl font-bold mb-4">Certificate History</h3>{certificates.map((item) => <div key={item.id} className="rounded-xl border border-border p-3 mb-2 text-sm">{item.eventTitle} · {item.status}</div>)}</section>
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-background/40 p-3"><div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</div><div className="text-xl font-bold mt-1">{value}</div></div>;
}
