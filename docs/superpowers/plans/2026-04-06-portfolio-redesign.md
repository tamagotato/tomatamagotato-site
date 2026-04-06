# Portfolio Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the tomatamagotato personal portfolio site with an olive green palette, Blueman as avatar, a new Work page, and a dual-register voice (casual personal / grounded professional).

**Architecture:** Pure CSS reskin of existing Nuxt 3 static site — no framework changes, no new dependencies. New Work page added as a static Vue page. All changes are confined to CSS files, two Vue components, three Vue pages, and one new page + stylesheet.

**Tech Stack:** Nuxt 3, TypeScript, Vue 3, static CSS (no Tailwind, no CSS vars framework — inline class-based theming via `.theme-light` / `.theme-dark` selectors as per existing pattern)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/assets/css/global.css` | Modify | Palette tokens → olive green; Blueman nav badge; nav/footer colors |
| `app/assets/css/home.css` | Modify | Hero layout with Blueman portrait; olive green accents; blog preview cards |
| `app/assets/css/post.css` | Modify | Accent color from dusty rose → olive green; blog index card hover |
| `app/components/SiteNav.vue` | Modify | Blueman badge logo; add Work nav link |
| `app/pages/index.vue` | Modify | Hero copy; frogger panel illustration near video |
| `app/pages/blogs/index.vue` | Modify | Use layout="default" (light theme); restyle card |
| `app/pages/work/index.vue` | Create | Work page — intro, project cards, approach section |
| `app/assets/css/work.css` | Create | Work page stylesheet |

---

## Task 1: Update global palette and nav badge

**Files:**
- Modify: `app/assets/css/global.css`
- Modify: `app/components/SiteNav.vue`

- [ ] **Step 1: Update `global.css` — light theme nav/footer to olive palette**

Replace the existing nav and footer color rules with:

```css
/* ── Reset ── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
img { max-width: 100%; display: block; }
a { color: inherit; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; }

/* ── Nav ── */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.theme-light .site-nav {
  background: rgba(245, 242, 234, 0.88);
  border-bottom: 1px solid rgba(107, 140, 62, 0.15);
}

.theme-dark .site-nav {
  background: rgba(15, 15, 15, 0.88);
  border-bottom: 1px solid #2a2a2a;
}

/* Blueman badge logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-logo-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #6b8c3e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.nav-logo-badge img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.nav-logo-name {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.theme-light .nav-logo-name { color: #1a1a1a; }
.theme-dark .nav-logo-name { color: #f0ece4; }

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.nav-link:hover { opacity: 0.7; }

.theme-light .nav-link { color: #333; }
.theme-dark .nav-link { color: #ccc; }

/* ── Footer ── */
.site-footer {
  padding: 40px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.theme-light .site-footer {
  background: #edeae0;
  color: #555;
  border-top: 1px solid #ddd;
}

.theme-dark .site-footer {
  background: #0f0f0f;
  border-top: 1px solid #2a2a2a;
  color: #888;
}

.footer-text {
  font-size: 0.9rem;
}

.footer-socials {
  display: flex;
  gap: 16px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: transform 0.2s, background 0.2s;
}

.theme-light .social-icon {
  color: #555;
  background: rgba(107, 140, 62, 0.1);
  border: 1px solid rgba(107, 140, 62, 0.2);
}

.theme-light .social-icon:hover {
  background: rgba(107, 140, 62, 0.2);
  transform: translateY(-2px);
}

.theme-dark .social-icon {
  color: #888;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
}

.theme-dark .social-icon:hover {
  color: #8aaa55;
  transform: translateY(-2px);
}
```

Keep the existing page transition rules at the top of the file unchanged.

- [ ] **Step 2: Update `SiteNav.vue` — Blueman badge and Work link**

Replace the entire file content with:

```vue
<template>
  <nav class="site-nav">
    <NuxtLink class="nav-logo" to="/">
      <div class="nav-logo-badge">
        <img src="/img/emote 2_112.png" alt="tomatamagotato">
      </div>
      <span class="nav-logo-name">tomatamagotato</span>
    </NuxtLink>
    <div class="nav-links">
      <NuxtLink class="nav-link" to="/">Home</NuxtLink>
      <NuxtLink class="nav-link" to="/work">Work</NuxtLink>
      <NuxtLink class="nav-link" to="/blogs">Blog</NuxtLink>
      <ThemeToggle />
    </div>
  </nav>
</template>
```

- [ ] **Step 3: Run dev server and verify nav visually**

```bash
cd /mnt/c/Users/warri/repos/tomatamagotato-site
npm run dev
```

Open `http://localhost:3000`. Check:
- Blueman badge appears in nav (small olive green square with Blueman)
- "tomatamagotato" text beside badge
- "Work" link appears between Home and Blog
- Light/dark toggle still works
- Nav background is warm paper (light) / near-black (dark)

- [ ] **Step 4: Commit**

```bash
git add app/assets/css/global.css app/components/SiteNav.vue
git commit -m "feat: update global palette to olive green and add Blueman nav badge"
```

---

## Task 2: Restyle home page hero and sections

**Files:**
- Modify: `app/assets/css/home.css`
- Modify: `app/pages/index.vue`

- [ ] **Step 1: Update `home.css` — full restyle**

Replace the entire file with:

```css
/* ── Home: Light Theme ── */
body.theme-light,
.theme-light {
  background: #f5f2ea;
  color: #1a1a1a;
}

/* ── Hero ── */
.hero {
  padding: 80px 24px 60px;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.hero-content {
  flex: 1;
  min-width: 260px;
}

.hero-name {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: #1a1a1a;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.hero-text {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #555;
  line-height: 1.6;
  max-width: 420px;
}

.hero-avatar {
  flex-shrink: 0;
  width: clamp(180px, 25vw, 280px);
}

.hero-avatar img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* ── Section Titles ── */
.section-title {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 16px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #6b8c3e;
}

/* ── Art Gallery ── */
.art-gallery {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 48px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.art-item {
  border-radius: 10px;
  overflow: hidden;
  background: #edeae0;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #ddd;
}

.art-item:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(107, 140, 62, 0.15);
}

.art-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Video ── */
.video-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 48px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
}

.video-main { flex: 1; }

.video-embed {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #222;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-caption {
  margin-top: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #555;
}

.video-illustration {
  width: 140px;
  flex-shrink: 0;
  opacity: 0.9;
}

.video-illustration img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* ── Blog Preview Cards ── */
.blog-list {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-card {
  display: block;
  padding: 20px 24px;
  background: #edeae0;
  border-radius: 10px;
  border: 1px solid #ddd;
  border-left: 3px solid transparent;
  text-decoration: none;
  color: #1a1a1a;
  transition: border-left-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.blog-card:hover {
  border-left-color: #6b8c3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.blog-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.blog-card .blog-date {
  font-size: 0.75rem;
  color: #6b8c3e;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.blog-card p {
  font-size: 0.88rem;
  color: #666;
  line-height: 1.5;
}

/* ── Dark Mode ── */
body.theme-dark,
.theme-dark {
  background: #0f0f0f;
  color: #f0ece4;
}

.theme-dark .hero-name { color: #f0ece4; }
.theme-dark .hero-text { color: #888; }

.theme-dark .section-title { color: #8aaa55; }

.theme-dark .art-item {
  background: #1a1a1a;
  border-color: #2a2a2a;
}

.theme-dark .art-item:hover {
  box-shadow: 0 4px 16px rgba(138, 170, 85, 0.1);
}

.theme-dark .video-embed { background: #111; }
.theme-dark .video-caption { color: #888; }

.theme-dark .blog-card {
  background: #1a1a1a;
  border-color: #2a2a2a;
  color: #f0ece4;
}

.theme-dark .blog-card:hover {
  border-left-color: #8aaa55;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.theme-dark .blog-card .blog-date { color: #8aaa55; }
.theme-dark .blog-card p { color: #888; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero { padding: 48px 20px 40px; gap: 24px; flex-direction: column-reverse; }
  .hero-avatar { width: 140px; margin: 0 auto; }
  .video-section { grid-template-columns: 1fr; }
  .video-illustration { display: none; }
  .art-gallery { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 2: Update `pages/index.vue` — hero copy and frogger illustration**

Replace the entire file with:

```vue
<template>
  <div class="home-page">
    <img src="/img/blueman with a gun vector.png" alt="" class="bg-watermark" aria-hidden="true">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">tomatamagotato.</h1>
        <p class="hero-text">i make things. some useful. some just weird. this is where all of it lives.</p>
      </div>
      <div class="hero-avatar">
        <img src="/img/bluman 2 - Copy.png" alt="tomatamagotato avatar">
      </div>
    </section>

    <!-- Art Gallery -->
    <p class="section-title">art</p>
    <div class="art-gallery">
      <div v-for="img in artImages" :key="img.alt" class="art-item">
        <img :src="img.src" :alt="img.alt">
      </div>
    </div>

    <!-- Video -->
    <p class="section-title">video</p>
    <section class="video-section">
      <div class="video-main">
        <div class="video-embed">
          <iframe
            src="https://www.youtube.com/embed/z-xawoH8lSs"
            title="dumblore maneuver"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="video-caption">dumblore maneuver</p>
      </div>
      <div class="video-illustration">
        <img src="/img/frogger panel 5.png" alt="tomatamagotato gaming">
      </div>
    </section>

    <!-- Blog Preview -->
    <p class="section-title">writing</p>
    <div class="blog-list">
      <a class="blog-card" href="/blogs/wfh-philippines">
        <div class="blog-date">March 22, 2026</div>
        <h3>How Filipino Workers Lost WFH — and Who They Blame</h3>
        <p>Sentiment analysis across Reddit, Twitter/X, Facebook, and TikTok. Covering PEZA policy, the BPO industry, Manila's commute crisis, and cultural fault lines.</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'tomatamagotato' })

const artImages = [
  { src: '/img/face.png', alt: 'face' },
  { src: '/img/lucy.png', alt: 'lucy' },
  { src: '/img/JOBLUBBER.png', alt: 'joblubber' },
  { src: '/img/bugsy -2.png', alt: 'bugsy' },
  { src: '/img/Inktober 3 - Copy.png', alt: 'inktober' },
  { src: '/img/angry emote.png', alt: 'angry emote' },
  { src: '/img/blueman with a gun vector.png', alt: 'blueman' },
  { src: '/img/kwini - Copy.png', alt: 'kwini' },
  { src: '/img/idshonor 2.png', alt: 'idshonor' },
  { src: '/img/27493159.png', alt: 'artwork' },
  { src: '/img/41975146.png', alt: 'artwork 2' },
  { src: '/img/emote 2_112.png', alt: 'emote' },
]
</script>

<style src="~/assets/css/home.css"></style>
<style scoped>
.home-page {
  position: relative;
}

.bg-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3000px;
  height: 3000px;
  object-fit: contain;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

.home-page :deep(section),
.home-page :deep(.art-gallery),
.home-page :deep(.video-section),
.home-page :deep(.blog-list),
.home-page :deep(.section-title) {
  position: relative;
  z-index: 2;
}
</style>
```

- [ ] **Step 3: Verify home page in browser**

With dev server running at `http://localhost:3000`, check:
- Hero shows Blueman waving portrait on the right, headline + subtext on the left
- On mobile (devtools < 768px): Blueman stacks above text, frogger illustration hidden
- Section titles are olive green, uppercase, small
- Art gallery cards have olive hover glow
- Blog card has olive left-border on hover, olive green date
- Frogger illustration appears beside the video embed on desktop
- Watermark is very faint (opacity 0.04)

- [ ] **Step 4: Commit**

```bash
git add app/assets/css/home.css app/pages/index.vue
git commit -m "feat: restyle home page hero with Blueman avatar and olive green palette"
```

---

## Task 3: Update blog index and post styles

**Files:**
- Modify: `app/assets/css/post.css`
- Modify: `app/pages/blogs/index.vue`

- [ ] **Step 1: Update `post.css` — accent color from dusty rose to olive green**

Replace the entire file with:

```css
/* ── Blog Post: Dark Theme ── */
body.theme-dark,
.theme-dark {
  background: #0f0f0f;
  color: #ddd5cc;
}

.post {
  max-width: 780px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}

.post-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  color: #f0ece4;
}

.post-date {
  display: block;
  font-size: 0.85rem;
  color: #8aaa55;
  margin-bottom: 40px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 48px 0 16px;
  color: #f0ece4;
}

.post h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 32px 0 12px;
  color: #e8e0d6;
}

.post p {
  margin-bottom: 16px;
  line-height: 1.7;
}

.post strong { color: #f0ece4; }

.post a {
  color: #8aaa55;
  text-decoration: none;
}

.post a:hover { text-decoration: underline; }

.post blockquote {
  border-left: 3px solid #6b8c3e;
  padding: 12px 20px;
  margin: 24px 0;
  background: #1a1a1a;
  border-radius: 0 8px 8px 0;
  color: #888;
  font-style: italic;
}

.post code {
  background: #1a1a1a;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #8aaa55;
}

.post pre {
  background: #1a1a1a;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 24px 0;
}

.post img {
  border-radius: 8px;
  margin: 24px 0;
}

/* ── Blog Index ── */
.blog-index {
  max-width: 780px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}

.blog-index h1 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 8px;
  color: #f0ece4;
  letter-spacing: -0.03em;
}

.blog-index-subtitle {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 40px;
}

.blog-index-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.blog-index-card {
  display: block;
  padding: 20px 24px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-left: 3px solid transparent;
  border-radius: 10px;
  text-decoration: none;
  color: #ddd5cc;
  transition: border-left-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.blog-index-card:hover {
  border-left-color: #8aaa55;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.blog-index-card h2 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 4px;
  color: #f0ece4;
}

.blog-index-card time {
  display: block;
  font-size: 0.75rem;
  color: #8aaa55;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.blog-index-card p {
  font-size: 0.88rem;
  color: #888;
  margin-top: 0;
  line-height: 1.5;
}
```

- [ ] **Step 2: Update `pages/blogs/index.vue` — add subtitle, keep dark layout**

Replace the entire file with:

```vue
<template>
  <div class="blog-index">
    <h1>writing.</h1>
    <p class="blog-index-subtitle">whatever i feel like. no consistent theme. just honest pieces.</p>
    <ul class="blog-index-list">
      <li>
        <a class="blog-index-card" href="/blogs/wfh-philippines">
          <time>March 22, 2026</time>
          <h2>How Filipino Workers Lost WFH — and Who They Blame</h2>
          <p>Sentiment analysis across Reddit, Twitter/X, Facebook, and TikTok. Covering PEZA policy, the BPO industry, Manila's commute crisis, and cultural fault lines.</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dark'
})

useHead({ title: 'Writing — tomatamagotato' })
</script>

<style src="~/assets/css/post.css"></style>
```

- [ ] **Step 3: Verify blog index in browser**

Navigate to `http://localhost:3000/blogs`. Check:
- Dark background (`#0f0f0f`)
- "writing." heading in white, large
- Subtitle in muted gray
- Card has olive green date, white title, muted excerpt
- Olive left-border appears on hover

- [ ] **Step 4: Commit**

```bash
git add app/assets/css/post.css app/pages/blogs/index.vue
git commit -m "feat: update blog styles to olive green accent, restyle index page"
```

---

## Task 4: Create Work page

**Files:**
- Create: `app/pages/work/index.vue`
- Create: `app/assets/css/work.css`

- [ ] **Step 1: Create `app/assets/css/work.css`**

```css
/* ── Work Page: Light Theme ── */
.work-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}

.work-intro {
  margin-bottom: 56px;
}

.work-intro h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
  color: #1a1a1a;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.work-intro p {
  font-size: 1.05rem;
  color: #555;
  max-width: 560px;
  line-height: 1.7;
}

/* ── Section Headings ── */
.work-section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #6b8c3e;
  margin-bottom: 20px;
}

/* ── Project Cards ── */
.work-projects {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 56px;
}

.work-card {
  padding: 24px 28px;
  background: #edeae0;
  border: 1px solid #ddd;
  border-left: 3px solid #6b8c3e;
  border-radius: 10px;
}

.work-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.work-card h3 {
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;
}

.work-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b8c3e;
  background: rgba(107, 140, 62, 0.1);
  border: 1px solid rgba(107, 140, 62, 0.25);
  padding: 3px 10px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.work-card p {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.65;
}

.work-card-outcome {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #6b8c3e;
  font-weight: 600;
}

/* ── Approach Section ── */
.work-approach {
  margin-bottom: 40px;
}

.approach-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.approach-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.approach-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b8c3e;
  flex-shrink: 0;
  margin-top: 8px;
}

.approach-item strong {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  display: block;
  margin-bottom: 2px;
}

.approach-item span {
  font-size: 0.88rem;
  color: #666;
  line-height: 1.5;
}

/* ── Dark Mode ── */
.theme-dark .work-intro h1 { color: #f0ece4; }
.theme-dark .work-intro p { color: #888; }
.theme-dark .work-section-label { color: #8aaa55; }

.theme-dark .work-card {
  background: #1a1a1a;
  border-color: #2a2a2a;
  border-left-color: #6b8c3e;
}

.theme-dark .work-card h3 { color: #f0ece4; }
.theme-dark .work-card p { color: #888; }
.theme-dark .work-card-outcome { color: #8aaa55; }
.theme-dark .work-tag {
  color: #8aaa55;
  background: rgba(138, 170, 85, 0.08);
  border-color: rgba(138, 170, 85, 0.2);
}

.theme-dark .approach-item strong { color: #f0ece4; }
.theme-dark .approach-item span { color: #888; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .work-page { padding: 40px 20px 60px; }
  .work-card-header { flex-direction: column; gap: 8px; }
}
```

- [ ] **Step 2: Create `app/pages/work/index.vue`**

```vue
<template>
  <div class="work-page">

    <div class="work-intro">
      <h1>I design systems that make organizations work.</h1>
      <p>Operating models, enforcement logic, data visibility, cross-functional alignment. I work at the intersection of operations, product, and engineering — translating ambiguous problems into structured, scalable solutions.</p>
    </div>

    <p class="work-section-label">selected work</p>
    <div class="work-projects">

      <div class="work-card">
        <div class="work-card-header">
          <h3>Attendance & Utilization Tracking System</h3>
          <span class="work-tag">workforce systems</span>
        </div>
        <p>Designed and oversaw implementation of an end-to-end attendance system with enforced dependencies — timesheet submission gates access to downstream workflows, eliminating manual policing of compliance. Introduced configurable activity tracking to support multi-stream service delivery across teams.</p>
        <p class="work-card-outcome">↳ Reduced manual exception handling. Compliance enforced at the system level, not by management overhead.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Overtime Governance Framework</h3>
          <span class="work-tag">process governance</span>
        </div>
        <p>Built overtime tracking with validation logic that enforces policy constraints before approval is granted. Replaced spreadsheet-based tracking and ad-hoc approvals with a structured workflow that surfaces policy violations before they become payroll problems.</p>
        <p class="work-card-outcome">↳ Policy enforced at the point of request, not after the fact. Supervisor workload reduced.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Multi-Dimensional Operations Dashboard</h3>
          <span class="work-tag">data reporting</span>
        </div>
        <p>Designed reporting tools enabling leadership visibility across teams, clients, and timeframes simultaneously. Built hybrid data-fetching and caching strategies to keep dashboards fast under high usage. Defined the metrics and data model, collaborated with engineering on implementation.</p>
        <p class="work-card-outcome">↳ Leadership decision-making moved from reactive to data-informed. Single source of truth across functions.</p>
      </div>

      <div class="work-card">
        <div class="work-card-header">
          <h3>Cross-Functional Workflow Standardization</h3>
          <span class="work-tag">operational design</span>
        </div>
        <p>Mapped and redesigned inconsistent workflows across operations, HR, and finance. Translated operational intent into system logic — validations, role-based access, and enforced step sequences — so process compliance is built in, not bolted on.</p>
        <p class="work-card-outcome">↳ Reduced process drift. Teams operate from shared, enforceable workflows instead of institutional memory.</p>
      </div>

    </div>

    <p class="work-section-label">how I work</p>
    <div class="work-approach">
      <ul class="approach-list">
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Systems thinking</strong>
            <span>I design solutions that account for dependencies, edge cases, and long-term scale — not just the happy path.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Problem definition first</strong>
            <span>I operate in ambiguous environments. Breaking a vague problem into solvable components is usually the hardest and most valuable part of the work.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Data-informed</strong>
            <span>I use metrics and observable behavior to guide decisions — not assumptions about what users or teams should be doing.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Influence without authority</strong>
            <span>I drive alignment across operations, product, HR, finance, and engineering through clarity and design — not hierarchy.</span>
          </div>
        </li>
        <li class="approach-item">
          <div class="approach-dot"></div>
          <div>
            <strong>Self-sustaining solutions</strong>
            <span>A solution that requires constant manual oversight isn't finished. I build systems that enforce their own rules.</span>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Work — tomatamagotato' })
</script>

<style src="~/assets/css/work.css"></style>
```

- [ ] **Step 3: Verify Work page in browser**

Navigate to `http://localhost:3000/work`. Check:
- Page loads with warm paper background (light theme)
- "selected work" and "how I work" labels are olive green, uppercase
- 4 project cards visible, each with olive left-border and olive tag badge
- Outcome lines (↳) in olive green
- Approach list with olive dots
- Dark mode toggle switches to dark bg with card/text adjustments
- No real name appears anywhere on the page

- [ ] **Step 4: Commit**

```bash
git add app/pages/work/index.vue app/assets/css/work.css
git commit -m "feat: add Work page with anonymous project cards and approach section"
```

---

## Task 5: Final check and build

**Files:** None modified

- [ ] **Step 1: Run full static build**

```bash
cd /mnt/c/Users/warri/repos/tomatamagotato-site
npm run generate
```

Expected: build completes with no errors. Output goes to `_site/` or `.output/public/`.

- [ ] **Step 2: Cross-page checks**

With dev server running, verify the following across all pages:

| Check | Home | Work | Blog index | Blog post |
|---|---|---|---|---|
| No real name visible | ✓ | ✓ | ✓ | ✓ |
| Olive accent visible | ✓ | ✓ | ✓ | ✓ |
| Dark mode works | ✓ | ✓ | ✓ | ✓ |
| Nav shows: Home · Work · Blog | ✓ | ✓ | ✓ | ✓ |
| Blueman badge in nav | ✓ | ✓ | ✓ | ✓ |
| Page transitions animate | ✓ | ✓ | ✓ | ✓ |

- [ ] **Step 3: Commit final**

```bash
git add -A
git commit -m "chore: verify build passes after portfolio redesign"
```
