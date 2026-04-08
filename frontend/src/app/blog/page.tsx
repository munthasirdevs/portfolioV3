import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Technical Writing & Engineering Insights",
  description:
    "Deep technical articles on system design, performance optimization, and engineering best practices.",
};

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Blog
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Technical deep-dives, lessons learned, and engineering insights from
          building real products.
        </p>
        <div className="mt-12 space-y-6">
          {/* Placeholder for blog posts */}
          <p className="text-muted-foreground">Blog posts coming soon...</p>
        </div>
      </div>
    </main>
  );
}
