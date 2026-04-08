import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Engineering Philosophy & Background",
  description:
    "My approach to building software, core engineering principles, and the story behind my work.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          About Me
        </h1>
        <div className="mt-8 max-w-3xl space-y-6 text-lg text-muted-foreground">
          <p>
            I&apos;m a software engineer who believes in building complete products
            — not just writing code. Every project I touch is designed to ship,
            scale, and solve real problems.
          </p>
          <p>
            This portfolio isn&apos;t a collection of screenshots and descriptions.
            It&apos;s a living system of working products, architecture diagrams,
            and real-time metrics that prove engineering depth.
          </p>
        </div>
      </div>
    </main>
  );
}
