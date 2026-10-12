# GitHub Pages deployment

Release preparation: 9 October 2026.

Repository: https://github.com/arun5959/WeGroween. Publishing branch: `main`.
Existing public address: https://arun5959.github.io/WeGroween/.

The previous site was deployed from commit `db21a8ceeb94a327a9ef81ccf81dedbbd3032fea` using GitHub's branch publishing workflow. The redeveloped application uses the committed Vite build and a custom Pages workflow instead. GitHub Pages must use **GitHub Actions** as its publishing source. The workflow runs the locked dependency installation, unit tests, production build and static-host browser tests before uploading `dist/` and deploying it. Source files and design review artifacts are not uploaded to the live site.

## Local verification

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
$env:WEGROWEEN_BASE_PATH = '/WeGroween/'
$env:VITE_ACCOUNT_PREVIEW = 'true'
npm.cmd run build
npm.cmd run test:pages
Remove-Item Env:WEGROWEEN_BASE_PATH
Remove-Item Env:VITE_ACCOUNT_PREVIEW
```

Normal local builds use `/`. The release uses the publishing path reported by `actions/configure-pages`. URL adaptation covers rendered navigation, images, icons, responsive image sources, the cart drawer, search submissions and browser history. Static entry documents cover concrete public/client routes. Old category HTML addresses have redirect documents. `release.json` records the deployed Git commit for live verification.

## Static hosting and implementation status

This release publishes the existing storefront foundation. Ordering, payments, authentication and private/admin data integrations are not connected. Existing `noindex, nofollow` directives and disabled/denied states remain in place.

GitHub Pages cannot execute Vite's route middleware or return custom HTTP 403 responses. Staff and checkout routes serve a static access-denied document and remain denied after client rendering. The Pages design release sets `VITE_ACCOUNT_PREVIEW=true` to publish the same assumed-session account UI as localhost: overview, orders, delivery addresses, profile and centred edit dialogs. These contain fictional sample data only; edits stay in browser memory and reset on reload. The flag does not create an authenticated session or enable development commerce/admin features. Account entry documents and known sample-order links are prerendered with the same UI, avoiding the older sign-in state on first load. Standard builds without this explicit flag still deny account access. Unpublished dynamic records and unknown routes initially return the shared HTTP 404 document; JavaScript then renders the appropriate denied/not-found state for the requested path. No private records or credentials are present in these files. Static legacy redirects use HTML refresh and a normal link; GitHub Pages does not provide the local server's HTTP 301 behavior.

## Backup and rollback

The pre-release commit remains in Git history and is tagged `pre-redevelopment-2026-10-09`. A hash-verified local backup exists outside the repository at `E:\WeGroween\release-backups\2026-10-09-pre-publication`, containing the old committed site ZIP, a complete Git bundle, a snapshot of the redeveloped source before publishing changes and a backup manifest. The obsolete category documents and their original images are archived under `legacy/pre-foundation/` and are excluded from the built site.

To restore the original site, restore the tagged source as a new commit on `main` (preserving history), push it, and restore the saved GitHub Pages publishing configuration to branch publishing. The pre-release Pages settings are saved alongside the backup when authenticated API access is available. Do not force-push or discard unrelated changes made after this release.

The historical foundation handoff describes its earlier local-only milestone. This document describes the new hosting integration; actual deployment results are recorded separately after publication.

## Vercel account parity — 12 October 2026

Vercel at https://wegroween.vercel.app used the same Git commit as Pages, but its release.json reported accountPreview=false. The Pages workflow supplied VITE_ACCOUNT_PREVIEW=true; Vercel used the normal protected-account build. This was a build-target mismatch, not a missing account redesign or a browser cache issue.

The committed vercel.json selects npm run build:vercel and dist output. The cross-platform build target forces the root hosting path and fictional account preview in both Vite's client bundle and static HTML generation, even if project variables retain the older false value or the Pages subdirectory. It checks the generated account document and release flag before completing. release.json now records VERCEL_GIT_COMMIT_SHA when GITHUB_SHA is absent.

Run npm.cmd run build:vercel locally to reproduce this target. Verify the account overview, addresses, history and known sample-order paths on first load and reload, including centred editors. The standard npm.cmd run build retains its explicit account-preview opt-in. Real customer auth, ordering and staff access remain unavailable. Existing prerendered documents and Vercel filesystem routing preserve the correct first paint.
