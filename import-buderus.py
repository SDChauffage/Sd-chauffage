"""Convertit les tarifs publics Buderus en données de recherche pour l'app.

Usage: python import-buderus.py catalogue.xlsx pieces.xlsx
Lecture seule des fichiers source. Nécessite openpyxl.
"""
import collections
import json
import math
import pathlib
import sys

import openpyxl

BASE = pathlib.Path(__file__).resolve().parent / 'catalogues'
SOURCE = 'https://www.buderus.com/be/fr/partenaires/installateurs/documentation/listes-de-prix/'


def text(value):
    if value is None:
        return ''
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def extract(catalogue, spares):
    items = []
    omitted = collections.Counter()
    for path, is_spare in [(catalogue, False), (spares, True)]:
        book = openpyxl.load_workbook(path, read_only=True, data_only=True)
        sheets = book.worksheets if is_spare else book.worksheets[:1]
        for sheet in sheets:
            for row in sheet.iter_rows(min_row=2, max_col=23 if is_spare else 7, values_only=True):
                if row[0] is None:
                    continue
                if is_spare and sheet.title == 'BASIC spares' and row[21] != 'X':
                    omitted['other_channel'] += 1
                    continue
                price = row[6 if is_spare else 3]
                if isinstance(price, bool) or not isinstance(price, (int, float)) or not math.isfinite(price) or price <= 0:
                    omitted['no_public_price'] += 1
                    continue
                name = text(row[2]) or text(row[1])
                reference = text(row[0])
                if not reference or not name:
                    omitted['missing_identity'] += 1
                    continue
                item = dict(reference=reference, name=name, price=round(price, 2), category='Pièces détachées' if is_spare else 'Appareils et accessoires')
                remark = text(row[19 if is_spare else 5])
                if remark:
                    item['remark'] = remark
                items.append(item)
        book.close()
    # Une référence peut avoir plusieurs désignations/tarifs : ne pas choisir un
    # prix arbitrairement. Seuls les enregistrements entièrement identiques sont retirés.
    unique = {json.dumps(a, ensure_ascii=False, sort_keys=True): a for a in items}
    return list(unique.values()), dict(omitted)


if __name__ == '__main__':
    items, omitted = extract(*sys.argv[1:3])
    BASE.mkdir(exist_ok=True)
    files = []
    for offset in range(0, len(items), 3000):
        name = f'buderus-2026-{offset // 3000 + 1}.json'
        (BASE / name).write_text(json.dumps(items[offset:offset + 3000], ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        files.append(name)
    manifest = dict(count=len(items), files=files, source=SOURCE, tariffDate='2026-07', importedAt='2026-10-20', currency='EUR', prices='public_excluding_vat')
    (BASE / 'buderus-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(dict(count=len(items), categories=dict(collections.Counter(a['category'] for a in items)), omitted=omitted, files=files), ensure_ascii=False))
