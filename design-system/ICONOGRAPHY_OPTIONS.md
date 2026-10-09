# WeGroween Iconography Options

## Status

- Version: 1.1.0
- Mode: EXTEND
- Scope: Iconography only
- Wordmark/logo: Deferred by the Design Decision Leader
- Canonical icon direction: I1 Field Notes — selected by the Design Decision Leader

## Shared requirements

All three approaches use a 24×24 coordinate grid, remain legible at 16–32px, inherit semantic color, avoid text baked into SVG, and support currentColor. Functional icons must preserve a 44×44px interaction target when used without a visible label. Icon-only controls require an accessible name; unfamiliar icons also require a tooltip or adjacent explanation.

Crop-specific icons may carry character. Universal interface actions—search, close, chevron, account, add, remove—must remain conventional enough to recognize immediately.

## I1 Field Notes — Approved

**Thesis:** Precisely drawn field observations: technically clear, but gently shaped by living produce.

- 24px base grid; 1.75px optical stroke.
- Square line caps with rounded joins.
- Slight asymmetry is reserved for organic subjects such as mushrooms and leaves.
- Open counters and interrupted contours preserve clarity at small sizes.
- Best fit with Cultivated Editorial because it echoes botanical annotation without becoming rustic or decorative.
- Accessibility/performance: strong small-size clarity and lightweight line SVGs.
- Risk: requires careful optical review so organic variation does not become inconsistency.

## I2 Cultivation Geometry

**Thesis:** Controlled growing expressed through rational construction and repeatable geometry.

- 24px base grid; 2px monoline stroke.
- Round caps and round joins.
- Symmetrical construction, circles, arcs and repeated modules.
- Strongest for operational interfaces, tables and dense controls.
- Accessibility/performance: highly predictable and easiest to extend.
- Risk: can feel generic, technological or clinical beside premium food photography.

## I3 Harvest Cut

**Thesis:** Bold cut forms inspired by produce labels, crate marks and agricultural tools.

- 24px base grid; 2.25px outer stroke with occasional filled detail.
- Flat caps, bevelled or mitred joins and angular silhouettes.
- Closed shapes and stronger contrast create a distinctive display voice.
- Strongest for category markers, packaging cues and larger navigation moments.
- Accessibility/performance: recognizable at 20px and above.
- Risk: loses finesse at 16px, competes with Fraunces, and is less suitable for dense admin or form controls.

## Decision

**I1 Field Notes was selected by the Design Decision Leader on 2026-10-02.** It best balances premium warmth, authenticity, small-size legibility and long-term UI coverage. I2 and I3 remain comparison history and must not be mixed into the canonical family.

## Decision format

The canonical library is delivered under `icons/` with a symbol sprite, individual SVG files, a machine-readable manifest, usage rules, token additions and accessibility examples.
