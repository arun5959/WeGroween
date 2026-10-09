from pathlib import Path
import sys,json
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,r'C:\Users\tarun\.agents\skills\design-language-system\scripts')
from chromium import Chromium
from language_core import save
with Chromium(r'C:\Program Files\Google\Chrome\Application\chrome.exe',ROOT/'tmp/gallery-interactions',1440,1000) as page:
    page.open(ROOT/'artifact/index.html')
    page.evaluate('document.querySelector(\'[data-category-control="color"]\').click()')
    page.evaluate('document.querySelector("#gallery input[type=radio]").click()')
    result=page.evaluate('({proposal:window.designGallery.exportChoices(),summary:document.getElementById("summary").textContent,frames:document.querySelectorAll("iframe").length})')
    page.evaluate('document.querySelector(\'[data-category-control="color"]\').focus()')
    page.call('Input.dispatchKeyEvent',{'type':'keyDown','key':'ArrowRight','code':'ArrowRight'})
    result['keyboard_category']=page.evaluate('document.querySelector(\'[data-category-control][aria-selected="true"]\').dataset.categoryControl')
save(ROOT,'validation/gallery-interaction.json',result)
print(json.dumps({'selected_proposal':result['proposal']['selections'],'export_status':result['proposal']['status'],'keyboard_category':result['keyboard_category'],'frames':result['frames']},indent=2))
