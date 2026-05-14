import { Award } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getMyCertificates, type Certificate } from "@/lib/studentPlatform";
import { useCmsCollection } from "@/lib/cms";

export function StudentCertificatesPage() {
  const { items } = useCmsCollection<Certificate>("certificates");
  return (
    <ProtectedRoute allow="student">
      {(user) => {
        const certificates = getMyCertificates(user.email).filter((cert) => items.some((item) => item.id === cert.id));
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-32 pb-20 md:pt-40 md:pb-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <Header title="Certificates" text="View and download certificates issued from approved or completed events." />
                {certificates.length === 0 ? <Empty /> : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {certificates.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} />)}
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

function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <article className="glass-strong rounded-2xl p-6 racing-border">
      <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow"><Award className="h-5 w-5 text-primary-foreground" /></div>
      <p className="text-xs uppercase tracking-widest font-mono text-primary">{certificate.certificateType}</p>
      <h2 className="text-xl font-bold mt-2">{certificate.eventTitle}</h2>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>ID: {certificate.certificateId}</p>
        <p>Issue Date: {certificate.issueDate}</p>
        <p>Status: {certificate.status}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-5">
        <a href={`/certificate/verify/${certificate.certificateId}`} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">View Certificate</a>
        <button onClick={() => window.print()} className="rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Download</button>
      </div>
    </article>
  );
}

function Header({ title, text }: { title: string; text: string }) {
  return <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border mb-6"><h1 className="text-4xl md:text-5xl font-bold">{title}</h1><p className="mt-3 text-muted-foreground">{text}</p></div>;
}

function Empty() {
  return <div className="glass-strong rounded-2xl p-6 racing-border"><p className="text-muted-foreground">No certificates issued yet.</p><a href="/events" className="inline-flex mt-4 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore Events</a></div>;
}
