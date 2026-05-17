import { motion } from "framer-motion";
import type React from "react";
import { ExternalLink, FileText, Headphones, Video } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useCmsCollection } from "@/lib/cms";

export function MediaPostDetailPage({ categorySlug, postSlug }: { categorySlug: string; postSlug: string }) {
  const { activeItems: categories } = useCmsCollection("mediaCategories");
  const { activeItems: posts } = useCmsCollection("mediaPosts");
  const category = categories.find((item) => String(item.slug ?? item.id) === categorySlug);
  const post = posts.find((item) => String(item.category ?? "") === categorySlug && String(item.slug ?? item.id) === postSlug);
  const gallery = Array.isArray(post?.gallery) ? post.gallery.map(String) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {!post ? (
            <div className="glass-strong rounded-2xl p-6 racing-border">Media post not found.</div>
          ) : (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <section className="glass-strong rounded-2xl p-6 md:p-8 racing-border">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
                  <Video className="h-3.5 w-3.5" /> {String(category?.name ?? "Media")}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">{String(post.title ?? "")}</h1>
                <p className="mt-4 text-muted-foreground">{String(post.shortDescription ?? "")}</p>
                <p className="mt-4 text-xs text-muted-foreground">{String(post.date ?? "")}{post.author ? ` - ${String(post.author)}` : ""}{post.eventName ? ` - ${String(post.eventName)}` : ""}</p>
              </section>

              {post.thumbnail ? <img src={String(post.thumbnail)} alt={String(post.title)} className="aspect-video w-full rounded-2xl object-cover border border-border" /> : null}

              <section className="glass-strong rounded-2xl p-6 racing-border space-y-4">
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{String(post.content ?? post.fullDescription ?? "")}</p>
                {post.tags ? <div className="flex flex-wrap gap-2">{String(post.tags).split(",").map((tag) => <span key={tag.trim()} className="px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary">{tag.trim()}</span>)}</div> : null}
              </section>

              {gallery.length ? (
                <section className="grid md:grid-cols-3 gap-4">
                  {gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-square w-full rounded-xl object-cover border border-border" />)}
                </section>
              ) : null}

              {(post.videoFile || post.videoUrl || post.audioFile || post.audioUrl || post.externalLink) ? (
                <section className="glass-strong rounded-2xl p-6 racing-border grid md:grid-cols-2 gap-4">
                  {post.videoFile ? <video src={String(post.videoFile)} controls className="w-full rounded-xl border border-border" /> : null}
                  {post.videoUrl ? <MediaLink icon={<Video className="h-4 w-4" />} href={String(post.videoUrl)} label="Video URL" /> : null}
                  {post.audioFile ? <audio src={String(post.audioFile)} controls className="w-full" /> : null}
                  {post.audioUrl ? <MediaLink icon={<Headphones className="h-4 w-4" />} href={String(post.audioUrl)} label="Podcast / Audio URL" /> : null}
                  {post.externalLink ? <MediaLink icon={<ExternalLink className="h-4 w-4" />} href={String(post.externalLink)} label="External Link" /> : null}
                </section>
              ) : null}
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function MediaLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 text-sm font-semibold">
      {icon || <FileText className="h-4 w-4" />} {label}
    </a>
  );
}
