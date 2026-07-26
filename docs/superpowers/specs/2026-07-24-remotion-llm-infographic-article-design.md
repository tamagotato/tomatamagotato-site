# Article: LLM + Remotion Static Infographics — Design Spec
**Date:** 2026-07-24
**Site:** tomatamagotato (blog post, standard post layout)

---

## 1. Purpose & Framing

A how-to article on pairing an LLM with Remotion to produce internal-facing static infographics — using a real worked example from the `trash-to-cashback` project rather than a constructed demo.

**Core positioning:** Remotion is not pitched as a Canva/Figma replacement. It's an assistive, programmatic first-draft layer — removes the "blank canvas" cost for one-off internal announcements. A skilled Canva/Figma user can still finish the output by hand if it needs to look fully designed; this workflow just gets there faster and is automatable (scriptable, callable from an LLM, no human clicking through a design tool).

**Scope boundary:** static/still output only (Remotion's `<Still>` composition, rendered to a single PNG). Animated/video output (Remotion's `<Composition>` with a timeline) is explicitly out of scope — reserved for a separate future post.

**Audience:** matches the site's existing Work-page register — peers who understand ops/product/engineering, no need to sell the concept, reward depth.

---

## 2. Structure

### Section 1 — Essay: why Remotion, positioned against Canva/Figma
Placed upfront, before the walkthrough. Three-part argument:
1. **Programmatic = automatable** — no human clicking through a design tool; a script or LLM can call the render directly.
2. **LLMs are fluent in React/TSX** — the practical reason this pairing works, versus trying to drive a Figma/Canva plugin API with an LLM.
3. **Assistive, not competitive** — explicitly frames Remotion output as a fast boilerplate/first draft, not a finished replacement for a Canva/Figma user's own output.

No claim is made about exporting Remotion output into Canva/Figma as editable layers — this was considered and deliberately dropped; no verified mechanism exists for it.

Closes by transitioning into the walkthrough: "here's what that actually looked like, including where it broke."

### Section 2 — Walkthrough (real example, fictionalized)
Source: a real session from the `trash-to-cashback` Remotion project (session report already produced; see Section 3 below for the anonymization rules).

Beats, in order:
1. **The input** — a photographed community circular/announcement (image, not text): "Sunday Fun Run Weather & Safety Guidelines." Establish that the source is an image, not typed notes — the LLM's job includes visual extraction, not just summarization.
2. **The prompt** — shown close to verbatim: *"generate a static mobile formatted announcement based on reference/[circular].jpg. follow our established CTA patterns"* (filename fictionalized). Note explicitly that no file pointers were given — "established CTA patterns" was left for the LLM to resolve on its own.
3. **How pattern-matching actually happened** — the LLM's own discovery path: `Root.tsx` (learned static posters are `<Still>` compositions) → an existing poster component (direct structural precedent) → shared theme file(s) (palette, font loader) → a sibling scene component sampled for how time-critical info is styled. Callout: this only worked because earlier components carried **comments describing design intent**, not just code shape — those comments functioned as a design-system spec for the LLM. This is the section's key technical insight, stated directly.
4. **Two-pass generation** — v1 typechecked and rendered but silently overflowed the fixed 1920px canvas (clipped CTA/footer). v2 was a spacing/type-scale-only correction, triggered by the LLM inspecting its own rendered PNG output — not by human feedback. Show a trimmed before/after spacing comparison (representative rows only, not the full table from the session report).
5. **The rendered result** — the final poster image.

Framing note for accuracy: this is **two-shot with self-correction**, not one-shot. Say so explicitly rather than rounding up to "worked first try."

### Section 3 — "Where this actually breaks" (dedicated section, all 5 points)
Stated as-is from the session report, each as its own beat:
1. **Silent canvas overflow** — typecheck and render both succeed on a broken layout; the workflow only holds together if visually inspecting the rendered output is part of the loop, not optional.
2. **The missing event date** — the poster never states which Sunday. Proves fidelity checks catch *wrong* text, not *absent* text — human review of the output stays mandatory, this workflow doesn't remove it.
3. **Success was pre-paid** — pattern inference worked specifically because earlier sessions left explanatory comments in the theme/component files. On an uncommented codebase, "follow our established patterns" degrades to guesswork.
4. **Session mechanics weren't linear** — plan mode activated mid-task, after the component was already partially written. Honest note that the real transcript isn't a tidy straight-line prompt-to-poster story.
5. **Synthesized copy is a feature and a liability** — the CTA line was invented, not sourced from the circular. Improves the poster, but means the output isn't a faithful reproduction of an official notice. For real association/org communications, invented copy needs sign-off before it represents that org publicly.

### Section 4 — Close
Short. Restate the assistive framing now that the reader has seen the full example, including its rough edges. One line noting motion/video output is a separate, later post.

---

## 3. Anonymization Rules

The source session used a real condo association's name, a real circular number, and real staff contact info. The article **fully fictionalizes** the organization — consistent fake identity used everywhere the example appears (code snippet, rendered image, prose references):

- Org name: replaced with a placeholder (e.g. a made-up condo/HOA name)
- Circular/document number: replaced with a fake number in the same format
- Contact info (email, phone): replaced with clearly fake placeholder values
- Location details: replaced or genericized as needed

The code snippet shown in the article and the rendered poster image must both be regenerated/edited to reflect the fictionalized identity — not the real one from the source session. This applies before anything is published or made public via Artifact or otherwise.

---

## 4. Content Source Mapping

| Article beat | Source material |
|---|---|
| The input (circular image) | `trash-to-cashback/references/MGCfunrunguidelines.jpg` (real filename/content — do not reference directly in article; describe generically or use fictionalized filename) |
| The prompt | Verbatim from user, filename fictionalized |
| Pattern discovery path | Session report Section 3 |
| Two-pass generation + spacing diff | Session report Sections 2 and 6 |
| Rendered result | `trash-to-cashback/out/funrun-poster.png` — must be re-rendered against a fictionalized component before use, since the real render contains real identifying text |
| "Where this breaks" | Session report Section 7, all 5 points, condensed but not cut |

---

## 5. File Scope

### New files
| File | Purpose |
|---|---|
| `app/pages/blogs/remotion-llm-infographics.vue` | The article, standard blog post layout (matches `wfh-philippines.vue` pattern minus the report/scrollspy machinery — no `useReport()`, no TOC) |

### Modified files
| File | Change |
|---|---|
| `app/pages/blogs/index.vue` | Add new post card to the index list |
| `public/img/` | Add fictionalized rendered poster image, if used inline |

### Not in scope
- Any change to the `trash-to-cashback` project itself
- The animated/video Remotion workflow (separate future post)
- Any real identifying information from the source association

---

## 6. Constraints

- **Hosting:** GitHub Pages, static only — no build-time data fetching, all content authored directly in the `.vue` file.
- **Layout:** standard post layout (`post.css` / `dark` layout), not the report-style long-form layout — this is a procedural how-to, not a data-driven report.
- **Anonymity:** the site's existing anonymity convention (no real name) extends here to no real third-party org identity either.
- **Honesty over polish:** the failure-mode section is not optional or abbreviated — it's the article's credibility anchor per direct user instruction, not padding.
