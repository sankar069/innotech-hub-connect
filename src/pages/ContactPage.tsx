import { Navbar } from "@/components/site/Navbar";
import { Contact, Footer } from "@/components/site/Sections";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
