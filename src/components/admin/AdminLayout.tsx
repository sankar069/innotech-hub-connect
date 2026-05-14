import { useState } from "react";
import type React from "react";
import { Menu, X } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { logout, type AuthUser } from "@/lib/auth";

const navItems = [
  ["Overview", "/admin/dashboard"],
  ["Website Stats / Traction", "/admin/traction"],
  ["Events CMS", "/admin/events"],
  ["Payment Verification", "/admin/payments"],
  ["Roadmap", "/admin/roadmap"],
  ["Team", "/admin/team"],
  ["Partners", "/admin/partners"],
  ["Sponsors", "/admin/sponsors"],
  ["Media & Outreach", "/admin/media"],
  ["Pages", "/admin/pages"],
  ["Contact Leads", "/admin/contact-leads"],
  ["Settings", "/admin/settings"],
];

export function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: (user: AuthUser) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <ProtectedRoute allow="admin">
      {(user) => (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button onClick={() => setOpen((current) => !current)} className="p-2 rounded-lg border border-border">
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

              <div className="grid lg:grid-cols-[260px_1fr] gap-6">
                <aside className={`${open ? "block" : "hidden"} lg:block glass-strong rounded-2xl p-4 racing-border h-fit lg:sticky lg:top-28`}>
                  <div className="px-3 py-3 mb-3">
                    <div className="font-display font-bold text-xl">Admin</div>
                    <div className="text-xs text-muted-foreground mt-1">Super Admin</div>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map(([label, href]) => (
                      <a key={href} href={href} className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors">
                        {label}
                      </a>
                    ))}
                    <button onClick={doLogout} className="w-full text-left rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors">
                      Logout
                    </button>
                  </nav>
                </aside>

                <section>
                  <div className="hidden lg:flex items-center justify-between gap-4 mb-6 glass rounded-2xl p-4">
                    <div>
                      <h1 className="text-3xl font-bold">{title}</h1>
                      <div className="text-sm text-muted-foreground">{user.name} · Super Admin</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a href="/" className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:border-primary/40 transition-colors">
                        Website Preview
                      </a>
                      <a href="/admin/settings" className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">
                        Quick Actions
                      </a>
                    </div>
                  </div>
                  {children(user)}
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}
