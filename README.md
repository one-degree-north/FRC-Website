# One Degree North — Team Website

Website for FRC Team 4817, One Degree North (Singapore American School).
Two jobs: tell people who we are, and host our subteam lessons and
documentation.

- **Live site:** https://frc-website-zeta.vercel.app
- **Edit content:** https://frc-website-zeta.vercel.app/keystatic — sign in
  with GitHub (you need to be in the org's **FRC Robotics** team). No local
  setup needed to add or edit lessons or documentation.

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
| `src/content/docs/lessons/` | **All lesson content.** One folder per subteam, one Markdown file per lesson. |
| `src/content/docs/documentation/` | **All reference documentation.** Same shape as lessons: one folder per subteam, one Markdown file per article. |
| `src/assets/gallery/` | Drop team photos here — the home page gallery picks them up automatically. |
| `src/data/site.json` | Editable team text (tagline, about story, contact email). |
| `keystatic.config.ts` | Defines the CMS editing forms. |
| `astro.config.mjs` | Site config (title, lessons + documentation sidebar). |

## Common tasks

**Add a lesson** — use the CMS at `/keystatic` (no code needed), or create
`src/content/docs/lessons/<subteam>/<NN-slug>.mdx` by hand. The numeric
prefix (`01-`, `02-`, …) controls sidebar order.

**Add a documentation article** — exactly the same, but in your subteam's
**Documentation** collection in the CMS, or by hand at
`src/content/docs/documentation/<subteam>/<NN-slug>.mdx`. Lessons teach a
skill from scratch; documentation is the reference you come back to (build
standards, tool setups, checklists).

**Add a subteam** — create a new folder under `src/content/docs/lessons/`
and/or `src/content/docs/documentation/` with a first page inside (the
sidebar updates automatically), and add matching collections in
`keystatic.config.ts` (copy an existing `lessonCollection(...)` /
`documentationCollection(...)` line).

**Group lessons into a section** — give a lesson a slug of the form
`group-name/lesson-slug` (e.g. `drivetrain/01-bellypan`). Every lesson sharing
the same `group-name/` prefix collapses together under one "Group Name" heading
in the sidebar. Only group when you have 2+ lessons for it — a group with a
single lesson just adds a redundant nested line. Plain lessons (no slash) stay
flat. Documentation articles group the same way.

**Add an image to a lesson** — edit the lesson in the CMS at `/keystatic` and
use the editor's image button (or paste/drag an image into the content). It's
saved automatically under `public/lesson-images/<subteam>/<slug>/` (documentation
images go to `public/documentation-images/<subteam>/<slug>/`) and embedded
with an absolute path that always resolves — no manual file handling. iPhone
`.heic` files are rejected by the uploader; convert to JPEG or PNG first
(opening and re-exporting the photo works).

**Add photos** — use the CMS **"Photo gallery"** (upload, describe, reorder,
delete — no code needed). iPhone photos are often `.heic`, which the uploader
rejects — convert to JPEG first (opening and re-exporting the photo works).
Behind the scenes, uploads are saved to `src/assets/gallery/` and listed in
`src/data/gallery.json`; `PhotoGallery.astro` renders them optimized.

**Change team text** — edit `src/data/site.json` (or use the CMS "Team
info" form).

## Stack

[Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
(lessons + documentation UI) + [Keystatic](https://keystatic.com) (browser CMS), deployed on
Vercel. All content is plain Markdown/JSON in this repo — no database, no
server to maintain.
