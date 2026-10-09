"""Run standard delivery checks with the accepted R3 renderer's freshness contract."""
from pathlib import Path
import sys,json,importlib.util
ROOT=Path(__file__).resolve().parents[1]
SKILL=Path(r"C:\Users\tarun\.agents\skills\design-language-system")
sys.path.insert(0,str(SKILL/"scripts"))
from language_core import *
import build_delivery
from validate_language import validate
spec=importlib.util.spec_from_file_location("project_adapter",ROOT/"scripts/build_project_delivery.py")
adapter=importlib.util.module_from_spec(spec);spec.loader.exec_module(adapter)
def adapter_check(root,groups=None,browser=None,check_only=False):
    if not check_only:raise ValueError("Use build_project_delivery.py to preserve the approved presentation")
    root=Path(root);manifest=load(root/"validation/adapter-freshness.json");state=load(root/"language-state.json")
    stale=[]
    if manifest["basis"]!=adapter.common_basis():stale.append("canonical-inputs-or-adapter")
    for rel,expected in manifest["files"].items():
        p=root/rel
        if not p.is_file() or digest(p.read_bytes())!=expected:stale.append(rel)
    for rel,record in state["artifacts"].items():
        if rel not in manifest["files"] or record["input_hash"]!=manifest["basis"]:stale.append("unbound:"+rel)
    return {"stale":stale,"renderer":"accepted-project-r3-adapter-v1"}
def check(stage="rendered"):
    language,tokens,state=[load(ROOT/n) for n in ("design-language.json","design-tokens.json","language-state.json")]
    build_delivery.build=adapter_check
    result=validate(ROOT,stage)
    result["validation_adapter"]={"reason":"Leader accepted R3 photographs/form content and three-page H1 presentation; generic schematic renderer cannot preserve them",
     "unchanged_standard_checks":["Specification","Approvals","Canonical tokens/CSS","Coverage","Common structure lock","Required files","Output hashes","PDF parsing","Scope/forbidden artifacts"],
     "replacement_check":"Renderer-specific input/decision/template/code/output hash freshness; no quality or approval check waived",
     "approval":state["migration_confirmation"]["evidence"]}
    stale=stale_decisions(language,tokens,state,ROOT)
    if stale:result["errors"].append("Stale approvals: "+",".join(stale))
    browser=load(ROOT/"validation/browser-qa.json");pdf=load(ROOT/"validation/pdf-qa.json")
    if any(v["scrollWidth"]>v["width"] or v["overflow"] or v["brokenImages"] for v in browser["viewports"]):result["errors"].append("Viewport overflow or broken media")
    if browser["stress"]["overflow"]:result["errors"].append("Content/reflow stress overflow")
    if pdf["out_of_bounds_count"] or not pdf["all_nonempty"]:result["errors"].append("PDF text bounds/empty-page failure")
    contrasts=load(ROOT/"validation/rendered-contrast.json")
    if any(r["failures"] for r in contrasts["reports"]):result["errors"].append("Rendered text contrast failure")
    variants=load(ROOT/"prototype-coverage.json")["generated_prototypes"]
    if any(v["pages"]!=3 for v in variants):result["errors"].append("Approved H1 presentation page-count drift")
    if scope_changes(state):result["errors"].append("Out-of-scope project changes")
    result["valid"]=not result["errors"]
    save(ROOT,"validation/"+stage+"-validation.json",result)
    print(json.dumps({"stage":stage,"valid":result["valid"],"errors":result["errors"],"declared_contrast_checks":len(result["checks"]),"project_adapter":"R3-preserving; standard non-renderer checks retained"},indent=2))
    return result
if __name__=="__main__":raise SystemExit(0 if check(sys.argv[1] if len(sys.argv)>1 else "rendered")["valid"] else 1)

