# One Degree North — Team Website

Website for FRC Team 4817, One Degree North (Singapore American School).
Two jobs: tell people who we are, and host our subteam lesson modules.

- **Live site:** https://frc-website-zeta.vercel.app
- **Edit content:** https://frc-website-zeta.vercel.app/keystatic — sign in
  with GitHub (you need to be in the org's **FRC Robotics** team). No local
  setup needed to add or edit lessons.

**Taking this project over? Read [HANDOFF.md](./HANDOFF.md).**

## Run it locally (for code changes)

You only need this to change the site's code or design — content editing
happens in the browser at the link above. You need
[Node.js](https://nodejs.org) (LTS version). Then:

```sh
npm install
npm run dev
```

Site: http://localhost:4321 (Astro's default port — if it's taken, Astro
picks the next free one and prints the real URL in the terminal).

`npm run build` does a full production build (this is what Vercel runs on
every deploy).

> The CMS at `localhost:4321/keystatic` won't let you sign in out of the
> box — it needs the four `KEYSTATIC_*` environment variables in a local
> `.env` file (copy the values from Vercel → Settings → Environment
> Variables). Alternatively, temporarily switch `storage` to
> `{ kind: 'local' }` in `keystatic.config.ts` to edit files offline —
> just don't commit that change.

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

**Add photos** — use the CMS **"Photo gallery"** (upload, describe, reorder,
delete — no code needed). iPhone photos are often `.heic`, which the uploader
rejects — convert to JPEG first (opening and re-exporting the photo works).
Behind the scenes, uploads are saved to `src/assets/gallery/` and listed in
`src/data/gallery.json`; `PhotoGallery.astro` renders them optimized.

**Change team text** — edit `src/data/site.json` (or use the CMS "Team
info" form).

## Stack

[Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
(lessons UI) + [Keystatic](https://keystatic.com) (browser CMS), deployed on
Vercel. All content is plain Markdown/JSON in this repo — no database, no
server to maintain.
