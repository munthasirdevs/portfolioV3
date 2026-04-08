import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Dashboard — Real-time Metrics",
  description:
    "Live performance metrics including Lighthouse scores, API response times, and uptime monitoring.",
};

export default function PerformancePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Performance Dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Real-time monitoring of site performance. This portfolio monitors
          itself.
        </p>
        <div className="mt-12">
          <p className="text-muted-foreground">
            Metrics dashboard coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}
