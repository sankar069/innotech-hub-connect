import { motion } from "framer-motion";
import { useState } from "react";
import {
  Target, Users, Wrench, Sparkles, X, Check,
  Calendar, Trophy, Mic, Video, Brain, Crown, Podcast, PartyPopper,
  Search, Cpu, ClipboardCheck, Award, BarChart3, Bot, Lightbulb, FileSearch, UsersRound, FileText,
  TrendingUp, Compass, Wallet, Building2, MapPin, FolderLock, BellRing,
  GraduationCap, School, Handshake, Briefcase, Mail, Sparkle, Activity, LogIn,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Counter } from "./Counter";
import { getCmsCollection, saveCmsCollection, useCmsCollection } from "@/lib/cms";
import { createId } from "@/lib/id";

/* ======================= ABOUT ======================= */
const aboutCards = [
  { icon: Target, title: "Mission-Driven", desc: "Empowering students through practical, affordable, outcome-based tech experiences." },
  { icon: Users, title: "Community-Led", desc: "A network of students, developers, designers, innovators, mentors, and young achievers." },
  { icon: Wrench, title: "Practical Learning", desc: "Hackathons, workshops, live sessions, projects, and task-based certificates over theory." },
  { icon: Sparkles, title: "Innovation-Focused", desc: "Turning events into measurable growth via AI tools, dashboards, and verified certificates." },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="About InnoTech-Hub"
          title={<>Building the <span className="text-gradient-racing">Future</span>, Together</>}
          subtitle="We noticed many events were branding-focused, theoretical, or expensive — and certificates rarely proved real skill. So we built a student-first ecosystem where every event becomes a learning journey, and every certificate becomes proof."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          {aboutCards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="racing-border rounded-2xl p-6 group hover:-translate-y-1 transition-transform"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= ORIGIN STORY ======================= */
const compareLeft = [
  "Attend and leave",
  "Certificate for presence",
  "Branding-focused hackathons",
  "One-time webinars",
  "Expert-only summits",
  "Generic podcasts",
  "No follow-up",
  "No skill tracking",
];
const compareRight = [
  "Learn, build, prove, grow",
  "Certificate based on outcome",
  "Student-growth-focused hackathons",
  "Series-based workshops",
  "Student-first summits",
  "Interviews with achievers & winners",
  "Post-event guidance",
  "Skill and growth analytics",
];

export function OriginStory() {
  return (
    <section className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why We Started"
          title={<>Born from the <span className="text-gradient-primary">student perspective</span></>}
          subtitle="Hackathons for branding. Webinars without depth. Summits for professionals only. Podcasts that ignored student innovators. We're rewriting the rulebook."
        />

        <div className="grid md:grid-cols-2 gap-5 mt-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl p-6 border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-2 mb-5">
              <X className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider">Normal Event Culture</h3>
            </div>
            <ul className="space-y-3">
              {compareLeft.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl p-6 racing-border shadow-glow">
            <div className="flex items-center gap-2 mb-5">
              <Check className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-gradient-racing">InnoTech-Hub Culture</h3>
            </div>
            <ul className="space-y-3">
              {compareRight.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ======================= EVENT PLATFORM ======================= */
const eventCategories = [
  { icon: Trophy, title: "Hackathons", tag: "Build. Ship. Win." },
  { icon: Wrench, title: "Workshops", tag: "Learn by Doing." },
  { icon: Mic, title: "Seminars", tag: "Insights & Ideas." },
  { icon: Video, title: "Webinars", tag: "Learn Anywhere." },
  { icon: Brain, title: "AI Conferences", tag: "The Future is Now." },
  { icon: Crown, title: "Summits", tag: "Leaders Convene." },
  { icon: Podcast, title: "Tech Podcasts", tag: "Voices of Tech." },
  { icon: PartyPopper, title: "Tech Carnivals", tag: "Celebrate Innovation." },
];
const flowSteps = [
  "Discover Event", "AI Recommendation", "Register", "Payment / Ticketing",
  "Attend", "Submit Project", "Certificate Generated", "Profile Updated", "Next Event Recommended",
];
const platformFeatures = [
  "Event discovery", "Student registration", "Payment & ticketing", "QR / manual payment",
  "Project submission", "Attendance tracking", "Verified certificates", "Sponsor visibility",
  "Skill growth dashboard", "AI recommendations", "AI idea generator", "Resume analyzer",
];

export function EventPlatform() {
  return (
    <section id="events" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Official Event Platform"
          title={<>InnoTech-Hub <span className="text-gradient-racing">Official</span> Event Platform</>}
          subtitle="Created and managed only by the InnoTech-Hub team. Not an open SaaS for external colleges to host events — we run our own official events end-to-end."
        />

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <a href="/login" className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:bg-[#a93a25] transition-colors inline-flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Login to Event Platform
          </a>
          <a href="/signup" className="px-6 py-3 rounded-xl glass text-foreground font-semibold hover:border-primary/40 transition-colors inline-flex items-center gap-2">
            <Users className="h-4 w-4" /> Create Student Account
          </a>
          <a href="/events" className="px-6 py-3 rounded-xl border border-accent/40 text-foreground font-semibold hover:bg-accent/10 transition-colors inline-flex items-center gap-2">
            <Search className="h-4 w-4" /> Explore Events
          </a>
        </div>

        {/* categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {eventCategories.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:border-primary/50 transition-colors group"
            >
              <c.icon className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-sm mb-1">{c.title}</div>
              <div className="text-xs text-muted-foreground font-mono">{c.tag}</div>
            </motion.div>
          ))}
        </div>

        {/* Racing track flow */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-2 text-center">Event Flow — The Racing Track</h3>
          <p className="text-sm text-muted-foreground text-center mb-10">Every student journey from start grid to podium.</p>
          <div className="relative">
            <div className="roadmap-track absolute top-6 left-0 right-0 h-1 bg-gradient-racing rounded-full opacity-60 hidden md:block" />
            <div className="absolute top-6 left-0 right-0 h-1 hidden md:block">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent speed-line rounded-full" />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3 relative">
              {flowSteps.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shadow-glow text-sm">
                    {i + 1}
                  </div>
                  <div className="text-[11px] mt-3 text-muted-foreground font-mono uppercase tracking-wide leading-tight">
                    {s}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-20 glass-strong rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> Platform Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platformFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />{f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= STUDENT DASHBOARD ======================= */
const dashCards = [
  "Registered Events", "Attended Events", "Certificates Earned", "Projects Submitted",
  "Hackathons Participated", "Skills Gained", "Team History", "AI Tool Usage",
  "Resume Readiness", "Growth Percentage",
];
const analytics = [
  { label: "Event Participation", v: 75 },
  { label: "Practical Submission", v: 60 },
  { label: "Team Collaboration", v: 80 },
  { label: "Certificate Completion", v: 90 },
  { label: "Career Readiness", v: 70 },
];

export function StudentDashboard() {
  return (
    <section className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Innovation Passport"
          title={<>Student <span className="text-gradient-racing">Growth</span> Dashboard</>}
          subtitle="Every student gets a personal dashboard — events become growth insights, not just history."
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />My Profile Modules</h3>
              <span className="text-xs font-mono text-muted-foreground">10 ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dashCards.map((d) => (
                <div key={d} className="bg-card/60 rounded-lg p-3 text-sm border border-border hover:border-primary/40 transition-colors">
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" />Growth Analytics</h3>
              <span className="text-xs font-mono text-muted-foreground">LIVE</span>
            </div>
            <div className="space-y-4">
              {analytics.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{a.label}</span>
                    <span className="font-mono font-bold"><Counter value={a.v} suffix="%" /></span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.v}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      className="h-full bg-gradient-racing rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-muted-foreground max-w-2xl mx-auto text-sm">
          Your profile becomes a <span className="text-foreground font-semibold">digital innovation passport</span> — achievements,
          certificates, skills, and event history connected in one place.
        </p>
        <div className="mt-8 flex justify-center">
          <a href="/event-platform" className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:bg-[#a93a25] transition-colors inline-flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Open My Dashboard
          </a>
        </div>
      </div>
    </section>
  );
}

/* ======================= AI TOOLS ======================= */
const aiTools = [
  { icon: Bot, title: "AI Chat Assistant", desc: "A personal mentor suggesting events, courses, projects, teammates, and career paths." },
  { icon: Compass, title: "AI Event Recommendation", desc: "Recommends events based on skills, interests, year, and career goals." },
  { icon: Lightbulb, title: "AI Idea Generator", desc: "Hackathon ideas tuned to theme, team skills, time, and tech stack." },
  { icon: FileSearch, title: "AI Idea Analyzer", desc: "Checks uniqueness, feasibility, business value, and presentation strength." },
  { icon: UsersRound, title: "AI Team Matching", desc: "Matches by skills, interests, availability, domain, and project goals." },
  { icon: FileText, title: "Resume Analyzer", desc: "Resume score, missing skills, ATS suggestions, and event-based bullets." },
];

export function AITools() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="AI Suite"
          title={<>AI-Powered <span className="text-gradient-racing">Student Growth</span> Tools</>}
          subtitle="AI guides students before, during, and after every event."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {aiTools.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="racing-border rounded-2xl p-6 hover:-translate-y-1 transition-transform group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                <t.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= LIVE SESSIONS + PODCAST ======================= */
export function LiveAndPodcast() {
  const liveFeatures = [
    "Free and paid sessions", "Speaker profile", "Session registration", "Meeting link sharing",
    "Q&A", "Task-based learning", "Attendance tracking", "Feedback collection",
    "Outcome certificates", "Future recording library",
  ];
  return (
    <section className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
        <div className="glass-strong rounded-2xl p-8 racing-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest mb-4">
            <Video className="h-3.5 w-3.5" /> Live Expert Sessions
          </div>
          <h2 className="text-3xl font-bold mb-3">Short, Powerful, <span className="text-gradient-racing">30–45 min</span></h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Expert-led by professionals, founders, developers, designers, recruiters, AI engineers, and achievers. Practical outcomes
            over long theoretical webinars.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {liveFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />{f}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-8 racing-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono uppercase tracking-widest mb-4">
            <Podcast className="h-3.5 w-3.5" /> Tech Podcast
          </div>
          <h2 className="text-3xl font-bold mb-3">Voices of Real <span className="text-gradient-racing">Tech Achievers</span></h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Interviews with national-level hackathon winners, coding champions, student innovators, and open-source contributors —
            so budding students learn from real journeys.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Hackathon Winners", "Coding Champions", "Open Source Devs", "Student Innovators", "AI Engineers", "Project Builders"].map((t) => (
              <div key={t} className="bg-card/60 rounded-lg p-3 border border-border text-sm">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= SAAS PRODUCTS ======================= */
const saasProducts = [
  {
    icon: ClipboardCheck,
    title: "Club / Team Task Manager",
    color: "from-[#c4472d] to-[#a8674b]",
    desc: "Replace messy WhatsApp coordination with structured task tracking, proof-based completion, and team dashboards.",
    features: ["Super admin workspace", "Member accounts", "Team & club creation", "Tasks, deadlines, priorities", "Proof upload", "Pending/completed/overdue dashboards"],
    note: "Ongoing product in active internal use by InnoTech-Hub teams.",
  },
  {
    icon: MapPin,
    title: "Volunteer Attendance & Tracking",
    color: "from-[#a93a25] to-[#c4472d]",
    desc: "Smart volunteer attendance and location verification for large college events and club programs.",
    features: ["Client admin & event setup", "GPS check-in/out", "Geo-tagged photo proof", "Live tracking option", "Team lead verification", "Volunteer reports"],
    note: "Upcoming product for event duty tracking, used only with consent.",
  },
  {
    icon: FolderLock,
    title: "College Repository System",
    color: "from-[#7a4e55] to-[#a8674b]",
    desc: "Inspection-ready document repository for NBA, NAAC, IQAC, JNTU, departments, faculty, and clubs.",
    features: ["Department & faculty folders", "Role-based access", "Approval workflow", "Audit logs & versioning", "Missing document tracker", "Inspection-ready reports"],
    note: "Upcoming SaaS to solve the chaos of Drive, WhatsApp, pendrives, and faculty laptops.",
  },
  {
    icon: BellRing,
    title: "Faculty Attendance & Smart Alerts",
    color: "from-[#a8674b] to-[#c4472d]",
    desc: "Smart academic workflow — timetables, biometric data, alerts, and reports unified into one system.",
    features: ["Class alert system", "Biometric notification", "Universal biometric connector (eSSL, ZKTeco, Hikvision, Matrix…)", "BioSync local agent", "HOD escalation", "Department reports"],
    note: "Positioned as academic workflow & visibility — not surveillance.",
  },
];

export function SaasProducts() {
  return (
    <section id="saas" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Ongoing & Upcoming SaaS"
          title={<>Beyond Events: <span className="text-gradient-racing">Ongoing and Upcoming Products</span></>}
          subtitle="Modular SaaS for clubs, teams, colleges, and smart campus operations. The official event platform stays internal — these products power our clients."
        />
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {saasProducts.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-7 racing-border hover:-translate-y-1 transition-transform group relative overflow-hidden"
            >
              <div className="absolute inset-x-7 top-0 h-px bg-border" />
              <div className="relative">
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5 shadow-card`}>
                  <p.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <ul className="space-y-2 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs italic text-muted-foreground/80 border-l-2 border-primary/40 pl-3">{p.note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= BUSINESS MODEL + TRACTION ======================= */
const revenueChannels = [
  "Paid events", "Paid workshops", "Live expert sessions", "Sponsorships",
  "Partner collaborations", "Premium AI tools", "SaaS subscriptions",
  "College repository plans", "Volunteer tracking plans", "Task manager plans", "Faculty alert plans",
];
const tractionStats = [
  { v: 2.4, suffix: " Lakhs+", prefix: "₹", label: "Revenue Generated", isFloat: true },
  { v: 7, suffix: "+", label: "Tech & Non-Tech Events" },
  { v: 1, suffix: "", label: "Hackathon with Gemini Google" },
  { v: 3000, suffix: "+", label: "Participants Reached" },
  { v: 8, suffix: "+", label: "States Represented" },
  { v: 25, suffix: "+", label: "Colleges Connected" },
];

export function BusinessAndTraction() {
  const { activeItems: dynamicTractionStats } = useCmsCollection("tractionStats");
  const visibleTractionStats = dynamicTractionStats.length > 0 ? dynamicTractionStats : tractionStats;
  const firstTraction = visibleTractionStats[0];

  return (
    <section className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Wallet className="h-3.5 w-3.5" /> Business Model
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revenue Built on <span className="text-gradient-racing">Real Value</span></h2>
            <p className="text-muted-foreground mb-6">
              Already generated <span className="text-foreground font-semibold">₹2.4 Lakhs+ revenue</span>, fully reinvested into events, hackathons,
              and product. Our promise: keep student platform fees ultra-low — and zero where possible.
            </p>
            <div className="flex flex-wrap gap-2">
              {revenueChannels.map((c) => (
                <span key={c} className="px-3 py-1.5 text-xs rounded-full glass text-muted-foreground hover:text-foreground transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-strong rounded-2xl p-6 racing-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />{String(firstTraction?.sectionHeading ?? "Current Traction")}</h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {visibleTractionStats.map((s) => (
                <div key={String(s.id ?? s.label ?? s.title)} className="bg-card/50 border border-border rounded-xl p-4">
                  <div className="text-3xl font-display font-bold text-gradient-primary">
                    {Number.isFinite(Number(s.value ?? s.v)) && Number(s.value ?? s.v) % 1 !== 0 ? <>{String(s.prefix ?? "")}{String(s.value ?? s.v)}{String(s.suffix ?? "")}</> : <Counter value={Number(s.value ?? s.v ?? 0)} prefix={String(s.prefix ?? "")} suffix={String(s.suffix ?? "")} />}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mt-1">{String(s.title ?? s.label ?? "")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= ROADMAP ======================= */
const phases = [
  { phase: "P1", title: "Event Ecosystem", status: "current", items: ["Official event platform", "Student registrations", "Payment & ticketing", "Certificates", "Live expert sessions", "Sponsor partnerships"] },
  { phase: "P2", title: "Internal Operations", status: "active", items: ["Club/team task manager", "Internal team usage", "Team dashboards", "Proof-based completion", "Workflow discipline"] },
  { phase: "P3", title: "Event Operations SaaS", status: "next", items: ["Volunteer attendance", "GPS-based tracking", "Geo-tagged proof", "Workforce reports", "Certificate eligibility"] },
  { phase: "P4", title: "College Documentation", status: "next", items: ["College repository", "NBA/NAAC/IQAC/JNTU", "Role-based dashboards", "Inspection reports"] },
  { phase: "P5", title: "Smart Campus Workflow", status: "future", items: ["Faculty class alerts", "Biometric notifications", "Universal connector", "BioSync agent", "Department reports"] },
  { phase: "P6", title: "Full Ecosystem", status: "future", items: ["AI-driven analytics", "Sponsor dashboards", "Innovation passport", "SaaS subscriptions", "Investor expansion"] },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Race Track"
          title={<>Roadmap: From Events to <span className="text-gradient-racing">SaaS Ecosystem</span></>}
          subtitle="Target: ~80–85% readiness across core products and pilot-ready SaaS by end of 2026."
        />

        <div className="relative mt-16">
          <div className="roadmap-track absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-racing rounded-full opacity-40 -translate-x-1/2 md:-translate-x-1/2" />
          <div className="space-y-10">
            {phases.map((p, i) => (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative md:grid md:grid-cols-2 gap-8 items-center ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}
              >
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shadow-glow border-4 border-background text-sm">
                    {p.phase}
                  </div>
                </div>
                <div className={`pl-20 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-16" : "md:pl-16"}`}>
                  <div className="glass-strong rounded-2xl p-6 racing-border inline-block w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold">{p.title}</h3>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                        p.status === "current" ? "bg-emerald-500/20 text-emerald-400" :
                        p.status === "active" ? "bg-primary/20 text-primary" :
                        p.status === "next" ? "bg-accent/20 text-accent" :
                        "bg-muted text-muted-foreground"
                      }`}>{p.status}</span>
                    </div>
                    <ul className={`space-y-1.5 text-sm text-muted-foreground ${i % 2 === 0 ? "md:items-end" : ""}`}>
                      {p.items.map((it) => (
                        <li key={it} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary shrink-0" />{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= BENEFITS ======================= */
const benefitGroups = [
  { icon: GraduationCap, title: "For Students", color: "text-primary", items: ["Discover meaningful events", "Affordable practical sessions", "Build & submit projects", "Earn verified certificates", "Track skill growth", "Find teammates", "Learn from achievers"] },
  { icon: School, title: "For Colleges", color: "text-racing-cyan", items: ["Better documentation", "Workforce tracking", "Faculty workflow support", "Reduced manual work", "Inspection readiness", "Digital transformation", "Analytics & reports"] },
  { icon: UsersRound, title: "For Clubs/Teams", color: "text-racing-purple", items: ["Replace WhatsApp chaos", "Assign and track work", "Manage members", "Verify completion", "Run events professionally"] },
  { icon: Briefcase, title: "For Sponsors", color: "text-accent", items: ["Direct student reach", "Event visibility", "Brand placement", "Audience analytics", "Long-term partnership", "Strategic investment opportunity"] },
];

export function Benefits() {
  return (
    <section className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Outcomes"
          title={<>Built to <span className="text-gradient-racing">Benefit Everyone</span></>}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {benefitGroups.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="racing-border rounded-2xl p-6 hover:-translate-y-1 transition-transform"
            >
              <g.icon className={`h-8 w-8 ${g.color} mb-4`} />
              <h3 className="font-bold text-lg mb-3">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= PARTNERS / TEAM / MEDIA ======================= */
export function PartnersTeamMedia() {
  const { activeItems: teamGroups } = useCmsCollection("teamCategories");
  const { activeItems: partners } = useCmsCollection("partners");
  const { activeItems: sponsors } = useCmsCollection("sponsors");
  const { activeItems: mediaCategories } = useCmsCollection("mediaCategories");

  return (
    <>
      <section id="partners" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Collaborators"
            title={<>Partners & <span className="text-gradient-racing">Sponsors</span></>}
            subtitle="Our collaborators help us create better learning experiences and innovation-driven events."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
            {[...partners, ...sponsors].map((item, i) => (
              <a key={String(item.id)} href={String(item.websiteUrl ?? "#")} className="aspect-[3/2] glass rounded-xl flex items-center justify-center text-muted-foreground/60 text-xs font-mono text-center p-3">
                {item.logoUrl ? <img src={String(item.logoUrl)} alt={String(item.name ?? "Partner")} className="max-h-12 max-w-full object-contain" /> : String(item.name ?? `PARTNER ${i + 1}`)}
                {item.sponsorshipLevel ? <span className="absolute mt-20 rounded-full border border-border bg-card/70 px-2 py-0.5 text-[10px] text-primary">{String(item.sponsorshipLevel)}</span> : null}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <a href="#contact" className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-transform inline-flex items-center gap-2">
              <Handshake className="h-4 w-4" /> Become a Partner
            </a>
            <a href="#contact" className="px-6 py-3 rounded-xl border border-accent/40 text-foreground font-semibold hover:bg-accent/10 transition-colors inline-flex items-center gap-2">
              <Sparkle className="h-4 w-4" /> Sponsor an Event
            </a>
          </div>
        </div>
      </section>

      <section id="team" className="relative py-24 md:py-32 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="The Team"
            title={<>Meet the Minds Behind the <span className="text-gradient-racing">Movement</span></>}
            subtitle="A student-led, innovation-driven team building real solutions from real campus problems."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {teamGroups.map((t, i) => (
              <motion.a
                key={String(t.id)}
                href={`/team/${String(t.slug ?? t.id)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-strong rounded-2xl p-6 racing-border"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg">{String(t.name ?? t.title ?? "")}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {String(t.shortDescription ?? "Driven contributors building, shipping, and scaling InnoTech-Hub every day.")}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Outreach"
            title={<>Media & <span className="text-gradient-racing">Outreach</span></>}
            subtitle="Building presence through events, student stories, podcasts, workshops, and collaborations."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {mediaCategories.map((m, i) => (
              <motion.a
                key={String(m.id)}
                href={`/media/${String(m.slug ?? m.id)}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-video glass-strong rounded-2xl racing-border flex items-center justify-center text-center p-6 hover:scale-[1.02] transition-transform group cursor-pointer"
              >
                <div>
                  <Video className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-bold">{String(m.name ?? m.title ?? "")}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ======================= CONTACT + FOOTER ======================= */
export function Contact() {
  const interests = [
    "Attend Events",
    "Sponsor Events",
    "Partner With Us",
    "Use SaaS Products",
    "College Collaboration",
    "Investor Discussion",
    "General Inquiry",
  ];
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    interest_type: "",
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.organization || !form.interest_type || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Contact submission failed");
      }

      saveCmsCollection("contactLeads", [
        ...getCmsCollection("contactLeads"),
        {
          id: createId("contact-lead"),
          ...form,
          status: "New",
          adminNotes: "",
          created_at: new Date().toISOString(),
          active: true,
          order: Date.now(),
        },
      ]);

      setStatus("success");
      setForm({
        name: "",
        email: "",
        organization: "",
        role: "",
        interest_type: "",
        message: "",
        company: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Let's Talk"
          title={<>Let's Build the <span className="text-gradient-racing">Future</span> Together</>}
          subtitle="Tell us how you'd like to work with InnoTech-Hub."
        />

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 md:p-8 racing-border space-y-5">
          <input
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            name="company"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Name" placeholder="Your full name" required value={form.name} onChange={(event) => updateField("name", event.target.value)} />
            <Field label="Email" type="email" placeholder="you@example.com" required value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            <Field label="Organization / College" placeholder="Acme University" required value={form.organization} onChange={(event) => updateField("organization", event.target.value)} />
            <Field label="Role" placeholder="Director, Faculty, Student..." value={form.role} onChange={(event) => updateField("role", event.target.value)} />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Interest Type</label>
            <select
              required
              value={form.interest_type}
              onChange={(event) => updateField("interest_type", event.target.value)}
              className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Select interest type</option>
              {interests.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us a bit about what you're looking for..."
              className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>
          {status === "success" && (
            <p className="text-sm text-emerald-400">Thanks for reaching out! The InnoTech-Hub team will contact you soon.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Mail className="h-4 w-4" /> {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function LegacyContact() {
  const interests = ["Attend Events", "Sponsor Events", "Partner With Us", "Use SaaS Products", "College Collaboration", "Investor Discussion"];
  return (
    <section id="contact" className="relative py-24 md:py-32 bg-card/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Let's Talk"
          title={<>Let's Build the <span className="text-gradient-racing">Future</span> Together</>}
          subtitle="Tell us how you'd like to work with InnoTech-Hub."
        />

        <form onSubmit={(e) => e.preventDefault()} className="glass-strong rounded-2xl p-6 md:p-8 racing-border space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Name" placeholder="Your full name" required />
            <Field label="Email" type="email" placeholder="you@example.com" required />
            <Field label="Organization / College" placeholder="Acme University" />
            <Field label="Role" placeholder="Director, Faculty, Student…" />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Interest</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <label key={i} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="px-3 py-1.5 rounded-full text-sm border border-border bg-card/40 peer-checked:bg-gradient-primary peer-checked:text-primary-foreground peer-checked:border-transparent transition-all">{i}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Message</label>
            <textarea required rows={4} placeholder="Tell us a bit about what you're looking for…" className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
          </div>
          <button type="submit" className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform inline-flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</label>
      <input {...props} className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 font-display font-bold text-lg mb-4">
              <img src="/ith-logo.jpeg" alt="InnoTech-Hub logo" className="h-9 w-9 rounded-lg border border-primary/40 object-cover" />
              <span>InnoTech<span className="text-gradient-racing">-Hub</span></span>
            </a>
            <p className="text-sm text-muted-foreground max-w-md">
              Where Innovation Meets Community. Events bring students in. AI tools help them grow.
              SaaS products help institutions operate smarter.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["About", "/#about"],
                ["Events", "/events"],
                ["SaaS Products", "/pricing"],
                ["Roadmap", "/roadmap"],
                ["Team", "/team"],
              ].map(([label, href]) => (
                <li key={label}><a href={href} className="text-foreground/80 hover:text-primary transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#partners" className="text-foreground/80 hover:text-primary transition-colors">Partners</a></li>
              <li><a href="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/privacy-policy" className="text-foreground/80 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-foreground/80 hover:text-primary transition-colors">Terms</a></li>
              <li><a href="/rules" className="text-foreground/80 hover:text-primary transition-colors">Rules</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 InnoTech-Hub. All rights reserved.</div>
          <div className="font-mono uppercase tracking-widest">Where Innovation Meets Community</div>
        </div>
      </div>
    </footer>
  );
}

/* ======================= FINAL MESSAGE STRIP ======================= */
export function FinalMessage() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-racing opacity-10" />
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Building2 className="h-10 w-10 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Events bring students in.<br />
          AI tools help them <span className="text-gradient-racing">grow</span>.<br />
          SaaS helps institutions operate <span className="text-gradient-primary">smarter</span>.
        </h2>
        <p className="text-muted-foreground text-lg">
          InnoTech-Hub connects all three into one future-ready ecosystem.
        </p>
      </div>
    </section>
  );
}
