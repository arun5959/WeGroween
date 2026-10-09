"""Adopt the reviewed design-only migration, retaining its complete legacy rollback."""
from pathlib import Path
import importlib.util, json, shutil, sys

ROOT=Path(__file__).resolve().parents[1]
assert ROOT.name=='migration-v2', 'Run adoption only from the migration workspace'
ACTIVE=ROOT.parent.resolve()
assert ACTIVE==Path(r'E:\WeGroween\GitHub Clone\WeGroween\design-system').resolve()
sys.path.insert(0,r'C:\Users\tarun\.agents\skills\design-language-system\scripts')
from language_core import load, save, write, digest, review_basis, scope_changes
spec=importlib.util.spec_from_file_location('project_adapter',ROOT/'scripts/build_project_delivery.py')
adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)

def main():
    rollback=ACTIVE/'history/2026-10-05-system-migration'
    manifest=load(rollback/'legacy-manifest.json')
    failures=[n for n,h in manifest['files'].items() if digest((rollback/'legacy-delivery'/n).read_bytes())!=h]
    assert not failures, failures
    state=load(ROOT/'language-state.json')
    assert not scope_changes(state), 'Project scope changed'
    assert load(ROOT/'validation/rendered-validation.json')['valid']
    assert state['migration_confirmation']['status']=='approved'
    assert state['decisions']['coverage']['choice']=='all-three'
    for name in ('README.md','MIGRATION_REVIEW.md','quality-review.json'):
        p=ROOT/name
        target=ROOT/'history/pre-adoption'/name
        if p.exists() and not target.exists():write(ROOT,'history/pre-adoption/'+name,p.read_bytes())
    state['phase']=9
    state['phases']['8']={'status':'complete','evidence':'All five PDFs rendered and visually inspected; browser, stress, gallery and rendered validation pass; quality-review.json binds actual outputs'}
    state['phases']['9']={'status':'pending','evidence':'Leader final PROPOSED/APPROVED confirmation and authorization of a private archive destination remain pending'}
    state['migration_adoption']={'status':'adopted','date':'2026-10-05','active_root':str(ACTIVE),'basis':'Accepted mapping/additions and all-three coverage; actual rendered review completed','rollback':'history/2026-10-05-system-migration/legacy-delivery','release_status':'PROPOSED; not independently confirmed','mode_after_migration':'Focused EXTEND for future design-language work'}
    save(ROOT,'language-state.json',state)
    readme='''# WeGroween Design Language System

Updated 2026-10-05 | 1.3.0-proposed | PROPOSED release

This is the active schema-2 design-language package. The user accepted the migration mapping and additions, and requested all three palette previews. C2 Soil & Saffron remains primary, with T2 Fraunces + DM Sans, G3 Curated Market, I1 Field Notes, H1 Harvest to Home and the authorized R3 project photographs.

Start with [the comparison gallery](artifact/index.html), [the primary responsive homepage](artifact/homepage-palette-2.html), and [project status](PROJECT_STATUS.md).

## Current deliverables

- Homepage PDFs: pdf/wegroween-homepage-prototype-palette-2.pdf (primary), palette-1.pdf and palette-3.pdf (comparisons); each uses the approved three-page format.
- pdf/wegroween-imagery-direction-guide.pdf: separate two-page art-direction guide.
- pdf/wegroween-design-direction-manual.pdf: synchronized 15-page manual.
- Narrative/system documents: BRAND_IDENTITY_BLUEPRINT.md, DESIGN_SYSTEM.md, IMAGERY_DIRECTION_GUIDE.md, DESIGN_DIRECTION_MANUAL.md, research-summary.md and decisions.md.
- Canonical inputs: design-language.json, design-tokens.json and language-state.json; generated tokens.css. State owns current progress and approvals.
- Review evidence: quality-review.json, QUALITY_REVIEW.md, migration-equivalence.json and validation/.

## Verified scope and remaining decision

165 selected values match the legacy system. All 26 current PDF pages were reviewed, nine palette/viewport cases have no measured overflow or broken images, 102 declared contrast checks pass and 609 rendered text-element checks have no measured failures. Gallery keyboard navigation and proposed-choice export work. These checks are not user testing or formal accessibility certification.

Final release status and a private archive destination still need leader confirmation. Pricing, delivery rules and public image rights remain unconfirmed. Wordmark/logo remains deferred. Existing historic research is carried with its dates; it was not refreshed in this migration.

The complete 92-file legacy rollback is retained under history/2026-10-05-system-migration/. Earlier root filenames such as artifact/components.html and older PDFs are legacy references; use the current filenames above. migration-v2 is the retained migration workspace. Existing project memory and product source remain unchanged.

## Rebuilding

Use scripts/build_project_delivery.py for this project's authorized R3 presentation adapter, then scripts/validate_project_delivery.py rendered. The generic skill renderer cannot preserve the approved photo/form content and three-page presentation. The adapter retains the standard approval, token/CSS, coverage, file, hash, PDF and scope checks. Review affected rendered outputs after any rebuild; final validation additionally requires confirmed release and immutable private archival.
'''
    status='''# WeGroween Design Language Progress

Updated: 2026-10-05. Decision owner: user. Active package: 1.3.0-proposed.

The requested system revision is adopted. MIGRATE preserved the approved identity and added schema-2 purpose/composition, component-state and imagery rules. All-three palette coverage and migration additions were expressly accepted. Future changes use focused EXTEND from current canonical inputs.

## Phase status

| Phase | Current result |
|---|---|
| 0 Preflight | Exact nested checkout, design-only scope, full legacy rollback verified |
| 1 Brief | Reused approved household-first, restaurant-secondary, English-first brief |
| 2–3 Memory/research | Retrieved and carried dated evidence; no fresh-market claim |
| 4 Direction | Preserved Cultivated Editorial; alternatives remain comparative hypotheses |
| 5 Language | Accepted mapping/additions; C2/T2/G3/V1/M1/I1/H1/R3 preserved |
| 6 Specification review | PASS; 165 selected values preserved and 102 declared contrast checks pass |
| 7 Coverage | User requested all three palettes; C2 primary |
| 8 Delivery/rendered review | Complete: three 3-page homepage PDFs, 2-page imagery guide, 15-page manual, gallery and canonical package |
| 9 Release/private archive | Pending explicit PROPOSED/APPROVED confirmation and archive destination authorization |

## Evidence and limits

quality-review.json and validation/ record actual inspection, responsive/stress checks, rendered text contrast and gallery interaction. All 26 current PDF pages pass text-bounds/nonempty checks. Nine viewports at 1440/768/390px have no measured overflow or broken media. Three variants lock copy, typography, spacing and media geometry. 203 text elements per palette have no measured contrast failure against composited solid surfaces; images/gradients are not certified by that measurement.

Prototype photographs retain earlier R3 permission. Public rights, live prices/packs/stock/service areas, operational claims and production implementation remain outside this release. Wordmark/logo is deferred. No formal accessibility certification or empirical user testing is claimed.

## Preservation and boundaries

Work stays under this project's design-system. Product source, dependencies, deployment and existing design-memory remain unchanged. The 92-file byte-preserving rollback and source hashes are in history/2026-10-05-system-migration/. The prior plan-only revision is retained in history/2026-10-05-plan-revision/. Personal/agency memory writes are not implied. B2 historic reviewed-redacted structural reuse is preserved; it does not authorize new client identity/copy/assets promotion.

## Next leader decision

Confirm PROPOSED for further review or APPROVED as the design release, and authorize the private archive root. This decision concerns the concrete design-language package; public/production image rights and operating data still need separate resolution before implementation.
'''
    migration=(ROOT/'MIGRATION_REVIEW.md').read_text(encoding='utf-8')
    migration=migration.replace('Status: PROPOSED; mapping confirmation pending','Status: Mapping and additions ACCEPTED; rendered review complete; release PROPOSED')
    migration=migration.replace('Exact source retained; final template adaptation not done','Exact source retained; authorized project adapter rendered and reviewed')
    migration=migration.replace('## Permitted changes proposed for acceptance','## Accepted migration changes')
    migration=migration.replace('no replacement has been rendered','the authorized project adapter now renders the retained H1 content and presentation')
    migration=migration.replace('A bounded project-specific presentation adapter is needed after this mapping is accepted','A bounded project-specific presentation adapter has been created for the accepted mapping')
    migration=migration.replace('Expanded imagery bands need acceptance. PDF/rendered/stress QA and final release/archive remain pending.','Expanded imagery bands were accepted. PDF/rendered/stress QA passes; final release/private archive remains pending.')
    migration=migration.replace('## Required leader checkpoint','## Accepted leader checkpoint')
    migration=migration.replace('Accept the preservation mapping and permitted additions above, or identify revisions. This is separate from the already approved all-three coverage and final release status. On acceptance, adapt/render the preserved H1 presentation, create synchronized imagery/manual PDFs, inspect actual outputs and then present the concrete release package.','The user accepted the mapping and additions on 2026-10-05 with “Accept mapping and additions (Recommended)”. All-three coverage was separately accepted. The retained H1 presentation, imagery guide and manual now exist and pass rendered review. Only final release/private archive remains pending.')
    migration=migration.replace('- No rendered-equivalence, user testing, public-rights clearance or final compliance claim.','- Current rendered review and responsive/stress/gallery checks pass. No pixel-identical equivalence, user testing, public-rights clearance or formal compliance claim is made.')
    migration+='\n## Adoption result\n\nAll five current PDFs were inspected; schema-2 package is active. See quality-review.json, validation/rendered-validation.json and PROJECT_STATUS.md. Original prepared review is retained in history/pre-adoption/MIGRATION_REVIEW.md within the migration workspace.\n'
    qualitymd='''# WeGroween Rendered Quality Review

2026-10-05 | 1.3.0-proposed | Rendered stage PASS; release/archive pending.

A distinct review pass inspected all current PDF pages, all three full desktop canvases in six readable slices each, cover/closing frames, responsive screenshots, component reference and the expanded/missing-copy stress case. Desktop/mobile, purpose, subtraction, hierarchy, geometry, imagery, original-expression preservation, fonts and gallery checks pass for review delivery.

Measured results: 165 preserved selected values; 102 declared contrast checks; 609 actual rendered text-element checks; 26 nonempty PDF pages with no out-of-bounds text; nine viewports without overflow/broken images; native gallery keyboard operation and PROPOSED export. A stale component version label was corrected after inspection. No blocking review defect remains.

Limitations: historic research was carried rather than refreshed; no empirical user testing or formal accessibility certification; solid-surface contrast measurements do not certify photographic/gradient backgrounds; disabled states retain documented inactive exemptions; R3 review permission does not clear public image rights; operational fields remain illustrative; alternative territory/order mappings are accepted proposal hypotheses. Final leader release status and private archive remain pending.

Evidence: quality-review.json; migration-equivalence.json; validation/pdf-qa.json; validation/browser-qa.json; validation/rendered-contrast.json; validation/gallery-interaction.json; validation/targeted-refresh.json; validation/rendered-validation.json.
'''
    for n,content in [('README.md',readme),('PROJECT_STATUS.md',status),('MIGRATION_REVIEW.md',migration),('QUALITY_REVIEW.md',qualitymd)]:adapter.record_output(n,content)
    adapter.delivery_manifest()
    evidence={
      'purpose':'Preserved household-first harvest/availability sequence and secondary restaurant path; 18 readable desktop slices and mobile crops inspected',
      'subtraction':'Reviewed ten H1 sections against their declared user need; supporting strips/CTAs remain subordinate and serve orientation, evidence or next action',
      'hierarchy':'Fraunces headings/DM Sans body, clear primary CTA and consistent section hierarchy across all three palette canvases and cover/closing frames',
      'precision':'Equal product action rows, retained grids, all three canvases and long/missing-copy card stress inspected; validation/browser-qa.json and migration-equivalence.json',
      'imagery':'All retained photos inspected in authorized R3 slots; source hashes match; both imagery-guide pages reviewed; public rights remain unresolved',
      'originality':'Migration retains project-authored H1 bytes/section expression and I1 icons; comparative hypotheses attributed, no newly copied source expression introduced; provenance/ and migration-equivalence.json',
      'fonts':'Offline Fraunces/DM Sans source hashes match, browser font status loaded, actual PDF heading/body rendering inspected; fallback/resource checks in validation/browser-qa.json',
      'desktop':'All three desktop canvases inspected in six readable slices each; 1440/768px viewport crops checked; validation/browser-qa.json',
      'mobile':'390px palette screenshots, product/form/footer layout, 720px reflow/expanded/missing-copy stress and component crop inspected; zero measured overflow or broken media',
      'pdf':'Every current page inspected: 3+3+3 homepage pages, 2 imagery pages and 15 manual pages; 26 nonempty pages and no out-of-bounds text; validation/pdf-qa.json',
      'gallery':'Three preview frames, native option selection and keyboard ArrowRight category switching tested; exported status remains proposed; validation/gallery-interaction.json'}
    save(ROOT,'quality-review.json',{'input_hash':review_basis(ROOT),'stage':'rendered','reviewed_at':'2026-10-05','review_method':'Distinct post-authoring review by primary agent; no delegation','checks':[{'category':c,'result':'pass','reviewer':'Codex rendered review','evidence':e} for c,e in evidence.items()], 'blocking_defects':[], 'limitations':['No empirical user testing or formal accessibility certification','Historical research not refreshed','R3 project review permission does not clear production/public rights','Image/gradient contrast not certified by solid-surface measurements','Release/private archive pending leader confirmation']})
    excluded={'tmp','history'}
    adopted=[]
    for p in ROOT.rglob('*'):
        rel=p.relative_to(ROOT)
        if not p.is_file() or any(part in excluded or part=='__pycache__' for part in rel.parts):continue
        if rel.as_posix() in ('scripts/prepare_migration.py','scripts/adopt_migration.py'):continue
        target=(ACTIVE/rel).resolve()
        assert target.is_relative_to(ACTIVE) and not target.is_relative_to(ROOT)
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(p,target)
        assert digest(target.read_bytes())==digest(p.read_bytes())
        adopted.append({'path':rel.as_posix(),'sha256':digest(target.read_bytes())})
    save(ACTIVE,'validation/adoption.json',{'date':'2026-10-05','status':'adopted','source':str(ROOT),'active_root':str(ACTIVE),'files':adopted,'legacy_rollback_files_verified':len(manifest['files']),'product_and_existing_memory_changes':scope_changes(state),'release':'PROPOSED; confirmation pending','private_archive':'Not performed'})
    assert not scope_changes(state)
    print(json.dumps({'adopted_files':len(adopted),'legacy_files_verified':len(manifest['files']),'active_root':str(ACTIVE),'scope_changes':scope_changes(state)},indent=2))

if __name__=='__main__':main()
