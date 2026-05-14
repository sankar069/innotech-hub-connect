import { useEffect, useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { getAuthUser, getDashboardPath, logout, type AuthUser } from "@/lib/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Events", href: "/events" },
  { label: "SaaS", href: "/pricing" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Team", href: "/team" },
  { label: "Partners", href: "/#partners" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("innotech-auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("innotech-auth-change", syncUser);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/95 border-b border-border shadow-card py-3 backdrop-blur-md" : "bg-card/80 border-b border-border/70 py-5 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-display font-bold text-lg group">
          <img src="/ith-logo.jpeg" alt="InnoTech-Hub logo" className="h-9 w-9 rounded-lg border border-border object-cover shadow-card" />
          <span className="text-foreground">
            InnoTech<span className="text-gradient-racing">-Hub</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((it) => (
            <a
              key={it.label}
              href={it.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {it.label}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
          {user ? (
            <a
              href={getDashboardPath(user)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ) : (
            <a
              href="/auth"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Login / Sign Up
              <span className="absolute bottom-1 left-3 right-3 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-border text-foreground hover:border-primary/40 transition-colors"
            >
              Logout
            </button>
          )}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground hover:bg-[#a93a25] transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Let's Talk
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-card border border-border shadow-card mt-3 mx-4 rounded-xl p-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navItems.map((it) => (
              <a
                key={it.label}
                href={it.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg"
              >
                {it.label}
              </a>
            ))}
            {user ? (
              <>
                <a
                  href={getDashboardPath(user)}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg"
                >
                  {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/auth"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg"
              >
                Login / Sign Up
              </a>
            )}
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 text-center text-sm font-semibold px-4 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Let's Talk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
