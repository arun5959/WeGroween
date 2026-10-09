import sys,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,r"C:\Users\tarun\.agents\skills\design-language-system\scripts")
from chromium import Chromium
from language_core import save
expr=r"""(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');const color=c=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=c;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data]};const blend=(f,b)=>{let a=f[3]/255;return [0,1,2].map(i=>f[i]*a+b[i]*(1-a)).concat(255)};const bg=e=>{let chain=[];for(let p=e;p;p=p.parentElement)chain.unshift(p);let c=[255,255,255,255];for(const p of chain)c=blend(color(getComputedStyle(p).backgroundColor),c);return c};const lum=c=>{const a=c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return a[0]*.2126+a[1]*.7152+a[2]*.0722};const results=[];for(const e of document.querySelectorAll('main *')){const text=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();if(!text||['SCRIPT','STYLE','SVG'].includes(e.tagName)||e.closest('svg'))continue;const cs=getComputedStyle(e),r=e.getBoundingClientRect();if(!r.width||!r.height||cs.visibility==='hidden')continue;const background=bg(e),foreground=blend(color(cs.color),background);const a=lum(foreground),b=lum(background);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);const size=parseFloat(cs.fontSize),weight=parseInt(cs.fontWeight);const min=size>=24||(size>=18.667&&weight>=700)?3:4.5;results.push({text:text.slice(0,75),cls:e.className,ratio:Math.round(ratio*100)/100,minimum:min,foreground:cs.color,background:background.slice(0,3),pass:ratio>=min});}return {checks:results.length,failures:results.filter(r=>!r.pass),limitations:'Computed flat/alpha background compositing; photo/gradient contrast needs rendered inspection'}})()"""
reports=[]
for pid in ('palette-2','palette-1','palette-3'):
    with Chromium(r"C:\Program Files\Google\Chrome\Application\chrome.exe",ROOT/"tmp/contrast-render",1440,1000) as page:
        page.open(ROOT/f"artifact/homepage-{pid}.html");report=page.evaluate(expr);report["palette"]=pid;reports.append(report)
        print(json.dumps({"palette":pid,"checks":report["checks"],"failures":report["failures"]},ensure_ascii=True),flush=True)
save(ROOT,"validation/rendered-contrast.json",{"reports":reports})
