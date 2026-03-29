import { config } from "@/data/config";

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-8 px-6">
      <div className="absolute inset-0 -z-10 bg-background/90" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span className="font-mono">© {new Date().getFullYear()} {config.author}</span>
        <div className="flex items-center gap-4">
          <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href={config.social.gitlab} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitLab</a>
          <a href={`mailto:${config.email}`} className="hover:text-foreground transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
