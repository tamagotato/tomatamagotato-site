# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`tomatamagotato.com` — a personal portfolio/blog site for the anonymous identity "tomatamagotato" (mascot: "Blueman"). Built with Nuxt 4, deployed as a fully static site to GitHub Pages. No backend, no API routes, no database — everything ships as static HTML/CSS/JS.

## Commands

```bash
npm run dev        # local dev server
npm run build       # nuxt build (SSR-capable build, not used for deploy)
npm run generate     # nuxt generate — static site build, this is what CI runs
npm run preview      # preview a generated/built output locally
```

There is no test suite and no linter configured in this repo.

CI (`.github/workflows/deploy.yml`) runs `npx nuxi generate` on push to `master` and deploys `.output/public` to GitHub Pages via `actions/deploy-pages`.

## Architecture

- **Nuxt 4** with the `app/` source directory convention (not the legacy root-level `pages/`/`components/`). Pages live in `app/pages/`, components in `app/components/`, composables in `app/composables/`.
- **Rendering target**: `nitro.preset: 'github-pages'` in `nuxt.config.ts`, with `ssr: true` but the actual deploy artifact is produced by `nuxt generate` (prerendered static output) — GitHub Pages cannot run a Node server.
- **Theming**: dark/light mode is handled by `useTheme()` (`app/composables/useTheme.ts`), a `useState`-backed composable that toggles a `theme-dark`/`theme-light` class on `<html>` and persists the choice to `localStorage`. `<html>` is the single source of truth: an inline script in `nuxt.config.ts` (`app.head.script`) stamps the class before first paint so dark-mode users never see a light flash, and `useTheme().apply()` writes to that same element. Layouts call `init()` on mount but must NOT bind `themeClass` to a wrapper `<div>` — the SSR-rendered wrapper would override the pre-paint class and reintroduce the flash. Component styles key off `.theme-light` / `.theme-dark` ancestor classes rather than CSS custom properties for most rules (report/post pages use CSS vars like `--report-accent` layered on top). Because the class lives on `<html>` and `background-color` does not inherit, theme surfaces are set for both `html` and `body` in `global.css`; page stylesheets must not rely on canvas propagation for their background.
- **Theme transitions**: `global.css` defines a 150ms cross-fade on `background-color`, `border-color`, and `color`, wrapped in `:where()` so it carries zero specificity. This is deliberate. A specificity-carrying selector here (`.theme-light *`) silently overrides the component-level `transition` declarations in `report.css` and `post.css`, killing reveal animations and stat bars. Keep any future global transition inside `:where()`.
- **Layouts**: `default` is used for the home/work pages; `dark` is used for the blog index and blog post pages (set via `definePageMeta({ layout: 'dark' })`). The `dark` layout name is a misnomer: it does not force dark mode and is functionally identical to `default`. The pages it serves only *look* dark-only because `post.css` defines dark colors with no light-theme variants. Report-style long-form posts (e.g. `wfh-philippines.vue`) use `useReport()` (`app/composables/useReport.ts`) for scroll-driven behavior: IntersectionObserver-based reveal animations, scrollspy-driven table-of-contents highlighting, and animated stat bars. Call `initAll()` from the post's `onMounted`.
- **Styling**: no CSS framework — hand-written CSS per page/section, imported via `<style src="~/assets/css/X.css">` at the bottom of each page component, plus scoped `<style>` blocks for page-specific one-offs. `app/assets/css/global.css` holds the reset, page/layout transition classes, and shared nav/footer styles. Other stylesheets (`home.css`, `work.css`, `post.css`, `report.css`) are page-specific and follow the same `.theme-light`/`.theme-dark` prefixing pattern.
- **Design system**: warm paper background (`#f5f2ea` light / `#0f0f0f` dark) with olive green (`#6b8c3e` light / `#8aaa55` dark) as the accent color, and Blueman (a hand-drawn blue mascot character) as recurring visual branding. Full design rationale, palette tokens, and page-by-page spec live in `docs/superpowers/specs/2026-04-06-portfolio-redesign-design.md`. The Work page additionally uses an "ink" visual language derived from the Blueman artwork itself: 2px black outlines, flat fills, offset hard shadows (`box-shadow: 5px 5px 0`) rather than soft blurs, and the mascot's cyan `#3ec6f0` as a secondary accent. See `docs/superpowers/specs/2026-08-06-visual-identity-pass.md` for why. The site is intentionally anonymous — no real name appears anywhere, and Work page project descriptions never name employers or clients.
- **Images**: served from `public/img/`. Filenames must be URL-safe (no spaces, consistent case) — CI has previously broken on filenames containing spaces/mixed case (see commit `367a8c6`). When adding images referenced from code, name the file itself URL-safe rather than relying on encoding.
- **Work page case studies**: three of the four `/work` cards (Attendance and utilization tracking, Overtime governance, Workflow standardization) link to dedicated sub-pages under `app/pages/work/` (`attendance-utilization.vue`, `overtime-governance.vue`, `workflow-standardization.vue`), each showing a tabbed set of short WebM interaction-demo videos via the shared `app/components/work/VideoTabViewer.vue` component (auto-imported by Nuxt as `<WorkVideoTabViewer>`, not `<VideoTabViewer>`, because of the nested `work/` folder). Card 3 (Operations dashboard) has no matching demo and is untouched. Videos live in `public/videos/work/` as WebM (`vp8` codec) — not GIF — for file-size reasons, played via `<video autoplay loop muted playsinline>`. Tab switching shows a randomized 50ms-1s buffering state before cross-fading into the new clip; `prefers-reduced-motion` skips both the buffer and autoplay/loop in favor of native controls. Cards and back-links use `<NuxtLink>` (not plain `<a>`) so navigation uses the site's existing page-transition fade. This revisits the 2026-08-06 visual identity pass's "no Remotion on the Work page" decision, scoped narrowly to functional demo video rather than decoration — see `docs/superpowers/specs/2026-08-10-work-case-study-videos-design.md` and `docs/superpowers/plans/2026-08-10-work-case-study-videos.md` for the full rationale and history.

## Known issues

- **`post.css` has no light-theme variants.** It defines only dark colors, so the blog index and blog post pages render near-white text on the warm paper background when the toggle is set to light. This was masked before 2026-08-06 because the theme class never reached those pages correctly. Fixing it means either adding `.theme-light` rules to `post.css` or forcing dark on blog routes and hiding the toggle there. Not yet decided.
- **Home page and blog index have not been through the visual identity pass.** Only the theme toggle and the Work page were addressed in the 2026-08-06 work.

## Planning docs

Feature specs and plans for this repo are tracked under `docs/superpowers/` (`specs/` and `plans/`), written by the `superpowers` skill workflow. Check there for the rationale behind existing design decisions before proposing changes to page structure or the visual system.

Change records for work that modified existing design decisions live alongside them as dated specs (e.g. `2026-08-06-visual-identity-pass.md`). Read the most recent one before assuming an older spec still describes the shipped state.
