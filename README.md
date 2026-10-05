# New Waves Underground Movement — sito

Sito vetrina statico (HTML/CSS/JS) del collettivo. Jungle · Drum & Bass · Dubstep — Venezia / Pordenone.

## Struttura
```
new-waves-site/
├── index.html                 Home
├── chi-siamo/index.html       Collettivo + membri + collaboratori + rider
├── eventi/index.html          Prossime date + archivio (da data/events.json)
├── bass-files/index.html      Format Bass Files
├── radio-ombra/index.html     Residenza Radio Ombra
├── mountain-waves/index.html  STUB "in arrivo" (noindex)
├── contatti/index.html        Booking e contatti
├── 404.html
├── css/style.css              Tokens → base → layout → componenti → pagine
├── js/main.js                 Nav mobile · facade YouTube/SoundCloud · eventi
├── data/
│   ├── events.json            Eventi (vuoto: da popolare)
│   ├── media.json             Set YouTube/SoundCloud (da popolare)
│   └── README.md
├── assets/
│   ├── img/{brand,hero,membri,eventi,og}/
│   ├── fonts/                 Font woff2 self-hosted (TODO)
│   └── icons/                 Favicon (placeholder)
├── docs/                      PROMPT.md (brief) · CONTENUTI.md (testi reali)
├── CLAUDE.md                  Regole per Claude Code
├── robots.txt · sitemap.xml   Sostituire DOMINIO.TLD
└── .gitignore
```

## Anteprima locale
```bash
python3 -m http.server 8000   # poi http://localhost:8000
```
Serve un server: i JSON in `data/` non si caricano da `file://`.

## Da fare prima del lancio
Cerca `TODO` nel progetto. Principali: dominio (`DOMINIO.TLD` in canonical, OG, sitemap, robots), URL YouTube/SoundCloud, immagine OG 1200×630, favicon, font self-hosted, foto di MRSN e Damnspark, conferma associazione foto → membro (`membro-a/b/c` = ordine delle slide: Djambe, Dema, Coce, DA CONFERMARE).

## Deploy
GitHub Pages (o qualunque hosting statico). Percorsi relativi: funziona anche in sottocartella, tranne `404.html` (percorsi dalla root).
