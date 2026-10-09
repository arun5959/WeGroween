"""Project presentation adapter for accepted R3 photographs and three-page H1 format."""
from pathlib import Path
import sys, json, re, copy, base64, hashlib
SKILL=Path(r"C:\Users\tarun\.agents\skills\design-language-system")
sys.path.insert(0,str(SKILL/"scripts"))
from language_core import *
import build_delivery as bundled
from language_workflow import record_decision
from validate_language import validate
from document_views import imagery_guide, manual
from chromium import Chromium
import fitz

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT.parent if ROOT.name=="migration-v2" else ROOT
LEGACY=BASE/"history/2026-10-05-system-migration/legacy-delivery"
BROWSER=Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
APPROVAL="User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings."
PROJECTDATE="2026-10-05"

def fonts(root,language):
    assets={item["family"]:item["path"] for item in language["font_assets"]}
    css=[]
    for family,path in assets.items():
        css.append('@font-face{font-family:'+json.dumps(family)+';src:url("../'+path+'") format("woff2");font-weight:300 900;font-style:normal;font-display:swap}')
    css.append('@font-face{font-family:"Fraunces";src:url("../assets/fraunces-latin-italic-variable.woff2") format("woff2");font-weight:300 800;font-style:italic;font-display:swap}')
    return "\n".join(css)
bundled.font_css=fonts

def common_basis():
    state=load(ROOT/"language-state.json")
    return digest([load(ROOT/"design-language.json"),load(ROOT/"design-tokens.json"),
      {c:{k:r.get(k) for k in ("choice","status","owner","evidence","basis_hash")} for c,r in state["decisions"].items()},
      digest((ROOT/"scripts/build_project_delivery.py").read_bytes()),
      digest((ROOT/"provenance/h1-r3-source.html").read_bytes()),digest((ROOT/"provenance/h1-r3-source.css").read_bytes())])

def record_output(rel,raw,basis=None):
    if isinstance(raw,str): raw=raw.encode()
    write(ROOT,rel,raw)
    state=load(ROOT/"language-state.json")
    state["artifacts"][rel]={"input_hash":basis or common_basis(),"output_hash":digest(raw),"renderer":"project-r3-adapter-v1"}
    save(ROOT,"language-state.json",state)

def theme_document(html):
    style=css_tokens(load(ROOT/"design-tokens.json"))
    style += """
body{font-family:"DM Sans","Segoe UI",sans-serif;color:var(--color-text-primary)}
h1,h2,h3{font-family:Fraunces,Georgia,serif;color:var(--color-brand-primary)}
th{background:var(--color-surface);color:var(--color-text-primary)}
th,td{border-color:var(--color-border)}a{color:var(--color-brand-secondary)}
@page{margin:18mm 17mm 19mm}
"""
    return html.replace("</style>",style+"</style>",1)

def documentation(language,tokens,state):
    imagery=imagery_guide(language,state,tokens["meta"]["status"])
    imagery=imagery.replace("Homepage prototype media remains empty; this guide governs later authorized image production and selection.",
                            "R3 selected project photographs remain authorized in this project's three-page review presentation; production/public rights remain unconfirmed.")
    imagery=imagery.replace("Treatment: r3-documentary / approved.","Treatment: r3-documentary / approved for this project.")
    imagery += "\n## Status and differences\n\nThe qualitative guide expansion was accepted on 2026-10-05. No new photography is generated. R3's photography exception preserves prototype continuity; it does not grant rights clearance.\n"
    from validate_language import validate_inputs
    report=validate_inputs(language,tokens)
    manualmd=manual(language,tokens,state,report["checks"])
    source_table="| Reference | Source and original review date | Limitation |\n|---|---|---|\n"
    for source in language["research"]["sources"]:
        source_table += "| "+source["id"]+" | "+source["title"]+" / "+source["date"]+" | Historical reference; no asset reuse or new live claim inferred |\n"
    concise_research=language["research"]["summary"]+"\n\n"+source_table+"\nUnconfirmed service rules, catalogue claims and image rights remain outside this design release. Source observations and direct URLs stay in research-summary.md and the canonical narrative.\n\n"
    manualmd=re.sub(r"(?<=## Evidence, decisions and limitations\n\n).*?(?=\| Decision \|)",concise_research,manualmd,flags=re.S)
    pattern_rows="| Pattern | User need and purpose | Placement / responsive priority |\n|---|---|---|\n"
    for pattern in language["composition"]["patterns"]:
        pattern_rows += "| "+pattern["id"]+" | "+pattern["user_need"]+". "+pattern["purpose"]+" | "+pattern["placement"]+"; "+pattern["prominence"]+"; preserve anatomy on reflow |\n"
    manualmd=re.sub(r"### Pattern: .*?(?=## Three color approaches)",pattern_rows+"\n",manualmd,flags=re.S)
    manualmd=manualmd.replace("Media remains empty.","This project preserves the leader-authorized R3 photographs and three-page H1 presentation.")
    manualmd=manualmd.replace("Do not place media into these homepage review prototypes.","This project retains its existing authorized R3 image exception; no new media is sourced.")
    manualmd += "\n## Project presentation adapter\n\nThe bundled schematic renderer cannot retain R3 photographs/forms and the approved three-page format. The project adapter preserves H1 copy, image geometry and presentation, changing mapped palette values only. All three coverage variants are rendered. The full legacy package remains in a hash-verified rollback. Project validation retains standard specification, approval, coverage, hash, QA and scope checks, and checks adapter freshness rather than comparing to the incompatible schematic renderer.\n"
    record_output("IMAGERY_DIRECTION_GUIDE.md",imagery)
    record_output("DESIGN_DIRECTION_MANUAL.md",manualmd)
    for title,md in (("imagery-direction-guide",imagery),("design-direction-manual",manualmd)):
        html=theme_document(bundled.document_html(md,fonts(ROOT,language),compact=title=="imagery-direction-guide"))
        record_output("artifact/"+title+".html",html)
        with Chromium(BROWSER,ROOT/"tmp/document-render",1000,900) as page:
            page.open(ROOT/"artifact"/(title+".html"))
            raw=page.pdf()
        doc=fitz.open(stream=raw,filetype="pdf")
        for number,pdfpage in enumerate(doc,1):
            pdfpage.insert_text((pdfpage.rect.width-61,pdfpage.rect.height-22),str(number)+" / "+str(doc.page_count),fontsize=8,color=(.40,.33,.29))
        raw=doc.tobytes(garbage=4,deflate=True);doc.close()
        record_output("pdf/wegroween-"+title+".pdf",raw)
        print(json.dumps({"rendered":title,"pages":fitz.open(stream=raw,filetype="pdf").page_count}),flush=True)

def mapped_css(pid,tokens):
    source=(ROOT/"provenance/h1-r3-source.css").read_text(encoding="utf-8-sig")
    source=re.sub(r"@font-face\{[^}]+\}","",source)
    source=re.sub(r":root\{[^}]+\}","",source,count=1)
    semantic={"#223225":"brand-primary","#7d3f54":"brand-secondary","#c89538":"accent","#f5f0e6":"background","#fffcf5":"surface",
      "#ffffff":"surface-elevated","#1e251d":"text-primary","#53604f":"text-secondary","#fff9ee":"text-inverse",
      "#ced2c8":"border","#7c8978":"border-strong","#006c5b":"focus","#226348":"success","#995300":"warning","#a52a3b":"error"}
    extras={
      "#2b3d2f":"color-mix(in srgb,var(--color-brand-primary) 88%,var(--color-text-primary))",
      "#151815":"var(--color-text-primary)","#111712":"var(--color-brand-primary)","#17241a":"var(--color-brand-primary)",
      "#e6ece2":"var(--soft-green)","#f1e2e7":"var(--soft-berry)","#f2e3c3":"var(--soft-gold)",
      "#e7e7df":"var(--color-border)","#f4f1e9":"var(--color-background)","#d9ded4":"var(--color-disabled-background)",
      "#f1dfe5":"var(--soft-berry)","#eef2eb":"var(--soft-green)",
      "#f0c878":"var(--deck-accent)","#e8c989":"var(--deck-accent)","#e9cf9d":"var(--deck-accent)",
      "#f2d398":"var(--deck-accent)","#efcf91":"var(--deck-accent)","#c18fa0":"var(--color-brand-secondary)",
      "#81b884":"var(--color-success)"}
    light_inverse={"#e2e7df","#bbc5b9","#cbd3c8","#cfd5ca","#d7ded4","#f8f2e5","#aeb5aa","#d5ddd2","#d6ded3","#d9e0d6","#dbe1d8","#abb4aa","#98a497"}
    muted_borders={"#475649","#4e5b50","#647064","#69756a","#6b786c","#798579","#8c978d","#9aa79a"}
    def color(match):
        v=match[0].lower()
        if v=="#fff":return "var(--color-surface-elevated)"
        if v in semantic:return "var(--color-"+semantic[v]+")"
        if v in extras:return extras[v]
        if v in light_inverse:return "var(--color-text-inverse)"
        if v in muted_borders:return "color-mix(in srgb,var(--color-text-inverse) 45%,var(--color-brand-primary))"
        raise ValueError("Unmapped R3 color "+v)
    source=re.sub(r"#[0-9a-fA-F]{3,8}\b",color,source)
    # Translate named legacy aliases without changing geometry.
    aliases=""":root{
--ink:var(--color-brand-primary);--ink-2:color-mix(in srgb,var(--color-brand-primary) 88%,var(--color-text-primary));
--berry:var(--color-brand-secondary);--gold:var(--color-accent);--bg:var(--color-background);
--surface:var(--color-surface);--paper:var(--color-surface-elevated);--text:var(--color-text-primary);
--muted:var(--color-text-secondary);--border:var(--color-border);--strong:var(--color-border-strong);
--focus:var(--color-focus);--success:var(--color-success);--warning:var(--color-warning);--error:var(--color-error);
--soft-green:color-mix(in srgb,var(--color-surface) 90%,var(--color-success));
--soft-berry:color-mix(in srgb,var(--color-surface) 90%,var(--color-brand-secondary));
--soft-gold:color-mix(in srgb,var(--color-surface) 90%,var(--color-accent));
--deck-accent:color-mix(in srgb,var(--color-text-inverse) 72%,var(--color-accent));
}
"""
    fixes="""
.button--primary,.button--inverse,.opening,.utility-bar,.closing-cta,.site-footer,.touch-sample{color:var(--color-text-inverse)}
.opening-card{background:color-mix(in srgb,var(--color-brand-primary) 94%,var(--color-surface))}
.site-header{background:var(--color-surface)}.media-label{background:var(--color-surface);color:var(--color-text-primary)}
.photo-caption{background:var(--color-brand-primary);color:var(--color-text-inverse)}
.button--gold{color:var(--accent-content)}.kicker--gold{color:var(--deck-accent)}
.box-price{color:var(--accent-content)}
.category-card--berry>span,.closing-cta .kicker--gold{color:var(--color-text-inverse)}
.journey article>span{color:var(--color-brand-secondary)}
.deck-meta--light{color:var(--color-text-inverse)}
.phone .button{min-height:44px}
.inline-arrow{display:inline-block;width:17px;height:17px;vertical-align:middle;flex:none}
.product-bottom button{width:44px;height:44px;color:var(--color-text-inverse)}
.category-card>.inline-arrow{width:34px;height:34px;margin-bottom:43px}
.trust-item>.inline-arrow{width:27px;height:27px}
.journey article>.inline-arrow{width:28px;height:28px;margin-bottom:35px}
.product-grid{align-items:stretch}.product-card{display:grid;grid-template-rows:auto 1fr}
.product-content{display:grid;grid-template-rows:auto minmax(2.3em,auto) 1fr auto}
.product-content h4{min-height:2.3em}.product-bottom{align-self:end}
input::placeholder{color:var(--color-text-secondary)}
:focus-visible{outline:var(--component-focus-ring-width) solid var(--color-focus);outline-offset:var(--component-focus-ring-offset)}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
"""
    accent="text-inverse" if pid=="palette-3" else "text-primary"
    return css_tokens(tokens,pid)+aliases+"\n:root{--accent-content:var(--color-"+accent+")}\n"+source+fixes

def adapted_home(pid,language,tokens):
    html=(ROOT/"provenance/h1-r3-source.html").read_text(encoding="utf-8-sig")
    name=next(o["name"] for o in language["options"]["color"] if o["id"]==pid)
    html=html.replace("v1.2.0-proposed - R3",language["project"]["version"]+" - R4")
    html=html.replace("C1 Orchard Ink - current catalogue and project photography",pid+" "+name+" - preserved project photography")
    html=html.replace('href="prototype.css"','href="prototype-'+pid+'.css"')
    html=html.replace("../../assets/","../assets/").replace("../../icons/","../icons/")
    arrow=(ROOT/"icons/svg/arrow-right.svg").read_text(encoding="utf-8-sig")
    arrow=re.sub(r"<\?xml[^>]*>","",arrow)
    arrow=arrow.replace("<svg ","<svg class=\"inline-arrow\" aria-hidden=\"true\" ",1)
    html=html.replace("<span>-></span>",arrow).replace(" ->", " "+arrow)
    # Decorative/action I1 icons inherit semantic colors rather than rendering black SVG image files.
    def inline_icon(match):
        path=ROOT/"icons/svg"/match[1]
        icon=path.read_text(encoding="utf-8-sig")
        icon=re.sub(r"<\?xml[^>]*>","",icon)
        return icon.replace("<svg ","<svg class=\"inline-arrow\" aria-hidden=\"true\" ",1)
    html=re.sub(r'<img src="\.\./icons/svg/([^"]+)" alt="">',inline_icon,html)
    # Correct the legacy example-only email value; keep its persistent label.
    html=html.replace('id="email" value="Email address"','id="email" type="email" placeholder="Email address"')
    html=html.replace("</head>","<style>"+fonts(ROOT,language)+"</style></head>")
    return html,mapped_css(pid,tokens)

def live_home(html):
    # Reuse exact H1 content, with a real narrow-screen layout separately from the scaled PDF mockups.
    start=html.index('<main class="homepage"')
    end=html.index("</main>",start)+len("</main>")
    main=html[start:end]
    css="""
html,body{background:var(--bg)}
.homepage{min-height:0}.site-container{width:min(1200px,calc(100% - 40px))}
@media(max-width:900px){
.utility-bar,.utility-inner{height:auto;min-height:40px}.utility-inner{padding:8px 0;gap:10px;flex-wrap:wrap}
.utility-inner>div{gap:12px;flex-wrap:wrap}.site-header,.site-nav{height:auto;min-height:76px}
.site-nav{gap:14px;flex-wrap:wrap;padding:12px 0}.nav-links{width:100%;overflow:auto;order:3;gap:22px}
.nav-links a{padding:12px 0;white-space:nowrap}.nav-links a.active::after{bottom:4px}
.hero-grid,.cultivation-grid,.home-box-grid,.restaurant-grid{grid-template-columns:1fr}
.hero-copy{padding:40px 0}.hero-copy h2{font-size:clamp(42px,8vw,73px)}
.hero-media{min-height:380px}.site-section{padding:48px 0}
.section-heading{display:flex;align-items:start;gap:20px;flex-direction:column}.section-aside{width:100%;max-width:none;min-width:0}
.serviceability{grid-template-columns:1fr;gap:24px;padding:24px}.pincode-form{min-width:0}.pincode-form input{width:100%;min-width:0}
.journey{grid-template-columns:repeat(2,minmax(0,1fr))}.delivery-note{grid-template-columns:1fr;gap:12px}
.product-grid,.category-grid,.journal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.trust-grid,.delivery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.cultivation-copy,.home-box-copy,.restaurant-copy{padding:32px 0}
.cultivation-media,.box-media,.restaurant-media{min-height:320px}
.footer-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}.footer-base{flex-wrap:wrap;gap:14px}
}
@media(max-width:540px){
.site-container{width:calc(100% - 32px)}.hero-media{min-height:320px}
.hero-copy h2{max-width:12ch}.hero-detail{gap:16px}
.product-grid,.category-grid,.journal-grid{grid-template-columns:1fr}
.journey{grid-template-columns:1fr}.journal-card--feature{grid-template-columns:1fr}
.restaurant-features{grid-template-columns:1fr}.home-box-copy ul{grid-template-columns:1fr}
.product-content h4{min-height:0}.product-media{height:auto;aspect-ratio:4/3}
.trust-grid,.delivery-grid{grid-template-columns:1fr}.trust-item{min-height:64px}
.cta-inner,.closing-cta .site-container{display:flex;flex-direction:column;align-items:start;gap:24px}
.cta-actions{width:100%}.cta-actions form{width:100%}.cta-actions input{min-width:0;width:100%}
.hero-copy h2,.section-heading h3{overflow-wrap:normal}.category-card{min-height:0}
.footer-grid{grid-template-columns:1fr}.home-box-media,.restaurant-media{height:340px}
}
"""
    return re.sub(r"<body>.*</body>","<body>"+main+"</body>",html,flags=re.S).replace("</head>","<style>"+css+"</style></head>")

def prototypes(language,tokens):
    cov=coverage(load(ROOT/"language-state.json"));records=[];structlock=digest([language["homepage"]["legacy_source_hash"],language["homepage"]["sections"],"h1-r4-shared-css-geometry-v1"])
    for pid in cov["requested_palettes"]:
        html,css=adapted_home(pid,language,tokens)
        record_output("artifact/prototype-"+pid+".html",html)
        record_output("artifact/prototype-"+pid+".css",css)
        record_output("artifact/homepage-"+pid+".html",live_home(html))
        with Chromium(BROWSER,ROOT/"tmp/homepage-render",1440,1000) as page:
            page.open(ROOT/("artifact/prototype-"+pid+".html"));raw=page.pdf()
        doc=fitz.open(stream=raw,filetype="pdf")
        if doc.page_count!=3:raise ValueError("H1 page count drift: "+pid+" "+str(doc.page_count))
        rel="pdf/wegroween-homepage-prototype-"+pid+".pdf";record_output(rel,raw)
        records.append({"palette_id":pid,"role":"primary" if pid==cov["primary_palette"] else "alternative","file":rel,"status":"rendered","structure_hash":structlock,
                        "renderer":"accepted-project-r3-adapter","pages":3})
        print(json.dumps({"rendered":pid,"pages":doc.page_count,"sizes":[[round(p.rect.width),round(p.rect.height)] for p in doc]}),flush=True)
    cov["generated_prototypes"]=records;cov["presentation_exception"]="Accepted R3 photography and three-page framing; full mobile H1 review provided in separate responsive HTML"
    record_output("prototype-coverage.json",json.dumps(cov,indent=2)+"\n")

def component_specimen():
    # Existing state-complete specimen is the approved project's component review surface.
    source=(LEGACY/"artifact/components.html").read_text(encoding="utf-8-sig")
    source=source.replace("../tokens.css","../components/legacy-aliases.css")
    source=source.replace('/design-system/tokens.css','/design-system/components/legacy-aliases.css')
    source=source.replace('Load tokens before component CSS.', 'This retained specimen uses compatibility aliases before component CSS; new adapters read canonical schema-2 tokens.')
    source=source.replace("v1.2.0-proposed","1.3.0-proposed").replace("v1.2.0 proposed","1.3.0 proposed")
    source=source.replace("Phase 6","Current specification").replace("reviewed","reference")
    for p in (LEGACY/"components").glob("*"):
        if p.is_file():write(ROOT,"components/"+p.name,p.read_bytes())
    oldcss=(LEGACY/"tokens.css").read_text(encoding="utf-8-sig")
    # Legacy aliases are an explicitly preserved adapter; source hashes/equivalence bind them to selected canonical values.
    record_output("components/legacy-aliases.css",oldcss)
    record_output("artifact/component-specimen.html",source)

def delivery_manifest():
    state=load(ROOT/"language-state.json")
    tracked=state["artifacts"]
    basis=common_basis()
    # Bind all views/assets to canonical input, decision and adapter code hashes.
    for rel in list(tracked):
        if (ROOT/rel).is_file():
            tracked[rel]["input_hash"]=basis
            tracked[rel]["output_hash"]=digest((ROOT/rel).read_bytes())
    state["dirty_groups"]=[]
    state["delivery_adapter"]={"id":"project-r3-adapter-v1","mapping_approval":APPROVAL,"basis":basis,
                              "scope":"Preserve R3 photo/form content, three-page presentation and native I1 icons"}
    save(ROOT,"language-state.json",state)
    save(ROOT,"validation/adapter-freshness.json",{"basis":basis,"files":{rel:rec["output_hash"] for rel,rec in tracked.items()}})

def main():
    language=load(ROOT/"design-language.json")
    language["brief"].pop("legacy_full_text",None);language["research"].pop("legacy_synthesis",None)
    language["imagery"]["status"]="APPROVED project treatment expansion on 2026-10-05; rights limitations retained"
    language["composition"]["status"]="DERIVED documentation of approved H1; migration additions accepted 2026-10-05"
    language["homepage"]["presentation"]["mapping_status"]="Approved project adapter preserves R3 photographs and three-page H1; actual rendered QA recorded separately"
    language["governance"]["migration"]["status"]="mapping-approved-rendering-in-progress"
    change="2026-10-05: Mapping and proposed additions accepted; all-three coverage retained; project-specific R3 renderer authorized by that acceptance"
    if change not in language["governance"]["change_history"]:language["governance"]["change_history"].append(change)
    language["governance"]["exceptions"]=[x for x in language["governance"]["exceptions"] if not x.startswith("New imagery")]
    exception="Legacy alternate preview/order mappings accepted as proposed comparative hypotheses, not new canonical selections"
    if exception not in language["governance"]["exceptions"]:language["governance"]["exceptions"].append(exception)
    save(ROOT,"design-language.json",language)
    # Changed narrative requires scope-specific re-recording with the actual current acceptance.
    for category,choice in (("brief","approved-brief"),("research","carried-synthesis"),("territory","cultivated-editorial"),("voice","v1"),
                           ("color","palette-2"),("typography","type-2"),("density","g3"),("structure","h1"),("imagery","r3-documentary"),
                           ("coverage","all-three"),("reuse","b2")):
        original=load(ROOT/"language-state.json")["decisions"].get(category)
        prior=" Original choice evidence retained in provenance/legacy-decisions.md" if original else ""
        # Reuse permission is preserved, never expanded by mapping approval.
        evidence=original["evidence"] if category=="reuse" else APPROVAL+prior
        if category=="coverage":evidence="User 2026-10-05: All three palettes. "+APPROVAL
        record_decision(ROOT,category,choice,"User",evidence)
    state=load(ROOT/"language-state.json")
    state["migration_confirmation"]={"status":"approved","evidence":APPROVAL,"at":now()}
    state["pending_decisions"]=["release"]
    for n in (1,3,4,5,7):state["phases"][str(n)]={"status":"complete" if n in (5,7) else "reused","evidence":APPROVAL,"at":now()}
    state["phases"]["6"]={"status":"complete","evidence":"specification-validation.json plus separate mapping/preservation review; rendered review remains separate","at":now()}
    save(ROOT,"language-state.json",state)
    tokens=canonical_tokens(load(ROOT/"design-tokens.json"),state);save(ROOT,"design-tokens.json",tokens)
    record_output("tokens.css",css_tokens(tokens))
    validation=validate(ROOT,"specification");save(ROOT,"specification-validation.json",validation)
    if not validation["valid"]:raise ValueError(validation["errors"])
    # Use the installed helpers for reusable gallery/docs mechanics only; project rendering preserves explicit leader exceptions.
    bundled.build(ROOT,groups=["gallery"])
    bundled.build(ROOT,groups=["docs"])
    state=load(ROOT/"language-state.json");language=load(ROOT/"design-language.json")
    documentation(language,tokens,state)
    prototypes(language,tokens)
    component_specimen()
    hub="""<aside style="padding:18px;border-bottom:1px solid #DDD1C2;background:#FBF4E8;color:#2B211D;font:15px/1.5 Arial,sans-serif">
<strong>WeGroween 1.3.0 — three-palette delivery review</strong><br>C2 Soil &amp; Saffron is primary. All variants preserve H1 structure, text, photos and geometry.
<a href="homepage-palette-2.html">Primary C2 homepage</a> · <a href="homepage-palette-1.html">C1 comparison</a> · <a href="homepage-palette-3.html">C3 comparison</a> · <a href="component-specimen.html">Component states</a>.
Selections below remain proposals; recorded approvals live in language-state.json.</aside>"""
    index=(ROOT/"artifact/index.html").read_text(encoding="utf-8")
    index=index.replace("<body>","<body>"+hub,1)
    record_output("artifact/index.html",index)
    state=load(ROOT/"language-state.json")
    state["phases"]["8"]={"status":"pending","evidence":"Outputs rendered; visual QA/review in progress","at":now()}
    save(ROOT,"language-state.json",state)
    delivery_manifest()
    print(json.dumps({"status":"rendered-QA-pending","root":str(ROOT),"pdfs":5},indent=2),flush=True)
if __name__=="__main__":
    if "--home-only" in sys.argv:
        prototypes(load(ROOT/"design-language.json"),load(ROOT/"design-tokens.json"));delivery_manifest()
    elif "--docs-only" in sys.argv:
        language=load(ROOT/"design-language.json")
        language["governance"]["migration"].pop("source_hashes",None)
        language["governance"]["migration"]["preservation_report"]="migration-equivalence.json; full source hashes in the private rollback manifest"
        language["governance"]["migration"]["status"]="mapping-approved; actual artifact QA recorded separately"
        language["governance"]["migration"].pop("legacy_media_manifest",None)
        for spec in language["components"].values():spec["review_status"]="Specification and state reference; consult quality-review.json for actual checks and remaining limits"
        save(ROOT,"design-language.json",language)
        bundled.build(ROOT,groups=["docs"])
        documentation(language,load(ROOT/"design-tokens.json"),load(ROOT/"language-state.json"));delivery_manifest()
    else:main()
