from pathlib import Path
import sys,json,math,re
from PIL import Image,ImageOps,ImageDraw
import fitz
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,r"C:\Users\tarun\.agents\skills\design-language-system\scripts")
from chromium import Chromium
from language_core import load,save,digest
BROWSER=r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT=ROOT/"tmp/qa";OUT.mkdir(parents=True,exist_ok=True)
pdfs=[]
current_pdfs=[ROOT/r['file'] for r in load(ROOT/'prototype-coverage.json')['generated_prototypes']]
current_pdfs += [ROOT/'pdf/wegroween-design-direction-manual.pdf',ROOT/'pdf/wegroween-imagery-direction-guide.pdf']
for pdf in sorted(current_pdfs):
    doc=fitz.open(pdf);pages=[];thumbnails=[]
    for i,page in enumerate(doc):
        text=page.get_text();outbounds=[]
        for block in page.get_text("dict")["blocks"]:
            if block.get("type")!=0:continue
            for line in block["lines"]:
                for span in line["spans"]:
                    r=fitz.Rect(span["bbox"])
                    if r.x0 < -.8 or r.y0 < -.8 or r.x1>page.rect.width+.8 or r.y1>page.rect.height+.8:outbounds.append(span["text"])
        if page.rect.height>2000:
            # Inspect readable long-page slices, not only a tiny contact sheet.
            count=6
            for part in range(count):
                clip=fitz.Rect(0,page.rect.height*part/count,page.rect.width,page.rect.height*(part+1)/count)
                page.get_pixmap(matrix=fitz.Matrix(.9,.9),clip=clip).save(OUT/(pdf.stem+f"-page-{i+1}-slice-{part+1}.png"))
        else:page.get_pixmap(matrix=fitz.Matrix(1.25,1.25)).save(OUT/(pdf.stem+f"-page-{i+1}.png"))
        pix=page.get_pixmap(matrix=fitz.Matrix(min(320/page.rect.width,420/page.rect.height),min(320/page.rect.width,420/page.rect.height)))
        im=Image.frombytes("RGB",(pix.width,pix.height),pix.samples).convert("RGB")
        tile=Image.new("RGB",(340,460),"#eeeeee");tile.paste(im,((340-im.width)//2,24));ImageDraw.Draw(tile).text((10,438),f"{pdf.stem[-28:]} / {i+1}",fill="black");thumbnails.append(tile)
        fonts=[f[3] for f in page.get_fonts(full=True)]
        pages.append({"page":i+1,"size":[round(page.rect.width,2),round(page.rect.height,2)],"text_chars":len(text),"out_of_bounds":outbounds,"fonts":fonts})
    for batch in range(math.ceil(len(thumbnails)/6)):
        selected=thumbnails[batch*6:(batch+1)*6];sheet=Image.new("RGB",(1020,920),"white")
        for idx,tile in enumerate(selected):sheet.paste(tile,((idx%3)*340,(idx//3)*460))
        sheet.save(OUT/(pdf.stem+f"-contact-{batch+1}.png"))
    pdfs.append({"file":pdf.relative_to(ROOT).as_posix(),"pages":pages,"repaired":doc.is_repaired})
    print(json.dumps({"pdf":pdf.name,"pages":doc.page_count,"out_of_bounds_count":sum(len(p["out_of_bounds"]) for p in pages)}),flush=True)
browser=[]
expr="""(()=>{const w=innerWidth;const els=[...document.querySelectorAll('body *')];const overflow=els.filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>w+1&&!e.closest('.nav-links')&&!['SCRIPT','STYLE'].includes(e.tagName)}).map(e=>({tag:e.tagName,cls:e.className,right:Math.round(e.getBoundingClientRect().right)}));const cards=[...document.querySelectorAll('.product-card')].map(e=>{const r=e.getBoundingClientRect();const a=e.querySelector('.product-bottom');return {height:Math.round(r.height),action:Math.round(a?.getBoundingClientRect().top||0),title:e.querySelector('h4')?.textContent}});return {width:w,scrollWidth:document.documentElement.scrollWidth,overflow:overflow.slice(0,15),brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),fonts:document.fonts.status,cards}})()"""
for pid in ("palette-2","palette-1","palette-3"):
    for width in (1440,768,390):
        with Chromium(BROWSER,ROOT/"tmp/viewport-qa",width,1000) as page:
            page.open(ROOT/f"artifact/homepage-{pid}.html")
            observation=page.evaluate(expr);observation.update(palette=pid)
            (OUT/f"{pid}-{width}-top.png").write_bytes(page.screenshot())
            page.evaluate("document.querySelector('#harvest').scrollIntoView()")
            (OUT/f"{pid}-{width}-harvest.png").write_bytes(page.screenshot())
            page.evaluate("window.scrollTo(0,document.body.scrollHeight)")
            (OUT/f"{pid}-{width}-footer.png").write_bytes(page.screenshot())
            browser.append(observation)
            print(json.dumps({"viewport":pid,"width":width,"overflow_count":len(observation["overflow"]),"scrollWidth":observation["scrollWidth"],"broken_images":len(observation["brokenImages"])}),flush=True)
# 200% equivalent layout reflow with realistic text expansion and a missing optional paragraph.
with Chromium(BROWSER,ROOT/"tmp/stress-qa",720,1000) as page:
    page.open(ROOT/"artifact/homepage-palette-2.html")
    page.evaluate("document.querySelector('.product-content h4').textContent='A longer seasonal mushroom variety';document.querySelectorAll('.product-content p')[0].textContent+=' Carefully selected for household cooking and professional kitchen use.';document.querySelectorAll('.product-content p')[1].textContent='';")
    stress=page.evaluate(expr);stress["case"]="720px equivalent 200% desktop reflow, expanded title/copy and missing optional description"
    page.evaluate("document.querySelector('#harvest').scrollIntoView()");(OUT/"stress-720-expanded-missing.png").write_bytes(page.screenshot())
with Chromium(BROWSER,ROOT/"tmp/gallery-qa",1440,1000) as page:
    page.open(ROOT/"artifact/index.html")
    gallery=page.evaluate("({title:document.getElementById('projectTitle')?.textContent,options:document.querySelectorAll('.option-card').length,frames:document.querySelectorAll('iframe').length,buttons:document.querySelectorAll('button').length,text:document.body.innerText.slice(0,350)})")
    page.evaluate("document.querySelector('[data-category-control=\"color\"]').click()")
    gallery["color_frames"]=page.evaluate("document.querySelectorAll('iframe').length")
    (OUT/"gallery-desktop.png").write_bytes(page.screenshot())
with Chromium(BROWSER,ROOT/"tmp/component-qa",390,1000) as page:
    page.open(ROOT/"artifact/component-specimen.html")
    component=page.evaluate("({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,controls:document.querySelectorAll('button,input').length,fonts:document.fonts.status})")
    (OUT/"component-mobile.png").write_bytes(page.screenshot())
save(ROOT,"validation/pdf-qa.json",{"pdfs":pdfs,"all_nonempty":all(p["text_chars"]>0 for f in pdfs for p in f["pages"]),"out_of_bounds_count":sum(len(p["out_of_bounds"]) for f in pdfs for p in f["pages"])})
save(ROOT,"validation/browser-qa.json",{"viewports":browser,"stress":stress,"gallery":gallery,"component":component})
print(json.dumps({"gallery":gallery,"component":component,"stress_overflow":stress["overflow"]},ensure_ascii=False),flush=True)
