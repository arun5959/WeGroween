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
npm.cmd run build
npm.cmd run test:pages
Remove-Item Env:WEGROWEEN_BASE_PATH
```

Normal local builds use `/`. The release uses the publishing path reported by `actions/configure-pages`. URL adaptation covers rendered navigation, images, icons, responsive image sources, the cart drawer, search submissions and browser history. Static entry documents cover concrete public/client routes. Old category HTML addresses have redirect documents. `release.json` records the deployed Git commit for live verification.

## Static hosting and implementation status

This release publishes the existing storefront foundation. Ordering, payments, authentication and private/admin data integrations are not connected. Existing `noindex, nofollow` directives and disabled/denied states remain in place.

GitHub Pages cannot execute Vite's route middleware or return custom HTTP 403 responses. Concrete protected routes serve a static access-denied document and remain denied after client rendering. Unpublished dynamic records and unknown routes initially return the shared HTTP 404 document; JavaScript then renders the appropriate denied/not-found state for the requested path. No private records or credentials are present in these files. Static legacy redirects use HTML refresh and a normal link; GitHub Pages does not provide the local server's HTTP 301 behavior.

## Backup and rollback

The pre-release commit remains in Git history and is tagged `pre-redevelopment-2026-10-09`. A hash-verified local backup exists outside the repository at `E:\WeGroween\release-backups\2026-10-09-pre-publication`, containing the old committed site ZIP, a complete Git bundle, a snapshot of the redeveloped source before publishing changes and a backup manifest. The obsolete category documents and their original images are archived under `legacy/pre-foundation/` and are excluded from the built site.

To restore the original site, restore the tagged source as a new commit on `main` (preserving history), push it, and restore the saved GitHub Pages publishing configuration to branch publishing. The pre-release Pages settings are saved alongside the backup when authenticated API access is available. Do not force-push or discard unrelated changes made after this release.

The historical foundation handoff describes its earlier local-only milestone. This document describes the new hosting integration; actual deployment results are recorded separately after publication.
