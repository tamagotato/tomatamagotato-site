# Handover: apply the annotation note to the WFH blog post

**Written:** 2026-08-21. **Status:** design settled, not implemented. No code has been
changed yet.

Paste the "Prompt" section below into a fresh Claude Code session opened at the repo
root. Everything it needs is in this repo.

---

## Prompt

> Apply a settled design decision to this Nuxt site. The design work is finished and
> documented; your job is implementation, not redesign.
>
> **Read these two files first, completely:**
>
> - `docs/annotation-note-spec.md`, the full spec, with measured contrast ratios and
>   the rules that govern the component
> - `docs/annotation-note.html`, a working reference. Plain CSS, no build step. Open
>   it in a browser to see the target
>
> **What you are replacing.** The current callouts use a coloured left border and hue
> as the only channel distinguishing info from warning. That fails WCAG 1.4.1. It also
> means one visual device (the leading-edge border) carries four unrelated jobs on this
> site: card hover, info aside, warning aside, and pull quote.
>
> The replacement is a paper note printed on a yellow ripple stock, with severity
> carried by an ink stamp whose *word* names the state. Colour is never the only
> channel.
>
> ### Task 1: the callouts
>
> **File:** `app/assets/css/report.css`, lines 378 to 401.
>
> Current state:
>
> ```css
> .report-callout {
>   border: 1px solid var(--report-border);
>   border-radius: 12px;
>   padding: 24px;
>   margin: 32px 0;
>   background: var(--report-surface);
> }
> .report-callout.warning { border-left: 4px solid var(--report-accent2); }
> .report-callout.info    { border-left: 4px solid var(--report-accent4); }
> ```
>
> Replace with the note. Port the CSS from `docs/annotation-note.html` (the `.note`,
> `.note__stamp`, `.note__label`, `.note__body` blocks). Keep the existing class names
> `.report-callout`, `.report-callout.info`, `.report-callout.warning`, and
> `.report-callout-title` so the markup in the `.vue` pages does not need rewriting.
>
> Map them:
>
> | Existing class | Gets |
> |---|---|
> | `.report-callout` | the paper: ripple stock, square corners, two-layer shadow, `rotate(-1.1deg)`, curled corner via `::after` |
> | `.report-callout-title` | the label, Roboto Mono 11px uppercase, `letter-spacing: 1.4px`, colour `#8a4b00` |
> | `.report-callout.info` | stamp ink `#252D49` |
> | `.report-callout.warning` | stamp ink `#7a3300` |
>
> **The stamp needs a new element.** The current markup has no element to hold it.
> Check `app/pages/blogs/wfh-philippines.vue` for how callouts are written, then either
> add a stamp element to each callout or generate it with a `::before` on
> `.report-callout`. Prefer a real element: `::before` cannot hold two different words
> without duplicating the rule per severity, and a real element keeps the word in the
> DOM for screen readers.
>
> ### Task 2: two defects in the same file
>
> 1. `.report-callout` and `.report-quote` both carry a `transition` on
>    `background-color`, `border-color` and `color`, but neither has a hover rule and
>    both are `cursor: auto`. Dead CSS copied forward from an interactive component.
>    Delete the transitions.
> 2. **Do not touch `.report-quote`** otherwise (lines 358 to 376). A left rule on a
>    blockquote is legitimate typographic convention and is the one sanctioned use of
>    the leading edge. It stays exactly as it is. This is deliberate, not an oversight.
>
> ### Task 3: the blog index card hover
>
> **File:** `app/assets/css/post.css`, lines 165 and 177.
>
> `.blog-index-card` reserves a 3px transparent left border and fades
> `border-left-color` to olive `rgb(85, 112, 47)` on hover. The card is a
> whole-surface click target, so a single edge does not communicate "this entire
> rectangle is clickable". The signifier's shape must scale with the target's shape.
>
> Replace with elevation plus a slight scale:
>
> ```css
> .blog-index-card {
>   /* remove the transparent left border and its transition */
>   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
>   transition: box-shadow 0.2s, transform 0.2s;
> }
> .blog-index-card:hover {
>   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
>   transform: scale(1.015);
> }
> @media (prefers-reduced-motion: reduce) {
>   .blog-index-card { transition: none; }
>   .blog-index-card:hover { transform: none; }
> }
> ```
>
> ### Task 4: the font
>
> The stamp needs **Big Shoulders Display** at weight 900. This site currently runs the
> system font stack and loads no webfont, so the stamp will silently fall back and look
> wrong. Add the font before considering this done. Check whether the project uses
> `@nuxt/fonts`; if so, add it there rather than a raw `<link>`.
>
> ### Constraints
>
> - **No em dashes** in any file you write or edit. Restructure the sentence instead.
> - Keep the existing CSS-variable style in both files. Add new variables to `:root`
>   rather than hardcoding hex values inline.
> - `rotate(0)` below 640px, or the note overflows its column. The stamp keeps its own
>   angle.
> - Do not invent a third severity. Only `info` and `warning` exist.
>
> ### Verify before you claim it works
>
> Do not report success without running these.
>
> 1. **Load the real page** at `/blogs/wfh-philippines/` in a browser (Playwright MCP
>    is fine) and confirm both callouts render as paper with a visible stamp. A dev
>    server returning 200 is not verification; the HTML shell loads even when CSS is
>    broken.
> 2. **Hue-stripped read.** Apply `filter: grayscale(1)` to the page and confirm you
>    can still tell the info callout from the warning callout. If you cannot, the
>    implementation regressed to colour-only and it fails.
> 3. **Narrow width.** Resize to 375px and confirm nothing overflows horizontally.
> 4. **Check the index page** at `/blogs` and confirm the card hover lifts rather than
>    drawing a left edge.
>
> ### One thing that is knowingly unfinished
>
> The ripple texture in the reference file is a CSS `repeating-radial-gradient`
> approximation. The real "Change in Ripples" motif is an SVG that does not exist in
> this repo. Use the approximation, and leave the comment in place saying so. Do not
> try to improve it, and do not claim the texture is final.

---

## Context a future session may want

**Why this design exists.** A survey of six canonical design systems (Material 3 cards,
Primer card and banner, Carbon tile and notification, GitHub alerts) found the
left-border accent prescribed **zero times** as either an interactive or a semantic
device. Verified twice: the word "left" appears five times in 2,892 lines of guidance
and every use is positional prose. Icon ranks first, elevation second, motion third.

**Why the warning ink is brown, not red.** Multiply blending over yellow paper drags
every red toward brown. `#D1001C` measures 3.43:1 on the stock, which passes AA for
large text only and fails AAA. `#7a3300` gives 4.60:1. Real red ink on yellow stock
genuinely does go brownish, so the physics and the accessibility agree.

**Why the label lost its severity word.** `WARNING` above `COMPETITIVE RISK` says the
same thing twice. The spec renames that label to `COMPETITIVE PRESSURE`. Apply the same
rule to any other callout on the page: if the stamp carries the severity, the label
drops it.

**Design canvas** with every rejected direction and the measured contrast table:
`https://claude.ai/code/artifact/95381dac-2d9d-474d-a322-dca263da2137`

**Boldr side.** The governing rule is `BOLDR_STANDARDS/branding.md` Non-Negotiable #9,
"one device, one job", in the BoldrGeniusBuilder repo. A `<BNote>` composite is proposed
for `@boldrtechsolutions/ui` §6.2 but blocked on three brand questions. This site is not
a Boldr app and does not depend on any of that.
