"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="border-t border-border/40 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/50 p-8 text-center backdrop-blur sm:p-12"
        >
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s Build Something Great
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you&apos;re looking for an engineer who ships, a collaborator
            who thinks in systems, or someone who can own a product
            end-to-end — let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:hello@munthasir.dev"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-colors"
            >
              hello@munthasir.dev
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
