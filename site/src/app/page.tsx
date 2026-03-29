import HeroSection from "@/components/sections/hero";
import WorkSection from "@/components/sections/work";
import ProjectsSection from "@/components/sections/projects";
import SkillsSection from "@/components/sections/skills";
import NewsSection from "@/components/sections/news";
import ContactSection from "@/components/sections/contact";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import KeyboardBackground from "@/components/keyboard/keyboard-background";
import SkillTooltip from "@/components/keyboard/skill-tooltip";

// Spacer — sections are now transparent so this is pure breathing room.
// No gradients needed: the pipeline shows through everywhere between cards.
function Gap({ size = "h-16" }: { size?: string }) {
  return <div className={`${size} pointer-events-none`} aria-hidden />;
}

export default function Home() {
  return (
    <>
      <KeyboardBackground />
      <SkillTooltip />

      {/* Page vignette: pushes pipeline to edges, focuses eye on center content */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 30%, rgba(2,6,23,0.55) 100%)",
        }}
        aria-hidden
      />

      <main className="canvas-overlay-mode dark:bg-transparent bg-white/80 relative z-10 min-h-screen">
        <Nav />
        <HeroSection />
        <Gap size="h-24" />
        <SkillsSection />
        <Gap />
        <WorkSection />
        <Gap />
        <ProjectsSection />
        <Gap size="h-12" />
        <NewsSection />
        <Gap size="h-12" />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
