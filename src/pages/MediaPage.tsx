import { Navbar } from "@/components/site/Navbar";
import { Footer, PartnersTeamMedia } from "@/components/site/Sections";

export function MediaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <PartnersTeamMedia />
      </main>
      <Footer />
    </div>
  );
}
