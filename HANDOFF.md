# Handoff Manual

This document is for whoever maintains the website after the current
maintainer leaves. It assumes you know some programming but not
necessarily web development. Read [README.md](./README.md) first for the
day-to-day basics.

## The one design rule

**All content is plain files in this repo.** Lessons are Markdown, team
text is JSON, photos are image files. There is no database and no server.
If every tool in the stack disappeared tomorrow, the content would still
be readable and portable. Keep it that way — don't add databases, paid
services, or anything that needs monthly attention.

## Account inventory

Everything must be owned by **team accounts**, never personal ones:

| What | Where | Who controls it |
| --- | --- | --- |
| Code + content | GitHub repo under the team's GitHub **organization** | Org owners (update yearly: current student maintainer + a mentor) |
| Hosting | Netlify account created with the **team email** | Whoever holds the team email |
| CMS access | Keystatic GitHub App (installed on the org) | GitHub org owners |

Every year, before seniors graduate: add the next maintainer to the GitHub
org, and make sure a mentor still has the team email credentials.

## Deployment (one-time setup)

The site auto-deploys: push to `main` → Netlify builds and publishes.
Setting that up the first time:

1. Create the GitHub organization (e.g. `frc-team-4817`) and push this
   repo to it.
2. Create a Netlify account **with the team email**, choose "Add new site →
   Import an existing project," and select the repo. Netlify detects Astro
   and reads `netlify.toml` — no settings needed.
3. Done. Every push to `main` deploys. Pull requests get preview URLs.

## CMS (Keystatic)

Editors use a web form at `<site-url>/keystatic` — they never touch git.

Right now `keystatic.config.ts` uses **local mode** (works only on a dev
machine). To enable browser editing on the live site (one-time, after
deployment):

1. In `keystatic.config.ts`, replace `storage: { kind: 'local' }` with the
   commented-out `github` line, filling in your org/repo.
2. Deploy, then visit `<site-url>/keystatic` — Keystatic walks you through
   creating its GitHub App on the org. Follow the prompts.
3. Copy the environment variables it gives you into Netlify (Site
   configuration → Environment variables) and redeploy.

To give someone edit access: add their GitHub account to the org (or as a
repo collaborator). To revoke: remove them.

Docs: https://keystatic.com/docs/github-mode

## When something breaks

- **Site is down / weird**: check the Netlify dashboard → Deploys. You can
  roll back to any previous working version with one click (open an older
  successful deploy → "Publish deploy"). This fixes most emergencies
  instantly.
- **Build fails after a content edit**: the deploy log names the file.
  Usually a malformed Markdown frontmatter block (the `---` section at the
  top of a lesson).
- **CMS stops working**: content can always be edited directly on GitHub
  (open the file in `src/content/docs/lessons/`, click the pencil). The
  CMS is a convenience, not a dependency.

## Known constraints (read before upgrading anything)

- **`overrides.vite: "^7"` in package.json** exists because Astro 6 bundles
  Vite 7 while `@astrojs/react` wants Vite 8 — without the pin the dev
  server breaks with cryptic `Missing field 'moduleType'` errors. When you
  eventually upgrade past Astro 6, **remove this override** or it will
  cause the opposite breakage.
- **Astro is held at v6 because of Keystatic.** `@keystatic/astro` declares
  which Astro majors it supports; before any Astro major upgrade, check
  `npm view @keystatic/astro peerDependencies.astro` and only upgrade to a
  version it lists.
- **Node is pinned to 22** (`NODE_VERSION` in `netlify.toml`, mirrored by
  `engines` in package.json). Bump it deliberately about once a year —
  check Netlify's supported versions first — rather than letting the
  platform default drift.
- **Two theme toggles by design**: the marketing pages' Light/Dark button
  and the lessons' (Starlight's) theme picker remember their settings
  independently. Not a bug.
- **Where build failures show up**: the GitHub Actions "build" check on
  each commit (red ✗ = that commit broke the build; the live site keeps
  serving the last good deploy), and the Netlify dashboard → Deploys.

## Dependency updates

Once per year (off-season), on a branch:

```sh
npm update
npm run build
```

If the build passes and the site looks right (`npm run preview`), merge.
If a major version bump breaks something and you can't fix it quickly,
don't — the site keeps working fine on old versions. Pinned versions that
build are better than fresh versions that don't.

## What NOT to do

- Don't move hosting/repo to a personal account "temporarily."
- Don't add a database, auth, or a paid plan without a mentor agreeing to
  own the bill long-term.
- Don't delete the old WordPress site (frc4817.wordpress.com) — it's the
  team's historical archive.
- Don't rewrite the site in a new framework the week before you graduate.
