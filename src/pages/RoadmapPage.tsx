import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { Roadmap } from "@/sections/Roadmap";

export function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <Roadmap />
      </main>
      <Footer />
      <div className="border-t border-border bg-card/50 px-4 py-4 text-center text-xs text-muted-foreground">
        © 2026 InnoTech-Hub. Where Innovation Meets Community.
      </div>
    </div>
  );
}
