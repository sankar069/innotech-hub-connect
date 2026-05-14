import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export function StudentSettingsPage() {
  return (
    <ProtectedRoute allow="student">
      {() => (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
                <h1 className="text-4xl md:text-5xl font-bold">Student Settings</h1>
                <p className="mt-3 text-muted-foreground">Manage your Event Platform account preferences.</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}
