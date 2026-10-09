"""Project-specific, non-rendering migration preparation; legacy delivery stays active."""
from pathlib import Path
from html.parser import HTMLParser
import sys, json, re, copy, shutil, hashlib

SKILL = Path(r"C:\Users\tarun\.agents\skills\design-language-system")
sys.path.insert(0, str(SKILL / "scripts"))
from language_core import load, save, write, digest, resolve, unwrap, now, snapshot_scope, canonical_tokens, css_tokens, coverage, contrast, COLOR_ROLES, STATES
from language_workflow import record_decision
from validate_language import validate

PROJECT = Path(r"E:\WeGroween\GitHub Clone\WeGroween")
LEGACY = PROJECT / "design-system"
ROOT = LEGACY / "migration-v2"
BACKUP = LEGACY / "history" / "2026-10-05-system-migration" / "legacy-delivery"
VERSION = "1.3.0-proposed"
STAMP = now()
def typed(kind, value): return {"$type": kind, "$value": value}
def read(path): return path.read_text(encoding="utf-8-sig")

# Full rollback before reading inputs into the new authority model.
if not BACKUP.exists():
    BACKUP.mkdir(parents=True)
    for source in LEGACY.iterdir():
        if source.name in ("history", "migration-v2"): continue
        target = BACKUP / source.name
        if source.is_dir(): shutil.copytree(source, target)
        else: shutil.copy2(source, target)
    hashes = {p.relative_to(BACKUP).as_posix(): digest(p.read_bytes()) for p in BACKUP.rglob("*") if p.is_file()}
    save(BACKUP.parent, "legacy-manifest.json", {"created_at": STAMP, "source": str(LEGACY), "files": hashes})
else:
    hashes = load(BACKUP.parent / "legacy-manifest.json")["files"]
    for rel, expected in hashes.items():
        if digest((BACKUP / rel).read_bytes()) != expected: raise ValueError("Rollback changed: " + rel)

old = load(BACKUP / "design-tokens.json")
identity = read(PROJECT / "design-memory/projects/wegroween/decisions/identity-options.md")
blueprint = read(BACKUP / "BRAND_IDENTITY_BLUEPRINT.md")
system = read(BACKUP / "DESIGN_SYSTEM.md")
old_decisions = read(BACKUP / "decisions.md")
brief = read(PROJECT / "design-memory/projects/wegroween/brief/approved-brief.md")
old_research = read(BACKUP / "research-summary.md")
home_source = read(BACKUP / "pdf/source/homepage-prototype.html")

tokens = copy.deepcopy(old)
tokens["schema_version"] = "2.0"
tokens["meta"].update(project="wegroween", legacy_project_name="WeGroween", version=VERSION, status="proposed", updated_at=STAMP,
                      primary_palette="palette-2", canonical_palette="palette-2", typography_option="type-2",
                      migration_status="candidate-awaiting-mapping-acceptance")
palettes = {}
for index in (1, 2, 3):
    block = identity.split("## Color strategy C" + str(index) + " ")[1].split("\n## ")[0]
    values = dict(re.findall(r"^\| ([a-z-]+) \| \x60(#[0-9a-fA-F]{6})\x60", block, re.M))
    if set(values) != set(COLOR_ROLES): raise ValueError("Incomplete historical palette " + str(index))
    if index == 2:
        values = {role: resolve(old, leaf) for role, leaf in old["color"]["semantic"]["light"].items()}
    palettes["palette-" + str(index)] = {"light": {k: typed("color", v) for k, v in values.items()}}
tokens["color"]["palettes"] = palettes

# Expand selected composite styles without normalizing approved numbers/families.
keymap = {"fontFamily": ("font_family", "fontFamily"), "fontSize": ("size", "dimension"), "fontWeight": ("weight", "fontWeight"),
          "letterSpacing": ("letter_spacing", "dimension"), "lineHeight": ("line_height", "number")}
type2 = {"family": copy.deepcopy(old["typography"]["family"]), "style": {}}
for role, composite in old["typography"]["style"].items():
    type2["style"][role] = {keymap[k][0]: typed(keymap[k][1], v) for k, v in unwrap(composite).items()}
type1 = {"family": {"display": typed("fontFamily", ["Newsreader", "Georgia", "Times New Roman", "serif"]),
                    "body": typed("fontFamily", ["Manrope", "Segoe UI", "Arial", "sans-serif"]),
                    "mono": copy.deepcopy(old["typography"]["family"]["mono"])}, "style": {}}
block = identity.split("## Typography T1")[1].split("## Typography T2")[0]
for line in block.splitlines():
    if not line.startswith("|") or "Role" in line or "---" in line: continue
    cols = [c.strip() for c in line.strip("|").split("|")]
    if len(cols) != 6: continue
    role, family, size, height, weight, tracking = cols
    if role == "code/data": role = "code"
    family_values = unwrap(type1["family"]["display" if family == "Newsreader" else "body" if family == "Manrope" else "mono"])
    type1["style"][role] = {"font_family": typed("fontFamily", family_values), "size": typed("dimension", size),
        "line_height": typed("number", float(height)), "weight": typed("fontWeight", int(weight)),
        "letter_spacing": typed("dimension", tracking)}
tokens["typography"]["options"] = {"type-1": type1, "type-2": type2}
tokens["typography"]["style"] = copy.deepcopy(type2["style"])
tokens["layout"]["grid"]["page-margin"] = copy.deepcopy(old["layout"]["grid"]["page-margin-compact"])
for key, value in old["motion"]["duration"].items(): tokens["motion"][key] = copy.deepcopy(value)
for key, value in old["motion"]["easing"].items():
    tokens["motion"]["easing-" + key] = typed("string", "cubic-bezier(" + ", ".join(str(n) for n in unwrap(value)) + ")")

def pair(fg, bg): return {"foreground": typed("color", "{color.semantic.light." + fg + "}"),
                         "background": typed("color", "{color.semantic.light." + bg + "}")}
def disabled():
    # Inactive controls are contrast-exempt. Keep the approved values, name the actual roles,
    # and measure separately rather than claiming a normal-text pass.
    return {"content": typed("color", "{color.semantic.light.disabled-content}"),
            "fill": typed("color", "{color.semantic.light.disabled-background}"),
            "$description": "Inactive disabled control only; never actionable text"}
for component, required in STATES.items():
    states = {}
    for state in required:
        fg, bg = ("text-primary", "surface")
        if component == "navigation": bg = "background"
        if component == "button": fg, bg = "text-inverse", "brand-primary"
        if component == "input": bg = "surface-elevated"
        if component == "badge": fg = "text-secondary" if state == "default" else state
        states[state] = disabled() if state == "disabled" else pair(fg, bg)
        if state in ("focus", "selected", "error", "success"):
            border_role = {"focus": "focus", "selected": "brand-secondary", "error": "error", "success": "success"}[state]
            states[state]["border"] = typed("color", "{color.semantic.light." + border_role + "}")
    tokens["component"][component]["states"] = states
tokens["component"]["navigation"]["states"].update(scrolled=pair("text-primary","surface"), overflow=pair("text-primary","background"))
tokens["component"]["button"]["states"].update(secondary=pair("brand-primary","background"), tertiary=pair("brand-primary","background"),
                                                destructive=pair("surface-elevated","error"))
tokens["component"]["button"]["states"]["hover"]["mix-rule"] = typed("string","88% brand-primary with 12% text-primary, as legacy CSS")
tokens["component"]["input"]["states"].update(validating=pair("text-primary","surface-elevated"), hover=pair("text-primary","surface-elevated"))
tokens["component"]["input"]["states"]["read-only"] = pair("text-primary","background")
tokens["component"]["card"]["states"].update(hover=pair("text-primary","surface"), unavailable=disabled(), loading=pair("text-primary","surface"), error=pair("text-primary","surface"))
tokens["component"]["badge"]["states"]["information"] = pair("information","surface")

# Parse the original hierarchy without executing its HTML; retain complete text and raw bytes.
class Node:
    def __init__(self, tag, attrs, start=0): self.tag, self.attrs, self.start, self.end, self.children = tag, dict(attrs), start, start, []
    def text(self): return re.sub(r"\s+", " ", " ".join(c if isinstance(c,str) else c.text() for c in self.children)).strip()
    def nodes(self, tag=None): return [n for c in self.children if isinstance(c,Node) for n in ([c] if tag is None or c.tag == tag else []) + c.nodes(tag)]
class Tree(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True); self.source=source; self.root=Node("root",{}); self.stack=[self.root]
        self.lines=[0]
        for m in re.finditer("\n",source): self.lines.append(m.end())
    def pos(self):
        line,col=self.getpos(); return self.lines[line-1]+col
    def handle_starttag(self, tag, attrs):
        node=Node(tag,attrs,self.pos()); self.stack[-1].children.append(node)
        if tag not in {"img","input","br","meta","link","hr","source"}: self.stack.append(node)
        else: node.end=self.pos()+len(self.get_starttag_text())
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack[i].end=self.pos()+len("</"+tag+">"); self.stack=self.stack[:i]; break
    def handle_data(self, data): self.stack[-1].children.append(data)
tree=Tree(home_source); tree.feed(home_source)
home=next(n for n in tree.root.nodes("main") if n.attrs.get("class")=="homepage")
children=[c for c in home.children if isinstance(c,Node)]
legacy_sections=[n for n in children if n.tag=="section"]
names=["hero","trust","harvest","categories","cultivation","delivery","home-box","restaurant","journal","closing"]
if len(legacy_sections)!=len(names): raise ValueError("Unexpected H1 section order")
section_ids=names
purposes={
"hero":("Understand offer and find household shopping","Lead with grown food and useful purchase path","Primary promise and household CTA"),
"trust":("Assess what the existing catalogue can support","Keep factual catalogue/support context near discovery","Supporting reassurance"),
"harvest":("Compare varieties, packs, price and availability","Make produce comparison the main next task","Primary shopping collection"),
"categories":("Find the relevant food family","Expose named category routes without vague labels","Equal-priority category peers"),
"cultivation":("Understand growing and handling credibility","Place provenance close to product interest","Supporting evidence"),
"delivery":("Understand whether and when an order can arrive","Explain service constraints before payment","Decision-relevant clarity"),
"home-box":("Explore compatible household pairings","Offer practical combinations and repeat-use context","Secondary household path"),
"restaurant":("Find kitchen supply without displacing households","Provide a separate professional enquiry path","Secondary B2B path"),
"journal":("Use and store unfamiliar ingredients","Reduce uncertainty and avoid food waste","Supporting education"),
"closing":("Return to shopping or choose a harvest note","Offer next steps after the narrative","Primary shopping plus optional follow-up")}
sections=[]; patterns=[]
for ident,node in zip(names,legacy_sections):
    headings=[n for n in node.nodes() if n.tag in ("h1","h2","h3")]
    paras=node.nodes("p")
    title=headings[0].text() if headings else ("Shopping assurances" if ident=="trust" else ident)
    if ident=="hero": title="Grown with care. Chosen for flavour." # Preserve textual content across inline breaks.
    source_fragment=home_source[node.start:node.end]
    headings_all=[{"level":n.tag,"text":n.text()} for n in node.nodes() if n.tag in ("h1","h2","h3","h4")]
    media=[{"path":n.attrs.get("src"),"alt":n.attrs.get("alt","")} for n in node.nodes("img") if "media-image" in n.attrs.get("class","")]
    typ="hero" if ident=="hero" else "cards" if ident in ("harvest","categories","journal") else "proof" if ident in ("trust","delivery") else "cta" if ident=="closing" else "split"
    section={"id":ident,"pattern_id":"h1-"+ident,"type":typ,"title":title,"copy":paras[0].text() if paras else "",
             "legacy_content":{"text":node.text(),"headings":headings_all,"source_hash":digest(source_fragment.encode()),"source_fragment":source_fragment},
             "media_manifest":media}
    if typ in ("hero","split"): section["media"]={"role":ident+" approved R3 image region","ratio":"5/4"}
    if typ=="cards":
        items=[]
        cards=[n for n in node.nodes() if "product-card" in n.attrs.get("class","") or "category-card" in n.attrs.get("class","") or "journal-card" in n.attrs.get("class","")]
        for card in cards:
            titles=card.nodes("h4"); ps=card.nodes("p")
            items.append({"title":titles[0].text() if titles else card.text(),"copy":ps[0].text() if ps else "",
                          "media":{"role":"product or editorial image","ratio":"4/3"},
                          "legacy_content":card.text(),"cta":{"label":"Review "+(titles[0].text() if titles else "item")}})
        section["items"]=items;section["columns"]=4 if ident=="categories" else 3
    sections.append(section)
    need,purpose,priority=purposes[ident]
    patterns.append({"id":"h1-"+ident,"user_need":need,"purpose":purpose,"placement":"H1 sequence position "+str(len(sections)),
       "prominence":priority,"removal_cost":"Loss of this approved narrative step and its useful meaning",
       "responsive":"Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions",
       "evidence_ids":["ev-approved-h1"],"knowledge_class":"DERIVED","source":"Legacy H1 section; rationale documents existing intent, not a new user study"})
raw_sections_manifest={s["id"]:s["legacy_content"]["source_hash"] for s in sections}
media_manifest=[m for s in sections for m in s["media_manifest"]]

language=load(SKILL/"assets/design-language.template.json")
language["project"].update(id="wegroween",name="WeGroween",version=VERSION,archetype="food-commerce-design-reference",
    audience="Quality-conscious Indian households and home cooks first; restaurant/chef/hospitality supply secondary",
    objective="Make premium fresh-produce discovery, trust, household shopping and the secondary supply path understandable",
    leader="User",tags=["food","india","premium-households","restaurant-supply","cultivated-editorial","design-language"])
language["brief"]={"offer":"Microgreens, mushrooms, organic vegetables and fruits, and specialty farming products",
 "constraints":["Design system and review prototypes only","English-first, single brand, no dark mode v1","Existing approved C2/T2/G3/V1/M1/I1/H1 preserved","Wordmark/logo deferred"],
 "assumptions":["India initial market from approved brief","Catalogue expansion, prices, pack sizes and delivery terms remain illustrative/unconfirmed"],
 "exclusions":["Application/backend/database/auth/checkout/CMS implementation","Dependencies and deployment","New logo production","Unsubstantiated health/organic/certification claims","Public-use image rights clearance"],
 "success_criteria":["Household-first task clarity","Discoverable restaurant pathway","Exact preservation of approved values","Synchronized sources and truthful review status"],
 "approval_source":"approved-brief.md dated 2026-10-02","legacy_full_text":brief}
language["brand"]={"theme":"Every harvest is an edition worth collecting: specific, seasonal, sensory and quietly confident.",
 "vibe":"Warm editorial precision. Premium without ornament, authentic without rustic nostalgia, knowledgeable without clinical language.",
 "emotion":"A discerning grower with the eye of a food editor and the operational clarity of a dependable supplier.",
 "keywords":["cultivated","seasonal","mineral","tactile","sensory","precise","traceable","restrained","appetizing"],
 "principles":["Specificity is luxury","Evidence stays close to the claim","Produce leads","Seasonality creates movement","Households come first","Constraints become service design"],
 "anti_principles":["No generic leaf-logo/beige-wellness/all-green shorthand","No unsupported health claims","No glassmorphism or arbitrary radii","No stock imagery as cultivation evidence","No hidden service constraints"],
 "tone":"V1 Cultivated Authority: precise, sensory, warm, transparent and calm. Concrete nouns/verbs; short headings and plain full sentences.",
 "copy_examples":["Grown with quiet precision.","Shop this harvest.","Supply your kitchen.","Harvesting Friday. Delivery begins Saturday.","This bed is resting. Join the next harvest list.","We could not confirm that payment. Your basket is safe; try again or choose another method."],
 "iconography":"I1 Field Notes: 24px grid, 1.75px optical stroke, square terminals, rounded joins, open counters and crop-specific asymmetry. Icons inherit currentColor; icon-only targets require names and 44px targets.",
 "motion_purpose":"M1 continuity and immediate state feedback: 140/220/360ms. Reduced motion removes translation and decorative reveals; no critical information depends on animation."}
sources=[]
for line in read(PROJECT/"design-memory/projects/wegroween/research/sources.jsonl").splitlines():
    if not line.strip():continue
    s=json.loads(line);sources.append({"id":s["evidence_id"],"title":s["source_title"],"source_url":s["source_url"] if str(s["source_url"]).startswith("http") else None,
      "source_path":s["source_url"] if not str(s["source_url"]).startswith("http") else None,"date":s["accessed_at"],
      "observation":s["observed_pattern"],"interpretation":s["researcher_interpretation"],"confidence":s["confidence"],
      "limitations":s["limitations"]+["Historical source; not live reverified during schema migration"],"rights":"Reference only; no identity, copy or asset reuse inferred"})
sources += [{"id":"ev-approved-h1","title":"Leader-approved H1 continuous R3 homepage","date":"2026-10-03",
    "observation":"H1 household-first narrative and three-page continuous presentation with selected project photographs.",
    "interpretation":"Preserve source order, copy, media geometry and original authorization.","confidence":"high","rights":"Prototype use authorized; production/public rights unconfirmed"},
    {"id":"ev-legacy-decisions","title":"WeGroween leader decision log","date":"2026-10-05","observation":"Recorded historic identity approvals and scope corrections.","confidence":"high","rights":"Project-private"}]
language["research"]={"summary":"Reuse 2026-10-02 research: premium should come from variety, provenance, harvest, handling, delivery and remedy specificity; households remain primary and restaurant supply secondary.",
 "sources":sources,"gaps":["Service area and delivery rules","Final catalogue, pack sizes, prices and claims","Production asset rights","New imagery-guide rules and migrated presentation mapping need acceptance"],
 "budget":{"questions":["Legacy schema equivalence","Existing H1 copy/media preservation","New mandatory field provenance"],"max_sources":6,"max_minutes":30,"used_web_sources_this_migration":0},
 "stop_condition":"Resolve preservation/mapping questions locally; new material design choices remain proposed until accepted",
 "legacy_synthesis":old_research}
def option(ident,name,thesis,benefits,risks,**extra):
    return dict(id=ident,name=name,thesis=thesis,benefits=benefits,risks=risks,evidence_ids=["ev-legacy-decisions"],**extra)
language["options"]["territory"]=[
 option("cultivated-editorial","Cultivated Editorial","Treat every harvest as a precise, seasonal, sensory edition.","Household premium with restaurant credibility","Photography/copy discipline; excessive serif or space can slow shopping",recommended=True,legacy_status="selected",preview={"palette_id":"palette-2","typography_id":"type-2","structure_id":"h1"}),
 option("living-laboratory","Living Laboratory","Visible cultivation intelligence, state clarity and quality control.","Specialty and restaurant authority","Can become clinical or synthetic",legacy_status="rejected",preview={"palette_id":"palette-1","typography_id":"type-1","structure_id":"h3"},preview_status="new comparison configuration proposed; original geometric-sans territory assets not fabricated"),
 option("harvest-house","Harvest House","Generous modern pantry built around human cultivation and shared meals.","Household warmth and broad-category adaptability","Rustic/mass-market drift; rounded illustration can reduce precision",legacy_status="rejected",preview={"palette_id":"palette-3","typography_id":"type-2","structure_id":"h2"},preview_status="new comparison configuration proposed; original arched/illustrated layout not fabricated")]
common_pairs=[("text-primary",bg,"normal-text") for bg in ("background","surface","surface-elevated")]+[("text-secondary",bg,"normal-text") for bg in ("background","surface","surface-elevated")]
common_pairs += [("text-inverse","brand-primary","normal-text"),("text-inverse","brand-secondary","normal-text"),("surface-elevated","error","normal-text")]
common_pairs += [(fg,bg,"normal-text") for fg in ("brand-primary","success","warning","error","information") for bg in ("background","surface","surface-elevated")]
common_pairs += [(fg,bg,"non-text") for fg in ("focus","border-strong","brand-secondary") for bg in ("background","surface","surface-elevated")]
color_specs=[
 ("Orchard Ink","Botanical ink, blackberry and harvest gold: depth, restraint and produce-led seasonality.","Cultivated, calm and sensory","Can suggest wine/cosmetics without fresh food context"),
 ("Soil & Saffron","Warm soil, terracotta and saffron: grounded, Indian and appetizing.","Warm, honest premium","Equal terracotta/saffron emphasis can become rustic/festive"),
 ("Plum & Leaf","Boutique plum, cultivated olive and ripe red: rare and giftable.","Curated gifting/editorial impact","Can resemble beauty, wine or hospitality")]
for i,(name,thesis,benefit,risk) in enumerate(color_specs,1):
    accentpair=("text-inverse","accent","normal-text") if i==3 else ("text-primary","accent","normal-text")
    pairs=[{"foreground":f,"background":b,"kind":k} for f,b,k in common_pairs+[accentpair]]
    language["options"]["color"].append(option("palette-"+str(i),name,thesis,benefit,risk,pairs=pairs,recommended=i==2,
        usage="Stable brand-primary; controlled secondary; palette-specific accessible accent foreground",
        misuse="Do not mix palettes or use untested inverse/white text on gold",legacy_status="selected" if i==2 else "alternative"))
language["options"]["typography"]=[
 option("type-1","Newsreader + Manrope","Literary screen serif plus neutral open UI sans.","Calm editorial hierarchy","Overuse can feel literary",license="SIL OFL 1.1; bundled notices",
 loading="Self-host variable WOFF2; preload roman; font-display swap; preserve OFL",fallbacks="Newsreader -> Georgia/Times New Roman/serif; Manrope -> Segoe UI/Arial/sans-serif",legacy_status="alternative"),
 option("type-2","Fraunces + DM Sans","Tactile contemporary headings plus compact friendly UI.","Approved organic editorial character","Excessive axes/heavy weight can become trendy",license="SIL OFL 1.1; bundled notices",
 loading="Self-host variable WOFF2; preload roman; font-display swap; fixed decorative axes",fallbacks="Fraunces -> Georgia/serif; DM Sans -> Segoe UI/Arial/sans-serif",legacy_status="selected")]
language["options"]["structure"]=[
 option("h1","H1 Harvest to Home","Household-first promise, current harvest, cultivation and delivery, with restaurant supply secondary.","Approved integrated household narrative","Needs credible cultivation and operational content",section_ids=names,legacy_status="selected"),
 option("h2","H2 Home and Kitchen","Earlier explicit household and professional pathway split.","Faster B2B discovery","Can dilute household hierarchy",section_ids=["hero","categories","harvest","home-box","restaurant","cultivation","delivery","journal","trust","closing"],legacy_status="unselected",mapping_status="proposed order; legacy name exists but complete original section mapping unavailable"),
 option("h3","H3 Cultivation Journal","Cultivation evidence and useful education lead discovery.","Process authority","Longer path to household product comparison",section_ids=["hero","cultivation","trust","journal","harvest","categories","delivery","home-box","restaurant","closing"],legacy_status="unselected",mapping_status="proposed order; original complete mapping unavailable")]
language["options"]["imagery"]=[
 option("r3-documentary","R3 documentary project imagery","Preserve selected project photographs and natural food color.","Approved R3 credibility and continuity","Public/production rights remain unverified",legacy_status="prototype use approved; expanded treatment guide proposed"),
 option("bounded-schematic","Bounded schematic media","Empty subject/ratio-labelled areas expose geometry without claiming finished photographs.","Matches skill default and separates design from asset production","Less sensory credibility than R3",legacy_status="earlier R2 treatment; replacing R3 requires approval")]
language["composition"]={"patterns":patterns,"attention":"Household offer and shopping first, evidence near action, restaurant supply secondary; preserve honest alternate routes",
 "negative_space":"Macro: separate H1 narrative chapters with approved section rhythm. Meso: distinguish copy/media and peer groups. Micro: token gaps within labels, icons, controls and card anatomy. Space clarifies relationships, not a generic premium claim.",
 "density":"G3 Curated Market: 1200px content, 12 columns, 20px canonical gutter; preserve efficient catalogue and restrained editorial headings",
 "responsive_priorities":"Preserve essential price, pack, status, navigation and next action; reflow into readable stacked regions; do not clip meaningful text; 35% text expansion and 200% reflow checks pending",
 "conflict_resolution":"Safety/accessibility/truthfulness, task comprehension, approved brand/business intent, then decoration; material compromises need leader choice",
 "exceptions":["Preserve approved R3 imagery authorization despite empty-media default","H1 three-page continuous presentation retained","No logo production"],
 "status":"DERIVED documentation of approved H1; new presentation mapping awaits confirmation"}
language["imagery"]={"thesis":"Cultivation and ingredient detail support quiet premium confidence; product color remains truthful",
 "warmth":"Natural neutral to gently warm; preserve believable daylight and food whites",
 "tint":"Avoid green casts and artificial palette tints",
 "saturation":"Restrained to moderate; no exaggerated green or fake freshness",
 "exposure":"Keep highlight texture and shadow detail; avoid luminous fake dew or crushed substrate",
 "contrast":"Readable food texture without harsh global contrast; overlays need their own contrast check",
 "lighting":"Soft directional daylight-like light; no clinical glare or stage-lit spectacle",
 "texture":"Preserve actual skin, leaf, mushroom, substrate and packing texture; restrained retouching",
 "depth":"Subject-led separation; keep cultivation context legible where it acts as evidence",
 "composition":"Macro food detail, scale, hands, growing beds, harvest and finished-food context; quiet backgrounds around conversion copy",
 "crop":"Product 4:3; square packshot allowed; hero/editorial 4:5 or 5:4. Preserve current R3 media geometry",
 "negative_space":"Reserve focal-safe regions for overlays; do not move copy over busy texture",
 "background":"Natural low-distraction mineral/paper/kitchen/growing contexts; separate packshot consistency from documentary evidence",
 "palette_compatibility":"C2 frames cool greens naturally; C1 blackberry remains restrained; C3 must not make food look like beauty/wine. Never grade merchandise to fit a palette.",
 "archetype_rules":["Catalogue: consistent angle/scale/padding for comparable food, no price or unit hidden","Food: appetite through credible texture and clean handling","B2B: show process evidence and labelled quantities; no invented chef testimonials"],
 "people":"Hands and cultivators may explain process; obtain consent/model/property rights; avoid staged stereotypes or implied endorsements",
 "generated_imagery":"No new generated images are requested. Generated scenes may not be cultivation/provenance evidence; any future production needs separate authorization and human artifact review.",
 "accessibility":"Meaningful alt text identifies variety/context; decorative media uses empty alt; overlays require readable contrast; responsive crops preserve focal subject",
 "performance":"Use existing WebP where appropriate; define responsive crops and dimensions; optimize without food-color or texture loss; measure later",
 "rights":"R3 project-image prototype use authorized on 2026-10-03; ownership/public/production rights unverified. Exclude visible-watermark candidates. Fonts have bundled OFL.",
 "examples":["Do: natural mushroom texture against quiet soil/mineral context","Do: label cultivation evidence only when verified","Do not: tint greens to match the palette","Do not: use stock/generated farms as WeGroween evidence"],
 "status":"PROPOSED expansion; original photography ratios/authenticity/rights retained; additional treatment bands require mapping acceptance",
 "provenance":"BRAND_IDENTITY_BLUEPRINT.md section 9 and assets/README.md; new qualitative bands are authored proposals, not measured edit settings"}
language["components"]={}
component_data={
 "navigation":("Orient customers and expose primary shopping with discoverable supply","skip link, brand, primary links, restaurant route, search/account/basket","storefront, scrolled, admin reference",
 "Collapse to labelled menu; preserve basket and sensible focus order","Short concrete category nouns; no ambiguous sole Explore label","nav landmark, aria-current, skip link, Escape/focus return; trap focus only in modal surface"),
 "button":("Initiate clear immediate actions","label, optional I1 icon, loading indicator","primary, secondary, tertiary, destructive, icon; 44/48/56px",
 "Keep target and label readable when wrapped","Loading preserves width and explains action; disabled never looks actionable","Native buttons/links; named icon controls; native Enter/Space; expose busy state"),
 "input":("Collect data with persistent guidance","label, required/optional cue, control, helper/error/status","text, email, phone, search, quantity, select, textarea, checkbox/radio/switch",
 "Full available width with labels/helper visible","Placeholder is example only; errors explain recovery","Persistent labels, described-by links, error summary, sensible validation timing"),
 "card":("Compare food with variety, pack, price, timing and next action","shared media/title/copy/metadata/divider/price/action rows","product, category, editorial, selected/featured with semantic reason",
 "Shared row geometry; stack predictably; no meaningful clipping at zoom","Shortest/longest/missing optional content and 35% expansion; preserve price/unit/action","No nested conflicting links; selection and unavailability have text; focus visible"),
 "badge":("Communicate compact named category or availability state","text, optional I1 glyph, optional named remove button","neutral, brand, success, warning, error, information",
 "Remain readable at 200% zoom; wrap where needed","Ready now, Harvest Friday, Limited, Resting; no color-only state","Text carries meaning; removable chip action is separately named")}
for name,(purpose,anatomy,variants,responsive,content,accessibility) in component_data.items():
    states=list(tokens["component"][name]["states"])
    language["components"][name]={"purpose":purpose,"anatomy":anatomy,"variants":variants,"states":states,
       "responsive":responsive,"content":content,"accessibility":accessibility,"token_mapping":"component."+name,
       "legacy_source":"DESIGN_SYSTEM.md component contracts","review_status":"Specification only; rendered state/stress checks pending"}
language["homepage"]={"navigation":[{"label":n.text(),"href":n.attrs.get("href","#")} for header in children if header.tag=="header" for n in header.nodes("a") if n.attrs.get("href","").startswith("#") and n.text()!=""],
 "sections":sections,"footer":next(c.text() for c in children if c.tag=="footer"),"template_file":None,
 "presentation":{"model":"three-page continuous H1 R3","mapping_status":"pending; generic helper loses approved presentation and photos","legacy_source":"provenance/h1-r3-source.html"},
 "legacy_chrome":[{"tag":c.tag,"text":c.text(),"source_fragment":home_source[c.start:c.end]} for c in children if c.tag!="section"],
 "legacy_source_hash":digest(home_source.encode()),"canonical_source_bytes":"provenance/h1-r3-source.html"}
font_names={"Fraunces":"fraunces-latin-variable.woff2","DM Sans":"dm-sans-latin-variable.woff2",
            "Newsreader":"newsreader-latin-variable.woff2","Manrope":"manrope-latin-variable.woff2"}
for family,filename in font_names.items():
    for weight in (400,450,500,550,600,650,700,750,800):
        language["font_assets"].append({"family":family,"weight":str(weight),"path":"assets/"+filename,"license":"SIL OFL 1.1; see assets/OFL-"+family.replace(" ","-")+".txt"})
language["governance"]={"change_history":["2026-10-05: Versioned schema-2 candidate; legacy package retained active; original approvals carried with scope evidence"],
 "feedback":[],"exceptions":["R3 imagery prototype-use authorization overrides the skill empty-media default for the approved R3 presentation","Logo deferred","New imagery treatment expansion and alternate structure/territory preview mappings remain proposed","No release approval inferred"],
 "source_authority":"Tokens: values; design-language.json: narrative/composition; language-state.json: progress/approvals",
 "confidentiality":"Project-private; B2 permits only reviewed-redacted structural reuse",
 "migration":{"source_version":"1.2.0-proposed","status":"awaiting-mapping-acceptance","source_hashes":hashes,"legacy_section_order":names,"legacy_media_manifest":media_manifest}}

ROOT.mkdir(parents=True,exist_ok=True)
for p in (BACKUP/"assets").iterdir():
    if p.is_file(): write(ROOT,"assets/"+p.name,p.read_bytes())
for p in (BACKUP/"icons").rglob("*"):
    if p.is_file(): write(ROOT,"icons/"+p.relative_to(BACKUP/"icons").as_posix(),p.read_bytes())
write(ROOT,"provenance/h1-r3-source.html",(BACKUP/"pdf/source/homepage-prototype.html").read_bytes())
write(ROOT,"provenance/h1-r3-source.css",(BACKUP/"pdf/source/prototype.css").read_bytes())
write(ROOT,"provenance/legacy-decisions.md",(BACKUP/"decisions.md").read_bytes())
save(ROOT,"design-language.json",language);save(ROOT,"design-tokens.json",tokens)
state={"schema_version":"2.0","project_id":"wegroween","version":VERSION,"mode":"MIGRATE","phase":5,
 "phases":{"0":{"status":"complete","evidence":"Full rollback with source hashes; exact nested project and scope checked"},
           "1":{"status":"reused","evidence":"Approved brief dated 2026-10-02; proposed schema additions await mapping acceptance"},
           "2":{"status":"complete","evidence":"Historical project evidence retrieved; mapping questions resolved locally"},
           "3":{"status":"pending","evidence":"Historical synthesis carried with dates; no fresh research approval invented"},
           "4":{"status":"reused","evidence":"Cultivated Editorial choice preserved; alternative preview mappings marked proposed"},
           "5":{"status":"pending","evidence":"Candidate prepared; mapping and expanded imagery treatment acceptance pending"},
           "6":{"status":"pending","evidence":"Automated specification checks pending, independent review not rendered QA"},
           "7":{"status":"complete","evidence":"User answered All three palettes on 2026-10-05"},
           "8":{"status":"pending","evidence":"No new rendering before migration mapping confirmation"},
           "9":{"status":"pending","evidence":"Final release and verified archival not performed"}},
 "decisions":{},"dirty_groups":["gallery","docs","prototypes"],"artifacts":{},
 "scope":{"project_root":str(PROJECT),"approved_roots":[],"baseline":snapshot_scope(PROJECT)},
 "pending_decisions":["migration-mapping","research-carried-synthesis","imagery-expanded-guide","release"],
 "created_at":STAMP,"updated_at":STAMP,"legacy_approval_sources":{"decision_log":"provenance/legacy-decisions.md"}}
save(ROOT,"language-state.json",state)
# Only original affirmative choices are imported. New/more detailed imagery is not silently approved.
records=[
 ("brief","approved-brief","Legacy approved-brief.md dated 2026-10-02: Status approved; existing design-system-only brief reused"),
 ("territory","cultivated-editorial","Legacy decisions.md 2026-10-02 Creative territory: selected Cultivated Editorial after comparable previews"),
 ("voice","v1","Legacy decisions.md 2026-10-02 Tone of voice: user explicitly instructed recommended V1 Cultivated Authority"),
 ("color","palette-2","Legacy decisions.md 2026-10-02 Canonical palette: user response c2 t2 g3 selected C2 Soil & Saffron"),
 ("typography","type-2","Legacy decisions.md 2026-10-02 Canonical typography: user response c2 t2 g3 selected T2 Fraunces + DM Sans"),
 ("density","g3","Legacy decisions.md 2026-10-02 Canonical grid/density: user response c2 t2 g3 selected G3 Curated Market"),
 ("structure","h1","Legacy decisions.md H1 + PDFs on 2026-10-02; three-page continuous presentation on 2026-10-03. Source copy/order retained; renderer mapping not approved"),
 ("coverage","all-three","User in current conversation on 2026-10-05: All three palettes"),
 ("reuse","b2","Legacy decisions.md 2026-10-03: B2 reviewed-redacted structural reuse; no client identity/copy/images/contacts/catalogue promotion")]
for category,choice,evidence in records:
    record_decision(ROOT,category,choice,"User",evidence)
state=load(ROOT/"language-state.json")
for category in ("brief","territory","voice","color","typography","density","structure"):
    state["decisions"][category]["original_approval_date"]="2026-10-02"
    state["decisions"][category]["scope_note"]="Carry-forward selection only; does not approve new proposed migration additions or presentation mapping"
state["decisions"]["structure"]["additional_approval_date"]="2026-10-03"
state["decisions"]["reuse"]["original_approval_date"]="2026-10-03"
state["migration_confirmation"]={"status":"pending","evidence":None}
save(ROOT,"language-state.json",state)
tokens=canonical_tokens(tokens,state);save(ROOT,"design-tokens.json",tokens)
write(ROOT,"tokens.css",css_tokens(tokens))
cov=coverage(state);cov.update(generated_prototypes=[],status="coverage-approved-rendering-pending",variant_lock="Copy, type, structure, spacing, media geometry and framing fixed; mapped palette values only")
save(ROOT,"prototype-coverage.json",cov)

# Verify complete selected token preservation with a field-by-field mapping.
comparisons=[]
def compare(path,newpath,a,b):
    comparisons.append({"legacy":path,"candidate":newpath,"legacy_value":a,"candidate_value":b,"equal":a==b})
for role,leaf in old["color"]["semantic"]["light"].items():
    compare("color.semantic.light."+role,"color.semantic.light."+role,resolve(old,leaf),resolve(tokens,tokens["color"]["semantic"]["light"][role]))
for role,composite in old["typography"]["style"].items():
    for field,val in unwrap(composite).items():
        newfield=keymap[field][0]
        compare("typography.style."+role+"."+field,"typography.options.type-2.style."+role+"."+newfield,val,resolve(tokens,tokens["typography"]["options"]["type-2"]["style"][role][newfield]))
for role,leaf in old["typography"]["family"].items():
    compare("typography.family."+role,"typography.family."+role,unwrap(leaf),unwrap(tokens["typography"]["family"][role]))
def leaf_compare(node,path):
    if isinstance(node,dict) and "$value" not in node:
        for key,value in node.items(): leaf_compare(value,path+[key])
    else:
        oldvalue=resolve(old,node);newnode=tokens
        for key in path:newnode=newnode[key]
        compare(".".join(path),".".join(path),oldvalue,resolve(tokens,newnode))
for group in ("layout","space","radius","shadow","motion","component"):
    leaf_compare(old[group],[group])
same_bytes=digest((ROOT/"provenance/h1-r3-source.html").read_bytes())==hashes["pdf/source/homepage-prototype.html"]
image_checks=[{"path":m["path"],"alt":m["alt"],"same_bytes":digest((ROOT/"assets"/Path(m["path"]).name).read_bytes())==hashes["assets/"+Path(m["path"]).name]} for m in media_manifest]
equivalence={"source_version":"1.2.0-proposed","candidate_version":VERSION,"selected_value_comparisons":comparisons,
 "all_selected_values_equal":all(x["equal"] for x in comparisons),"selected_values_count":len(comparisons),
 "legacy_full_html_bytes_equal":same_bytes,"legacy_section_order":names,"candidate_section_order":[s["id"] for s in sections],
 "section_source_hashes":raw_sections_manifest,"image_checks":image_checks,
 "font_hashes_match":all(digest((ROOT/"assets"/n).read_bytes())==hashes["assets/"+n] for n in font_names.values()),
 "rendered_equivalence":"NOT TESTED; template mapping pending","release_status":"PROPOSED"}
if not equivalence["all_selected_values_equal"] or not same_bytes or not all(x["same_bytes"] for x in image_checks):
    raise ValueError("Preservation check failed")
save(ROOT,"migration-equivalence.json",equivalence)

# Actual controls/status pair calculations, including explicit exemptions and mixed colors.
validation=validate(ROOT,"specification");save(ROOT,"specification-validation.json",validation)
extra=[]
def blend(a,b,f):
    return "#"+"".join(f"{round(int(a[i:i+2],16)*f+int(b[i:i+2],16)*(1-f)):02x}" for i in (1,3,5))
for pid in palettes:
    c={r:resolve(tokens,v) for r,v in palettes[pid]["light"].items()}
    for label,fg,bg in [("primary hover",c["text-inverse"],blend(c["brand-primary"],c["text-primary"],.88)),
                        ("secondary hover",c["brand-primary"],blend(c["brand-primary"],c["background"],.07)),
                        ("placeholder",c["disabled-content"],c["surface-elevated"])]:
        ratio=contrast(fg,bg);extra.append({"palette":pid,"purpose":label,"ratio":round(ratio,3),"minimum":4.5,"pass":ratio>=4.5})
    extra.append({"palette":pid,"purpose":"inactive disabled controls","ratio":round(contrast(c["disabled-content"],c["disabled-background"]),3),
                 "result":"exempt only while inactive; not a normal-text pass"})
save(ROOT,"contrast-detail.json",{"declared_pairs":validation["checks"],"additional_actual_pairs":extra,
 "blocking_failures":[x for x in extra if x.get("pass") is False],"not_tested":["All actual overlays/gradients and final rendered surfaces; see source mapping limitations"]})

def fields_md(data):
    parts=[]
    for k,v in data.items():
        if k in ("legacy_full_text","legacy_synthesis","legacy_chrome","source_fragment","legacy_content"):continue
        label=k.replace("_"," ").title()
        if isinstance(v,list): parts += ["### "+label,""]+["- "+(json.dumps(x,ensure_ascii=False) if isinstance(x,dict) else str(x)) for x in v]+[""]
        elif isinstance(v,dict): parts += ["### "+label,"",fields_md(v)]
        else:parts += ["- **"+label+":** "+str(v)]
    return "\n".join(parts)+"\n"
write(ROOT,"BRAND_IDENTITY_BLUEPRINT.md","# WeGroween Brand Identity Blueprint\n\n"+VERSION+" | MIGRATION CANDIDATE | PROPOSED\n\nApproved identity preserved; migration additions await confirmation. Values live in design-tokens.json.\n\n## Brief\n\n"+fields_md(language["brief"])+"\n## Brand intent and voice\n\n"+fields_md(language["brand"])+"\n## Composition\n\n"+fields_md(language["composition"])+"\n## Source and approval boundaries\n\nRead migration-equivalence.json and MIGRATION_REVIEW.md. Logo remains deferred. Candidate rendering has not been performed.\n")
write(ROOT,"DESIGN_SYSTEM.md","# WeGroween Design Language System\n\n"+VERSION+" | PROPOSED CANDIDATE\n\nTokens own values; narrative/composition lives in design-language.json; approvals/progress live in language-state.json.\n\n## Foundations\n\n"+fields_md({k:tokens[k] for k in ("layout","space","radius","shadow","motion")})+"\n## Component contracts\n\n"+fields_md(language["components"])+"\n## Precision acceptance\n\nCheck shared row anatomy, price/action baselines, actual fonts/glyphs, shortest/longest/missing copy, 35% expansion, narrow/intermediate/wide widths, relevant states and 200% reflow. Rendered checks are pending; structural validation is not proof of visual quality.\n")
write(ROOT,"IMAGERY_DIRECTION_GUIDE.md","# WeGroween Imagery Direction Guide\n\n"+VERSION+" | PROPOSED EXPANSION\n\nR3 image use is already authorized. The additional qualitative treatment bands below are new proposed specification, not measured grading settings or rights clearance.\n\n"+fields_md(language["imagery"])+"\n## Context and approval history\n\nCultivated Editorial / C2 / T2 / G3; households first, restaurant supply secondary. Prototype use of selected project images approved 2026-10-03. Expanded guide pending mapping acceptance; separate PDF not rendered yet.\n")
write(ROOT,"research-summary.md","# WeGroween Migration Research Summary\n\n"+VERSION+" | HISTORICAL EVIDENCE REUSED\n\n"+fields_md(language["research"])+"\nNo live source refresh or new market claims were needed for value/schema preservation. Source observations retain their original dates.\n")
write(ROOT,"decisions.md","# WeGroween Candidate Decisions\n\nCarry-forward records are scoped to original approvals. New migration and imagery additions are not automatically approved.\n\n"+fields_md(state["decisions"])+"\n## Pending\n\n"+fields_md({"mapping":state["migration_confirmation"],"pending_decisions":state["pending_decisions"]}))
write(ROOT,"README.md","# WeGroween Design Language Migration Candidate\n\n"+VERSION+" | PROPOSED | MIGRATE\n\nStart with MIGRATION_REVIEW.md. Canonical inputs are design-language.json, design-tokens.json and language-state.json. All three palette previews are authorized; C2 remains primary. Rendering waits for migration mapping acceptance. The parent v1.2.0-proposed package remains active.\n\nPreservation results: migration-equivalence.json. Input checks: specification-validation.json. Current status: language-state.json. Proposed expanded art direction: IMAGERY_DIRECTION_GUIDE.md. Complete original H1 content and imagery remain retained under provenance and assets; no replacement PDF is claimed.\n")
report=f"""# WeGroween Migration Review

Prepared: 2026-10-05  
Candidate: {VERSION}  
Status: PROPOSED; mapping confirmation pending  
Mode: MIGRATE — no visual redesign selected

## What is already concrete

- Schema-2 narrative, token registries and resumable state exist in this candidate.
- Three original palettes and two type pairings are retained. C2 maps to palette-2; T2 maps to type-2.
- {len(comparisons)} selected token/style comparisons are equal, including color, font values, grid, space, radii, shadows, motion and existing component dimensions.
- Original H1 source bytes, ten-section order, section text/fragments and selected media files are retained. All copied roman font files match their source hashes.
- Full legacy delivery rollback contains {len(hashes)} files with source hashes outside the candidate root.
- All-three palette coverage is explicitly approved in this conversation; primary C2 remains unchanged.
- New component state mappings, purpose/composition documentation and an expanded imagery guide have been authored.

## Source-to-target mapping

| Existing | Candidate | Treatment |
|---|---|---|
| C1/C2/C3 | palette-1/2/3 registries | Actual historic role values; C2 canonical |
| T1/T2 | type-1/2 registries | T2 composite fields expanded with identical values |
| Blueprint/brief/components/research | design-language.json | Attributed content and derived intent; new bands labelled proposed |
| Decision log | language-state.json | Original choice evidence and dates retained; no fresh research/imagery/release approval invented |
| H1/R3 source | homepage legacy content + provenance/h1-r3-source.html | Exact source retained; final template adaptation not done |
| R3 photos/fonts/I1 assets | assets and icons | Byte-preserving copies and existing rights limits |
| Scope/progress | language-state.json | Actual project, candidate version, scope baseline, dirty outputs and pending gates |

## Permitted changes proposed for acceptance

1. Expand approved composite tokens into schema-2 registries and typed fields, with generated CSS aliases; retain equivalent values.
2. Keep Cultivated Editorial, C2/T2/G3/V1/M1/I1/H1 and the three-page continuous presentation.
3. Keep the already authorized R3 photographs as a documented project exception to the skill's empty-media default, without expanding public-use rights.
4. Add derived purpose/attention/space/component-state documentation and the proposed fuller imagery treatment guide.
5. Generate all three palette variants after template mapping, locking copy, typography, spacing, media geometry and presentation.

## Missing mappings and honest limits

- The bundled generic builder prohibits photos/forms and changes H1 into generic section markup. Using it unchanged would lose R3 imagery and the approved three-page presentation. A bounded project-specific presentation adapter is needed after this mapping is accepted; no replacement has been rendered.
- Original Living Laboratory specifies geometric sans/mono, and Harvest House specifies arched/illustrated surfaces. Their new preview registry combinations are explicitly proposed approximations, not faithful historical reconstructions. Neither rejected territory is being selected or redesigned.
- H2/H3 names are historical, but complete original section mapping is unavailable. Candidate alternative orders are proposed hypotheses; H1 alone remains approved.
- Historic alternative T2/M1 text disagrees with canonical T2 weights and 8/10/14px geometry. Canonical tokens win; no values were normalized to older proposal text.
- Disabled-control contrast remains preserved and measured as inactive-only exemption, not mislabelled as normal-text success. Additional actual hover/placeholder pairs are recorded separately.
- Historical research is dated; no new fresh-market claim is made. Operational data and image rights remain unconfirmed.
- Expanded imagery bands need acceptance. PDF/rendered/stress QA and final release/archive remain pending.

## Checks actually run

- Full rollback/source hash verification.
- Selected field-by-field equivalence, exact H1 byte retention, media/font hash comparisons.
- Current specification validator: {"PASS" if validation["valid"] else "FAIL — see specification-validation.json"}.
- Declared opaque intended-pair contrast calculations and additional actual hover/placeholder checks in contrast-detail.json.
- No rendered-equivalence, user testing, public-rights clearance or final compliance claim.

## Required leader checkpoint

Accept the preservation mapping and permitted additions above, or identify revisions. This is separate from the already approved all-three coverage and final release status. On acceptance, adapt/render the preserved H1 presentation, create synchronized imagery/manual PDFs, inspect actual outputs and then present the concrete release package.

The invoked skill's operations contract requires: “Confirm the mapping, permitted differences and missing choices with the leader before rendering.”
"""
write(ROOT,"MIGRATION_REVIEW.md",report)
save(ROOT,"quality-review.json",{"input_hash":None,"stage":"specification-preparation",
 "checks":[{"category":"token-preservation","result":"pass","reviewer":"Codex field-by-field check","evidence":"migration-equivalence.json"},
 {"category":"specification","result":"pass" if validation["valid"] else "fail","reviewer":"Installed specification validator","evidence":"specification-validation.json"},
 *[{"category":c,"result":"not-tested","reviewer":"Codex","evidence":"Rendering gated on mapping acceptance"} for c in ("purpose","subtraction","hierarchy","precision","imagery","originality","fonts","desktop","mobile","pdf","gallery")]],
 "blocking_defects":validation["errors"]+["Migration mapping acceptance pending","Expanded imagery/research confirmation pending","No final template/rendered QA yet"]})
print(json.dumps({"candidate":str(ROOT),"rollback_files":len(hashes),"selected_values_preserved":len(comparisons),
 "specification_valid":validation["valid"],"specification_errors":validation["errors"],
 "contrast_additional_failures":[x for x in extra if x.get("pass") is False],"phase":"mapping-review","rendering_performed":False},ensure_ascii=False,indent=2))
