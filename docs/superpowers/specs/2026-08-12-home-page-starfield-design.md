# Home Page Refresh — Star Map Background & Scroll Reveal — Design Spec

**Date:** 2026-08-12
**Site:** tomatamagotato (GitHub Pages, Nuxt 4 static)
**Addresses:** the "Home page and blog index have not been through the visual identity pass" item in `CLAUDE.md`'s Known Issues, and `2026-08-06-visual-identity-pass.md` §6's "Home page ... not touched"

---

## 1. Why

The home page currently reads as flat and generic: hero, then three stacked sections (art, video, writing), no motion, same look regardless of interaction. The complaint driving this work was that it "feels generic and dated" and needs "dynamism."

The direction landed on through live iteration (canvas prototyping in a brainstorming session) rather than being decided up front: a dark, space-themed canvas background — a field of drifting stars with faint constellation lines — that responds gently to cursor/touch position with an orbital gravity pull. This ties back to an earlier idea (a relativity-diagram grid that dips under the cursor) but the grid approach was dropped mid-session: displacing grid vertices by raw XY push produced visibly glitchy, crossing lines, and even after fixing that with a proper Z-depth + perspective projection, the effect read as too geometric. Stars pulled by gravity is a more physically legible metaphor and was the version that stuck.

## 2. What's changing

### New component: `app/components/home/StarField.vue`

A `position: fixed`, full-viewport `<canvas>` sitting behind all home page content (below the existing `.bg-watermark`, below section content, above the page background color).

**Visual composition, back to front:**
1. Faint static reference gridlines — dark olive (`rgba(74,94,46,~0.16)`), very low opacity, no motion of their own
2. ~46 stars with a `depth` value (0–1) driving size, brightness, and drift speed — closer (higher-depth) stars are bigger, brighter, faster
3. Constellation lines connecting nearby higher-depth stars, opacity falling off with distance, only between stars above a depth threshold (keeps the effect from becoming visual noise)
4. Cyan (`#3ec6f0`) pulse ring pinging periodically on brighter nodes — sci-fi nav-console detail
5. A soft cyan radial glow centered on the cursor/touch point

**Motion:**
- **Ambient drift:** every star has a small constant base velocity (mostly downward, slight horizontal jitter), independent of input. This is what makes the field feel alive at rest.
- **Cursor/touch gravity:** stars within a small radius (~90px) of the pointer get an orbital pull — a radial component toward the pointer plus a perpendicular component, so stars curve/swirl past rather than beelining straight in. Strength is deliberately gentle (tuned down twice during prototyping after "too strong" / "black hole" feedback) — this is meant to read as background ambiance, not a focal interaction. Velocity eases back to the base drift once the pointer moves away or leaves.
- **Scroll parallax:** the whole field offsets slightly based on `window.scrollY` (a small multiplier, not 1:1), so scrolling itself feels like drifting through the field rather than the background being static while content moves over it.
- **Touch:** `touchmove` drives the same pull-origin coordinate the mouse does. No touch = field decays back to ambient drift, same as `mouseleave`.

**Lifecycle:** owns its own `requestAnimationFrame` loop, started in `onMounted`, cancelled in `onUnmounted`. Listens to `mousemove`, `touchmove`, `scroll`, `resize` (resize recalculates canvas dimensions and star bounds).

### Dark-mode gating

`StarField` is only rendered when `useTheme().isDark` is `true` (`app/composables/useTheme.ts` already exposes this as reactive `useState`). In light mode, the home page keeps its current warm-paper look with no canvas mounted — not hidden via CSS, actually unmounted, so the animation loop doesn't run for an invisible layer.

This means toggling theme on the home page now does something structurally different than on other pages: light mode is the existing warm/paper/olive/Blueman identity; dark mode is the new space background, with Blueman art, olive accents, and the writing/video sections still rendering on top as before. Both are "the site," just at different times of day, matching how a personal site plausibly would present itself.

### `prefers-reduced-motion`

Checked on mount via `window.matchMedia('(prefers-reduced-motion: reduce)')`, following the pattern already established in `app/components/work/VideoTabViewer.vue`. When set: no animation frame loop starts. The canvas either isn't mounted, or draws a single static frame (stars in their initial positions, no pulse, no gridlines motion) and stops — matching the "skip autoplay/loop, show a static/native fallback" precedent from the Work page video work.

### Scroll-reveal on sections

The art gallery, video section, and writing section fade/slide in as they enter the viewport, using an IntersectionObserver — the same mechanism `app/composables/useReport.ts` already uses for blog post reveal animations. Rather than importing `useReport()` wholesale (it also owns scrollspy/TOC-highlighting and animated stat bars, neither of which applies to the home page), a small new composable extracts just the reveal-observer piece:

**New composable: `app/composables/useScrollReveal.ts`**
- Takes a list of element refs (or a shared class selector) and applies a `.revealed` class when each enters the viewport
- CSS transition (opacity + small translateY) lives in `home.css`, guarded the same way the existing global theme-transition is (`:where()`, per the established rule in `CLAUDE.md` about not letting global transition selectors carry specificity that overrides component-level transitions)
- Respects `prefers-reduced-motion`: if set, sections render fully visible immediately, no observer needed

## 3. Scope boundaries

**In scope:** `app/pages/index.vue` and its stylesheet (`app/assets/css/home.css`), one new component (`StarField.vue`), one new composable (`useScrollReveal.ts`).

**Not in scope:**
- Work page, Blog index, Blog posts — untouched
- Hero copy, art gallery grid contents, video embed, writing card contents — structurally unchanged; this is a background + reveal-motion layer, not a content redesign
- No full pinned/snapping scroll narrative (considered and explicitly rejected — see §4)
- No new font imports, no new dependencies (canvas + native APIs only, consistent with the site's no-framework CSS/vanilla-JS approach)

## 4. Alternatives considered

**Grid displacement instead of stars (rejected).** Prototyped first: a line grid whose vertices push away from the cursor, relativity-diagram style. Two failure modes: raw XY vertex displacement produced glitchy, crossing lines when neighboring vertices moved at different rates; fixing that with proper Z-depth + perspective projection solved the glitching but the result still read as too rigid/geometric for "dynamism." Stars — a particle field with gravity-like pull — matched the "outer space" and "alive but gentle" feedback much better once tried.

**Full pinned-section scroll narrative (rejected).** Considered restructuring the page into full-viewport-height scroll "beats" with pinning/snapping between hero → art → video → writing, camera-like movement through the star field between sections. Rejected as disproportionate for a personal portfolio home page: meaningfully more custom scroll-hijacking code, higher risk of scroll-jank and motion-sickness complaints, harder to reconcile with `prefers-reduced-motion`. The chosen approach (scroll-reveal + scroll-linked parallax on the existing fixed background) gets most of the "alive while scrolling" feeling at a fraction of the complexity and risk.

**Star map always on, regardless of theme (rejected).** Considered making dark the home page's permanent look. Rejected in favor of gating on the existing theme toggle — keeps the toggle meaningful on every page, and preserves the light warm-paper identity that's still the site's primary look on Work/Blog.

## 5. Open questions / follow-ups

None blocking. One note for later: this leaves light-mode home page and dark-mode home page as two visually distinct experiences by design (see §2). If that ever reads as inconsistent rather than intentional, revisit — but that's a live-with-it-and-see call, not a pre-decision to make now.
