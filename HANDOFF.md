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
| Hosting | Vercel account created with the **team email** | Whoever holds the team email |
| CMS access | Keystatic GitHub App (installed on the org) | GitHub org owners |

Every year, before seniors graduate: add the next maintainer to the GitHub
org, and make sure a mentor still has the team email credentials.

## Deployment (one-time setup)

The site auto-deploys: push to `main` → Vercel builds and publishes.
Setting that up the first time:

1. Create the GitHub organization (e.g. `frc-team-4817`) and push this
   repo to it.
2. Create a Vercel account **with the team email**, choose "Import
   project," and select the repo. Vercel detects Astro automatically — no
   settings needed.
3. Done. Every push to `main` deploys. Pull requests get preview URLs.

## CMS (Keystatic)

Editors use a web form at `<site-url>/keystatic` — they never touch git.
It's **live in GitHub mode**: editors sign in with GitHub, and saving writes
a commit to this repo, which triggers a deploy.

`keystatic.config.ts` uses `storage: { kind: 'github', repo:
'one-degree-north/FRC-Website' }`. The connection relies on a **GitHub App**
("One Degree North CMS", installed on the org) plus four environment
variables set in Vercel (Settings → Environment Variables):

- `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` — from the
  GitHub App.
- `KEYSTATIC_SECRET` — a random key that encrypts editor login sessions.
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` — the app's slug.

If you ever rebuild this from scratch, Keystatic's setup wizard at
`<site-url>/keystatic` can regenerate the app + variables; the manual path
is at https://keystatic.com/docs/github-mode.

### Who can edit (access control)

**Editing = GitHub write access to this repo.** There is no separate
password or editor list in Keystatic — it uses GitHub permissions:

- Anyone with **write access** to `one-degree-north/FRC-Website` can sign in
  at `/keystatic` and publish changes (their saves become commits to `main`).
- The repo is **public**, so anyone can *view* it and technically open the
  CMS, but without write access their edits go into a fork/pull request that
  changes nothing on the live site until a maintainer merges it.

To manage the editor list:

1. Best practice: in the org, make a **Team** (e.g. "Website Editors") and
   give it **Write** access to this repo (repo → Settings → Collaborators
   and teams → Add team, role: Write). Add each editor to that team.
2. Or add people one-off: repo → Settings → Collaborators and teams → Add
   people, role **Write**.
3. To revoke someone, remove them from the team/collaborators — access is
   gone immediately.

Org **owners** always have access. Give people the *least* access that lets
them do their job (Write for editors; Admin only for maintainers).

## When something breaks

- **Site is down / weird**: check the Vercel dashboard → Deployments. You
  can redeploy any previous working version with one click ("Promote to
  production"). This fixes most emergencies instantly.
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
- **Node is pinned to 22.x** (`engines` in package.json; Vercel honors it).
  Bump it deliberately about once a year — check Vercel's supported
  versions first — rather than letting the platform default drift.
- **Two theme toggles by design**: the marketing pages' Light/Dark button
  and the lessons' (Starlight's) theme picker remember their settings
  independently. Not a bug.
- **Lessons must use plain Markdown, not Starlight asides.** The CMS
  (Keystatic) can't parse Starlight's `:::note` / `:::tip` / `:::caution`
  block syntax — a lesson that contains one won't appear in the CMS. Use a
  blockquote (`> **Tip:** …`) instead. Editors using the CMS won't hit this
  (it only produces standard Markdown); it's a trap only for hand-edited
  files.
- **Where build failures show up**: the GitHub Actions "build" check on
  each commit (red ✗ = that commit broke the build; the live site keeps
  serving the last good deploy), and the Vercel dashboard → Deployments.

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
