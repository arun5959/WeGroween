"""Encode remaining delivery rasters as WebP; retain supplied originals.
Run with Python/Pillow when these source images change. Builds validate committed copies.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json, hashlib
ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'public/media'
OUTPUT = MEDIA / 'optimized'
OUTPUT.mkdir(exist_ok=True)
report = []
for stem, filename in {
    'indoor-farm': 'Industrial Microgreens and Mushroom Farm.png',
    'mixed-mushroom-harvest': 'Rustic Mixed Mushroom Harvest.png',
    'mushroom-microgreen-platter': 'Rustic Mushroom and Microgreen Platter (1).png',
}.items():
    source = MEDIA / filename
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        copies = []
        for width in sorted(set([480, 768, image.width])):
            height = round(image.height * width / image.width)
            dest = OUTPUT / f'{stem}-{width}.webp'
            image.resize((width, height), Image.Resampling.LANCZOS).save(dest, 'WEBP', quality=86, method=6)
            copies.append({'filename': str(dest.relative_to(MEDIA)), 'width': width, 'height': height, 'bytes': dest.stat().st_size})
        report.append({'source': filename, 'originalBytes': source.stat().st_size, 'copies': copies})
logos = []
for source_name, display_name, crop in [
    ('wegroween-header-logo.png', 'wegroween-header', (32, 119, 2143, 579)),
    ('wegroween-footer-logo.png', 'wegroween-footer', (35, 128, 2053, 642)),
    ('wegroween-brand-mark.png', 'wegroween-favicon', None),
]:
    source = MEDIA / 'Logo' / source_name
    with Image.open(source) as original:
        image = original.convert('RGBA')
        if crop: image = image.crop(crop)
        else:
            background = Image.new('RGBA', image.size, '#FBF4E8')
            image = Image.alpha_composite(background, image).resize((256, 256), Image.Resampling.LANCZOS)
        dest = source.with_name(display_name + '.webp')
        image.save(dest, 'WEBP', lossless=True, quality=100, method=6, exact=True)
        decoded = Image.open(dest).convert('RGBA')
        assert decoded.size == image.size
        assert decoded.tobytes() == image.tobytes(), 'Logo encoding changed pixels'
        logos.append({'source': source_name, 'output': dest.name, 'width': image.width, 'height': image.height, 'originalBytes': source.stat().st_size, 'bytes': dest.stat().st_size, 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest()})
(MEDIA / 'Logo' / 'webp-manifest.json').write_text(json.dumps(logos, indent=2) + '\n', encoding='utf-8')
review = ROOT / 'docs/reviews/modern-images-2026-10-12'
review.mkdir(parents=True, exist_ok=True)
(review / 'conversion.json').write_text(json.dumps({'photos': report, 'logos': logos}, indent=2) + '\n', encoding='utf-8')
original = sum(x['originalBytes'] for x in report + logos)
modern = sum(x['copies'][-1]['bytes'] for x in report) + sum(x['bytes'] for x in logos)
print(json.dumps({'originalBytes': original, 'deliveryBytes': modern, 'reductionPercent': round((1-modern/original)*100, 1)}))
