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
- **Theming**: dark/light mode is handled by `useTheme()` (`app/composables/useTheme.ts`), a `useState`-backed composable that toggles a `theme-dark`/`theme-light` class on the root element and persists the choice to `localStorage`. Both layouts (`app/layouts/default.vue` and `app/layouts/dark.vue`) call `useTheme().init()` on mount and wrap content in a `<div :class="themeClass">`. Component styles key off `.theme-light` / `.theme-dark` ancestor classes rather than CSS custom properties for most rules (report/post pages use CSS vars like `--report-accent` layered on top).
- **Layouts**: `default` is used for the home/work pages; `dark` is used for the blog index and blog post pages (set via `definePageMeta({ layout: 'dark' })`). Report-style long-form posts (e.g. `wfh-philippines.vue`) use `useReport()` (`app/composables/useReport.ts`) for scroll-driven behavior: IntersectionObserver-based reveal animations, scrollspy-driven table-of-contents highlighting, and animated stat bars. Call `initAll()` from the post's `onMounted`.
- **Styling**: no CSS framework — hand-written CSS per page/section, imported via `<style src="~/assets/css/X.css">` at the bottom of each page component, plus scoped `<style>` blocks for page-specific one-offs. `app/assets/css/global.css` holds the reset, page/layout transition classes, and shared nav/footer styles. Other stylesheets (`home.css`, `work.css`, `post.css`, `report.css`) are page-specific and follow the same `.theme-light`/`.theme-dark` prefixing pattern.
- **Design system**: warm paper background (`#f5f2ea` light / `#0f0f0f` dark) with olive green (`#6b8c3e` light / `#8aaa55` dark) as the accent color, and Blueman (a hand-drawn blue mascot character) as recurring visual branding. Full design rationale, palette tokens, and page-by-page spec live in `docs/superpowers/specs/2026-04-06-portfolio-redesign-design.md`. The site is intentionally anonymous — no real name appears anywhere, and Work page project descriptions never name employers or clients.
- **Images**: served from `public/img/`. Filenames must be URL-safe (no spaces, consistent case) — CI has previously broken on filenames containing spaces/mixed case (see commit `367a8c6`). When adding images referenced from code, name the file itself URL-safe rather than relying on encoding.

## Planning docs

Feature specs and plans for this repo are tracked under `docs/superpowers/` (`specs/` and `plans/`), written by the `superpowers` skill workflow. Check there for the rationale behind existing design decisions before proposing changes to page structure or the visual system.
