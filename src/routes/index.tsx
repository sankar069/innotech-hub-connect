import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import {
  About, OriginStory, EventPlatform, StudentDashboard, AITools,
  LiveAndPodcast, SaasProducts, BusinessAndTraction, Roadmap,
  Benefits, PartnersTeamMedia, Contact, Footer, FinalMessage,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InnoTech-Hub | Global Tech Events & Smart Campus SaaS Ecosystem" },
      {
        name: "description",
        content:
          "InnoTech-Hub is a student-first tech ecosystem conducting outcome-based events, hackathons, live expert sessions, AI-powered student growth tools, and SaaS products for college clubs, repositories, volunteer tracking, and faculty workflow automation.",
      },
      { property: "og:title", content: "InnoTech-Hub | Where Innovation Meets Community" },
      {
        property: "og:description",
        content:
          "Student-first global tech ecosystem — events, AI growth tools, and SaaS for colleges and clubs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
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
