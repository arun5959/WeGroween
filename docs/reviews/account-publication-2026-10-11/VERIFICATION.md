# Published account parity

The GitHub Pages release enables `VITE_ACCOUNT_PREVIEW=true` for the same fictional assumed-session account UI shown on localhost. It uses the existing account component, sample fixtures, navigation and centred profile/address dialogs. Static HTML, client rendering and known sample-order entries share this configuration; standard builds without the flag retain denied account access. Admin, authentication and real checkout remain unavailable.

Validation: 17 unit checks passed, including byte-for-byte account HTML parity and unchanged staff/checkout access decisions. The mounted `/WeGroween/` build and all four Pages browser checks passed, covering direct routes, reload, profile edits, address creation dialogs, reset-on-reload and 1440/390/320px layouts. Desktop and mobile account heading/workspace bounds matched localhost exactly. Screenshots: localhost-1440.png, pages-1440.png, localhost-390.png, pages-390.png.

The stale Pages search assertion now targets its matching-product list explicitly, so Shop category/sort option portals do not create a strict-selector failure.
