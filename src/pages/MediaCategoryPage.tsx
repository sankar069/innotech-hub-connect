import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useCmsCollection } from "@/lib/cms";

export function MediaCategoryPage({ slug }: { slug: string }) {
  const { activeItems: categories } = useCmsCollection("mediaCategories");
  const { activeItems: posts } = useCmsCollection("mediaPosts");
  const category = categories.find((item) => String(item.slug ?? item.id) === slug);
  const categoryPosts = posts.filter((post) => String(post.category ?? "") === slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Video className="h-3.5 w-3.5" /> Media
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">{String(category?.name ?? "Media")}</h1>
            <p className="mt-4 text-muted-foreground">{String(category?.shortDescription ?? "Building presence through events, stories, podcasts, workshops, and collaborations.")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryPosts.length === 0 && <div className="glass rounded-2xl p-6 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">No items added yet</div>}
            {categoryPosts.map((post, index) => (
              <motion.a key={post.id} href={String(post.externalLink ?? "#")} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-strong rounded-2xl p-6 racing-border">
                {post.thumbnail ? <img src={String(post.thumbnail)} alt={String(post.title)} className="aspect-video w-full rounded-xl object-cover border border-border mb-4" /> : <Video className="h-8 w-8 text-primary mb-4" />}
                <h2 className="text-xl font-bold">{String(post.title ?? "")}</h2>
                <p className="text-sm text-muted-foreground mt-3">{String(post.shortDescription ?? "")}</p>
                <p className="text-xs text-muted-foreground mt-4">{String(post.date ?? "")} {post.author ? `· ${String(post.author)}` : ""}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
