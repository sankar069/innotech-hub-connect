import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Rocket, Handshake, Activity, Cpu, Trophy, Gauge } from "lucide-react";
import { Counter } from "./Counter";

const stats = [
  { label: "Revenue Generated", value: 1.5, prefix: "₹", suffix: "L+", isFloat: true },
  { label: "Events Conducted", value: 7, suffix: "+" },
  { label: "Hackathon Collaboration", value: 1, suffix: "" },
  { label: "Participants Reached", value: 3000, suffix: "+" },
  { label: "States Represented", value: 8, suffix: "+" },
  { label: "Colleges Connected", value: 25, suffix: "+" },
];

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-hero">
      {/* Grid backdrop */}
      <div className="absolute inset-0 bg-grid moving-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* Racing track lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent speed-line" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent speed-line" style={{ animationDelay: "1s" }} />
        <div className="race-light-trail top-[36%]" />
        <div className="race-light-trail top-[58%]" style={{ animationDelay: "1.4s" }} />
      </div>

      {/* Glow blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Global Tech Events & SaaS Innovation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6">
            Where Innovation
            <br />
            Meets <span className="text-gradient-racing">Community</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover, attend, and participate in outcome-based hackathons, workshops, summits, and live expert sessions.
            InnoTech-Hub is building a student-first innovation ecosystem powered by events, AI tools, and scalable SaaS.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <a
              href="#events"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.03] transition-transform"
            >
              Explore Events
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-semibold hover:border-primary/40 transition-colors"
            >
              <Users className="h-4 w-4" /> Join Community
            </a>
            <a
              href="#saas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-semibold"
            >
              <Cpu className="h-4 w-4" /> View SaaS
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/40 text-foreground font-semibold hover:bg-accent/10 transition-colors"
            >
              <Handshake className="h-4 w-4" /> Partner With Us
            </a>
          </div>
        </motion.div>

        {/* F1 Telemetry Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="telemetry-card glass-strong rounded-2xl p-6 md:p-8 shadow-card racing-border relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-racing" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <Gauge className="h-4 w-4 text-primary" />
                Live Traction Telemetry
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">SYSTEM ONLINE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card/40 border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="text-2xl md:text-3xl font-display font-bold text-gradient-primary">
                    {s.isFloat ? (
                      <>
                        {s.prefix}{s.value}
                        {s.suffix}
                      </>
                    ) : (
                      <Counter value={s.value as number} prefix={s.prefix} suffix={s.suffix} />
                    )}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1 font-mono">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating side cards */}
          <div className="hidden xl:block absolute -left-8 top-1/4 glass rounded-xl p-3 float-soft shadow-card">
            <div className="flex items-center gap-2 text-xs">
              <Activity className="h-4 w-4 text-racing-cyan" />
              <span className="font-mono">+24% growth</span>
            </div>
          </div>
          <div className="hidden xl:block absolute -right-8 bottom-1/4 glass rounded-xl p-3 float-soft shadow-card" style={{ animationDelay: "1.5s" }}>
            <div className="flex items-center gap-2 text-xs">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="font-mono">1 hackathon with Gemini Google</span>
            </div>
          </div>
          <div className="hidden xl:block absolute -right-12 top-1/3 glass rounded-xl p-3 float-soft shadow-card" style={{ animationDelay: "2.5s" }}>
            <div className="flex items-center gap-2 text-xs">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="font-mono">SaaS shipping</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
