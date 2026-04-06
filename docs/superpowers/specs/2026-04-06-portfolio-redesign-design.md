# Portfolio Site Redesign — Design Spec
**Date:** 2026-04-06  
**Site:** tomatamagotato (GitHub Pages, Nuxt 3 static)

---

## 1. Identity & Tone

### Who
**tomatamagotato** is the only identity on the site. No real name appears anywhere. Blueman (`bluman 2 - Copy.png`) is the avatar and face of the site — a hand-drawn blue character that is both mascot and genuine self-portrait.

### Voice (code-switching)
The site has two registers, both authentic:
- **Personal content** (home, art, video, casual blog posts): lowercase, informal, self-aware — "i make things. some useful. some just weird."
- **Professional content** (Work page, analytical blog posts): grounded, direct, no corporate speak — describes systems and outcomes plainly

### Audience
Peers and collaborators — people who already understand ops, product, and engineering. The site does not need to sell; it needs to represent accurately and be deep enough to reward exploration.

### Color
- Favourite color: **olive green** — used as primary accent throughout
- Blueman's cyan blue and the olive green are the two signature colors of the site

---

## 2. Pages & Structure

### Navigation
`[Blueman badge] tomatamagotato` · Home · Work · Blog · `[theme toggle]`

- Blueman badge: avatar image on an olive green rounded square background (replaces current logo)
- Nav links updated to include **Work** as a new destination
- Sticky, glass blur — same behavior as current

### Home Page (personal)
Warm, playful, Blueman-forward.

**Hero:**
- Blueman waving portrait (`bluman 2 - Copy.png`) floated right on desktop, stacked on mobile
- Headline: `tomatamagotato.`
- Subtext (new voice, replaces current): "i make things. some useful. some just weird."

**Art gallery:** existing grid, restyled to match new palette

**Video section:** 
- `frogger panel 5.png` (Blueman gaming on couch) used as decorative illustration near the YouTube embed
- Caption and embed preserved

**Blog preview:** 2–3 latest posts shown as cards with olive green date, bold title, muted excerpt

### Work Page (new — `pages/work/index.vue`)
Grounded, anonymous, no employer or client names.

**Intro:** 1–2 sentences describing the professional practice ("I design operating models and the systems that enforce them.")

**Project cards (3–4):** Each card describes:
- The problem/system type
- What was designed/built
- The outcome
- A skill tag (e.g., "workforce systems", "data reporting", "process governance")

**Approach section:** Short list of working principles (systems thinking, cross-functional alignment, data-informed, outcome-driven, influence without authority)

### Blog Index (`pages/blogs/index.vue`)
Existing page, restyled with new card design to match the palette.

### Blog Post
Existing layout and content preserved. Restyled to match new palette.

---

## 3. Visual Design System

### Palette

| Token | Light | Dark |
|---|---|---|
| Background | `#f5f2ea` (warm paper) | `#0f0f0f` |
| Surface / Cards | `#edeae0` | `#1a1a1a` |
| Text primary | `#1a1a1a` | `#f0ece4` |
| Text secondary | `#555` | `#888` |
| Accent (olive) | `#6b8c3e` | `#8aaa55` |
| Border | `#ddd` | `#2a2a2a` |

### Typography
- Body: system sans-serif (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) — existing, kept
- Headings: bold weight of the same stack — no new font imports
- No serif typefaces

### Blueman Usage
- **Nav:** small Blueman badge (avatar on olive square, ~40px)
- **Hero:** large waving portrait (`bluman 2 - Copy.png`), floated right on desktop
- **Video section:** `frogger panel 5.png` as decorative illustration
- **Watermark:** existing full-page watermark (`blueman with a gun vector.png`) preserved at reduced opacity

### Components

**Cards (blog + work):**
- Background: surface color
- Border: `1px solid` border token
- Hover: olive green left-border accent (`3px solid #6b8c3e`), subtle lift shadow
- Date/tag: olive green, small, uppercase

**Nav:**
- Sticky, glass blur — existing behavior
- Colors updated to new palette tokens

**Footer:**
- Updated to new palette
- tomatamagotato text, social icons

---

## 4. File Scope

### Modified files
| File | Change |
|---|---|
| `app/assets/css/global.css` | New palette variables, Blueman nav badge styles, updated nav/footer colors |
| `app/assets/css/home.css` | Hero layout (Blueman + text), restyled gallery, video section, blog preview cards |
| `app/assets/css/post.css` | Palette update to match new system |
| `app/components/SiteNav.vue` | Blueman badge replaces logo image, Work link added |
| `app/pages/index.vue` | Hero copy rewritten, `frogger panel 5.png` added near video, blog preview cards |
| `app/pages/blogs/index.vue` | Restyled with new card design |

### New files
| File | Purpose |
|---|---|
| `app/pages/work/index.vue` | Work page — anonymous project cards + approach section |
| `app/assets/css/work.css` | Stylesheet for work page |

### Not in scope
- Blog post content (`wfh-philippines.vue` content unchanged)
- Adding new blog posts
- Any backend, CMS, database, or server-side logic (GitHub Pages = static only)
- New font imports
- Any page not listed above

---

## 5. Constraints

- **Hosting:** GitHub Pages — fully static. No SSR, no API routes, no database.
- **Framework:** Nuxt 3 + TypeScript — no changes to stack.
- **Anonymity:** No real name anywhere on the site.
- **Images:** All avatar/illustration images already exist in `public/img/`. No new image assets required.
