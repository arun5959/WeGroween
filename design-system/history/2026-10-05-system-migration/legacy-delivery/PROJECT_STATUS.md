# WeGroween Design Language Plan and Progress

Revised: 2026-10-05  
Workflow: Design Language System  
Decision owner: Design Decision Leader (user)  
Current task: Plan revision only  
Next execution mode: MIGRATE, then focused EXTEND for missing outputs

## Current position

The existing **v1.2.0-proposed** delivery remains the preserved legacy package. Its identity choices are approved; R3 homepage/manual reviews and private snapshots are historical evidence. Final release remains pending. This revision changes the plan, not canonical design values, prototypes, PDFs or memory archives. New-contract migration and validation have not been performed.

Adopt the system through a versioned migration that preserves approved expression and values, then extend only missing outputs. Reuse the brief, research and decisions rather than restarting onboarding.

This plan replaces the previous instruction to move directly to release. Current numbering places specification review in Phase 6, palette coverage in Phase 7, synchronized delivery/rendered review in Phase 8, and memory/archive in Phase 9. Earlier completion records remain in the planning rollback.

## Scope baseline

| Boundary | Rule |
|---|---|
| Exact project | E:\WeGroween\GitHub Clone\WeGroween; Website Source Code is a separate copy |
| Authorized work | Design documents, tokens/CSS, galleries, bounded non-production prototypes, PDFs and review records under this project's design-system |
| Local resources | Read relevant material under E:\WeGroween\Resources; do not crawl the entire drive |
| Memory | Read existing design-memory evidence; this revision writes no memory. Verify authorization of the actual future archive destination before writes |
| Exclusions | Product-source edits, app scaffolding, routes, backend, database, authentication, checkout, CMS, dependencies and deployment |
| Deferred | Wordmark, logo, monogram and lockup production |
| Working changes | Existing design-system and design-memory are untracked; preserve them and concurrent work |

The future HTML/Tailwind/JavaScript/Supabase/Razorpay stack and storefront/admin surfaces remain implementation context only.

Rollback copies of PROJECT_STATUS.md, README.md and decisions.md, plus pre-edit hashes of 196 project files, are in history/2026-10-05-plan-revision/. This is a planning rollback. Before migration, preserve the entire legacy delivery byte-for-byte outside the candidate output root.

## Preserve settled choices

Evidence: decisions.md, BRAND_IDENTITY_BLUEPRINT.md, and design-memory/projects/wegroween/brief/approved-brief.md. Transfer original dates, owner and source citations into migration state; record no unsupported approvals.

| Category | Existing approval/constraint | Candidate treatment |
|---|---|---|
| Audience/brief | Premium Indian households first; restaurant supply secondary; English-first | Reuse; ask only about material gaps |
| Scope | Design-system development only | Preserve |
| Territory | Cultivated Editorial | Preserve; no new territory selection |
| Color | C2 Soil & Saffron | Map to palette-2 with identical resolved approved values |
| Typography | T2 Fraunces + DM Sans | Map to type-2; retain styles, licensed fonts and loading rules |
| Density | G3 Curated Market | Preserve containers, grid, spacing and responsive intent |
| Voice | V1 Cultivated Authority | Preserve rules and applied copy |
| Component character | M1 Restrained Editorial | Preserve geometry/states and 140/220/360ms motion with reduced-motion rules |
| Icons | I1 Field Notes | Preserve approved vector family and values |
| Structure | H1 Harvest to Home | Preserve household-first narrative and section order |
| Presentation | Three pages: themed opening, continuous desktop canvas, responsive/interaction closing | Preserve; disclose builder limitations before proposing changes |
| R3 photography | Direct use of selected current project images approved on 2026-10-03 | Retain authorization as a prototype-use exception; production/public rights remain unconfirmed |
| Reuse | B2 reviewed-redacted structural reuse approved on 2026-10-03 | Remain within the existing boundary; review actual new records before promotion |
| Release | PROPOSED | Keep pending; plan revision is not release approval |

Retain the three original territories, three palette alternatives, two typography choices and existing narrative alternatives. Unselected alternatives remain decision history. Missing mandatory fields are new work, never invented historical approvals.

## Phase tracker and gates

| Phase | Current position | Required next work and exit condition |
|---|---|---|
| 0 — Preflight | Plan review completed; migration preparation pending | Inventory legacy inputs/assets/archives, full rollback, tools and candidate scope baseline. Prepare source/target mapping and losses. Never run init over the existing delivery |
| 1 — Intake and brief | Existing brief approved | Carry forward approved scope and assumptions. Gate A is reusable for unchanged work; added deliverables/material assumptions require acceptance |
| 2 — Memory and research plan | Existing evidence available | Retrieve relevant project/local evidence. Record question IDs, known/stale/missing evidence, source/time budget and stopping condition |
| 3 — Conduct research | Historical synthesis reusable | Resolve only active gaps; record dates, observations versus interpretation, confidence, rights and limitations. Gate B: sufficient decision-relevant evidence or disclosed hypotheses |
| 4 — Patterns and territories | Cultivated Editorial approved | Carry forward Gate C with evidence. Preserve original three directions; rebuild comparable functional gallery previews only when affected |
| 5 — Generate language | Legacy inputs exist; migration pending | Populate versioned narrative/value/state inputs, complete registries, purpose/composition, component anatomy/states and imagery standards. Ask only about genuinely new material rules |
| 6 — Independent specification review | Historical QA retained; current review pending | Separate reviewer pass after authoring: equivalence, approvals, actual contrast/state pairs, purpose/subtraction, consistency, originality, rights and scope. Gate D: no blocking specification defects |
| 7 — Palette coverage | Separate coverage approval absent | Ask selected-only (recommended), selected plus a named alternative, or all three. C2 is primary. Wait for explicit response/delegation |
| 8 — Synchronized delivery and rendered review | Historical R3/manual exist; candidate work pending | Reuse H1 approval; reopen structure only for material changes. Build affected outputs and inspect actual desktop/mobile, component crops, stress cases, gallery and every PDF page |
| 9 — Memory, archive and handoff | Historical proposed archives/B2 entry exist | Confirm release/exception/reuse status, freeze reviewed inputs/outputs, archive verified bytes/hashes, reopen records, scope-check and final-validate |

Default to one focused pass. No sub-agents are scheduled; delegation requires explicit authorization. At material gates, continue only neutral preparation that does not presume the answer.

## Preservation-first migration

Prepare a versioned candidate under design-system/migration-v2/. Keep the legacy package active until mapping and equivalence are accepted. Store full legacy rollback and source hashes separately under design-system/history/, outside the candidate output root. Assign the candidate version explicitly; do not relabel v1.2.0 as already migrated.

| Source | New authority/output | Transfer and gap treatment |
|---|---|---|
| Approved brief, Blueprint, DESIGN_SYSTEM, research | design-language.json | Transfer attributed facts and approved expression. Add attention, macro/meso/micro space, responsive priorities, purpose patterns and bounded research metadata |
| Tokens, CSS and authored alternative values | Schema-2 design-tokens.json | C1/C2/C3 -> palette-1/2/3; T1/T2 -> type-1/2. Preserve C2/T2 selection and compare every resolved approved leaf. Complete missing alternative roles as proposed work |
| Decisions, progress and prior validation | language-state.json and derived decisions.md | Fresh MIGRATE state with actual project/version, scope baseline, phases, dirty outputs, hashes and evidenced approvals; coverage/release pending, logo deferred |
| Photography rules/provenance | Imagery data and separate guide Markdown/PDF | Define product fidelity, treatment, crops/backgrounds, rights, representation, accessibility/performance and generated-image restrictions. New material direction needs approval |
| H1 source and R3 presentation | Homepage sections/template and palette PDFs | Preserve copy, section order, type, spacing, media geometry and presentation. Use a bounded token-driven template if supported sections are insufficient |
| Existing comparison/specimens | Functional gallery | Preserve actual options and current IDs; selections/exports stay proposed until leader confirmation |
| Historic reviews/snapshots | New review/archive records | Preserve old evidence with dates; certify only candidate bytes actually checked |

Do not use template defaults as business answers. New mandatory fields must be attributed, authored or marked incomplete. Present mapping, permitted differences, missing choices and equivalence results to the leader before rendering replacements.

Source authority after migration: **tokens own implementation values; design-language.json owns narrative/composition; language-state.json owns approvals/progress**. Markdown, CSS, galleries and PDFs are derived views, rebuilt only when their dependencies change.

## Purpose and craft requirements

Record user need, purpose, placement, prominence, removal cost, responsive behavior and evidence/hypothesis once per reusable section/component pattern. Cover H1 navigation/serviceability, hero, current harvest, categories, cultivation, delivery, household boxes, restaurant supply, journal, closing actions and footer.

Keep household shopping prominent and restaurant supply discoverable. Explain macro space between narrative chapters, meso space between groups and micro space within component anatomy. Subtraction review addresses redundant claims, competing actions and unjustified decoration; material removal of approved expression requires leader approval.

Repeated cards require shared media/title/copy/metadata/price/action rows, aligned baselines and stable action zones under shortest, longest or absent optional content. Check I1 glyphs, real font weights, optical centering, borders/radii, wrapping and all relevant states. Test narrow/intermediate/wide widths, localization expansion and 200% reflow. Do not hide defects with clipping or brittle fixed heights.

## Palette, imagery and presentation exceptions

**Palette:** Existing R3 uses C1 because of the legacy mandatory Approach #1 rule; approved identity is C2. Keep R3 as history. New primary previews use C2; any C1 comparison needs separate coverage approval. Palette-1 fallback applies only to explicit uncertainty/deferment and stays PROPOSED. No fallback is currently authorized.

**Imagery:** The system defaults to empty bounded rich-media regions, while the leader explicitly authorized direct imagery for R3. Preserve that authorization as a project-specific exception. Do not silently remove photos or infer rights clearance. During candidate mapping, confirm whether the next preview retains R3's exception or uses bounded schematic media. Lock media geometry across palette variants.

**Presentation:** Preserve the approved three-page continuous-homepage model. All variants lock structure, copy, typography, spacing, media geometry and framing. Show any needed mobile-view or framing amendment before rendering.

## Output and freshness plan

| Output | Existing state | Planned work |
|---|---|---|
| Brief/research/territories | Existing | Reuse with attribution; refresh only decision-relevant stale claims |
| Blueprint/system Markdown | Existing | Generate synchronized views from accepted candidate inputs |
| Imagery guide Markdown + separate PDF | Absent as separate deliverables | Focused EXTEND after migration and approval of new material rules |
| Tokens/CSS | Legacy shape | Preserve values; add complete registries/state mappings; regenerate adapter |
| Narrative/state JSON | Absent in active package | Prepare and validate candidate; not initialized by this revision |
| Gallery | Legacy comparison/specimens | Generate and inspect synchronized candidate controls/options/export |
| Homepage palette PDF(s) | C1 R3, three pages | C2 primary, approved coverage only; retain legacy R3 |
| Manual PDF | Historical twenty-page manual | Rebuild affected content; disclose format/scope changes |
| Coverage/review JSON | New-contract records absent | Record variant lock, actual checks, reviewer and evidence |
| Snapshot/log | Historical proposed records | Fresh archive after current QA and release-status decision |

This is MIGRATE plus focused EXTEND, not full CREATE. Keep unaffected outputs; do not call the entire package current while required dependencies are missing/stale. Skip unchanged rendering only when source/browser hashes support freshness. Mark checks pass/fail/not-tested/not-applicable; historical passes do not certify changed bytes.

## Research and validation sequence

Active questions: completeness of legacy alternative registries, factual versus proposed imagery rules, H1 builder compatibility, and evidence/rights sufficiency. Local inspection answers mapping questions without new competitor research.

For remaining material gaps, begin with at most six relevant sources and thirty minutes, adjusted to scope. Use project evidence and the narrow local resource root first; verify live claims only when needed for a new decision. Stop when questions are supported, explicitly hypothetical or ready for a leader choice. Ask before materially expanding the budget. Prices, pack sizes and delivery/serviceability remain illustrative until verified; launch credentials are unnecessary for this design work.

After inputs/approvals are ready, run the installed skill helpers against the candidate root: language_workflow.py status, validate_language.py --stage specification, affected build_delivery.py groups with a verified local renderer, validate_language.py --stage rendered, then language_workflow.py scope-check.

Phase 6 reviews specifications; Phase 8 inspects actual artifacts. Review every PDF page and readable slices of long canvases, desktop/mobile and component crops. Bind quality-review.json to the real review-basis hash. Relevant later changes invalidate affected QA.

After explicit PROPOSED/APPROVED release choice, verify archive destination authorization, retain immutable delivered bytes/hashes, reopen snapshots/logs and run final validation. B2 permits only reviewed-redacted structural reuse; release does not expand it. Personal Codex memory updates are outside this task.

## Next execution and expected decisions

1. Prepare full migration rollback, mapping and equivalence report without replacing legacy files.
2. Present one compact mapping review: preserved C2/T2/G3/I1/H1, required schema additions, R3 imagery exception, imagery-guide scope and any format limitations. Obtain acceptance before replacement rendering.
3. Transfer supported approvals and complete missing inputs; request only new material choices.
4. Ask palette coverage once: selected C2 only (recommended), C2 plus a named alternative, or all three.
5. Build/review affected outputs, then present the concrete package for release status and verified archive.

This plan revision needs no further approval to be complete. No migration mapping, new creative choice, additional coverage or release decision has been inferred from the request.

## Revision record

2026-10-05: Revised under the explicitly requested Design Language System. Corrected Phase 0–9, introduced preservation-first MIGRATE and focused EXTEND, separate coverage, source/state authority, purpose/craft checks, imagery-guide work and staged validation. Preserved historic approvals, R3 photography, B2 reuse, deferred logo and proposed release. Product source, canonical values, delivered PDFs and memory archives were not changed.
