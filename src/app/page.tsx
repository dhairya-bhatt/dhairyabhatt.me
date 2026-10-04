import { Header } from "@/components/nav/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-canvas">
      {/* Fixed Pokéball Navigation Header */}
      <Header />

      {/* Main Single-Scroll Experience */}
      <main>
        {/* 1. Landing Hero: Grainy Name + Figma Typography */}
        <HeroSection />

        {/* 2. About Me: Marquee + Bio + Portrait + Scattered Photos */}
        <AboutSection />

        {/* 3. Featured Projects Showcase */}
        <ProjectsSection />
      </main>

      {/* 4. Footer & Easter Eggs */}
      <Footer />
    </div>
  );
}
