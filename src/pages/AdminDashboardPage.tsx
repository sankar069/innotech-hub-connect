import { motion } from "framer-motion";
import { Award, BarChart3, Calendar, CreditCard, FileText, Globe2, Image, Map, Shield, Users } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const adminCards = [
  { title: "Website Content", icon: Globe2 },
  { title: "Events", icon: Calendar },
  { title: "Registrations", icon: Users },
  { title: "Payments", icon: CreditCard },
  { title: "Students", icon: Users },
  { title: "Certificates", icon: Award },
  { title: "Team", icon: Shield },
  { title: "Partners & Sponsors", icon: BarChart3 },
  { title: "Media & Outreach", icon: Image },
  { title: "Roadmap", icon: Map },
  { title: "Privacy & Terms", icon: FileText },
];

export function AdminDashboardPage() {
  return (
    <AdminLayout title="Admin Dashboard">
      {(user) => (
        <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="max-w-4xl mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                  <Shield className="h-3.5 w-3.5" /> {user.email}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">Admin Dashboard</h1>
                <p className="mt-4 text-muted-foreground text-base md:text-lg">
                  Manage InnoTech-Hub website content, events, users, partners, sponsors, media, and platform data.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {adminCards.map((card, index) => (
                  <motion.a
                    key={card.title}
                    href={card.title === "Roadmap" ? "/admin/roadmap" : card.title === "Website Content" ? "/admin/pages" : card.title === "Events" ? "/admin/events" : card.title === "Registrations" ? "/admin/events" : card.title === "Payments" ? "/admin/payments" : card.title === "Students" ? "/admin/students" : card.title === "Certificates" ? "/admin/certificates" : card.title === "Team" ? "/admin/team" : card.title === "Partners & Sponsors" ? "/admin/partners" : card.title === "Media & Outreach" ? "/admin/media" : "/admin/dashboard"}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-strong rounded-2xl p-6 racing-border hover:-translate-y-1 transition-transform"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                      <card.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">{card.title}</h2>
                  </motion.a>
                ))}
              </div>
        </>
      )}
    </AdminLayout>
  );
}
