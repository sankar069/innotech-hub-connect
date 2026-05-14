import { motion } from "framer-motion";
import { MilestoneCard } from "@/components/MilestoneCard";
import { RoadmapPhaseCard } from "@/components/RoadmapPhaseCard";
import { StatCard } from "@/components/StatCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { roadmapMilestones, roadmapPhases, roadmapStats } from "@/data/roadmapData";

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <SectionHeading
            eyebrow="Roadmap"
            title={<>Upcoming Product <span className="text-gradient-racing">Roadmap</span></>}
            subtitle="Our journey from event platform to complete innovation ecosystem. Target: 80-85% readiness across core products by end of 2026."
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {roadmapStats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Development Phases"
            title={<>Development <span className="text-gradient-racing">Phases</span></>}
            subtitle="Six phases building towards a complete innovation ecosystem"
          />
          <div className="grid lg:grid-cols-2 gap-5 mt-12">
            {roadmapPhases.map((phase, index) => (
              <RoadmapPhaseCard key={phase.id} {...phase} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Key Milestones"
            title={<>Key <span className="text-gradient-racing">Milestones</span></>}
            subtitle="Important launches and releases on our roadmap"
          />
          <div className="relative mt-12">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:pl-8">
              {roadmapMilestones.map((milestone, index) => (
                <MilestoneCard key={`${milestone.quarter}-${milestone.title}`} {...milestone} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
