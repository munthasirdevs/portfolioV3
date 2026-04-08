"use client";

import { motion } from "framer-motion";

const technologies = [
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Laravel", category: "Backend" },
  { name: "PHP 8.3", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Cache" },
  { name: "Docker", category: "DevOps" },
  { name: "GitHub Actions", category: "CI/CD" },
  { name: "pgvector", category: "AI/ML" },
  { name: "OpenAI API", category: "AI/ML" },
];

export function TechStackVisualization() {
  return (
    <section className="border-t border-border/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Technology Stack
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Modern, battle-tested tools chosen for performance, developer
            experience, and production reliability.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-lg border border-border/60 bg-card/50 px-4 py-3 backdrop-blur transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{tech.name}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {tech.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
