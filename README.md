# Surendra Kumar AR — Portfolio

Personal portfolio and case-study site for a Lead Platform / GenAI-ML Infrastructure Engineer.  
Deployed via GitLab Pages at the `main` branch.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS |
| Animation | GSAP ScrollTrigger · Framer Motion · custom SVG pipeline diagram |
| Data | Python 3 · Jinja2 templates · JSON data files |
| News feed | `scraper.py` — RSS aggregator, runs in CI `prepare` stage |
| CI/CD | GitLab CI (`.gitlab-ci.yml`) — scrape → build → pages |

---

## Project Structure

```
surendra-portfolio/
├── site/                   # Next.js app (primary frontend)
│   ├── src/
│   │   ├── app/            # Next.js App Router (layout, page, globals.css)
│   │   ├── components/
│   │   │   ├── keyboard/   # Interactive SVG pipeline background
│   │   │   ├── layout/     # Nav, Footer
│   │   │   └── sections/   # Hero, Skills, Work, Projects, Contact, News
│   │   ├── data/           # Static data (config, constants, skills, work, projects)
│   │   ├── hooks/          # Custom React hooks (reserved)
│   │   ├── lib/            # Shared utilities (reserved)
│   │   └── types/          # TypeScript type definitions (reserved)
│   └── public/
│       └── assets/
│           ├── icons/      # SVG tool icons (kebab-case, no dimensions in filename)
│           └── keycap-sounds/
├── data/                   # Source JSON for Python templates
├── templates/              # Jinja2 HTML templates
├── content/                # Markdown content (blog reserved)
├── build.py                # Python static site builder
├── scraper.py              # RSS news feed scraper
├── requirements.txt        # Python dependencies
└── .gitlab-ci.yml          # CI pipeline: prepare → build → pages
```

---

## Local Development

### Next.js frontend
```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → site/out/
```

### Python templates (legacy)
```bash
pip install -r requirements.txt
python build.py    # outputs to public/
```

---

## CI Pipeline

```
scrape-news  →  build-site  →  pages
```

- **scrape-news**: runs `scraper.py`, produces `site/public/data/news.json` (artifact, 25h TTL)
- **build-site**: `npm ci && npm run build`, renames `site/out/` → `public/`
- **pages**: deploys `public/` to GitLab Pages

Triggers: `main` branch push · scheduled · manual web trigger.

---

## Naming Conventions

| Asset | Convention | Example |
|---|---|---|
| SVG icons | `kebab-case.svg` | `new-relic.svg`, `sonarqube.svg` |
| React components | `PascalCase` (function), `kebab-case` (file) | `KeyboardBackground` / `keyboard-background.tsx` |
| Next.js data files | `camelCase.ts` | `config.ts`, `constants.ts` |
| Python scripts | `snake_case.py` | `build.py`, `scraper.py` |
| JSON data | `snake_case.json` | `case_studies.json`, `resume.json` |
| URL slugs | `kebab-case` | `/case-studies/rto-4-hours-to-7-minutes` |
