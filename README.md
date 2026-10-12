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

## Local operations workspace

Open `/admin` on the Vite development server. The operations preview now supports catalogue editing and approved photograph previews, reasoned stock adjustments, fulfilment and order notes, customer history, kitchen follow-ups, promotion/delivery rules, linked reports and filtered CSV export. Tables provide search, status/category filters, sort, pagination and selected-record actions.

Operations records synchronise between tabs on the same origin. Unsaved editors retain their inputs; a conflicting change requires reviewing the latest record before saving. Reports apply their ledger search and stage filters to totals, charts and CSV export.

Operations records are fictional and persist in this browser under `wegroween.operations.preview.v1`. Settings → Reset preview data restores the original records through a confirmation dialog. Basket and customer profile/address previews remain separate. Period reports end at the latest sample order date; cancelled orders are excluded from sample value and item quantities. A storage warning explains when changes can only remain in the current tab.

The Vercel build publishes this editable fictional admin preview with VITE_OPERATIONS_PREVIEW=true. Changes stay in each browser and do not publish the storefront catalogue, send messages, collect payments or enable delivery. Shared database persistence, authenticated permissions and live integrations remain separate work. Standard and GitHub Pages builds retain their protected admin state unless this explicit preview flag is enabled.

The plan is in [ADMIN_DYNAMIC_PLAN.md](docs/ADMIN_DYNAMIC_PLAN.md), and the verification record is in [the admin review](docs/reviews/admin-dynamic-2026-10-11/VERIFICATION.md). Run the functional admin tests with:

```powershell
npx.cmd playwright test --config playwright.account.config.js operations-dynamic.spec.js transformed-pages.spec.js
```

## Publishing

The [Pages workflow](.github/workflows/deploy-pages.yml) builds and tests the application, then publishes only `dist/` to GitHub Pages on a push to `main`. The Pages build includes the localhost account design with fictional data and in-memory editing (`VITE_ACCOUNT_PREVIEW=true`); authentication and real orders remain unconnected. The full application source, design system, documentation and tests remain in this repository. See [deployment and rollback](docs/DEPLOYMENT.md) for the project-directory build, static-host limitations and preserved previous version.

## Modern image delivery

All referenced raster media now use WebP, including header/footer logos and favicon. Remaining farm/category photographs have 480px, 768px and full-size delivery copies. Logos preserve the approved viewport and use lossless transparency. Original supplied PNGs remain as editing sources; true vector icons stay SVG. Recreate these delivery copies with Python/Pillow using scripts/prepare-modern-media.py; npm builds validate the committed files without Python.
