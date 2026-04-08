import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation — RESTful API Reference",
  description:
    "Complete API reference for the Developer Portfolio backend. Explore endpoints, authentication, and rate limits.",
};

export default function ApiDocsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          API Documentation
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Full RESTful API with documented endpoints, authentication, and rate
          limits. Try it live.
        </p>
        <div className="mt-12">
          <p className="text-muted-foreground">
            Interactive API documentation coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}
