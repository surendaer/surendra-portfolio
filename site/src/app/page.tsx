import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/hero";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

// Animated SVG background — pure visual, no SSR value, load after HTML paint.
const KeyboardBackground = dynamic(
  () => import("@/components/pipeline/pipeline-background"),
  { ssr: false }
);
// Hover tooltip — depends on KeyboardBackground signal bus, client-only.
const SkillTooltip = dynamic(
  () => import("@/components/pipeline/skill-tooltip"),
  { ssr: false }
);

// Below-fold sections: code-split so the initial JS bundle stays lean.
// Static HTML is still pre-rendered at build time; only the JS chunk is deferred.
const SkillsSection  = dynamic(() => import("@/components/sections/skills"));
const WorkSection    = dynamic(() => import("@/components/sections/work"));
const ProjectsSection = dynamic(() => import("@/components/sections/projects"));
const NewsSection    = dynamic(() => import("@/components/sections/news"));
const ContactSection = dynamic(() => import("@/components/sections/contact"));

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
