# Vercel account mismatch

Date: 12 October 2026. Fix commit: 6dd7082.

## Cause

https://wegroween.vercel.app/release.json reported accountPreview=false and commit=null. Its account document contained Sign-in required and no account preview marker. GitHub reported the Vercel deployment of the same source commit 9a8a30b that Pages had deployed. The difference was build configuration: only the Pages workflow enabled the fictional account design.

## Fix and pre-publication checks

vercel.json now selects npm run build:vercel. That target forces VITE_ACCOUNT_PREVIEW=true and WEGROWEEN_BASE_PATH=/ for both the client build and static generation, then validates the emitted account HTML and release flag. Release metadata includes the Vercel Git SHA when GitHub's build SHA is absent. Standard build defaults and protected staff/checkout behavior remain intact.

The exact narrow release was checked independently from uncommitted admin work at E:\WeGroween\verification\vercel-account-release-2026-10-12. Eighteen unit checks, the Vercel target build, and four static-host browser checks passed. The complete current workspace also passed 28 unit checks and the Vercel build.

[Desktop/mobile parity observations](release-parity.json) verified identical account headings, content and four key layout bounds (less than 0.5px difference) against localhost at 1440/390px for overview, addresses, history and SAMPLE-1042 detail. First-load HTML, reloads, edit/save behavior, overflow and browser errors were checked. The desktop/mobile release screenshots are saved beside this file.

## Publication status

After the user completed GitHub sign-in, commit 6dd7082f060447222e0a509a2f2e18e5900b0e20 was pushed to main. Vercel deployment Cwxz6bBpS16UD2wZkwgaBrBw1yFS completed successfully. Live release.json reports that exact commit, root base path and accountPreview=true.

[Live desktop/mobile observations](live-parity.json) verify eight route/viewport comparisons against localhost: overview, addresses, history and order detail at 1440/390px. Content and measured layout bounds match, initial HTML already contains the assumed-session preview, reloads preserve the intended design, and centred edit/save dialogs work. No viewport overflow or browser errors were observed. Live screenshots are saved beside this record.

HTTP checks of /account with and without a trailing slash, addresses, history and the known order-detail route return the sample account HTML without the older sign-in link. /admin and /checkout still serve protected states without operations or sample-account content. These are static hosted documents (HTTP 200), not authenticated access grants.

At that account-fix release, the local admin upgrade was uncommitted and excluded. The user subsequently authorised publishing the editable sample admin in a separate release.
