#!/usr/bin/env python3
"""Controllo locale dei JSON-LD del sito (solo libreria standard, nessuna dipendenza).

Uso:  python3 docs/validate-jsonld.py        (dalla radice del progetto)

Verifica per ogni pagina:
- il JSON è sintatticamente valido e ha @context schema.org;
- ogni nodo ha @type e (se presente) @id univoco nella pagina;
- i riferimenti {"@id": ...} sono risolti da un nodo della stessa pagina;
- gli URL usano un solo dominio (oggi il segnaposto DOMINIO.TLD);
- BreadcrumbList con posizioni 1..n e URL assoluti;
- sameAs solo verso i profili elencati in docs/CONTENUTI.md;
- nomi di persone/organizzazioni e frasi di descrizione presenti nel testo visibile della pagina.
Non sostituisce il Rich Results Test né lo Schema Markup Validator (vedi docs/SEO-GEO-REPORT.md).
"""
import glob, html, json, re, sys
from urllib.parse import urlparse

ALLOWED_SAMEAS = {
    "https://instagram.com/newwaves_um", "https://instagram.com/mountainwavesfest",
    "https://instagram.com/bass_files_italia", "https://instagram.com/djambe__",
    "https://instagram.com/djdema_productions", "https://instagram.com/alessandro_coce",
}
errors, warnings = [], []


def err(page, msg): errors.append(f"{page}: {msg}")
def warn(page, msg): warnings.append(f"{page}: {msg}")


def visible_text(src):
    src = re.sub(r"<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>", " ", src, flags=re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", src))).lower()


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


pages = ["index.html"] + sorted(glob.glob("*/index.html"))
hosts, total = set(), 0
for page in pages:
    src = open(page, encoding="utf-8").read()
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, flags=re.S)
    if not blocks:
        continue
    text = visible_text(src)
    for raw in blocks:
        total += 1
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            err(page, f"JSON non valido: {e}")
            continue
        if data.get("@context") != "https://schema.org":
            err(page, "@context mancante o diverso da https://schema.org")
        nodes = data.get("@graph", [data])
        ids = {}
        for n in nodes:
            if "@type" not in n:
                err(page, f"nodo senza @type: {str(n)[:60]}")
            if "@id" in n:
                ids[n["@id"]] = ids.get(n["@id"], 0) + 1
        for i, c in ids.items():
            if c > 1:
                warn(page, f"@id ripetuto {c} volte nello stesso grafo: {i}")
        # riferimenti: oggetti con il solo @id devono avere un nodo completo in pagina
        for n in walk(data):
            if set(n) == {"@id"} and n["@id"] not in ids:
                err(page, f"riferimento non risolto: {n['@id']}")
            for k in ("url", "item", "logo", "image"):
                v = n.get(k)
                if isinstance(v, str) and v.startswith("http"):
                    hosts.add(urlparse(v).netloc)
            for s in n.get("sameAs", []) if isinstance(n.get("sameAs"), list) else []:
                if s not in ALLOWED_SAMEAS:
                    err(page, f"sameAs non presente in docs/CONTENUTI.md: {s}")
            if n.get("@type") == "BreadcrumbList":
                pos = [i["position"] for i in n["itemListElement"]]
                if pos != list(range(1, len(pos) + 1)):
                    err(page, f"BreadcrumbList: posizioni non sequenziali {pos}")
            if n.get("@type") in ("Person", "Organization", "MusicGroup") and "name" in n:
                nm = n["name"].lower()
                if nm not in text:
                    warn(page, f"nome non presente nel testo visibile: {n['name']}")
            if n.get("@type") in ("ContactPoint",) and "telephone" in n:
                err(page, "numero di telefono presente: NON pubblicare i telefoni personali")
        # coerenza testo: la descrizione deve riprendere frasi visibili
        for n in nodes:
            d = n.get("description")
            if d and n.get("@type") in ("MusicGroup", "CreativeWorkSeries"):
                frag = re.split(r"[:,]", d.lower())[1 if d.lower().startswith(("collettivo", "residenza")) else 0].strip()
                if frag[:25] not in text:
                    warn(page, f"descrizione non ritrovata nel testo visibile ({n['@type']}): '{frag[:40]}…'")

if len(hosts) > 1:
    err("sito", f"più domini negli URL dei dati strutturati: {sorted(hosts)}")

print(f"Blocchi JSON-LD controllati: {total} in {len([p for p in pages if 'ld+json' in open(p, encoding='utf-8').read()])} pagine")
print(f"Domini negli URL: {sorted(hosts)}")
for w in warnings:
    print("AVVISO:", w)
for e in errors:
    print("ERRORE:", e)
print("OK" if not errors else f"{len(errors)} errori")
sys.exit(1 if errors else 0)
