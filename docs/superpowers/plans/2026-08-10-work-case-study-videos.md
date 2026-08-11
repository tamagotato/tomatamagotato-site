# Work Case-Study Videos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 case-study sub-pages to the Work section, each showing a tabbed set of short interaction-demo videos, and link the 3 relevant Work cards to them.

**Architecture:** Nine Remotion compositions (already built in the separate `RemotionStudio` project) get rendered to WebM and copied into this repo's `public/videos/work/`. A new shared `VideoTabViewer.vue` component renders a tab strip plus one ink-framed `<video>`, swapping the active clip on tab click. Three new pages under `app/pages/work/` each configure `VideoTabViewer` with their own clip list. `app/pages/work/index.vue` gets its cards 1, 2, and 4 wrapped as full-card links (matching the existing `.blog-index-card` link pattern) with a small badge added to signal they lead to a case study.

**Tech Stack:** Nuxt 4 (static generation via `nuxi generate`), plain `<a href>` for internal nav (no NuxtLink in this codebase), hand-written CSS per page following the `.theme-light`/`.theme-dark` prefix pattern, Remotion CLI (via WSL) for video rendering.

## Global Constraints

- No client branding, no real employee names anywhere in captions or tab labels — fictional placeholder data only (per repo CLAUDE.md and the design spec).
- Video delivery format is WebM (`vp8` codec), not GIF — confirmed working via test render (223KB for a 280-frame clip).
- Videos play via `<video autoplay loop muted playsinline>` — no visible controls, no sound.
- Only the active tab's video may be mounted/playing at any time; switching tabs must not leave the previous video running in the background.
- Visual framing must match the existing ink language: `2px solid #1a1a1a` border, `box-shadow: 5px 5px 0 #1a1a1a` (light) / `5px 5px 0 #000` (dark), `border-radius: 14px` — same values `.work-card` already uses in `work.css`.
- Card 3 (Operations dashboard) is explicitly out of scope — no link, no badge, no changes.
- Filenames under `public/videos/work/` must be URL-safe: lowercase, hyphenated, no spaces (repo convention already enforced for `public/img/`).
- Internal navigation uses plain `<a href="...">`, matching `.blog-index-card` — this codebase does not use `<NuxtLink>`.

---

## Task 1: Render remaining 8 WebM assets and stage all 9 in this repo

**Files:**
- Create: `tomatamagotato-site/public/videos/work/attendance.webm`
- Create: `tomatamagotato-site/public/videos/work/activity-tracker.webm`
- Create: `tomatamagotato-site/public/videos/work/grouping.webm`
- Create: `tomatamagotato-site/public/videos/work/night-shift.webm`
- Create: `tomatamagotato-site/public/videos/work/past-weeks.webm`
- Create: `tomatamagotato-site/public/videos/work/add-ot.webm`
- Create: `tomatamagotato-site/public/videos/work/partial-failure.webm`
- Create: `tomatamagotato-site/public/videos/work/create-adjustment.webm`
- Create: `tomatamagotato-site/public/videos/work/mark-rest.webm`

**Interfaces:**
- Produces: 9 WebM files at the paths above, each playable via a plain `<video src="/videos/work/<name>.webm">` tag once the site is generated. No code depends on internal video structure — only the file paths matter to later tasks.

**Context:** One test render already exists at `C:\Users\warri\personalProjects\RemotionStudio\out\webm\attendance.webm` (223KB, confirmed working, `vp8` codec). The other 8 Remotion composition IDs are already registered in `RemotionStudio/src/Root.tsx`: `WorkMockupActivityTracker`, `WorkMockupGrouping`, `WorkMockupBulkOps`, `WorkMockupBulkAdjustment`, `WorkMockupMarkRest`, `WorkMockupPartialFailure`, `WorkMockupNightShift`, `WorkMockupPastWeeks`. Remotion CLI only runs inside WSL from this Windows checkout (POSIX-only bin shims) — invoke via `wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && ..."`.

- [ ] **Step 1: Render the 8 remaining compositions to WebM**

Run each of these from the Windows shell (WSL invocation wraps every command):

```bash
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupActivityTracker out/webm/activity-tracker.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupGrouping out/webm/grouping.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupBulkOps out/webm/add-ot.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupBulkAdjustment out/webm/create-adjustment.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupMarkRest out/webm/mark-rest.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupPartialFailure out/webm/partial-failure.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupNightShift out/webm/night-shift.webm --codec=vp8"
wsl.exe -- bash -lc "cd /mnt/c/Users/warri/personalProjects/RemotionStudio && npx remotion render src/index.ts WorkMockupPastWeeks out/webm/past-weeks.webm --codec=vp8"
```

Expected: each command ends with a line like `+  out/webm/<name>.webm  <size> kB`, no errors.

- [ ] **Step 2: Verify all 9 files exist and are non-trivially sized**

```bash
wsl.exe -- bash -lc "ls -la /mnt/c/Users/warri/personalProjects/RemotionStudio/out/webm/"
```

Expected: 9 `.webm` files listed, each larger than 20KB (a near-empty/failed render would be a few hundred bytes).

- [ ] **Step 3: Copy all 9 files into this repo's public assets**

```bash
mkdir -p "C:\Users\warri\personalProjects\tomatamagotato-site\public\videos\work"
```

Then copy (Windows path, from the Bash tool):

```bash
cp /c/Users/warri/personalProjects/RemotionStudio/out/webm/*.webm "/c/Users/warri/personalProjects/tomatamagotato-site/public/videos/work/"
```

- [ ] **Step 4: Verify the copy landed correctly**

```bash
ls -la "C:\Users\warri\personalProjects\tomatamagotato-site\public\videos\work"
```

Expected: exactly these 9 files present — `attendance.webm`, `activity-tracker.webm`, `grouping.webm`, `night-shift.webm`, `past-weeks.webm`, `add-ot.webm`, `partial-failure.webm`, `create-adjustment.webm`, `mark-rest.webm`.

- [ ] **Step 5: Commit**

```bash
git add public/videos/work/
git commit -m "feat: add case-study demo videos for the Work page"
```

---

## Task 2: Build the shared VideoTabViewer component

**Files:**
- Create: `app/components/work/VideoTabViewer.vue`

**Interfaces:**
- Consumes: nothing from earlier tasks (first component task).
- Produces: a component usable as:
  ```vue
  <VideoTabViewer :clips="[
    { label: 'Attendance', caption: '...', src: '/videos/work/attendance.webm' },
    ...
  ]" />
  ```
  Prop shape: `clips: { label: string; caption: string; src: string }[]`. Later tasks (3, 4, 5) import this component and pass their own `clips` array under this exact shape.

**Context:** No existing component in this repo does tabbed switching, so there's no local pattern to follow beyond the general `.theme-light`/`.theme-dark` prefixing convention used throughout `work.css` and `global.css`. Styling values (border, shadow, radius) must match `.work-card` exactly, per the Global Constraints section above.

- [ ] **Step 1: Write the component**

```vue
<template>
  <div class="video-tab-viewer">
    <div class="video-tabs" role="tablist">
      <button
        v-for="(clip, i) in clips"
        :key="clip.label"
        type="button"
        role="tab"
        :aria-selected="i === activeIndex"
        class="video-tab"
        :class="{ 'is-active': i === activeIndex }"
        @click="activeIndex = i"
      >
        {{ clip.label }}
      </button>
    </div>

    <p class="video-caption">{{ activeClip.caption }}</p>

    <div class="video-frame">
      <video
        :key="activeClip.src"
        :src="activeClip.src"
        autoplay
        loop
        muted
        playsinline
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Clip {
  label: string
  caption: string
  src: string
}

const props = defineProps<{ clips: Clip[] }>()

const activeIndex = ref(0)
const activeClip = computed(() => props.clips[activeIndex.value])
</script>

<style scoped>
.video-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.video-tab {
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  border: 2px solid #1a1a1a;
  background: #fbf9f4;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}

.video-tab.is-active {
  background: #3ec6f0;
}

.video-caption {
  font-size: 0.93rem;
  color: #4a4a4a;
  line-height: 1.6;
  margin-bottom: 16px;
}

.video-frame {
  border: 2px solid #1a1a1a;
  border-radius: 14px;
  box-shadow: 5px 5px 0 #1a1a1a;
  overflow: hidden;
  background: #000;
}

.video-frame video {
  display: block;
  width: 100%;
  height: auto;
}

:global(.theme-dark) .video-tab {
  background: #17171a;
  border-color: #3a3a3a;
  color: #f0ece4;
}

:global(.theme-dark) .video-tab.is-active {
  background: #3ec6f0;
  color: #0f0f0f;
  border-color: #0f0f0f;
}

:global(.theme-dark) .video-caption {
  color: #a9a29a;
}

:global(.theme-dark) .video-frame {
  border-color: #3a3a3a;
  box-shadow: 5px 5px 0 #000;
}
</style>
```

Note: `:key="activeClip.src"` on the `<video>` forces Vue to destroy and recreate the element on tab switch, which stops the previous clip's playback rather than leaving it running detached in memory — this satisfies the "only the active tab's video may be playing" constraint without extra lifecycle code.

- [ ] **Step 2: Manual verification (no test framework in this repo — confirmed via CLAUDE.md: "There is no test suite and no linter configured")**

Run the dev server and check the component renders with placeholder data. Create a temporary scratch check by running:

```bash
npm run dev
```

Then in a browser at the dev server's local URL, navigate to any page and confirm no console errors are thrown by importing the component (it won't be wired into a page until Task 3, so this step just confirms the file is syntactically valid — proceed if `npm run dev` starts cleanly with no Vue compiler errors referencing `VideoTabViewer.vue`).

- [ ] **Step 3: Commit**

```bash
git add app/components/work/VideoTabViewer.vue
git commit -m "feat: add VideoTabViewer component for case-study demo pages"
```

---

## Task 3: Build the attendance-utilization case-study page

**Files:**
- Create: `app/pages/work/attendance-utilization.vue`
- Create: `app/assets/css/work-case-study.css`

**Interfaces:**
- Consumes: `VideoTabViewer` from Task 2 (`app/components/work/VideoTabViewer.vue`, prop `clips: { label, caption, src }[]`). Nuxt auto-imports components under `app/components/`, so no explicit import statement is needed — `<VideoTabViewer>` resolves automatically in the template.
- Produces: the page at route `/work/attendance-utilization`, and the shared stylesheet `work-case-study.css` that Tasks 4 and 5 will also reference via `<style src="~/assets/css/work-case-study.css">`.

**Context:** This is the first of the 3 sub-pages and establishes the shared page-shell markup and CSS that Tasks 4 and 5 will reuse verbatim (only the intro copy, back-link text, and `clips` array differ between the three). Follows the intro-heading pattern already used in `work/index.vue` (`.work-intro h1` / `p`) and the back-link pattern from `.blog-index-card` for consistency, but as a single link rather than a card grid.

- [ ] **Step 1: Write the page**

```vue
<template>
  <div class="case-study-page">
    <a class="case-study-back" href="/work">&larr; Back to work</a>

    <div class="case-study-intro">
      <h1>Attendance and utilization tracking</h1>
      <p>Five pieces of the same system: viewing attendance detail, tracking activity across service streams, managing large teams, and handling the edge cases that come with real shift schedules.</p>
    </div>

    <VideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Attendance and utilization tracking | tomatamagotato' })

const clips = [
  {
    label: 'Attendance',
    caption: 'Viewing a shift bar pulls up the day\'s attendance detail without leaving the schedule view.',
    src: '/videos/work/attendance.webm'
  },
  {
    label: 'Activity tracker',
    caption: 'Stopping then starting a new activity inserts an Idle row for the gap. Switching directly between activities does not \u2014 the timer never stops.',
    src: '/videos/work/activity-tracker.webm'
  },
  {
    label: 'Grouping',
    caption: 'Large teams collapse into headers with filter chips, so a manager can narrow to who is on shift right now.',
    src: '/videos/work/grouping.webm'
  },
  {
    label: 'Night shift',
    caption: 'A shift spanning midnight reads as one continuous block, with a boundary marker rather than being split across two days.',
    src: '/videos/work/night-shift.webm'
  },
  {
    label: 'Past weeks',
    caption: 'Past weeks are read-only. The current week can carry a double shift, shown as two stacked bars on the same day.',
    src: '/videos/work/past-weeks.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
```

- [ ] **Step 2: Write the shared case-study stylesheet**

```css
/* ── Case Study Pages ──
   Shared by all /work/<slug> sub-pages. Same ink visual language as work.css:
   thick outlines, flat fills, hard offset shadows. */

.case-study-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 56px 24px 96px;
}

.case-study-back {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 32px;
  color: #6b8c3e;
}

.case-study-back:hover { opacity: 0.75; }

.case-study-intro {
  max-width: 620px;
  margin-bottom: 40px;
}

.case-study-intro h1 {
  font-size: clamp(1.7rem, 3.6vw, 2.3rem);
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

.case-study-intro p {
  font-size: 1.02rem;
  color: #4a4a4a;
  line-height: 1.7;
}

.theme-dark .case-study-back { color: #8aaa55; }
.theme-dark .case-study-intro h1 { color: #f0ece4; }
.theme-dark .case-study-intro p { color: #a9a29a; }

@media (max-width: 640px) {
  .case-study-page { padding: 40px 20px 64px; }
}
```

- [ ] **Step 3: Verify the page renders**

```bash
npm run dev
```

Navigate to `http://localhost:3000/work/attendance-utilization` (adjust port if the dev server reports a different one). Confirm:
- The 5 tabs appear (Attendance, Activity tracker, Grouping, Night shift, Past weeks)
- Clicking each tab swaps the video and its caption
- Only one video plays at a time (open browser dev tools, Elements panel, confirm only one `<video>` element exists in the DOM at a time — the `:key`-based remount means the previous one is fully removed, not just paused)
- Toggle the site's dark/light theme control and confirm the page and video frame both switch correctly

- [ ] **Step 4: Commit**

```bash
git add app/pages/work/attendance-utilization.vue app/assets/css/work-case-study.css
git commit -m "feat: add attendance-utilization case-study page"
```

---

## Task 4: Build the overtime-governance case-study page

**Files:**
- Create: `app/pages/work/overtime-governance.vue`

**Interfaces:**
- Consumes: `VideoTabViewer` (Task 2), `work-case-study.css` (Task 3, referenced via `<style src="~/assets/css/work-case-study.css">` — no changes needed to the stylesheet itself).
- Produces: the page at route `/work/overtime-governance`.

**Context:** Same page shell as Task 3, different intro copy and a 2-entry `clips` array covering the overtime/validation flows.

- [ ] **Step 1: Write the page**

```vue
<template>
  <div class="case-study-page">
    <a class="case-study-back" href="/work">&larr; Back to work</a>

    <div class="case-study-intro">
      <h1>Overtime governance</h1>
      <p>Overtime requests get validated before they're approved, not after. These two clips show the batch-approval flow and what happens when one request in a batch fails validation.</p>
    </div>

    <VideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Overtime governance | tomatamagotato' })

const clips = [
  {
    label: 'Add overtime',
    caption: 'Selecting multiple team members and filing overtime for all of them in one batch action.',
    src: '/videos/work/add-ot.webm'
  },
  {
    label: 'Partial failure',
    caption: 'When one request in a batch breaks policy, the system applies the rest and flags only the one that failed \u2014 nothing silently succeeds or silently fails as a group.',
    src: '/videos/work/partial-failure.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
```

- [ ] **Step 2: Verify the page renders**

```bash
npm run dev
```

Navigate to `http://localhost:3000/work/overtime-governance`. Confirm both tabs (Add overtime, Partial failure) switch correctly, captions match the active tab, and dark/light theme both render correctly.

- [ ] **Step 3: Commit**

```bash
git add app/pages/work/overtime-governance.vue
git commit -m "feat: add overtime-governance case-study page"
```

---

## Task 5: Build the workflow-standardization case-study page

**Files:**
- Create: `app/pages/work/workflow-standardization.vue`

**Interfaces:**
- Consumes: `VideoTabViewer` (Task 2), `work-case-study.css` (Task 3).
- Produces: the page at route `/work/workflow-standardization`.

**Context:** Same page shell pattern as Tasks 3 and 4, with a 2-entry `clips` array covering the adjustment and rest-day tooling.

- [ ] **Step 1: Write the page**

```vue
<template>
  <div class="case-study-page">
    <a class="case-study-back" href="/work">&larr; Back to work</a>

    <div class="case-study-intro">
      <h1>Workflow standardization</h1>
      <p>Bulk tools for keeping a schedule consistent across a team: applying an adjustment across people who don't share the same template, and marking a rest day without touching each record by hand.</p>
    </div>

    <VideoTabViewer :clips="clips" />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Workflow standardization | tomatamagotato' })

const clips = [
  {
    label: 'Create adjustment',
    caption: 'Applying a schedule adjustment across a selection that spans more than one template surfaces a heterogeneity warning before it goes through.',
    src: '/videos/work/create-adjustment.webm'
  },
  {
    label: 'Mark rest',
    caption: 'Marking a rest day for a selected group in one action instead of editing each person\'s record individually.',
    src: '/videos/work/mark-rest.webm'
  }
]
</script>

<style src="~/assets/css/work-case-study.css"></style>
```

- [ ] **Step 2: Verify the page renders**

```bash
npm run dev
```

Navigate to `http://localhost:3000/work/workflow-standardization`. Confirm both tabs (Create adjustment, Mark rest) switch correctly, captions match, dark/light theme both render correctly.

- [ ] **Step 3: Commit**

```bash
git add app/pages/work/workflow-standardization.vue
git commit -m "feat: add workflow-standardization case-study page"
```

---

## Task 6: Link Work page cards 1, 2, 4 to their case studies and add the case-study badge

**Files:**
- Modify: `app/pages/work/index.vue:12-31` (Card 1 — Attendance and utilization tracking)
- Modify: `app/pages/work/index.vue:33-52` (Card 2 — Overtime governance)
- Modify: `app/pages/work/index.vue:75-94` (Card 4 — Workflow standardization)
- Modify: `app/assets/css/work.css` (add `.work-card-link` and `.work-case-badge` rules)

**Interfaces:**
- Consumes: routes created in Tasks 3, 4, 5 (`/work/attendance-utilization`, `/work/overtime-governance`, `/work/workflow-standardization`).
- Produces: nothing consumed by later tasks — this is the final task.

**Context:** Card 3 (Operations dashboard, `index.vue:54-73`) is explicitly untouched. The existing `.work-card` is a `<div>`; converting cards 1/2/4 to links means wrapping each card's contents in an `<a>` while keeping the `.work-card` class on that `<a>` so all existing card styling (border, shadow, hover transform) continues to apply unchanged — `<a>` accepts the same box-model CSS as `<div>`. This mirrors how `.blog-index-card` is already an `<a>` with card-like styling in `blogs/index.vue`.

- [ ] **Step 1: Convert Card 1 to a link and add the badge**

In `app/pages/work/index.vue`, replace:

```html
      <div class="work-card">
        <div class="work-card-header">
          <h3>Attendance and utilization tracking</h3>
          <span class="work-tag">workforce systems</span>
        </div>
```

with:

```html
      <a class="work-card work-card-link" href="/work/attendance-utilization">
        <div class="work-card-header">
          <h3>Attendance and utilization tracking</h3>
          <span class="work-tag">workforce systems</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
```

Then change the closing tag for this card from `</div>` to `</a>` — this is the `</div>` immediately after the closing `</div>` of `.work-shift` for this card (originally line 31 in the file as read).

- [ ] **Step 2: Convert Card 2 to a link and add the badge**

Same pattern. Replace:

```html
      <div class="work-card">
        <div class="work-card-header">
          <h3>Overtime governance</h3>
          <span class="work-tag">process governance</span>
        </div>
```

with:

```html
      <a class="work-card work-card-link" href="/work/overtime-governance">
        <div class="work-card-header">
          <h3>Overtime governance</h3>
          <span class="work-tag">process governance</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
```

Change this card's closing `</div>` to `</a>`.

- [ ] **Step 3: Convert Card 4 to a link and add the badge**

Replace:

```html
      <div class="work-card">
        <div class="work-card-header">
          <h3>Workflow standardization</h3>
          <span class="work-tag">operational design</span>
        </div>
```

with:

```html
      <a class="work-card work-card-link" href="/work/workflow-standardization">
        <div class="work-card-header">
          <h3>Workflow standardization</h3>
          <span class="work-tag">operational design</span>
        </div>
        <span class="work-case-badge">case study &rarr;</span>
```

Change this card's closing `</div>` to `</a>`. Card 3 (Operations dashboard) is left completely unchanged — still a plain `<div class="work-card">`.

- [ ] **Step 4: Add link and badge styling to work.css**

Append to `app/assets/css/work.css`, after the existing `.work-card:hover, .work-card:focus-within` rule (around line 117):

```css
/* ── Case-study links ──
   Cards 1, 2, 4 link out to a dedicated demo page; Card 3 (dashboard) has no
   matching demo and stays a plain, non-interactive card. */
.work-card-link {
  text-decoration: none;
  display: block;
}

.work-case-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #1a1a1a;
  background: #f5f2ea;
  border: 2px solid #1a1a1a;
  padding: 3px 10px;
  border-radius: 20px;
  margin-top: 16px;
}

.theme-dark .work-case-badge {
  color: #f0ece4;
  background: #0f0f0f;
  border-color: #3a3a3a;
}
```

- [ ] **Step 5: Verify in the browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/work`. Confirm:
- Cards 1, 2, 4 show the "case study →" badge and are clickable anywhere on the card, navigating to their respective sub-pages
- Card 3 (Operations dashboard) has no badge and is not a link — clicking it does nothing
- Existing card hover effect (shadow shift) still works on all 4 cards
- Dark and light theme both render the badge correctly

- [ ] **Step 6: Full site generation check**

```bash
npx nuxi generate
```

Expected: build completes with no errors, and the output lists all 3 new routes (`/work/attendance-utilization`, `/work/overtime-governance`, `/work/workflow-standardization`) alongside the existing routes.

- [ ] **Step 7: Commit**

```bash
git add app/pages/work/index.vue app/assets/css/work.css
git commit -m "feat: link Work page cards to their case-study demo pages"
```
