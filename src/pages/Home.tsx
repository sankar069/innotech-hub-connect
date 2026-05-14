import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import {
  About,
  OriginStory,
  EventPlatform,
  StudentDashboard,
  AITools,
  LiveAndPodcast,
  SaasProducts,
  BusinessAndTraction,
  Benefits,
  PartnersTeamMedia,
  Contact,
  Footer,
  FinalMessage,
} from "@/components/site/Sections";
import { Roadmap } from "@/sections/Roadmap";

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <OriginStory />
        <EventPlatform />
        <StudentDashboard />
        <AITools />
        <LiveAndPodcast />
        <SaasProducts />
        <BusinessAndTraction />
        <Roadmap />
        <Benefits />
        <PartnersTeamMedia />
        <FinalMessage />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
