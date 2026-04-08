import type { Metadata } from "next";
import { HeroSection } from "@components/layout/HeroSection";
import { LiveMetrics } from "@components/layout/LiveMetrics";
import { TechStackVisualization } from "@components/layout/TechStackVisualization";
import { ProjectShowcase } from "@components/layout/ProjectShowcase";
import { ContactCTA } from "@components/layout/ContactCTA";

export const metadata: Metadata = {
  title: "Home — Software Engineer & Product Builder",
  description:
    "Building and scaling real products. Try my live SaaS tools, read system design case studies, and see real-time performance metrics.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <LiveMetrics />
      <TechStackVisualization />
      <ProjectShowcase />
      <ContactCTA />
    </main>
  );
}
