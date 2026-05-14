import { motion } from "framer-motion";
import { Award, Calendar, CreditCard, Settings, Sparkles, UserRound } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventById, getMyRegistrations, type EventRegistration } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";

const studentCards = [
  { title: "Registered Events", icon: Calendar },
  { title: "Upcoming Events", icon: Sparkles },
  { title: "Certificates", icon: Award },
  { title: "Payment Status", icon: CreditCard },
  { title: "Profile Completion", icon: UserRound },
  { title: "Recommended Events", icon: Sparkles },
];

export function StudentDashboardPage() {
  const { items } = useCmsCollection<EventRegistration>("eventRegistrations");

  return (
    <ProtectedRoute allow="student">
      {(user) => {
        const registrations = getMyRegistrations().filter((registration) => items.some((item) => item.id === registration.id));
        return (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="max-w-3xl mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                  <UserRound className="h-3.5 w-3.5" /> {user.name}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">Student Dashboard</h1>
                <p className="mt-4 text-muted-foreground text-base md:text-lg">
                  Your personal innovation passport for events, certificates, skills, and growth.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {studentCards.map((card, index) => (
                  <motion.a
                    key={card.title}
                    href={card.title === "Profile Completion" ? "/student/profile" : card.title === "Recommended Events" ? "/events" : card.title === "Settings" ? "/student/settings" : card.title.includes("Events") || card.title === "Payment Status" ? "/student/registrations" : "/student/dashboard"}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="glass-strong rounded-2xl p-6 racing-border hover:-translate-y-1 transition-transform"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                      <card.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">{card.title}</h2>
                  </motion.a>
                ))}
              </div>

              <div className="mt-8">
                <a href="/student/settings" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-accent/40 text-foreground font-semibold hover:bg-accent/10 transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </a>
              </div>

              <section className="mt-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">My Registered Events</h2>
                    <p className="text-sm text-muted-foreground mt-2">Registration, payment, certificates, and event updates appear here.</p>
                  </div>
                  <a href="/student/registrations" className="text-sm font-semibold text-primary hover:text-primary/80">View all registrations</a>
                </div>
                {registrations.length === 0 ? (
                  <div className="glass-strong rounded-2xl p-6 racing-border text-muted-foreground">No registered events yet.</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {registrations.slice(0, 4).map((registration) => {
                      const event = getEventById(registration.eventId);
                      return (
                        <a key={registration.id} href={`/events/${registration.eventSlug}`} className="glass-strong rounded-2xl p-5 racing-border hover:-translate-y-1 transition-transform">
                          <p className="text-xs uppercase tracking-widest font-mono text-primary">{event?.category ?? "Event"}</p>
                          <h3 className="text-xl font-bold mt-2">{event?.title ?? registration.eventSlug}</h3>
                          <p className="text-sm text-muted-foreground mt-2">{event?.dates?.eventStartDate ?? "Date to be announced"}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{registration.registrationStatus}</span>
                            <span className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{registration.paymentStatus}</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </main>
          <Footer />
        </div>
      );
      }}
    </ProtectedRoute>
  );
}
