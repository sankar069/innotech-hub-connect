import { Award } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { getCertificates } from "@/lib/studentPlatform";

export function CertificateVerifyPage({ certificateId }: { certificateId: string }) {
  const certificate = getCertificates().find((item) => item.certificateId === certificateId);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
            <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow"><Award className="h-6 w-6 text-primary-foreground" /></div>
            <h1 className="text-4xl md:text-5xl font-bold">Certificate Verification</h1>
            {certificate ? (
              <div className="mt-6 grid gap-3 text-sm">
                <Info label="Certificate ID" value={certificate.certificateId} />
                <Info label="Student Name" value={certificate.studentName} />
                <Info label="Event Name" value={certificate.eventTitle} />
                <Info label="Certificate Type" value={certificate.certificateType} />
                <Info label="Issue Date" value={certificate.issueDate} />
                <Info label="Verification Status" value={certificate.status === "Issued" ? "Verified" : certificate.status} />
              </div>
            ) : (
              <p className="mt-6 text-muted-foreground">Certificate not found or not publicly verifiable.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/40 p-4"><div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</div><div className="font-semibold mt-1">{value}</div></div>;
}
