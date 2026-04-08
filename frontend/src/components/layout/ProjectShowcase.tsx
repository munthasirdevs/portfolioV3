"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "URL Shortener + Analytics",
    description:
      "Production-grade URL shortening service with real-time analytics, QR codes, and rate limiting.",
    status: "live" as const,
    tags: ["Laravel", "PostgreSQL", "Redis", "Chart.js"],
    href: "/tools/url-shortener",
    github: "#",
  },
  {
    title: "Code Playground",
    description:
      "Multi-language code execution environment with live preview, save/share, and template gallery.",
    status: "live" as const,
    tags: ["Next.js", "WebAssembly", "Pyodide", "Monaco"],
    href: "/tools/code-playground",
    github: "#",
  },
  {
    title: "Markdown Blog Engine",
    description:
      "Full-featured blog with live preview, SEO optimization, and content management via Laravel Filament.",
    status: "live" as const,
    tags: ["Next.js", "MDX", "Laravel", "Filament"],
    href: "/blog",
    github: "#",
  },
];

export function ProjectShowcase() {
  return (
    <section className="border-t border-border/40 py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Featured Projects
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Working, production-ready applications — not screenshots. Click
              through to interact with each system.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/50"
            >
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-sm text-success">Live</span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6 flex items-center gap-4">
                <Link
                  href={project.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Try it live
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={project.github}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Source
                  <Github className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
