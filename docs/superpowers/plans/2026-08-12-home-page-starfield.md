# Home Page Star-Field Background & Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the home page (dark mode only) a fixed-background canvas star field with cursor/touch-reactive gravity and scroll parallax, plus scroll-reveal fade-in on the existing art/video/writing sections.

**Architecture:** A new self-contained `StarField.vue` component owns a `<canvas>`, its own `requestAnimationFrame` loop, and all pointer/touch/scroll/resize listeners; it is mounted conditionally in `index.vue` based on `useTheme().isDark`. A new `useScrollReveal.ts` composable extracts the `IntersectionObserver` reveal pattern already used by `useReport.ts`, generalized to take a selector, and is wired into `index.vue`'s `onMounted`. No new dependencies — canvas 2D API and native browser APIs only.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, TypeScript, native Canvas 2D API. No test framework in this repo — verification is `npx nuxi generate` (must stay clean) plus manual browser checks called out per task.

## Global Constraints

- No new npm dependencies (repo is static-only, GitHub Pages, no build-time services beyond `nuxi generate`).
- No new font imports.
- Home page only — `app/pages/work/**`, `app/pages/blogs/**` must not change.
- Light mode home page must render exactly as it does today — `StarField` must not mount at all in light mode (not just be visually hidden), so the animation loop never runs when invisible.
- Must respect `prefers-reduced-motion`: no animation frame loop, sections render immediately visible, no observer needed.
- Touch input drives the same gravity behavior as mouse (`touchmove` = pointer position; no touch = decay to ambient drift).
- Star field is `position: fixed`, sits behind all page content, and must not intercept pointer events meant for content below it (`pointer-events: none` on the canvas itself; the component listens on `window`, not the canvas element).
- Follow the codebase's existing `.theme-dark` / `.theme-light` CSS prefixing convention in `home.css` — no CSS custom properties for this feature, matching how `home.css` already works.
- Reveal transitions must be component-level `transition` declarations (not wrapped in `:where()`), so they aren't overridden by the global theme cross-fade in `global.css` — see `global.css:66-75` and the note it documents.

---

## File Structure

| File | Responsibility |
|---|---|
| `app/components/home/StarField.vue` | Canvas star field: rendering, physics (drift + gravity), constellation lines, pulse, cursor glow, scroll parallax, reduced-motion gating. Self-contained; no props needed (reads `prefers-reduced-motion` itself). |
| `app/composables/useScrollReveal.ts` | Generic IntersectionObserver reveal helper, reduced-motion aware. Used by `index.vue`; does not replace `useReport.ts` (blog posts keep their own composable). |
| `app/pages/index.vue` | Mounts `StarField` conditionally on `isDark`; adds `.reveal` class + refs to the three sections; calls `useScrollReveal()` in `onMounted`. |
| `app/assets/css/home.css` | Adds `.reveal` / `.reveal.visible` transition rules and any layout tweaks needed for the canvas to sit correctly behind content. |

---

### Task 1: `useScrollReveal` composable

**Files:**
- Create: `app/composables/useScrollReveal.ts`

**Interfaces:**
- Consumes: nothing (reads `window.matchMedia`, DOM directly)
- Produces: `useScrollReveal(selector: string): { init: () => void }` — later tasks call `init()` from `onMounted` (wrapped in `nextTick`, matching the `useReport.ts` pattern at `app/composables/useReport.ts:66-72`)

- [ ] **Step 1: Write the composable**

```typescript
// app/composables/useScrollReveal.ts
export const useScrollReveal = (selector: string) => {
  const init = () => {
    if (!import.meta.client) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll(selector)

    if (reduceMotion) {
      elements.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    elements.forEach((el) => observer.observe(el))
  }

  return { init }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd C:\Users\warri\personalProjects\tomatamagotato-site && npx nuxi typecheck`
Expected: no new type errors referencing `useScrollReveal.ts`. (If `typecheck` isn't configured as a script, run `npx nuxi generate` instead and confirm it completes — see Task 4 for the full generate check; a bare syntax error here would still fail that build.)

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\warri\personalProjects\tomatamagotato-site"
git add app/composables/useScrollReveal.ts
git commit -m "feat: add useScrollReveal composable for home page section reveal"
```

---

### Task 2: `StarField.vue` component

**Files:**
- Create: `app/components/home/StarField.vue`

**Interfaces:**
- Consumes: nothing (no props, no injected state — reads `window.matchMedia('(prefers-reduced-motion: reduce)')` itself)
- Produces: a Vue SFC importable/auto-registered by Nuxt as `<HomeStarField>` (nested-folder auto-import convention, same as `<WorkVideoTabViewer>` documented in `CLAUDE.md`). Renders one `<canvas class="star-field">` element, `position: fixed`, full viewport, `pointer-events: none`, low z-index (behind `.bg-watermark` which is `z-index: 1` and section content which is `z-index: 2`, per `app/pages/index.vue:104-111` — so `StarField`'s canvas must use `z-index: 0`).

This task is prototype-derived: the physics and rendering below are the exact tuned values approved during brainstorming (radius 90, orbital pull strength ~0.045/0.4/0.3, 46 stars, depth threshold 0.45 for constellation lines, depth threshold 0.6 for pulse). Do not re-tune without going back to the user — these numbers were iterated live and approved.

- [ ] **Step 1: Write the component**

```vue
<!-- app/components/home/StarField.vue -->
<template>
  <canvas ref="canvasEl" class="star-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
interface Star {
  x: number
  y: number
  baseVx: number
  baseVy: number
  vx: number
  vy: number
  depth: number
  r: number
  alpha: number
  pulsePhase: number
}

const canvasEl = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let stars: Star[] = []
let rafId = 0
let width = 0
let height = 0
let pointerX = 0
let pointerY = 0
let pointerActive = false
let scrollY = 0
let reduceMotion = false

const STAR_COUNT = 46
const PULL_RADIUS = 90
const LINK_DIST = 130
const GRID_SPACING = 60
const PULL_DEPTH_THRESHOLD = 0.45
const PULSE_DEPTH_THRESHOLD = 0.6
const SCROLL_PARALLAX = 0.04

function resize() {
  if (!canvasEl.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.value.width = width
  canvasEl.value.height = height
}

function makeStars() {
  stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const depth = Math.random()
    const star: Star = {
      x: Math.random() * width,
      y: Math.random() * height,
      baseVx: (Math.random() - 0.5) * 0.06 * (0.5 + depth),
      baseVy: (Math.random() * 0.04 + 0.01) * (0.5 + depth),
      vx: 0,
      vy: 0,
      depth,
      r: 0.4 + depth * 1.3,
      alpha: 0.12 + depth * 0.35,
      pulsePhase: Math.random() * Math.PI * 2
    }
    star.vx = star.baseVx
    star.vy = star.baseVy
    stars.push(star)
  }
}

function onPointerMove(clientX: number, clientY: number) {
  pointerX = clientX
  pointerY = clientY - scrollY * SCROLL_PARALLAX
  pointerActive = true
}

function onMouseMove(e: MouseEvent) {
  onPointerMove(e.clientX, e.clientY)
}

function onTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (touch) onPointerMove(touch.clientX, touch.clientY)
}

function onPointerLeave() {
  pointerActive = false
}

function onScroll() {
  scrollY = window.scrollY
}

function onResize() {
  resize()
  makeStars()
}

function drawStatic() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  drawGrid()
  for (const s of stars) {
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = s.depth > PULSE_DEPTH_THRESHOLD
      ? `rgba(210,230,238,${s.alpha})`
      : `rgba(240,236,228,${s.alpha})`
    ctx.fill()
  }
}

function drawGrid() {
  if (!ctx) return
  const offsetY = scrollY * SCROLL_PARALLAX
  ctx.strokeStyle = 'rgba(74,94,46,0.16)'
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += GRID_SPACING) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = -GRID_SPACING; y <= height + GRID_SPACING; y += GRID_SPACING) {
    const yy = ((y - offsetY) % (height + GRID_SPACING) + height + GRID_SPACING) % (height + GRID_SPACING) - GRID_SPACING
    ctx.beginPath()
    ctx.moveTo(0, yy)
    ctx.lineTo(width, yy)
    ctx.stroke()
  }
}

function draw(ts: number) {
  if (!ctx) return
  const t = ts * 0.001
  ctx.clearRect(0, 0, width, height)

  drawGrid()

  for (const s of stars) {
    let ax = 0
    let ay = 0
    if (pointerActive) {
      const dx = pointerX - s.x
      const dy = pointerY - s.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
      if (dist < PULL_RADIUS) {
        const strength = (1 - dist / PULL_RADIUS) * 0.045
        ax += (dx / dist) * strength * 0.4
        ay += (dy / dist) * strength * 0.4
        ax += (-dy / dist) * strength * 0.3
        ay += (dx / dist) * strength * 0.3
      }
    }
    s.vx += (s.baseVx - s.vx) * 0.015 + ax
    s.vy += (s.baseVy - s.vy) * 0.015 + ay
    s.vx *= 0.97
    s.vy *= 0.97
    s.x += s.vx
    s.y += s.vy

    if (s.x < -5) s.x = width + 5
    if (s.x > width + 5) s.x = -5
    if (s.y > height + 5) { s.y = -5; s.x = Math.random() * width }
    if (s.y < -5) s.y = height + 5
  }

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i]
      const b = stars[j]
      if (a.depth < PULL_DEPTH_THRESHOLD || b.depth < PULL_DEPTH_THRESHOLD) continue
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < LINK_DIST) {
        const lineAlpha = (1 - dist / LINK_DIST) * 0.12 * Math.min(a.depth, b.depth)
        ctx.strokeStyle = `rgba(138,170,85,${lineAlpha})`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  if (pointerActive) {
    const grad = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, PULL_RADIUS)
    grad.addColorStop(0, 'rgba(62,198,240,0.10)')
    grad.addColorStop(1, 'rgba(62,198,240,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  for (const s of stars) {
    let alpha = s.alpha
    let r = s.r
    if (s.depth > PULSE_DEPTH_THRESHOLD) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + s.pulsePhase)
      alpha += pulse * 0.15
      r += pulse * 0.4
      if (pulse > 0.85) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, r + 2.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(62,198,240,${(pulse - 0.85) * 1.2})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }
    ctx.beginPath()
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
    ctx.fillStyle = s.depth > PULSE_DEPTH_THRESHOLD
      ? `rgba(210,230,238,${alpha})`
      : `rgba(240,236,228,${alpha})`
    ctx.fill()
  }

  rafId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (!canvasEl.value) return
  ctx = canvasEl.value.getContext('2d')
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resize()
  makeStars()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })

  if (reduceMotion) {
    drawStatic()
    return
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onPointerLeave)
  window.addEventListener('mouseleave', onPointerLeave)

  rafId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onPointerLeave)
  window.removeEventListener('mouseleave', onPointerLeave)
})
</script>

<style scoped>
.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>
```

- [ ] **Step 2: Verify it compiles**

Run: `cd C:\Users\warri\personalProjects\tomatamagotato-site && npx nuxi generate`
Expected: build completes with 20 routes prerendered (same count as the last known-good build), no new errors mentioning `StarField.vue`. This component only mounts client-side behavior in `onMounted`, so it prerenders as an empty canvas — that's expected and fine.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\warri\personalProjects\tomatamagotato-site"
git add app/components/home/StarField.vue
git commit -m "feat: add StarField canvas component with gravity, drift, and parallax"
```

---

### Task 3: Wire `StarField` and scroll-reveal into `index.vue`

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/assets/css/home.css`

**Interfaces:**
- Consumes: `useTheme().isDark` (from `app/composables/useTheme.ts:2`, already reactive `useState`), `<HomeStarField>` (Task 2), `useScrollReveal` (Task 1)
- Produces: nothing new consumed elsewhere — this is the leaf integration point

- [ ] **Step 1: Add `StarField` mount and reveal classes to `index.vue`**

Modify `app/pages/index.vue`. Current top of file (lines 1-22, per earlier read):

```vue
<template>
  <div class="home-page">
    <img src="/img/blueman-watermark.png" alt="" class="bg-watermark" aria-hidden="true">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">tomatamagotato.</h1>
        <p class="hero-text">i make things. some useful. some just weird. this is where all of it lives.</p>
      </div>
      <div class="hero-avatar">
        <img src="/img/bluman-2-copy.png" alt="tomatamagotato avatar">
      </div>
    </section>

    <!-- Art Gallery -->
    <p class="section-title">art</p>
    <div class="art-gallery">
```

Replace with:

```vue
<template>
  <div class="home-page">
    <HomeStarField v-if="isDark" />
    <img src="/img/blueman-watermark.png" alt="" class="bg-watermark" aria-hidden="true">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">tomatamagotato.</h1>
        <p class="hero-text">i make things. some useful. some just weird. this is where all of it lives.</p>
      </div>
      <div class="hero-avatar">
        <img src="/img/bluman-2-copy.png" alt="tomatamagotato avatar">
      </div>
    </section>

    <!-- Art Gallery -->
    <p class="section-title reveal">art</p>
    <div class="art-gallery reveal">
```

Current writing/blog section (lines 44-57, per earlier read):

```vue
    <!-- Blog Preview -->
    <p class="section-title">writing</p>
    <div class="blog-list">
```

Replace with:

```vue
    <!-- Blog Preview -->
    <p class="section-title reveal">writing</p>
    <div class="blog-list reveal">
```

Also add `reveal` to the video section title and wrapper (locate the existing `<!-- Video -->` block):

```vue
    <!-- Video -->
    <p class="section-title">video</p>
    <section class="video-section">
```

Replace with:

```vue
    <!-- Video -->
    <p class="section-title reveal">video</p>
    <section class="video-section reveal">
```

In the `<script setup>` block, add the theme/reveal wiring. Current script start:

```vue
<script setup lang="ts">
useHead({ title: 'tomatamagotato' })

const artImages = [
```

Replace with:

```vue
<script setup lang="ts">
useHead({ title: 'tomatamagotato' })

const { isDark } = useTheme()
const { init: initReveal } = useScrollReveal('.reveal')

onMounted(() => {
  nextTick(() => initReveal())
})

const artImages = [
```

- [ ] **Step 2: Add reveal transition CSS to `home.css`**

Add to `app/assets/css/home.css`, after the `/* ── Section Titles ── */` block (after line 63 in the current file):

```css
/* ── Scroll Reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Verify the theme toggle gates the star field**

Run: `cd C:\Users\warri\personalProjects\tomatamagotato-site && npm run dev`

In a browser, navigate to `/`. With the site in light mode (default or toggle to light), confirm no canvas element is in the DOM (inspect element, look for `.star-field` — it should not exist). Toggle to dark mode, confirm the canvas appears and stars are visible drifting, moving the mouse produces the gravity/swirl effect, and scrolling the page produces a slight parallax shift in the star positions. Confirm the art/video/writing sections fade in as you scroll to them.

Stop the dev server after verifying (Ctrl+C or note it's still running if continuing to Task 4).

- [ ] **Step 4: Verify `prefers-reduced-motion`**

In Chrome DevTools: Cmd/Ctrl+Shift+P → "Rendering" → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload `/` in dark mode. Confirm: sections are immediately visible (no fade-in wait), star field renders as a static frame (stars visible but not moving, no pulse animation, no response to mouse movement).

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\warri\personalProjects\tomatamagotato-site"
git add app/pages/index.vue app/assets/css/home.css
git commit -m "feat: mount StarField in dark mode and add scroll-reveal to home sections"
```

---

### Task 4: Full build verification

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the production static generate**

Run: `cd C:\Users\warri\personalProjects\tomatamagotato-site && npx nuxi generate`
Expected: same route count as the last known-good baseline (20 routes, per the build run during the leadership-article fix earlier this session), no errors, `.output/public` produced.

- [ ] **Step 2: Preview the generated build**

Run: `cd C:\Users\warri\personalProjects\tomatamagotato-site && npx serve .output/public`

Open the printed local URL, navigate to `/`, repeat the dark-mode star field check and light-mode absence check from Task 3 Step 3 against the actual generated static output (not just dev server) — this confirms the canvas prerenders safely (empty canvas element, no SSR errors from `window`/`document` access, since all such access is correctly gated inside `onMounted`).

- [ ] **Step 3: Check other pages are untouched**

Navigate to `/work`, `/blogs`, `/blogs/wfh-philippines` in the preview. Confirm no visual regressions and no console errors — these pages should render identically to before this plan.

- [ ] **Step 4: Stop the preview server**

Ctrl+C in the terminal running `npx serve`.

No commit for this task — it's verification only, nothing changes.

---

## Post-Plan Note

This plan does not push to `master` or trigger the live GitHub Pages deploy. Per the pattern established earlier in this session (leadership-article fix), pushing is a separate, explicit step the user should confirm after reviewing the finished feature — do not push automatically at the end of this plan.
