# Visual Identity Pass — Theme Toggle & Work Page

**Date:** 2026-08-06
**Site:** tomatamagotato (GitHub Pages, Nuxt 4 static)
**Supersedes in part:** `2026-04-06-portfolio-redesign-design.md` (theming mechanism, Work page copy and visual treatment)

---

## 1. Why this happened

The complaint that started it: "it's so obvious that it's AI generated." Followed immediately by a correction that mattered, because it invalidated the obvious first guess: "it's not the read, it's the visual and overall design." The prose was not the problem. The visual layer was.

Scope was then narrowed by hand, twice. First to the theme toggle ("switching is not graceful at all"), then to the Work page ("work looks generic").

Two decisions were made explicitly and should not be relitigated without cause:

- **No Remotion.** Remotion renders video and stills from React. The Work page is static HTML on GitHub Pages. Adding it would have meant a build-time dependency for a decorative result. Playfulness was delivered in CSS and inline SVG instead.
- **Copy voice: plain and direct, still credible to a stranger.** Sentence case, no LinkedIn abstractions, but a recruiter or client landing here should not find it unserious. Playfulness lives in the visuals; the claims stay restrained.

---

## 2. What changed

### Theme system

The theme class moved from a layout-rendered wrapper `<div>` to `<html>`, and `<html>` became the single source of truth.

| Before | After |
|---|---|
| `themeClass` bound to a `<div>` in each layout | Class written to `document.documentElement` by `useTheme().apply()` |
| Class applied on mount, after first paint | Inline script in `nuxt.config.ts` stamps it before first paint |
| No transition — colors snapped | 150ms cross-fade on `background-color`, `border-color`, `color` |
| Emoji glyph swap in `ThemeToggle.vue` | Inline SVG: rays retract, an SVG `<mask>` slides across to carve a crescent |

**Why the wrapper `<div>` had to go.** With the pre-paint script writing to `<html>` and a layout also rendering `:class="themeClass"`, the SSR-rendered wrapper wins for anything scoped beneath it, and the flash comes back. The two mechanisms cannot coexist. Layouts now render a bare `<div>` and only call `init()`.

**Why `:where()` on the transition.** The obvious selector, `.theme-light *`, has specificity 0,2,0. That is enough to override the `transition` shorthand declarations in `report.css` (lines 201, 339, 433, 496, 571), which own the IntersectionObserver reveal animations and the animated stat bars. A global theme transition written that way silently breaks scroll behavior on the long-form posts, with no error and no visual clue on the page you are actually testing. `:where()` carries zero specificity and avoids the whole class of problem. Two earlier attempts, one using `body *` with `!important`, were discarded for this reason.

**Why `ThemeToggle.vue` keys off its own state, not an ancestor.** `:global(.theme-dark) .icon-rays` inside a Vue `<style scoped>` block is dropped by the compiler. This was verified by enumerating `document.styleSheets`: only the base rules survived, so the icon never animated. The component now binds `:class="{ 'is-dark': isDark }"` on the SVG and keys off `.is-dark`. Anything in a scoped block that needs to react to the theme must do the same, because the theme class is on `<html>` and scoped styles cannot reach it.

### Work page

**Diagnosis: the copy was doing most of the damage.** The page said "translating ambiguous problems into structured, scalable solutions" while sitting on a site whose home page reads "i make things. some useful. some just weird." and whose mascot is a hand-drawn blue cartoon. Four visually identical cards with uniform left-border accents did the rest. Swap the nouns and it is any consultant's site.

**Visual direction was taken from the Blueman art already in the repo,** which the Work page was not using at all. Thick black outlines, flat fills, a hand-drawn wobble. Translated to CSS:

- `2px solid #1a1a1a` card borders
- `box-shadow: 5px 5px 0` — a hard offset, reading as an underdrawing peeking out, not a soft drop shadow
- `#3ec6f0` lifted directly from the mascot, promoted to a secondary accent beside the existing olive
- Signature element: a hand-drawn cyan SVG stroke under one word in the headline, drawn on load via `stroke-dasharray` over 0.7s

**Structure now encodes something true.** Every project in the list is the same shape: a manual process replaced by an enforced one. So every card ends in a Before/After pair. That is the actual through-line, and it replaced a decorative arrow that meant nothing.

**Deliberately absent:** `01 / 02 / 03` numbering on the cards, and numbering on the "how I work" list. Neither is a sequence. Numbering them would be decoration claiming to be information. The approach list is a responsive grid with hand-inked check marks instead.

**Every factual claim from the previous copy was preserved.** Nothing was invented, and the anonymity constraint holds: no employers or clients are named.

---

## 3. Bugs found while doing the above

Both pre-existing, neither related to the requested work.

**Body background was transparent on every route.** `html` and `body` both computed to `rgba(0,0,0,0)`. It looked correct only because the browser propagates an `html` background to the canvas, and because `home.css` was bundled globally so its body rule happened to apply everywhere. Any page whose stylesheet omitted a background was one bundling change away from rendering wrong. Theme surfaces are now set explicitly for both `html` and `body` in `global.css`. `background-color` does not inherit; this must stay centralized.

**Mobile nav overflowed.** At a 375px viewport, `scrollWidth` was 415px, producing a horizontal scrollbar, with the wordmark colliding with the "Home" link. Fixed with `flex-shrink: 0` on `.nav-links`, ellipsis truncation on the wordmark, and a 480px breakpoint that drops the wordmark entirely. The badge still identifies the site. Verified `overflows: false` afterward.

---

## 4. Files changed

| File | Change |
|---|---|
| `app/assets/css/global.css` | Theme surfaces for `html` + `body`; `:where()` theme transition; nav mobile overflow fixes |
| `app/assets/css/work.css` | Rewritten — ink visual language |
| `app/assets/css/home.css` | Selectors moved off `body.theme-*` to the `.theme-*, .theme-* body` form |
| `app/assets/css/post.css` | Same selector move. Retains its own `color`, which correctly still wins over `global.css` |
| `app/components/ThemeToggle.vue` | Rewritten — animated SVG, keyed off local `is-dark` |
| `app/composables/useTheme.ts` | Added `apply()`; `<html>` is now the single source of truth |
| `app/layouts/default.vue`, `app/layouts/dark.vue` | Removed `:class="themeClass"` from the wrapper |
| `app/pages/work/index.vue` | Rewritten — copy and Before/After structure; `approach` moved into `<script setup>` |
| `nuxt.config.ts` | Pre-paint theme script in `app.head.script` |

---

## 5. Verification

`npx nuxi generate` — 12 routes prerendered, clean. Pre-paint script confirmed present in the generated HTML.

Checked in a real browser rather than assumed:

- `/work` dark resolves `bodyBg: rgb(15,15,15)`
- `/blogs` retains `post.css`'s `rgb(221,213,204)`, confirming `:where()` did not override it
- `.blog-card` retains its own `border-left-color, transform, box-shadow` transition, confirming component motion survived
- Mid-toggle sample read `bg: rgb(19,19,19)` easing toward `15,15,15`, confirming the cross-fade animates rather than snapping
- 375px viewport reports `overflows: false`

---

## 6. Still open

**`post.css` has no light-theme variants.** It defines dark colors only. Now that the toggle genuinely reaches blog pages, light mode renders near-white text on the paper background and is unreadable. This is a real readability bug, not a style preference. Two options, undecided:

1. Add `.theme-light` rules to `post.css` so blog pages respect the toggle like the rest of the site.
2. Force dark on blog routes and hide the toggle there, making the `dark` layout name honest.

**Home page and blog index were not touched.** The original complaint was about the site as a whole. Only the theme toggle and the Work page have been through this pass.
