#!/usr/bin/env python3
"""Find real award-winning reference sites from the bundled dataset (808 Awwwards winners).

Usage:
  python3 scripts/refs.py --tags "Food & Drink" --tier sotm
  python3 scripts/refs.py --q "watch luxury" --dark --limit 12
  python3 scripts/refs.py --tags WebGL,Storytelling --min-score 7.6 --sheet /tmp/refs.jpg
  python3 scripts/refs.py --list-tags
Each hit prints score, tier, sub-scores, palette, fonts, stack, live URL and a reference
screenshot path (refs/<slug>.jpg: hero + one scroll frame) you can open to look at it.
"""
import argparse, json, os, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(ROOT, 'data', 'winners.json')))
ap = argparse.ArgumentParser()
ap.add_argument('--tags', default='', help='comma separated, all must match (case-insensitive, substring)')
ap.add_argument('--any', default='', help='comma separated, at least one must match')
ap.add_argument('--q', default='', help='free text over title/description/tags/agency/headline')
ap.add_argument('--tier', choices=['soty', 'sotm', 'sotd'], help='minimum tier')
ap.add_argument('--min-score', type=float, default=0)
ap.add_argument('--dark', action='store_true'); ap.add_argument('--light', action='store_true')
ap.add_argument('--alive', action='store_true', help='only sites that loaded during research')
ap.add_argument('--since', type=int, default=2023, help='minimum award year (default 2023: older winners are often redesigned/parked today)')
ap.add_argument('--all-years', action='store_true', help='include 2011-2022 winners (metadata is historical; screenshots show today\'s site)')
ap.add_argument('--limit', type=int, default=15)
ap.add_argument('--sheet', help='write a contact sheet jpg of the hits (needs Pillow)')
ap.add_argument('--list-tags', action='store_true')
ap.add_argument('--json', action='store_true')
a = ap.parse_args()
if a.list_tags:
    for t, n in collections.Counter(t for w in W for t in w['tags']).most_common(): print(f'{n:4d}  {t}')
    raise SystemExit
rank = {'sotd': 1, 'sotm': 2, 'soty': 3}
def ok(w):
    tags = [t.lower() for t in w['tags']]
    if a.tags and not all(any(x.strip().lower() in t for t in tags) for x in a.tags.split(',')): return False
    if a.any and not any(any(x.strip().lower() in t for t in tags) for x in a.any.split(',')): return False
    if a.q:
        hay = ' '.join([w['title'], w.get('description', ''), ' '.join(w['tags']), w.get('agency') or '', (w.get('live') or {}).get('headline', '')]).lower()
        if not all(word in hay for word in a.q.lower().split()): return False
    if a.tier and rank[w['tier']] < rank[a.tier]: return False
    if w['score'] < a.min_score: return False
    if not a.all_years and a.since and (w.get('year') or 0) < a.since: return False
    live = w.get('live')
    if (a.alive or a.dark or a.light) and not live: return False
    if a.dark and not live['dark']: return False
    if a.light and live['dark']: return False
    return True
for w in W:  # screenshots are local-only: present if captured with scripts/capture-refs.mjs
    f = os.path.join(ROOT, 'refs', w['slug'] + '.jpg')
    if os.path.exists(f): w['shot'] = os.path.join('refs', w['slug'] + '.jpg')
    else: w.pop('shot', None)
hits = sorted([w for w in W if ok(w) and not w.get('broken')], key=lambda w: (-rank[w['tier']], -w['score']))[:a.limit]
STALE = lambda w: (w.get('year') or 0) < 2023
if a.json: print(json.dumps(hits, indent=1, ensure_ascii=False)); raise SystemExit
for w in hits:
    l = w.get('live') or {}
    s = w['scores']
    print(f"{w['score']:.2f} {w['tier'].upper():4} {w['year']}  {w['title']}  — {w.get('agency') or '?'}")
    print(f"     D{s['design']:.2f} U{s['usability']:.2f} C{s['creativity']:.2f} Ct{s['content']:.2f} | palette {' '.join(w['palette'])} | {', '.join(w['tags'][:7])}")
    if l: print(f"     fonts {', '.join(l['fonts'])} | hero {l.get('heroVw')}vw w{l.get('heroWeight')} | {'dark' if l['dark'] else 'light'} | stack {', '.join(l['stack']) or '-'}{' | fullscreen WebGL' if l['webglFullscreen'] else ''}")
    ref = os.path.join(ROOT, w['shot']) if w.get('shot') else '(not captured yet)'
    if STALE(w) and w.get('shot'): ref += '  [HISTORICAL: screenshot shows today\'s site, not the awarded version]'
    print(f"     {w['url']}   ref: {ref}")
print(f'\n{len(hits)} hits')
missing = [w['slug'] for w in hits if not w.get('shot')]
if missing:
    print(f"\n{len(missing)} without a local screenshot. Capture them (private, on your machine):")
    print(f"  node {os.path.join(ROOT, 'scripts', 'capture-refs.mjs')} --slugs {','.join(missing)}")
    print('  or open the URLs above in a browser and look at them. Do not design from memory.')
if a.sheet and hits:
    from PIL import Image, ImageDraw
    ims = [(w, Image.open(os.path.join(ROOT, w['shot']))) for w in hits if w.get('shot') and not STALE(w)]
    if ims:
        cw = 960; rows = []
        for w, im in ims:
            im = im.resize((cw, int(im.height * cw / im.width))); row = Image.new('RGB', (cw, im.height + 24), (20, 20, 20))
            row.paste(im, (0, 24)); ImageDraw.Draw(row).text((6, 6), f"{w['title']} · {w['score']} · {w['tier']}", fill=(255, 255, 255)); rows.append(row)
        sheet = Image.new('RGB', (cw, sum(r.height for r in rows)), (20, 20, 20)); y = 0
        for r in rows: sheet.paste(r, (0, y)); y += r.height
        sheet.save(a.sheet, quality=75); print('sheet:', a.sheet)
