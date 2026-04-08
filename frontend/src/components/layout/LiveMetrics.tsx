"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Server, Zap } from "lucide-react";

const metrics = [
  {
    icon: Server,
    label: "API Uptime",
    value: "99.9",
    suffix: "%",
    color: "text-success",
  },
  {
    icon: Zap,
    label: "Avg Response Time",
    value: "< 50",
    suffix: "ms",
    color: "text-primary",
  },
  {
    icon: Activity,
    label: "Projects Shipped",
    value: "12",
    suffix: "+",
    color: "text-accent",
  },
  {
    icon: Clock,
    label: "Last Deployment",
    value: "2h",
    suffix: " ago",
    color: "text-info",
  },
];

export function LiveMetrics() {
  return (
    <section className="border-t border-border/40 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <span className="text-sm text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric.suffix}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
