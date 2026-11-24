#!/usr/bin/env python3
"""Write a Markdown copy of each HTML page, for AI agents and answer engines.

Agents such as Claude Code and Cursor ask for Markdown when they fetch a page, and a clean
Markdown copy is easier to quote than HTML. Each page gets a sibling file: `index.html` ->
`index.md`, `about.html` -> `about.md`. The page links to it with
`<link rel="alternate" type="text/markdown" href="...">`, build.sh ships it, and `_headers`
serves it as `text/markdown`.

The copy is made from the page's `<main>` (the whole `<body>` if there is none), so it says
exactly what the page says. Navigation, footers, forms, scripts, decorative SVG and anything
`aria-hidden` or `hidden` are left out. A short YAML header carries the title, canonical URL and
description.

    scripts/page_md.py index.html about.html contact.html projects.html
    scripts/page_md.py --check index.html     # exit 1 if a .md is missing or stale

Copied from the cygnusstrategy.com repo (scripts/page_md.py); only the default base URL and
this docstring differ. Standard library only. Generated files are committed.
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

SKIP = {"script", "style", "noscript", "svg", "nav", "footer", "form", "template",
        "iframe", "canvas", "video", "audio", "select", "dialog"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source",
        "track", "wbr"}
BLOCK = {"p", "div", "section", "article", "header", "aside", "figure", "figcaption", "ul", "ol",
         "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "table", "tr", "dl", "dt",
         "dd", "details", "summary", "main", "address", "hr"}


class Page(HTMLParser):
    """Collects head metadata and a Markdown rendering of the main content."""

    def __init__(self, base_url: str):
        super().__init__(convert_charrefs=True)
        self.base = base_url
        self.title = ""
        self.canonical = ""
        self.description = ""
        self._in_title = False
        self.has_main = False
        self.in_main = 0
        self.skip = 0           # depth inside a skipped subtree
        self.stack: list[str] = []
        self.out: list[str] = []  # Markdown fragments for the current scope
        self.body_out: list[str] = []
        self.main_out: list[str] = []
        self.lists: list[list] = []  # [kind, counter]
        self.link: list[str | None] = []
        self.pre = 0
        self.table: list[list[str]] | None = None
        self.cell: list[str] | None = None

    # Output helpers -----------------------------------------------------------------------
    def _target(self) -> list[str]:
        if self.cell is not None:
            return self.cell
        return self.main_out if self.in_main else self.body_out

    def emit(self, text: str) -> None:
        self._target().append(text)

    def block(self, prefix: str = "") -> None:
        if self.cell is not None:
            self.cell.append(" ")
            return
        self.emit("\n\n" + prefix)

    # Parser callbacks ----------------------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content") or ""
        if tag == "link" and (a.get("rel") or "") == "canonical":
            self.canonical = a.get("href") or ""
        if tag in VOID:
            self._void(tag, a)
            return
        self.stack.append(tag)
        if tag == "main":
            self.has_main = True
            self.in_main += 1
        hidden = a.get("aria-hidden") == "true" or "hidden" in a or a.get("role") == "presentation" and tag == "svg"
        if self.skip or tag in SKIP or hidden:
            self.skip += 1
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.block("#" * int(tag[1]) + " ")
        elif tag in ("p", "figcaption", "address", "dt", "dd", "summary"):
            self.block("**" if tag in ("dt", "summary") else "")
        elif tag in ("ul", "ol"):
            self.lists.append([tag, 0])
            if len(self.lists) == 1:
                self.block()
        elif tag == "li":
            kind = self.lists[-1] if self.lists else ["ul", 0]
            kind[1] += 1
            indent = "  " * (len(self.lists) - 1)
            marker = f"{kind[1]}. " if kind[0] == "ol" else "- "
            if self.cell is None:
                self.emit("\n" + indent + marker)
        elif tag == "blockquote":
            self.block("> ")
        elif tag == "pre":
            self.pre += 1
            self.block("```\n")
        elif tag == "code" and not self.pre:
            self.emit("`")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i") and not a.get("class", "").startswith("icon"):
            self.emit("_")
        elif tag == "a":
            href = a.get("href") or ""
            if href.startswith(("mailto:", "#")) or not href:
                self.link.append(href if href.startswith("mailto:") else None)
            else:
                self.link.append(urljoin(self.base, href))
            if self.link[-1]:
                self.emit("[")
        elif tag == "table":
            self.table = []
            self.block()
        elif tag == "tr" and self.table is not None:
            self.table.append([])
        elif tag in ("td", "th") and self.table is not None:
            self.cell = []
        elif tag in BLOCK:
            self.block()

    def _void(self, tag, a):
        if self.skip:
            return
        if tag == "br":
            self.emit("  \n" if self.cell is None else " ")
        elif tag == "hr":
            self.block("---")
        elif tag == "img":
            alt = (a.get("alt") or "").strip()
            if alt and a.get("aria-hidden") != "true":
                self.emit(f"![{alt}]({urljoin(self.base, a.get('src') or '')})")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag in VOID:
            return
        # Close up to the matching tag (tolerates unclosed <p> and <li>).
        if tag not in self.stack:
            return
        while self.stack:
            top = self.stack.pop()
            self._close(top)
            if top == tag:
                break

    def _close(self, tag):
        if self.skip:
            self.skip -= 1
            if tag == "main":
                self.in_main -= 1
            return
        if tag == "main":
            self.in_main -= 1
        if tag in ("ul", "ol") and self.lists:
            self.lists.pop()
            if not self.lists:
                self.block()
        elif tag in ("dt", "summary"):
            self.emit("**")
        elif tag == "pre":
            self.pre -= 1
            self.emit("\n```")
            self.block()
        elif tag == "code" and not self.pre:
            self.emit("`")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag in ("em", "i"):
            self.emit("_")
        elif tag == "a" and self.link:
            href = self.link.pop()
            if href:
                self.emit(f"]({href})")
        elif tag in ("td", "th") and self.table is not None and self.cell is not None:
            text = re.sub(r"\s+", " ", "".join(self.cell)).strip().replace("|", "\\|")
            self.cell = None
            if self.table:
                self.table[-1].append(text)
        elif tag == "table" and self.table is not None:
            rows = [r for r in self.table if r]
            self.table = None
            if rows:
                width = max(len(r) for r in rows)
                rows = [r + [""] * (width - len(r)) for r in rows]
                lines = ["| " + " | ".join(rows[0]) + " |", "|" + " --- |" * width]
                lines += ["| " + " | ".join(r) + " |" for r in rows[1:]]
                self.block("\n".join(lines))
                self.block()
        elif tag in BLOCK:
            self.block()

    def handle_data(self, data):
        if self._in_title:
            self.title += data
            return
        if self.skip:
            return
        if self.pre:
            self.emit(data)
            return
        text = re.sub(r"\s+", " ", data)
        if text.strip() or (text and self._target() and not self._target()[-1].endswith((" ", "\n"))):
            self.emit(text)


def tidy(md: str) -> str:
    md = re.sub(r"[ \t]+\n", "\n", md)
    md = re.sub(r"\n(#+|>|-|\d+\.) +", lambda m: "\n" + m.group(1) + " ", md)
    md = re.sub(r"\*\*\s*\*\*", "", md)
    md = re.sub(r"\[\s*\]\([^)]*\)", "", md)            # links with no text (icon links)
    md = re.sub(r"\[\s+", "[", md)
    md = re.sub(r"\s+\]\(", "](", md)
    md = re.sub(r"^(#+|>|-|\d+\.)\s*$", "", md, flags=re.M)  # empty headings and items
    md = re.sub(r"\n{3,}", "\n\n", md)
    lines = [ln.strip() if not ln.startswith(("  ", "```")) else ln.rstrip() for ln in md.split("\n")]
    return "\n".join(lines).strip() + "\n"


def convert(path: Path, base_url: str | None = None) -> str:
    raw = path.read_text(encoding="utf-8")
    page = Page(base_url or "https://pid1.space/")
    page.feed(raw)
    page.close()
    url = page.canonical or base_url or ""
    if url and not base_url:
        # Re-run with the page's own canonical so relative links resolve to the right host.
        page = Page(url)
        page.feed(raw)
        page.close()
    body = "".join(page.main_out if page.has_main else page.body_out)
    head = ["---", f"title: {yaml_str(page.title.strip())}"]
    if url:
        head.append(f"url: {url}")
    if page.description:
        head.append(f"description: {yaml_str(page.description.strip())}")
    head.append("---")
    return "\n".join(head) + "\n\n" + tidy(html.unescape(body))


def yaml_str(s: str) -> str:
    s = re.sub(r"\s+", " ", s)
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def md_path(p: Path) -> Path:
    return p.with_suffix(".md")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("pages", nargs="+", type=Path)
    ap.add_argument("--check", action="store_true", help="fail if a .md is missing or stale")
    args = ap.parse_args()
    stale = []
    for p in args.pages:
        out = md_path(p)
        md = convert(p)
        if args.check:
            if not out.exists() or out.read_text(encoding="utf-8") != md:
                stale.append(str(out))
            continue
        if not out.exists() or out.read_text(encoding="utf-8") != md:
            out.write_text(md, encoding="utf-8")
            print(f"  wrote {out}")
    if stale:
        print("stale or missing Markdown copies (run scripts/page_md.py):", *stale, sep="\n  ", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
