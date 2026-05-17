import { motion } from "framer-motion";
import type React from "react";
import { Link as LinkIcon, Users } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Sections";
import { useCmsCollection } from "@/lib/cms";

export function TeamCategoryPage({ slug }: { slug: string }) {
  const { activeItems: categories } = useCmsCollection("teamCategories");
  const { activeItems: members } = useCmsCollection("teamMembers");
  const category = categories.find((item) => String(item.slug ?? item.id) === slug);
  const categoryMembers = members.filter((member) => String(member.category ?? "") === slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Users className="h-3.5 w-3.5" /> Team
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">{String(category?.name ?? "Team")}</h1>
            <p className="mt-4 text-muted-foreground">{String(category?.shortDescription ?? "Driven contributors building, shipping, and scaling InnoTech-Hub every day.")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryMembers.length === 0 && <div className="glass rounded-2xl p-6 text-sm text-muted-foreground md:col-span-2 lg:col-span-3">No items added yet</div>}
            {categoryMembers.map((member, index) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-strong rounded-2xl p-6 racing-border">
                {member.profileImage ? <img src={String(member.profileImage)} alt={String(member.name)} className="aspect-[4/5] w-full rounded-xl object-cover border border-border mb-4" /> : <div className="aspect-[4/5] w-full rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4"><Users className="h-10 w-10 text-primary-foreground" /></div>}
                <h2 className="text-xl font-bold">{String(member.name ?? "")}</h2>
                <p className="text-sm text-primary mt-1">{String(member.role ?? "")}</p>
                <p className="text-sm text-muted-foreground mt-3">{String(member.bio ?? "")}</p>
                {member.message ? <blockquote className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">"{String(member.message)}"<br /><span className="text-primary">- {String(member.name ?? "")}, {String(member.role ?? "")}</span></blockquote> : null}
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.linkedinUrl ? <Social href={String(member.linkedinUrl)} label="LinkedIn" icon={<LinkIcon className="h-4 w-4" />} /> : null}
                  {member.githubUrl ? <Social href={String(member.githubUrl)} label="GitHub" icon={<LinkIcon className="h-4 w-4" />} /> : null}
                  {member.portfolioUrl ? <Social href={String(member.portfolioUrl)} label="Portfolio" icon={<LinkIcon className="h-4 w-4" />} /> : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Social({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-primary">{icon}{label}</a>;
}
