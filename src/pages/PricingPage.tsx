import { Navbar } from "@/components/site/Navbar";
import { BusinessAndTraction, Footer, SaasProducts } from "@/components/site/Sections";

export function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <SaasProducts />
        <BusinessAndTraction />
      </main>
      <Footer />
    </div>
  );
}
