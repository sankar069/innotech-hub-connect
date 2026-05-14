import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAuthUser, getDashboardPath } from "@/lib/auth";

export function EventPlatformPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: getDashboardPath(getAuthUser()), replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-6 racing-border text-sm text-muted-foreground">
        Opening Event Platform...
      </div>
    </div>
  );
}
