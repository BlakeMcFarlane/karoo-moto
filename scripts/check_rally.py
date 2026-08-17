"""Static QA for the Rally Tower page.

Runs without Node. Catches the defects that are cheap to find mechanically and
expensive to find by eye:

  1. classes used in a .tsx but never defined in any rally stylesheet
  2. classes defined in a section partial but never used anywhere
  3. hard-coded colours / font-sizes / durations that should be tokens
  4. font-weights outside the embedded set
  5. references to var(--rt-*) tokens that do not exist
  6. 100vw usage (the classic horizontal-overflow bug)
  7. imports of assets that are not in src/assets/rally

Usage:  python scripts/check_rally.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RALLY_CSS = ROOT / "src" / "styles" / "rally"
RALLY_TSX = ROOT / "src" / "components" / "rally"
PAGES = ROOT / "src" / "pages"
ASSETS = ROOT / "src" / "assets" / "rally"

# Font weights actually embedded in fonts-embedded.css.
ALLOWED_WEIGHTS = {
    "barlow condensed": {"600", "700"},
    "inter": {"400", "500", "600", "700"},
    "ibm plex mono": {"500"},
}
ALL_ALLOWED_WEIGHTS = {"400", "500", "600", "700", "normal", "bold", "inherit"}


def strip_css_comments(text: str) -> str:
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def collect_css():
    """Return (defined_classes, declared_tokens, used_tokens, per-file text)."""
    defined: set[str] = set()
    declared: set[str] = set()
    used: set[str] = set()
    files: dict[Path, str] = {}

    # app.css sits outside the rally folder but defines shared classes
    # (.rt-page--bleed, .skip-link, .toast), so it has to be scanned or those
    # read as undefined.
    sheets = sorted(RALLY_CSS.glob("*.css")) + [ROOT / "src" / "styles" / "app.css"]
    for path in sheets:
        if not path.exists():
            continue
        raw = path.read_text(encoding="utf-8")
        text = strip_css_comments(raw)
        files[path] = text
        defined |= set(re.findall(r"\.(rt-[A-Za-z0-9_-]+)", text))
        declared |= set(re.findall(r"(--rt-[A-Za-z0-9-]+)\s*:", text))
        used |= set(re.findall(r"var\(\s*(--rt-[A-Za-z0-9-]+)", text))

    return defined, declared, used, files


def collect_tsx():
    """Return (used_classes, per-file text).

    Class names are assembled in too many ways (template literals, ternaries,
    arrays, helper functions, `${variant}` interpolation) to parse precisely,
    so every `rt-*` token appearing anywhere in the file counts as "used".
    Over-collecting costs a missed dead-class note; under-collecting produces
    a wall of false "undefined class" errors, which is far worse.
    """
    used: set[str] = set()
    files: dict[Path, str] = {}
    paths = sorted(RALLY_TSX.glob("*.tsx")) + sorted(PAGES.glob("*.tsx"))

    # Ids and ARIA targets share the rt- prefix but are not classes.
    id_attr = re.compile(
        r"""(?:id|aria-labelledby|aria-describedby|aria-controls|htmlFor)\s*=\s*["'{]?\s*["']?([A-Za-z0-9_ -]+)"""
    )

    for path in paths:
        text = path.read_text(encoding="utf-8")
        files[path] = text

        ids: set[str] = set()
        for m in id_attr.finditer(text):
            ids |= {tok for tok in m.group(1).split() if tok.startswith("rt-")}
        # `useId`-style template ids, e.g. `${id}-title`
        ids |= set(re.findall(r"[`'\"](rt-[A-Za-z0-9_-]*(?:title|label|desc|prompt)[A-Za-z0-9_-]*)", text))

        # `(?<![-\w])` keeps CSS custom properties (`--rt-delay`) out.
        for name in re.findall(r"(?<![-\w])(rt-[A-Za-z0-9_-]+)", text):
            if name.endswith("-") or name in ids:
                continue
            used.add(name)
    return used, files


def rel(p: Path) -> str:
    return str(p.relative_to(ROOT)).replace("\\", "/")


def main() -> int:
    problems: list[str] = []
    notes: list[str] = []

    defined, declared, used_tokens, css_files = collect_css()
    used_classes, tsx_files = collect_tsx()

    # 1. classes used but never styled -------------------------------------
    # Variant/state classes applied conditionally are still expected to exist.
    missing = sorted(c for c in used_classes if c not in defined)
    for c in missing:
        where = [rel(p) for p, t in tsx_files.items() if c in t]
        problems.append(f"class .{c} used in {', '.join(where)} but never defined in CSS")

    # 2. classes defined but never used ------------------------------------
    # Ignore the shared base/token layers — they are a library, not a section.
    section_defined: dict[str, str] = {}
    for path, text in css_files.items():
        if path.name in ("base.css", "tokens.css"):
            continue
        for c in set(re.findall(r"\.(rt-[A-Za-z0-9_-]+)", text)):
            section_defined.setdefault(c, rel(path))
    for c, where in sorted(section_defined.items()):
        if c not in used_classes:
            notes.append(f"class .{c} defined in {where} but never used in any .tsx")

    # 3. hard-coded values --------------------------------------------------
    # A mask/gradient stop of #000/#fff is an alpha channel, not a colour
    # choice, and 0s/0ms/1ms are motion *cancellations*, not timings.
    mask_ctx = re.compile(r"mask-image|mask:|-webkit-mask")
    for path, text in css_files.items():
        if path.name == "tokens.css":
            continue
        lines = text.split("\n")
        for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", text):
            line = text[: m.start()].count("\n") + 1
            ctx = "\n".join(lines[max(0, line - 18) : line + 1])
            if m.group(0).lower() in ("#000", "#fff", "#000000", "#ffffff") and mask_ctx.search(ctx):
                continue
            problems.append(f"{rel(path)}:{line} hard-coded colour {m.group(0)}")
        for m in re.finditer(r"font-size:\s*([0-9.]+)px", text):
            line = text[: m.start()].count("\n") + 1
            problems.append(f"{rel(path)}:{line} px font-size {m.group(0)}")
        for m in re.finditer(r"(?:transition|animation)[^;{}]*?\b(\d+(?:\.\d+)?m?s)\b", text):
            if m.group(1) in ("0s", "0ms", "1ms"):
                continue
            line = text[: m.start()].count("\n") + 1
            problems.append(f"{rel(path)}:{line} literal duration {m.group(1)} — use a --rt-t-* token")

    # 4. font weights -------------------------------------------------------
    for path, text in css_files.items():
        for m in re.finditer(r"font-weight:\s*([A-Za-z0-9]+)", text):
            w = m.group(1)
            if w not in ALL_ALLOWED_WEIGHTS and not w.startswith("var"):
                line = text[: m.start()].count("\n") + 1
                problems.append(f"{rel(path)}:{line} font-weight {w} is not embedded")

    # 5. unknown tokens -----------------------------------------------------
    # A custom property is legitimate if it is a global token, declared in the
    # same stylesheet, set inline from a component, or read with a fallback.
    inline_props: set[str] = set()
    for text in tsx_files.values():
        inline_props |= set(re.findall(r"['\"](--rt-[A-Za-z0-9-]+)['\"]", text))

    for path, text in css_files.items():
        for m in re.finditer(r"var\(\s*(--rt-[A-Za-z0-9-]+)\s*(,?)", text):
            token, has_fallback = m.group(1), bool(m.group(2))
            if (
                token in declared
                or token in inline_props
                or has_fallback
                or re.search(rf"{re.escape(token)}\s*:", text)
            ):
                continue
            line = text[: m.start()].count("\n") + 1
            problems.append(f"{rel(path)}:{line} unknown token {token}")

    # 6. 100vw --------------------------------------------------------------
    for path, text in css_files.items():
        for m in re.finditer(r"\b100vw\b", text):
            line = text[: m.start()].count("\n") + 1
            problems.append(f"{rel(path)}:{line} uses 100vw — causes horizontal overflow with a scrollbar")

    # 7. asset imports ------------------------------------------------------
    available = {p.name for p in ASSETS.glob("*")}
    for path, text in tsx_files.items():
        for m in re.finditer(r"from '\.\./\.\./assets/rally/([^']+)'", text):
            if m.group(1) not in available:
                problems.append(f"{rel(path)} imports missing asset {m.group(1)}")

    # 8. section ids present -------------------------------------------------
    expected_ids = [
        "proof", "design", "wiring", "warranty",
    ]
    all_tsx = "\n".join(tsx_files.values())
    for sid in expected_ids:
        if f'"{sid}"' not in all_tsx and f"'{sid}'" not in all_tsx and f"{{{sid}" not in all_tsx:
            # ids usually come from the data module as {SECTION.id}
            notes.append(f"section id '{sid}' not obviously present — verify the anchor renders")

    print(f"{len(problems)} problems, {len(notes)} notes\n")
    if problems:
        print("--- PROBLEMS ---")
        for p in problems:
            print(" ", p)
    if notes:
        print("\n--- NOTES ---")
        for n in notes:
            print(" ", n)

    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
