import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Design — Interactive Case Studies",
  description:
    "Deep-dive into real system architectures with interactive diagrams, trade-off analysis, and performance metrics.",
};

export default function CaseStudiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          System Design Case Studies
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Interactive architecture diagrams with real metrics. Not blog posts
          — actual systems I&apos;ve designed, built, and measured.
        </p>
        <div className="mt-12 space-y-8">
          {/* Placeholder for case studies */}
          <div className="rounded-lg border border-border bg-card p-8">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Case Study
            </span>
            <h2 className="mt-4 text-2xl font-bold">
              URL Shortener — Scaling to 10M+ Requests
            </h2>
            <p className="mt-2 text-muted-foreground">
              Architecture decisions, trade-offs, and live performance data
              from a production URL shortening service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
