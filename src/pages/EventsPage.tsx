import { Navbar } from "@/components/site/Navbar";
import { EventPlatform, Footer } from "@/components/site/Sections";

export function EventsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <EventPlatform />
      </main>
      <Footer />
    </div>
  );
}
