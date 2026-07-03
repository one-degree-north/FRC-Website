# One Degree North — Team Website

Website for FRC Team 4817, One Degree North (Singapore American School).
Two jobs: tell people who we are, and host our subteam lesson modules.

**Taking this project over? Read [HANDOFF.md](./HANDOFF.md).**

## Run it locally

You need [Node.js](https://nodejs.org) (LTS version). Then:

```sh
npm install
npm run dev
```

- Site: http://localhost:4321
- Content editor (CMS): http://localhost:4321/keystatic

`npm run build` does a full production build (this is what Vercel runs on
every deploy).

## How the site is organized

| Path | What it is |
| --- | --- |
| `src/pages/` | Marketing pages (home, about, outreach). Plain Astro files. |
| `src/content/docs/lessons/` | **All lesson content.** One folder per subteam, one folder per lesson. Markdown files. |
| `src/assets/gallery/` | Drop team photos here — the home page gallery picks them up automatically. |
| `src/data/site.json` | Editable team text (tagline, about story, contact email). |
| `keystatic.config.ts` | Defines the CMS editing forms. |
| `astro.config.mjs` | Site config (title, lesson sidebar). |

## Common tasks

**Add a lesson** — use the CMS at `/keystatic` (no code needed), or create
`src/content/docs/lessons/<subteam>/<NN-slug>/index.mdx` by hand. The
numeric prefix (`01-`, `02-`, …) controls sidebar order.

**Add a subteam** — create a new folder under `src/content/docs/lessons/`
with a first lesson inside (the sidebar updates automatically), and add a
matching collection in `keystatic.config.ts` (copy an existing
`lessonCollection(...)` line).

**Add photos** — drop `.jpg`/`.png`/`.webp` files into `src/assets/gallery/`.
iPhone photos are often `.heic`, which won't show up — convert them first
(on Windows/Mac, opening the photo and re-saving/exporting as JPEG works).

**Change team text** — edit `src/data/site.json` (or use the CMS "Team
info" form).

## Stack

[Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
(lessons UI) + [Keystatic](https://keystatic.com) (browser CMS), deployed on
Vercel. All content is plain Markdown/JSON in this repo — no database, no
server to maintain.
