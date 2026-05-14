import { motion } from "framer-motion";

type MilestoneCardProps = {
  quarter: string;
  title: string;
  status: string;
  index?: number;
};

const statusClass: Record<string, string> = {
  Completed: "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  Upcoming: "bg-secondary text-muted-foreground border-border",
};

export function MilestoneCard({ quarter, title, status, index = 0 }: MilestoneCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.42, delay: index * 0.06, ease: "easeOut" }}
      className="relative rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="absolute -left-2 top-7 h-4 w-4 rounded-full border-4 border-background bg-primary hidden md:block" />
      <div className="text-xs font-mono uppercase tracking-widest text-primary">{quarter}</div>
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      <span className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${statusClass[status] ?? "bg-secondary text-muted-foreground border-border"}`}>
        {status}
      </span>
    </motion.article>
  );
}
