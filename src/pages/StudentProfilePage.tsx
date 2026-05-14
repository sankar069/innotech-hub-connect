import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export function StudentProfilePage() {
  return (
    <ProtectedRoute allow="student">
      {(user) => (
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
                <h1 className="text-4xl md:text-5xl font-bold">Student Profile</h1>
                <p className="mt-3 text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}
