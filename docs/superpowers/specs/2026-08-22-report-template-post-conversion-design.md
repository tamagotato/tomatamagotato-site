# Converting three posts to the report template

Date: 2026-08-22

## Context

`wfh-philippines.vue` uses `report.css` and `useReport()`: a hero with badge/title/stat row, a scrollspy table of contents, numbered sections, and a family of data-viz and paper-note components (timeline, ranked bars, bar charts, stat grids, expandable cards, quote/callout paper notes). Every other post (`learning-instead-of-watching.vue`, `stones-throw.vue`, `remotion-llm-infographics.vue`) uses the plain `post.css` layout: title, date, prose, occasional `blockquote.ink-quote` or scoped one-off styling.

This spec converts those three posts to the report template. `wfh-philippines.vue` itself is out of scope — it already has this design.

## Non-goals

- No new report.css components. Every post uses components report.css already defines (hero, TOC, `report-quote`, `report-callout`, `report-card`/`report-card-grid`, `report-stat-grid`).
- No forced data-viz. `report-timeline`, `report-ranked-stack`, and `report-bar-chart` are not used unless a post has real countable content that fits — none of the three do, so none of them appear.
- No per-post accent tokens. All report pages share the single `--report-accent*` set defined on `:root` in report.css.

## Shared mechanics (all three posts)

- `definePageMeta({ layout: 'dark' })` → `definePageMeta({ layout: false })`. The report shell (hero + TOC + footer) replaces the site nav/footer, same as `wfh-philippines.vue`.
- `<style src="~/assets/css/post.css">` → `<style src="~/assets/css/report.css">`.
- Import `useReport()`, destructure `tocScrolled`, `activeSection`, `toggleItem`, `toggleExpand`, `initAll`; call `onMounted(initAll)`.
- Template restructures to: `.report-page` > `.report-hero` (badge + `h1` + optional `.report-hero-sub` + optional `.report-hero-stats`) + `nav.report-toc` (scrollspy links, `NuxtLink` home) + `main.report-content` > one `.report-section[id]` per `h2`-delimited section, each with a `.report-section-number` (01, 02, ...) + `footer.report-footer`.
- Any page-specific scoped `<style>` (SVG diagrams, tables) stays, re-checked against report.css token names (`--report-text-muted` etc.) instead of post.css's (`--post-muted` etc.).

## Per-post content mapping

### `remotion-llm-infographics.vue`

- Hero: badge ("Workflow Writeup"), title, subtitle, and a real stat row drawn from the post's own numbers — headline size delta (84px → 78px), pass count (2), breaking-point count (5). No invented figures.
- The existing before/after sizing table (headline size, CTA padding, deadline block size) becomes a `report-stat-grid` or compact bar comparison — real deltas, not decoration.
- The "Five limitations" section (five `h3` items: overflow fails silently, fidelity vs. completeness, pattern-matching relies on groundwork, the session had twists, invented copy needs approval) becomes a `report-card-grid` of expandable `report-card`s — same accordion shape as wfh's abuse-cards grid.
- The aside "If you want an LLM to infer your conventions, the conventions have to be written down somewhere it can read them" becomes a `report-callout info` — it's a standalone insight, not prose that has to stay inline.
- No `report-quote` — nothing in this post reads as a pull quote candidate.

### `learning-instead-of-watching.vue`

- Hero: badge, title, subtitle only. No stat row — nothing in this essay is a countable metric.
- The two existing `blockquote.ink-quote` elements (the Ratatouille critic line; the Luthen "I burn my life..." line) convert to `report-quote`.
- The two `<figure class="ink-figure">` SVG diagrams (four-brakes-one-accelerator; Social Styles grid) stay as figures, untouched structurally — they're diagrams, not report bar-charts or stat grids, and forcing them into a report component would lose the custom SVG content.
- Every `h2` becomes a `.report-section[id]` with a TOC entry and section number.
- No `report-card-grid` — no natural list of parallel short items exists here that isn't already a diagram.

### `stones-throw.vue`

- Hero: badge, title (post already has a subtitle: "what drives me to even try"), no stat row.
- No existing blockquotes. One or two standout lines (e.g. "A principle passed down secondhand isn't an instruction. It's a seed") get wrapped in `report-quote` for the same visual-break rhythm wfh-philippines.vue uses in dense prose sections — not one per section, just where a line is strong enough to carry it standalone.
- No `report-card-grid`, no `report-callout` — no parallel-item list or severity-worthy aside exists in this post; forcing either would violate the callout doc's "no severity to signal, don't reach for a stamp" rule.
- Every `h2` becomes a `.report-section[id]` with a TOC entry and section number.

## Testing

No test suite exists in this repo. Verification is manual: `npm run dev`, then for each of the three routes — hero rendering, TOC scrollspy highlighting on scroll, quote/callout/card rendering and (for cards) expand/collapse, section reveal-on-scroll animation, and the sub-640px breakpoint (paper notes flatten to `rotate(0)`, hero stats — where present — collapse per report.css's existing mobile rules).
