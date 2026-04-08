import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Live Portfolio & Working Demos",
  description:
    "Browse my portfolio of live, working projects and SaaS tools. Every project has real-time status indicators and interactive demos.",
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every project listed is live and interactive. Click through to
          experience working SaaS tools, not just screenshots.
        </p>
        {/* Project grid will be populated with data from backend API */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards — will be replaced with real data */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Project {i + 1}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Description coming soon...
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
