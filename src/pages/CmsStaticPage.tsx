import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useCmsCollection } from "@/lib/cms";

export function CmsStaticPage({ slug }: { slug: string }) {
  const { activeItems: pages } = useCmsCollection("pages");
  const page = pages.find((item) => String(item.slug ?? item.id) === slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Last updated: {String(page?.lastUpdated ?? "")}</div>
            <h1 className="text-4xl md:text-6xl font-bold">{String(page?.title ?? "Page")}</h1>
            <div className="mt-8 space-y-4 text-muted-foreground">
              {String(page?.content ?? "No content added yet").split("\n").filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
