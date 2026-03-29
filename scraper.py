"""
RSS scraper — runs in CI before the Next.js build.
Outputs site/public/data/news.json which the Next.js client loads at runtime.
"""

import json
import os
import requests
import feedparser
from datetime import datetime, timezone
from dateutil import parser as dateutil_parser

KEYWORDS = [
    "platform engineering", "mlops", "genai", "llm", "devops", "kubernetes",
    "k8s", "argocd", "gitops", "sre", "ai infrastructure", "ml infrastructure",
    "observability", "reliability", "cloud", "aws", "azure", "terraform",
]

TAG_MAP = {
    "mlops": "mlops", "genai": "genai", "llm": "genai", "ai infrastructure": "genai",
    "ml infrastructure": "genai", "platform engineering": "platform",
    "kubernetes": "kubernetes", "k8s": "kubernetes", "argocd": "gitops",
    "gitops": "gitops", "sre": "sre", "reliability": "sre", "observability": "sre",
    "devops": "devops", "terraform": "devops", "aws": "cloud", "azure": "cloud",
    "cloud": "cloud",
}

SOURCES = [
    {"name": "The Pragmatic Engineer",  "url": "https://newsletter.pragmaticengineer.com/feed"},
    {"name": "Kubernetes Blog",         "url": "https://kubernetes.io/feed.xml"},
    {"name": "AWS DevOps Blog",         "url": "https://aws.amazon.com/blogs/devops/feed/"},
    {"name": "InfoQ Platform",          "url": "https://www.infoq.com/platform-engineering/rss/"},
    {"name": "Google Cloud Blog",       "url": "https://cloudblog.withgoogle.com/rss/"},
    {"name": "HackerNews (Top)",        "url": "https://hnrss.org/frontpage"},
]

HEADERS = {"User-Agent": "surendra-portfolio-scraper/1.0"}
MAX_PER_SOURCE = 5
MAX_TOTAL = 30


def tag_article(title: str, summary: str = "") -> list[str]:
    text = (title + " " + summary).lower()
    tags = set()
    for kw, tag in TAG_MAP.items():
        if kw in text:
            tags.add(tag)
    return sorted(tags)


def fmt_date(entry) -> str:
    for attr in ("published_parsed", "updated_parsed"):
        val = getattr(entry, attr, None)
        if val:
            try:
                import time
                return datetime.fromtimestamp(time.mktime(val), tz=timezone.utc).strftime("%b %d")
            except Exception:
                pass
    return ""


def scrape() -> list[dict]:
    articles: list[dict] = []
    seen_links: set[str] = set()

    for src in SOURCES:
        try:
            resp = requests.get(src["url"], headers=HEADERS, timeout=10)
            resp.raise_for_status()
            feed = feedparser.parse(resp.content)
        except Exception as e:
            print(f"  [skip] {src['name']}: {e}")
            continue

        count = 0
        for entry in feed.entries:
            if count >= MAX_PER_SOURCE:
                break
            link = entry.get("link", "")
            title = entry.get("title", "").strip()
            if not link or link in seen_links or not title:
                continue

            text_lower = (title + " " + entry.get("summary", "")).lower()
            if not any(kw in text_lower for kw in KEYWORDS):
                continue

            seen_links.add(link)
            articles.append({
                "title":     title,
                "link":      link,
                "published": fmt_date(entry),
                "source":    src["name"],
                "tags":      tag_article(title, entry.get("summary", "")),
            })
            count += 1

    return articles[:MAX_TOTAL]


def main():
    print("Scraping RSS feeds...")
    articles = scrape()
    print(f"  {len(articles)} articles collected")

    out_dir = os.path.join("site", "public", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "news.json")

    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "count":        len(articles),
        "articles":     articles,
    }
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2)

    print(f"  Written → {out_path}")


if __name__ == "__main__":
    main()
