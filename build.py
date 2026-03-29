#!/usr/bin/env python3
"""
build.py — TechPulse portfolio generator.
Scrapes RSS feeds, loads static data, renders all pages via Jinja2, writes to public/.
Run locally:  python build.py
CI:           python build.py  (same command, no flags needed)
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import feedparser
import markdown
import requests
from dateutil import parser as dateutil_parser
from jinja2 import Environment, FileSystemLoader, select_autoescape

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).parent
TEMPLATES_DIR = ROOT / "templates"
DATA_DIR = ROOT / "data"
STATIC_DIR = ROOT / "static"
CONTENT_DIR = ROOT / "content" / "blog"
PUBLIC_DIR = ROOT / "public"

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
INCLUDE_KEYWORDS: list[str] = [
    "kubernetes", "k8s", "devops", "platform", "sre", "cloud",
    "aws", "terraform", "ci/cd", "docker", "helm", "gitops",
    "python", "engineer", "infrastructure", "observability",
    "ai", "llm", "genai", "openai", "anthropic",
]
MAX_ARTICLES = 20


# ---------------------------------------------------------------------------
# Jinja2 setup
# ---------------------------------------------------------------------------
def make_env() -> Environment:
    return Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html"]),
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def strip_html(text: str) -> str:
    """Remove HTML tags and collapse whitespace."""
    clean = re.sub(r"<[^>]+>", " ", text or "")
    return re.sub(r"\s+", " ", clean).strip()


def relative_time(dt: datetime) -> str:
    """Return a human-readable relative time string."""
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta = now - dt
    if delta.days >= 7:
        return dt.strftime("%b %d, %Y")
    if delta.days >= 2:
        return f"{delta.days} days ago"
    if delta.days == 1:
        return "yesterday"
    hours = delta.seconds // 3600
    if hours >= 2:
        return f"{hours} hours ago"
    if hours == 1:
        return "1 hour ago"
    minutes = delta.seconds // 60
    return f"{minutes} minutes ago" if minutes > 1 else "just now"


def parse_date(entry: Any) -> datetime:
    """Extract and parse the published date from a feed entry."""
    for attr in ("published", "updated", "created"):
        raw = getattr(entry, attr, None)
        if raw:
            try:
                return dateutil_parser.parse(raw)
            except Exception:
                pass
    return datetime.now(timezone.utc)


def keyword_match(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in INCLUDE_KEYWORDS)


def write_page(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  wrote  {path.relative_to(ROOT)}")


# ---------------------------------------------------------------------------
# Data loaders
# ---------------------------------------------------------------------------
def load_json(filename: str) -> Any:
    return json.loads((DATA_DIR / filename).read_text(encoding="utf-8"))


def scrape_articles() -> list[dict]:
    sources: list[dict] = load_json("sources.json")
    seen_urls: set[str] = set()
    articles: list[dict] = []

    for source in sources:
        try:
            response = requests.get(source["url"], timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
            feed = feedparser.parse(response.content)
            for entry in feed.entries[:5]:
                url = entry.get("link", "")
                if not url or url in seen_urls:
                    continue
                title = strip_html(entry.get("title", ""))
                summary = strip_html(entry.get("summary", entry.get("description", "")))
                summary = summary[:200] + "…" if len(summary) > 200 else summary
                if not keyword_match(title + " " + summary):
                    continue
                seen_urls.add(url)
                articles.append({
                    "title": title,
                    "link": url,
                    "summary": summary,
                    "source_name": source["name"],
                    "tags": source["tags"],
                    "published_dt": parse_date(entry),
                })
        except Exception as exc:
            print(f"  [warn] failed to fetch {source['url']}: {exc}", file=sys.stderr)

    articles.sort(key=lambda a: a["published_dt"], reverse=True)
    articles = articles[:MAX_ARTICLES]

    for a in articles:
        a["relative_time"] = relative_time(a["published_dt"])
        del a["published_dt"]

    return articles


def load_case_studies() -> list[dict]:
    return load_json("case_studies.json")


def load_blog_posts() -> list[dict]:
    posts: list[dict] = []
    if not CONTENT_DIR.exists():
        return posts
    for md_file in sorted(CONTENT_DIR.glob("*.md"), reverse=True):
        lines = md_file.read_text(encoding="utf-8").splitlines()
        title = lines[0].lstrip("# ").strip() if lines else md_file.stem
        summary = next((l.strip() for l in lines[1:] if l.strip()), "")
        date_str = ""
        for line in lines:
            if line.startswith("date:"):
                date_str = line.split(":", 1)[1].strip()
                break
        content_md = "\n".join(lines)
        posts.append({
            "slug": md_file.stem,
            "title": title,
            "summary": summary[:150],
            "date": date_str or "2026",
            "content_html": markdown.markdown(content_md, extensions=["fenced_code", "tables"]),
        })
    return posts


# ---------------------------------------------------------------------------
# Render pages
# ---------------------------------------------------------------------------
def build_all() -> None:
    env = make_env()
    projects: list[dict] = sorted(
        load_json("projects.json"),
        key=lambda p: p.get("last_commit", ""),
        reverse=True,
    )
    resume: dict = load_json("resume.json")
    articles: list[dict] = scrape_articles()
    blog_posts: list[dict] = load_blog_posts()
    case_studies: list[dict] = load_case_studies()
    all_tags: list[str] = sorted({t for a in articles for t in a["tags"]})
    last_updated = datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")

    print("Building pages...")

    # Home
    write_page(
        PUBLIC_DIR / "index.html",
        env.get_template("index.html").render(
            root="",
            stats={
                "projects": len(projects),
                "articles_per_day": MAX_ARTICLES,
                "years_exp": resume.get("years_experience", 11),
                "certifications": len(resume.get("certifications", [])),
            },
        ),
    )

    # News
    write_page(
        PUBLIC_DIR / "news" / "index.html",
        env.get_template("news.html").render(
            root="../",
            articles=articles,
            all_tags=all_tags,
            last_updated=last_updated,
        ),
    )

    # Projects
    write_page(
        PUBLIC_DIR / "projects" / "index.html",
        env.get_template("projects.html").render(root="../", projects=projects),
    )

    # Resume
    write_page(
        PUBLIC_DIR / "resume" / "index.html",
        env.get_template("resume.html").render(root="../", resume=resume),
    )

    # Architecture
    write_page(
        PUBLIC_DIR / "architecture" / "index.html",
        env.get_template("architecture.html").render(root="../", video_url=None),
    )

    # Blog index
    write_page(
        PUBLIC_DIR / "blog" / "index.html",
        env.get_template("blog.html").render(root="../", posts=blog_posts),
    )

    # Blog posts
    for post in blog_posts:
        write_page(
            PUBLIC_DIR / "blog" / post["slug"] / "index.html",
            env.get_template("blog_post.html").render(root="../../", post=post),
        )

    # Work / ADRs index
    write_page(
        PUBLIC_DIR / "work" / "index.html",
        env.get_template("case_studies.html").render(root="../", case_studies=case_studies),
    )

    # Individual work / ADR pages
    for cs in case_studies:
        write_page(
            PUBLIC_DIR / "work" / cs["slug"] / "index.html",
            env.get_template("case_study.html").render(root="../../", cs=cs),
        )

    # Copy static files to public/static/
    if STATIC_DIR.exists():
        import shutil
        dest = PUBLIC_DIR / "static"
        dest.mkdir(parents=True, exist_ok=True)
        for f in STATIC_DIR.iterdir():
            shutil.copy2(f, dest / f.name)
            print(f"  copied {f.name} → public/static/")

    # Copy data JSON files for any browser-side use
    import shutil
    pub_data = PUBLIC_DIR / "data"
    pub_data.mkdir(parents=True, exist_ok=True)
    for f in DATA_DIR.iterdir():
        shutil.copy2(f, pub_data / f.name)
        print(f"  copied {f.name} → public/data/")

    print(f"\nDone. {6 + len(blog_posts) + 1 + len(case_studies)} pages written to public/")


if __name__ == "__main__":
    build_all()
