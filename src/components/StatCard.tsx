import { motion } from "framer-motion";

type StatCardProps = {
  value: string;
  title: string;
  description: string;
  index?: number;
};

export function StatCard({ value, title, description, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="glass-strong rounded-2xl p-5 racing-border"
    >
      <div className="text-3xl md:text-4xl font-display font-bold text-gradient-primary">
        {value}
      </div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
