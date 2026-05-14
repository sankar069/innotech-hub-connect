import { useEffect, useState } from "react";
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

  return <>{children(user)}</>;
}
