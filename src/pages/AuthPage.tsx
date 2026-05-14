import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { ArrowRight, EyeOff, Globe2, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { getAuthUser, getDashboardPath, signIn, signUp } from "@/lib/auth";

type AuthTab = "login" | "signup";

export function AuthPage({ initialTab = "login" }: { initialTab?: AuthTab }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    role: "",
    phone: "",
  });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      navigate({ to: getDashboardPath(user), replace: true });
    }
  }, [navigate]);

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = signIn(loginForm.email, loginForm.password);
      navigate({ to: getDashboardPath(user), replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    }
  };

  const submitSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = signUp(signupForm);
      navigate({ to: getDashboardPath(user), replace: true });
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Unable to create account");
    }
  };

  const googlePlaceholder = () => {
    setError("Google sign-in is ready for OAuth setup. Please use email and password for now.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-hero">
        <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative max-w-xl mx-auto px-4 sm:px-6"
        >
          <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border shadow-card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                <Lock className="h-3.5 w-3.5" /> InnoTech-Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Welcome</h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Sign in to your account or create a new one
              </p>
            </div>

            <button
              type="button"
              onClick={googlePlaceholder}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              <Globe2 className="h-4 w-4" /> Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase font-mono tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 rounded-xl border border-border bg-card/50 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "login" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  setError("");
                }}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === "signup" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign Up
              </button>
            </div>

            {error && <p className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

            {tab === "login" ? (
              <form onSubmit={submitLogin} className="space-y-4">
                <AuthField
                  label="Email"
                  type="email"
                  placeholder="innotechhub@gmail.com"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
                <AuthField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  icon={<EyeOff className="h-4 w-4" />}
                  required
                />
                <div className="flex items-center justify-between gap-3 text-sm">
                  <a href="/login" className="text-primary hover:underline">Forgot password?</a>
                  <button type="button" onClick={() => setTab("signup")} className="text-muted-foreground hover:text-primary">
                    New here? Sign Up
                  </button>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-[#a93a25] transition-colors">
                  Sign In <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={submitSignup} className="space-y-4">
                <AuthField label="Full Name" placeholder="Your full name" value={signupForm.name} onChange={(event) => setSignupForm((current) => ({ ...current, name: event.target.value }))} icon={<User className="h-4 w-4" />} required />
                <AuthField label="Email" type="email" placeholder="innotechhub@gmail.com" value={signupForm.email} onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))} icon={<Mail className="h-4 w-4" />} required />
                <div className="grid md:grid-cols-2 gap-4">
                  <AuthField label="Password" type="password" placeholder="Enter your password" value={signupForm.password} onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))} required />
                  <AuthField label="Confirm Password" type="password" placeholder="Confirm password" value={signupForm.confirmPassword} onChange={(event) => setSignupForm((current) => ({ ...current, confirmPassword: event.target.value }))} required />
                </div>
                <AuthField label="College / Organization" placeholder="Acme University" value={signupForm.college} onChange={(event) => setSignupForm((current) => ({ ...current, college: event.target.value }))} required />
                <div className="grid md:grid-cols-2 gap-4">
                  <AuthField label="Role" placeholder="Student, Faculty..." value={signupForm.role} onChange={(event) => setSignupForm((current) => ({ ...current, role: event.target.value }))} required />
                  <AuthField label="Phone Number" type="tel" placeholder="+91 98765 43210" value={signupForm.phone} onChange={(event) => setSignupForm((current) => ({ ...current, phone: event.target.value }))} required />
                </div>
                <div className="flex justify-end text-sm">
                  <button type="button" onClick={() => setTab("login")} className="text-muted-foreground hover:text-primary">
                    Already have an account? Login
                  </button>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-[#a93a25] transition-colors">
                  Create Account <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function AuthField({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          {...props}
          className={`w-full bg-background/60 border border-border rounded-xl py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${icon ? "pl-11 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}
