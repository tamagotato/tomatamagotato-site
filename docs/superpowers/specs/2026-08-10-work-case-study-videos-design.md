# Work page case-study videos — design

**Date:** 2026-08-10
**Site:** tomatamagotato (GitHub Pages, Nuxt 4 static)
**Revisits:** `2026-08-06-visual-identity-pass.md`, §1 — "No Remotion" decision

---

## 1. Why this happened

Nine short interaction-simulation mockups exist (built in a separate Remotion project, `RemotionStudio`, over a prior session): animated demos of UI flows for an attendance/utilization tracking system — clock-in/activity-switch logic, large-team grouping, bulk overtime operations, adjustment/rest-day tooling, night-shift and past-week edge cases. Each is a cursor-driven simulation of a real interaction, built from a real UX brainstorm session but fully anonymized: no client branding, no real employee names, fictional placeholder data only.

The 2026-08-06 visual identity pass explicitly rejected Remotion/video on the Work page: "Adding it would have meant a build-time dependency for a decorative result." That decision stands for decoration. It does not apply here — these clips are not decorative motion, they're functional proof of the product thinking described in the card copy (e.g. Card 1's claim that "activity tracking is configurable to handle teams running several service streams at once" is exactly what the Activity Tracker clip demonstrates). This spec revisits the decision on that basis, scoped narrowly to case-study demo video, not general-purpose page animation.

## 2. Scope

Of the Work page's 4 cards, 3 have matching clips:

| Card | Clips | Count |
|---|---|---|
| Attendance and utilization tracking | Attendance, Activity Tracker, Grouping, Night Shift, Past Weeks | 5 |
| Overtime governance | Add OT (Bulk Ops), Partial Failure | 2 |
| Operations dashboard | — | 0 |
| Workflow standardization | Create Adjustment, Mark Rest | 2 |

Card 3 (Operations dashboard) has no matching demo and is untouched by this work.

## 3. Approach

**Dedicated sub-pages, not inline card content.** Card 1 alone has 5 clips — too many to embed in the card itself without turning it into a slideshow. Three new routes under `/work/`, one per card that has clips:

- `/work/attendance-utilization`
- `/work/overtime-governance`
- `/work/workflow-standardization`

Cards 1, 2, and 4 on `/work` become fully clickable links to their sub-page (whole card, not just a text link — consistent with how the rest of the site treats card-shaped things as single hit targets). They also gain a small ink-styled "case study" badge, visually similar to the existing `.work-tag` chip, so it's clear at a glance which cards lead somewhere. Card 3 is untouched — no badge, no link, same as every card today.

**Delivery format: WebM, not GIF.** Confirmed via test render (`WorkMockupAttendance`, 280 frames, vp8 codec): 223KB. GIF would have been several times larger for the same clip and can't be paused/lazy-loaded the way `<video>` can. Videos use `autoplay loop muted playsinline` so they behave like GIFs to the viewer (no controls, no sound) while costing a fraction of the bytes.

## 4. Sub-page structure

Each sub-page reuses the site's existing page chrome — same intro heading treatment, olive/cyan palette, ink visual language as `/work` — and adds:

1. A back-link to `/work`
2. A short intro (1-2 sentences, matching the parent card's framing)
3. A tabbed video viewer: a horizontal tab strip (clip names — e.g. "Attendance", "Activity tracker", "Grouping", "Night shift", "Past weeks" for the Attendance page) above one video player. Clicking a tab swaps the active clip.
4. Below the tab strip: a 1-2 sentence caption for the active clip, then the video itself in an ink-bordered "screen" frame — 2px black border, hard offset box-shadow, rounded corners, matching `.work-card`'s existing treatment so the player reads as part of the same visual system rather than a foreign embed.

Only the active tab's video is mounted and playing; switching tabs unmounts the previous one so multiple clips never autoplay simultaneously.

## 5. Components

**New shared component**, e.g. `app/components/work/VideoTabViewer.vue`:
- Props: a list of `{ label: string, caption: string, src: string }` entries
- Renders the tab strip + ink-framed `<video>` for the active entry
- No other logic — active-tab state only, no analytics/tracking

**New pages**, `app/pages/work/attendance-utilization.vue`, `overtime-governance.vue`, `workflow-standardization.vue`:
- Each imports `VideoTabViewer` and passes its own clip list
- Each gets its own `useHead({ title: ... })`
- Styling: extend `work.css` (or a new `work-case-study.css` if the additions are substantial enough to warrant separating from the card-grid styles — decide during implementation based on actual size)

**Modified**: `app/pages/work/index.vue` — cards 1, 2, 4 wrapped in `<NuxtLink>` to their sub-page route; badge markup added to those three cards' headers.

## 6. Assets

- Render all 9 `WorkMockup*` Remotion compositions to WebM (`--codec=vp8`, matching the confirmed-working test render)
- Store in `tomatamagotato-site/public/videos/work/`, named to match tab slugs: `attendance.webm`, `activity-tracker.webm`, `grouping.webm`, `night-shift.webm`, `past-weeks.webm`, `add-ot.webm`, `partial-failure.webm`, `create-adjustment.webm`, `mark-rest.webm`
- Filenames are URL-safe (lowercase, hyphenated) per the existing repo convention for `public/img/`

## 7. Out of scope

- No changes to Card 3 (Operations dashboard) beyond leaving it exactly as-is
- No static thumbnail/preview generation for the `/work` cards themselves — whole-card-click was chosen over an inline video teaser
- No full before/after narrative reproduced per-tab on the sub-pages — a short caption line is enough, the fuller Before/After structure stays unique to the `/work` cards
- No changes to `post.css`'s light-theme gap (tracked separately in the 2026-08-06 spec's "Still open" section)

## 8. Verification plan

- `npx nuxi generate` — confirm all 3 new routes prerender cleanly alongside the existing 12
- Manual check in a real browser: each sub-page's tab strip switches clips correctly, only one video plays at a time, ink frame renders in both light and dark theme, cards 1/2/4 navigate correctly and Card 3 remains inert
- Confirm total added asset weight is reasonable for a static GitHub Pages site (expect low single-digit MB total across all 9 clips based on the 223KB test render)
