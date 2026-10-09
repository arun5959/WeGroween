# WeGroween
WeGroween began as a static catalogue that directed purchases to WhatsApp. It now includes the initial application foundation for the planned full online store.

## Planned full-store development

The online-store and admin architecture is documented in [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md), with 22 customer and 15 admin page types registered in [docs/PAGE_MANIFEST.json](docs/PAGE_MANIFEST.json). The route/layout/build foundation is implemented. Authentication, inventory, checkout and payment integrations are future phases.

## Run the foundation

Use Node.js 22.12 or newer in `E:\WeGroween\WeGroween`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:5173. The development-only route/layout review is at `/__foundation`.

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Build output is in `dist/`. `npm.cmd run preview` serves it on port 4173. The first browser test run needs the matching Playwright Chromium runtime (`npx.cmd playwright install chromium` if it is not already present). See [the foundation handoff](docs/FOUNDATION_HANDOFF.md) for status and deployment constraints. The legacy homepage is backed up at `legacy/pre-foundation/index.html`.

## Publishing

The [Pages workflow](.github/workflows/deploy-pages.yml) builds and tests the application, then publishes only `dist/` to GitHub Pages on a push to `main`. The full application source, design system, documentation and tests remain in this repository. See [deployment and rollback](docs/DEPLOYMENT.md) for the project-directory build, static-host limitations and preserved previous version.
