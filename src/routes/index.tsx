import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

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
  component: Home,
});
