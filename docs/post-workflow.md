# Drafting posts for tomatamagotato

The canonical process for taking an idea to a shipped page under `app/pages/blogs/`.
Written posts only. Vlog drafting and production is a separate workflow, not yet
built, see Backlog at the end of this doc.

The `/draft-post` skill automates these steps. This doc is the reasoning behind
them, and the reference for doing it by hand.

---

## The two post types

Pick the type before writing anything. They have different structures, different
stylesheets, and different amounts of work.

### Standard post

For essays, walkthroughs, and opinion pieces. Plain prose with headings.

- Lives at `app/pages/blogs/<slug>.vue`
- `<article class="post">` wrapper
- Imports `~/assets/css/post.css`
- Page-specific one-offs go in a scoped `<style>` block at the bottom
- Reference implementation: `remotion-llm-infographics.vue` (159 lines)

Structure:

```vue
<template>
  <article class="post">
    <h1 class="post-title">Sentence case title</h1>
    <time class="post-date">July 24, 2026</time>

    <p>Opening paragraph.</p>

    <h2>Section heading</h2>
    <p>Body.</p>
  </article>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dark' })
useHead({ title: 'Post title | tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
```

Available elements beyond prose: `<pre><code>` for code (add `v-pre` when the
snippet contains braces Vue would try to interpret), `<table>` for comparisons,
`<p class="post-caption">` for image captions.

### Report post

For data-driven long-form with sections, stats, and scroll interaction. Much
heavier. Only reach for this when the content genuinely has structured data to
show.

- Imports `~/assets/css/report.css`
- Uses `useReport()` from `app/composables/useReport.ts`, call `initAll()` in `onMounted`
- Gets IntersectionObserver reveal animations, scrollspy table of contents, animated stat bars
- Reference implementation: `wfh-philippines.vue` (287 lines)

Components available: `report-hero` with `report-hero-stat` figures,
`report-toc` sticky nav, numbered `report-section` blocks, `report-timeline`,
`report-ranked-stack` bars, `report-card-grid`, `report-callout` (`.info` /
`.warning`), `report-stat-grid`.

Accent colors come from CSS custom properties: `--report-accent` through
`--report-accent4`.

---

## The process

### 1. Brainstorm, then write a spec

Do not open a `.vue` file first. Every post that shipped well here started as a
spec under `docs/superpowers/specs/`, named `YYYY-MM-DD-<slug>-design.md`.

The spec settles, before any prose exists:

- **Purpose and framing.** What is the piece actually arguing? What is it
  deliberately *not* claiming? The Remotion post's spec explicitly recorded that
  no claim would be made about exporting to Figma layers, because no verified
  mechanism existed. Writing down what you refuse to claim prevents drift.
- **Scope boundary.** What is out of scope and reserved for a later post.
- **Audience and register.** Default: peers who understand ops, product, and
  engineering. No need to sell the concept. Reward depth.
- **Structure.** Section by section, in order, with the beats inside each.
- **Anonymization rules.** See below. Non-negotiable if the piece draws on real
  work.

The spec is the deliverable of this step. Get it agreed before drafting prose.

### 2. Anonymize the source material

The site is intentionally anonymous. This is a hard constraint, not a
preference.

- No real name appears anywhere on the site.
- Work page project descriptions never name employers or clients.
- The same rule applies to posts. If a piece draws on real work, fictionalize
  the organization completely and use one consistent fake identity everywhere
  it appears: in prose, in code snippets, and inside any rendered image.
- Fictionalize identifying details too: document numbers, staff contacts,
  locations.
- Say in the post that details are fictionalized when showing something
  presented as real output. The Remotion post does this directly: "Names,
  circular number, and location are fictionalized for this post; the JSX
  structure and styling are exactly what shipped."

Anonymizing prose but leaving a real name inside a screenshot or code block is
the failure mode to watch for.

### 3. Draft the prose

House style, learned the hard way. Two commits exist purely to fix violations of
this (`07f50f5`, `0d278ff`), so treat it as settled:

- **No em dashes.** Anywhere. Use commas, or restructure the sentence.
- **Sentence case** for headings and page titles. Not title case.
- **No rule-of-three grouping.** Three parallel items in a row is the single
  most recognizable LLM prose tell.
- **No bolded topic-sentence openers.** Do not start paragraphs with a bolded
  phrase followed by explanation.
- **Vary section pacing.** Symmetrical sections of near-identical length read as
  machine-generated. Let some sections be short.
- **Write warm and personal.** First person is fine. Asides are fine. "Kind of a
  mean thing to do to it, honestly" is the register that shipped.
- **State limits honestly.** The Remotion post says "this was a two-shot result
  with self-correction, not a one-shot success, and that matters, since rounding
  it up would misrepresent how the workflow behaves." Do that. Rounding results
  up is the thing to avoid.

The `humanizer` skill catches the mechanical tells. It does not supply voice, so
read the draft aloud before shipping regardless.

### 4. Build the page

Convert the approved draft into the `.vue` structure for the chosen post type.

Prose goes directly into the template as HTML. There is no markdown pipeline
and no content module on this site.

### 5. Register it on the index

`app/pages/blogs/index.vue` does not autodiscover posts. The list is hardcoded.
Add a card manually, newest first:

```vue
<li>
  <a class="blog-index-card" href="/blogs/<slug>">
    <time>July 24, 2026</time>
    <h2>Sentence case title</h2>
    <p>One or two sentence summary.</p>
  </a>
</li>
```

Forgetting this step ships a page nobody can reach from the site.

### 6. Verify before claiming done

- `npm run dev`, then load the post and the index and actually look at them.
- Check both themes with the toggle. Standard posts currently render poorly in
  light mode, see Known limitations.
- `npm run generate` must pass. This is what CI runs.
- Confirm any image referenced from code has a URL-safe filename.

### 7. Commit

Granular commits, each one logical action, explaining the why. Spec and page are
separate commits.

---

## Images

- Served from `public/img/`.
- **Filenames must be URL-safe.** No spaces, consistent case. CI has broken on
  this before (`367a8c6`). Rename the file itself, do not rely on URL encoding.
- Use web formats. PNG, JPG, WebP. Not TIFF, browsers will not render it.

---

## Known limitations

- **`post.css` has no light-theme variants.** It defines only dark colors, so
  standard posts and the blog index render near-white text on the warm paper
  background when the toggle is set to light. Unresolved. Either add
  `.theme-light` rules to `post.css`, or force dark on blog routes and hide the
  toggle there.
- **The `dark` layout is a misnomer.** It does not force dark mode and is
  functionally identical to `default`. Blog pages only look dark-only because of
  the `post.css` gap above.
- **The index is hardcoded.** No autodiscovery. Step 5 is manual and easy to
  forget.

---

## Backlog

### Vlog drafting and production workflow

Not scoped, not started. Vlog content is for other things and does not belong in
this written-post pipeline. It gets its own workflow when the time comes.

Rough shape of the idea: a pipeline covering scripting, production, and
publishing, built on the standing Remotion project at `trash-to-cashback` for
motion graphics, plus a video editor such as OpenCut for cutting real footage.
Remotion handles the programmatic pieces well (titles, lower thirds, data
animation) but is the wrong tool for trimming and sequencing recorded video,
which is where a real editor comes in.

Open questions to settle before building it:

- Where the video actually lives. Whether the site hosts video at all, or the
  workflow ends at a platform upload with nothing shipped here.
- Whether video posts ever appear on this site. If yes, the site needs an embed
  component, responsive aspect-ratio CSS, and a distinguishable index card,
  none of which exist. If no, this workflow never touches this repo.
- Where the boundary between Remotion and the editor sits, and what handoff
  format crosses it.

If video posts do eventually land on the site, they run through the written
process above for the companion piece. The writing is a real piece that stands
on its own for someone who does not press play, not a description of the video.

### Posable Blueman component set

Not scoped, not started. Raised during the leadership post (2026-08-06), where
the art plan was cut to typography because the pose the essay wanted did not
exist and could not be assembled from what does.

The problem: everything in `public/img/` is a finished flat PNG. Blueman exists
as faces and one-off gag pieces, mostly forward-facing. There is no way to get a
new pose out of the existing library, so every post that wants a specific pose is
blocked on drawing one from scratch.

Rough shape of the idea: break Blueman into separately drawn parts, head, body,
arms, and a set of swappable faces, so poses become composition rather than
illustration. Once the parts exist, the standing Remotion project at
`trash-to-cashback` can place and rotate them into stills for posts, and a video
editor such as OpenCut can animate them for vlog work. Same parts feeding both.

Open questions to settle before building it:

- Which parts, and how many joints. Too few and the poses stay stiff, too many
  and the drawing effort defeats the point.
- Whether the parts get drawn once by hand or whether existing art can be cut
  apart. Cutting is faster and likely produces visible seams on the ink outline.
- Whether the 2px black outline survives rotation. Parts drawn with a closed
  outline show gaps at the joints when moved, which usually means overlap
  allowances baked into each part.
- Where the parts live. A shared location both this repo and the Remotion
  project can reach, versus duplicating them.
- Whether stills for posts and frames for video want the same source parts at
  the same resolution.

Until this exists, posts that want illustration are limited to the finished PNGs
already in `public/img/`, and the honest fallback is typographic treatment
instead, which is what the leadership post shipped with.

Do not scaffold a new Remotion project for this. `trash-to-cashback` is the
standing one.
