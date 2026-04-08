"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 backdrop-blur"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">
            Available for new opportunities
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          I build{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            real products
          </span>
          <br />
          not just portfolios.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Software engineer with expertise in system design, full-stack
          development, and shipping production-ready products. Try my live
          tools below — they&apos;re real, working systems.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Try My Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Code2 className="h-4 w-4" />
            System Design
          </Link>
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Terminal className="h-4 w-4" />
            API Docs
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to explore</span>
          <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-muted-foreground/60"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
