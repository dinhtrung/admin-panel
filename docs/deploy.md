# Deploying the panel

The panel is a static single-page application: `npm run build` writes `dist/`, and any static host
with a deep-link fallback can serve it. There is no server, no environment variable and no secret —
a fresh clone builds and runs with nothing but Node.

Chosen name for the showcase: **`handover-admin`** (the Vercel project slug; the URL will be
`handover-admin.vercel.app` unless that slug is taken, in which case Vercel appends a suffix).

## Option A — Vercel CLI (fastest, no repository needed)

```bash
cd ~/develop/admin-panel
npx vercel login                 # one interactive step, on your machine, once
npx vercel                       # preview deployment → prints a preview URL
npx vercel --prod                # promote the same build to the production URL
```

`vercel.json` already pins the framework (`vite`), the build command, the output directory (`dist`),
the SPA rewrite and the cache headers, so no dashboard settings are needed and the CLI picks the
project name from the directory (`admin-panel`); pass `npx vercel --name handover-admin` to use the
chosen name instead. The build is fully static, so nothing needs to be configured per environment.

## Option B — import the GitHub repository

1. Push the repository (private is fine) to GitHub.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset: **Vite** (auto-detected), root directory `./`, build `npm run build`, output
   `dist`. Every push to `main` then produces a production deployment and every pull request a
   preview URL.

## What makes the deploy safe to share

- **Deep links work.** `vercel.json` rewrites every unmatched path to `index.html`, and
  `public/_redirects` does the same for Netlify-style hosts. A hard reload on `/users/usr_014` or
  `/audit?page=3` returns the app shell, not a 404.
- **No secrets.** The build reads no environment variable; the panel's data is an in-browser mock
  layer. Nothing about the deployment can leak a credential because none exists.
- **Honest content.** Everything on the board is authored synthetic data and the interface says so in
  the sign-in screen and the footer; there is no real person, customer or measurement anywhere.
- **Immutable assets, revalidated shell.** Hashed files under `/assets` are cached for a year;
  `index.html` is never cached, so a new deployment is picked up immediately.
- **License ships with the build.** `LICENSE` (MIT) is in the repository root, and the same text is
  copied to `public/LICENSE.txt` so it is served at `/LICENSE.txt` by the deployment; the interface
  footer links to it, so a reviewer can read the terms without leaving the demo.

## Verifying a deployment

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://<deployment>/users/usr_001   # expect 200, not 404
curl -s https://<deployment>/ | grep -c '<div id="root">'                     # expect 1
```

Then open it and check the four states a reviewer checks first: sign in as the Viewer account (the
navigation thins out), open a list and search for nothing (a "no matches" state, not a blank panel),
turn on **Fail the next request** in the board controls and reload a list (a failed state with a
retry path), and switch appearance to Dark.
