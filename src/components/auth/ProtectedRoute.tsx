import { Component, useEffect, useState } from "react";
import type React from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAuthUser, type AuthRole, type AuthUser } from "@/lib/auth";

export function ProtectedRoute({
  allow,
  children,
}: {
  allow: AuthRole;
  children: (user: AuthUser) => React.ReactNode;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const current = getAuthUser();
    setUser(current);

    if (!current || current.role !== allow) {
      navigate({ to: "/auth", replace: true });
    }
  }, [allow, navigate]);

  if (!user || user.role !== allow) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="glass-strong rounded-2xl p-6 racing-border text-sm text-muted-foreground">
          Checking access...
        </div>
      </div>
    );
  }

  return (
    <SectionErrorBoundary dashboardPath={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}>
      <ProtectedContent render={() => children(user)} />
    </SectionErrorBoundary>
  );
}

function ProtectedContent({ render }: { render: () => React.ReactNode }) {
  return <>{render()}</>;
}

class SectionErrorBoundary extends Component<{ children: React.ReactNode; dashboardPath: string }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Protected section failed to render", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
          <div className="glass-strong rounded-2xl p-6 racing-border max-w-md">
            <h1 className="text-2xl font-bold">
              {this.props.dashboardPath.includes("admin") ? "Admin Panel Error" : "Student Portal Error"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">This section failed to render safely. Your session is active, but this specific module encountered an issue.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => this.setState({ hasError: false })} className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Try again
              </button>
              <a href={this.props.dashboardPath} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
                Back to dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
