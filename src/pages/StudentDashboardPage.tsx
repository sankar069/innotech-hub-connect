import { motion } from "framer-motion";
import { Award, Calendar, CreditCard, Settings, Sparkles, UserRound } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getEventById, getMyRegistrations, getPublicEvents, type EventRegistration } from "@/lib/events";
import { useCmsCollection } from "@/lib/cms";
import { getCurrentStudentProfile, getMyCertificates, getMyNotifications, getStudentStats } from "@/lib/studentPlatform";

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
        const profile = getCurrentStudentProfile();
        const stats = getStudentStats(user.email);
        const certificates = getMyCertificates(user.email);
        const notifications = getMyNotifications(user.email);
        const recommended = getPublicEvents().slice(0, 3);
        const overview = [
          ["Registered Events", stats.registered],
          ["Upcoming Events", stats.upcoming],
          ["Completed Events", stats.completed],
          ["Certificates Earned", stats.certificates],
          ["Payments Pending", stats.paymentsPending],
          ["Achievements", stats.achievements],
          ["Skills Added", stats.skillsAdded],
          ["Profile Completion", `${stats.profileCompletion}%`],
        ];
        const growth = [
          ["Event Participation", Math.min(100, stats.registered * 20)],
          ["Practical Submission", Math.min(100, stats.completed * 25)],
          ["Team Collaboration", Math.min(100, registrations.filter((item) => item.teamDetails?.teamName).length * 35)],
          ["Certificate Completion", Math.min(100, certificates.length * 30)],
          ["Career Readiness", Math.min(100, Math.round((stats.profileCompletion + stats.achievements * 10) / 2))],
        ];
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
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/events" className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore Events</a>
                  <a href="/student/registrations" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">My Registrations</a>
                  <a href="/student/profile" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Edit Profile</a>
                  <a href="/student/certificates" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Certificates</a>
                </div>
                <div className="mt-6 max-w-sm">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2"><span>Profile Completion</span><span>{profile?.profileCompletion ?? 0}%</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${profile?.profileCompletion ?? 0}%` }} /></div>
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {overview.map(([label, value], index) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="glass-strong rounded-2xl p-5 racing-border">
                    <p className="text-xs uppercase tracking-widest font-mono text-muted-foreground">{label}</p>
                    <div className="text-3xl font-bold mt-2">{value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {studentCards.map((card, index) => (
                  <motion.a
                    key={card.title}
                    href={card.title === "Profile Completion" ? "/student/profile" : card.title === "Recommended Events" ? "/events" : card.title === "Certificates" ? "/student/certificates" : card.title.includes("Events") || card.title === "Payment Status" ? "/student/registrations" : "/student/dashboard"}
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

              <div className="grid lg:grid-cols-2 gap-6 mt-12">
                <section className="glass-strong rounded-2xl p-6 racing-border">
                  <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {registrations[0] ? <Activity text={`Recently registered for ${getEventById(registrations[0].eventId)?.title ?? registrations[0].eventSlug}`} /> : null}
                    {registrations.find((item) => item.paymentStatus !== "Not Required") ? <Activity text={`Payment status: ${registrations.find((item) => item.paymentStatus !== "Not Required")?.paymentStatus}`} /> : null}
                    {certificates[0] ? <Activity text={`Certificate issued: ${certificates[0].eventTitle}`} /> : null}
                    {recommended[0] ? <Activity text={`Upcoming event reminder: ${recommended[0].title}`} /> : null}
                    {notifications[0] ? <Activity text={notifications[0].title} /> : null}
                    {!registrations.length && !notifications.length ? <p className="text-sm text-muted-foreground">No recent activity yet.</p> : null}
                  </div>
                </section>

                <section className="glass-strong rounded-2xl p-6 racing-border">
                  <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
                  <div className="space-y-3">
                    {recommended.map((event) => (
                      <a key={event.id} href={`/events/${event.slug}`} className="block rounded-xl border border-border p-4 hover:border-primary/50 transition-colors">
                        <div className="text-sm font-semibold">{event.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{event.category} · {event.dates?.eventStartDate}</div>
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <section className="glass-strong rounded-2xl p-6 racing-border mt-6">
                <h2 className="text-2xl font-bold mb-5">Growth Analytics</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {growth.map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-border bg-background/40 p-4">
                      <div className="flex justify-between text-sm mb-2"><span>{label}</span><span>{value}%</span></div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
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

function Activity({ text }: { text: string }) {
  return <div className="rounded-xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">{text}</div>;
}
