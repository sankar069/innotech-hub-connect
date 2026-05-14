import { motion } from "framer-motion";
import { Check } from "lucide-react";

type RoadmapPhaseCardProps = {
  id: string;
  title: string;
  status: string;
  progress: number;
  items: string[];
  index?: number;
};

const badgeClass: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  Planning: "bg-accent/10 text-accent border-accent/20",
  Research: "bg-secondary text-muted-foreground border-border",
  Vision: "bg-muted text-muted-foreground border-border",
};

export function RoadmapPhaseCard({
  id,
  title,
  status,
  progress,
  items,
  index = 0,
}: RoadmapPhaseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.48, delay: Math.min(index * 0.04, 0.2), ease: "easeOut" }}
      className="glass-strong rounded-2xl p-6 racing-border"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
            {id}
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest ${badgeClass[status] ?? "bg-muted text-muted-foreground border-border"}`}
            >
              {status}
            </motion.span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-primary">{progress}%</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Progress
          </div>
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-primary"
        />
      </div>

      <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
        {items.map((item, itemIndex) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.32, delay: 0.12 + itemIndex * 0.035 }}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.article>
  );
}
