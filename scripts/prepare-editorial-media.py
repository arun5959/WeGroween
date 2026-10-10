"""Create responsive WebP delivery copies; supplied PNG originals stay untouched.

Run manually with Python and Pillow when these source photographs change.
The website build validates the resulting public assets without requiring Python.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'public' / 'media'
OUTPUT = MEDIA / 'optimized'
SOURCES = {
    'supply-hero-portrait': 'fresh-mushrooms-and-microgreens-on-parchment-portrait.png',
    'supply-hero-landscape': 'fresh-mushrooms-and-microgreens-on-parchment-landscape.png',
    'kitchen-dish-portrait': 'sauteed-mushrooms-with-microgreens-portrait.png',
    'kitchen-dish-landscape': 'sauteed-mushrooms-with-microgreens-landscape.png',
    'oyster-mushrooms-detail': 'Oyster Mushroom Cluster on Stone.png',
    'microgreens-detail': 'Fresh Microgreens on Stone Texture.png',
    'microgreens-range': 'Vibrant Microgreen Trio Overhead.png',
    'microgreens-harvest': 'Harvesting Microgreens on Indoor Racks.png',
}

OUTPUT.mkdir(parents=True, exist_ok=True)
report = []
for stem, filename in SOURCES.items():
    source = MEDIA / filename
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        files = []
        for width in sorted(set([480, 768, image.width])):
            if width > image.width:
                continue
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            destination = OUTPUT / f'{stem}-{width}.webp'
            resized.save(destination, 'WEBP', quality=84, method=6)
            files.append({'filename': destination.name, 'width': width, 'height': height, 'bytes': destination.stat().st_size})
        report.append({'source': filename, 'originalBytes': source.stat().st_size, 'dimensions': image.size, 'copies': files})

(ROOT / 'docs' / 'verification' / 'editorial-media-files.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'sourceFiles': len(report), 'originalBytes': sum(item['originalBytes'] for item in report), 'largestCopyBytes': sum(item['copies'][-1]['bytes'] for item in report), 'webpFiles': sum(len(item['copies']) for item in report)}))
