# PROMPT PER CLAUDE CODE — Sito New Waves Underground Movement

> NOTA: lo scheletro (pagine, CSS di base, JS, dati) è già nella cartella. Il tuo compito è completarlo e costruire il design. Foto e logo sono in `assets/img/`. `CLAUDE.md` nella root riassume le regole del progetto.

## Ruolo
Sei un Web Designer/Frontend Developer senior. Costruisci il sito vetrina di **New Waves Underground Movement**, collettivo bass music (jungle, drum & bass, dubstep) tra Venezia e Pordenone. Prima di scrivere codice leggi `CONTENUTI.md` (testi, link, dati reali) e guarda `assets/`.

## Obiettivo del sito
Vetrina identitaria + hub di ascolto. Il sito deve:
1. presentare il collettivo, i membri, i progetti;
2. far ascoltare i set (YouTube / SoundCloud) senza appesantire la pagina;
3. portare a un'unica azione di conversione: **richiesta booking via mail**.
Non è un Linktree: il valore sta in identità coerente, archivio e pagine indicizzabili per collettivo e progetti.

## Direzione visiva: UNDERGROUND (vincolante)
- Palette: nero profondo `#0A0A0A` come base, bianco caldo `#F2F0EB` per il testo, arancione fuoco `#FF5A1F` come unico accento (derivato dal Press Kit). Nessun altro colore di accento. Definisci tutto come CSS custom properties.
- Tipografia: grotesk maiuscola, pesante e compressa nei titoli (stile Press Kit: "NEW WAVES." con punto arancione finale). Micro-etichette in monospace con tracking largo e numerazione ("01 — IL COLLETTIVO"). Font self-hosted (woff2), `font-display: swap`, niente Google Fonts.
- Linguaggio grafico: angoli netti (zero border-radius), linee sottili, barre arancioni, griglia rigida e asimmetrica, grana/noise leggero su fondo nero, foto in bianco e nero o duotone con il solo arancione come tinta. Il logo (`assets/logo-mark.png`) è bianco: usalo grande, ritagliato, come elemento grafico.
- Hero: texture arancione (`assets/hero-orange.webp`) su nero, titolo gigante, sottotitolo "Jungle — Drum & Bass — Dubstep".
- Animazioni: poche, secche, con scopo (reveal allo scroll, hover sui link con linea arancione). Rispetta `prefers-reduced-motion`.
- Da EVITARE: gradienti viola/blu, card arrotondate con ombre morbide, glassmorphism, icone emoji, stock photo, look "template SaaS", testi centrati ovunque, effetti neon/glow esagerati. Deve sembrare un flyer da sound system, non una landing page.

## Architettura: sito multipagina statico (7 pagine)
URL puliti, ogni pagina in una cartella con il proprio `index.html`:

| Pagina | URL | Contenuto |
|---|---|---|
| Home | `/` | Hero, manifesto breve del collettivo, anteprima membri, prossimo evento (se presente), anteprima progetti (Bass Files, Radio Ombra, Mountain Waves), **sezione Ascolta** (YouTube + SoundCloud), CTA booking |
| Chi siamo | `/chi-siamo/` | Presentazione del collettivo (bio), i 5 membri ("nessuna gerarchia") con scheda per ognuno e bio completa dei 3 DJ + Instagram, collaboratori, rider tecnico in accordion |
| Eventi | `/eventi/` | Prossime date e archivio eventi passati (vedi sotto: dati da `events.json`) |
| Bass Files | `/bass-files/` | Il format: interviste + dj set, collaborazione con Drum And Bass Italia, episodi/video, Instagram |
| Radio Ombra | `/radio-ombra/` | La residenza artistica: cos'è Radio Ombra (radio indipendente al Chet, Venezia), il ruolo del collettivo, puntate/mix, link |
| Mountain Waves | `/mountain-waves/` | **Pagina predisposta ma solo come stub "in arrivo"** (stesso template, hero, testo breve, link Instagram @mountainwavesfest, CTA mail). `noindex` finché non sarà costruita. Progettare il template in modo che si possa riempire dopo senza rifare il design |
| Contatti | `/contatti/` | Booking via mail (CTA principale), Instagram dei progetti, rider tecnico sintetico, area stampa/press kit solo se Marco conferma |

- Navigazione: Home · Chi siamo · Bass Files · Radio Ombra · Contatti. (Eventi è temporaneamente non pubblicata: noindex, fuori da menu, sitemap e robots; la pagina esiste in `eventi/`.) Mountain Waves compare nel footer e nelle card progetto della home finché non è pronta (non in nav principale). Menu mobile accessibile (tastiera, `aria-expanded`, chiusura con Esc), voce attiva con `aria-current="page"`.
- Header e footer identici su tutte le pagine. Senza framework né build step, duplicali nell'HTML (non caricarli via JS: peggiora SEO e provoca flash). Aggiungi in cima a ogni file un commento `<!-- HEADER: tenere identico in tutte le pagine -->`.
- Ogni pagina ha: `<title>` e meta description propri, canonical, Open Graph, un solo `h1`, breadcrumb dove ha senso.
- Struttura file: **la cartella del progetto esiste già** (vedi `README.md`): non ricrearla né spostare file senza chiedere. Percorsi **relativi** a livello di pagina (`../css/style.css` nelle sottocartelle), così il sito funziona sia su dominio custom sia su GitHub Pages in sottocartella; l'unica eccezione è `404.html` (percorsi dalla root).

## Pagina Eventi
- Gli eventi vengono da `data/events.json` (`{date, title, venue, city, status, link, flyer}`), renderizzati da JS con **fallback HTML statico** per il prossimo evento e markup JSON-LD `Event` generato per ogni data (SEO).
- Due blocchi: "Prossime date" (se vuoto, mostra stato vuoto utile con CTA booking e link Instagram, mai una pagina morta) e "Archivio" (anni passati, filtro per città/progetto).
- Non inventare eventi: popola l'archivio solo con ciò che trovi in `CONTENUTI.md` (CS Rivolta Venezia, Astro Club Pordenone, Veneto Blaze) come venue/residenze, senza date né line-up finché Marco non le fornisce.

## Sezione Ascolta (YouTube + SoundCloud)
- Componente riutilizzabile, presente in **home** (con 3-4 contenuti in evidenza e pulsanti "Tutti i set su YouTube" / "Tutti i mix su SoundCloud") e riproposto, filtrato, in `/bass-files/` e `/radio-ombra/`.
- Usa **facade**: miniatura/placeholder statico e iframe caricato solo al click (`youtube-nocookie.com`, widget SoundCloud). Nessun iframe di terzi al primo render. Il click mostra una riga di avviso sul caricamento di contenuti esterni (cookie di terze parti).
- Configurazione in un solo punto: `data/media.json` con `[{platform, url, title, tags:["collettivo"|"bass-files"|"radio-ombra"], artist, date}]`. Marco aggiunge un set modificando solo quel file.
- Se mancano gli URL, mostra card segnaposto con `<!-- TODO: URL -->`, mai embed finti.
- Link ai canali completi (URL dei canali da fornire).

## Booking
- CTA principale: `mailto:newwavesundergroundmovement@gmail.com` con subject precompilato.
- **Non pubblicare i numeri di telefono personali** di Djambe e Dema (privacy/spam). Se Marco li vuole, li aggiunge lui.
- Il rider tecnico (Pioneer DJM-900NXS, 3× CDJ-2000NXS2, ecc.) sta in una sezione/accordion "Rider tecnico", non in primo piano.

## Stack e vincoli tecnici
- HTML/CSS/JS statico, **nessun framework né build step obbligatorio**. Struttura: `index.html`, `css/style.css`, `js/main.js`, `assets/`. Deploy previsto su GitHub Pages (percorsi relativi).
- Mobile-first, breakpoint a 480 / 768 / 1100. Almeno l'80% del traffico sarà da telefono (link da Instagram): testa prima lì.
- Performance: LCP < 2.5s su 4G, CLS ≈ 0, immagini WebP con `width`/`height`, `srcset`, `loading="lazy"` sotto il fold, hero con `fetchpriority="high"`. JS < 15 KB, nessuna dipendenza esterna a runtime.
- Accessibilità WCAG 2.1 AA: contrasto verificato (arancione `#FF5A1F` su nero va bene; mai arancione su bianco per testo piccolo), focus visibile, navigazione da tastiera, `alt` descrittivi, landmark, skip link, gerarchia `h1–h3` corretta.
- SEO: `<title>` e meta description, Open Graph e Twitter card (immagine 1200×630 da creare), JSON-LD `MusicGroup` con `member` e `sameAs` (Instagram), canonical, `robots.txt`, `sitemap.xml` (senza Mountain Waves finché è noindex), `lang="it"`.
- Codice pulito, commentato, CSS organizzato (tokens → base → componenti → sezioni).

## Metodo di lavoro
1. **Prima di codare** proponi in 10 righe: sitemap delle 7 pagine, wireframe testuale di Home e Chi siamo, sistema tipografico, token colore, e la scelta dei font con licenza libera (es. Archivo / Inter Tight + una mono). Aspetta il mio ok.
2. Per UX/UI usa le skill disponibili (`frontend-design`, e le `design:*` per accessibilità e critique). Per i pattern dei componenti (navigazione, accordion, griglia membri, facade) puoi prendere ispirazione da 21st.dev **solo se hai accesso al suo MCP**; altrimenti scrivili a mano. Adatta sempre allo stile underground, non incollare componenti generici.
3. Costruisci per fasi: tokens, template di pagina, header/footer → Home → Chi siamo → Eventi → Bass Files → Radio Ombra → Contatti → stub Mountain Waves → sitemap, SEO, rifinitura. Dopo ogni pagina fermati per la mia revisione.
4. **Verifica a ogni fase**: apri il sito in locale, controlla mobile e desktop con screenshot, console senza errori, Lighthouse (performance, accessibilità, SEO, best practice) con report finale.
5. **Review con CodeRabbit**: inizializza git, crea il repo su GitHub e lavora su un branch `feat/sito-v1` con PR. Se la CLI `coderabbit` è installata, eseguila in locale; altrimenti lascia la PR pronta per la review dell'app CodeRabbit e poi correggi i commenti ricevuti. Non dichiarare "verificato con CodeRabbit" se la review non è stata davvero eseguita.
6. A fine lavoro: elenco di cosa è fatto, cosa manca (URL set, foto mancanti, OG image), e i problemi noti.

## Cose aperte (non inventare: lascia TODO e segnalale)
- URL YouTube/SoundCloud dei set.
- Foto di MRSN e Damnspark (usa un placeholder grafico coerente, non foto stock).
- Le foto nel Press Kit non sono etichettate: l'associazione `member-a/b/c` con Djambe/Dema/Coce **va confermata da Marco**.
- Instagram di MRSN e Damnspark da fornire.
- Dominio definitivo e se il deploy è su dominio custom o GitHub Pages in sottocartella.
- Contenuti per Eventi: elenco date passate e future, con venue e flyer.
- Contenuti per Bass Files: episodi/ospiti, link ai video, eventuale playlist YouTube.
- Contenuti per Radio Ombra: cos'è, quando va in onda il collettivo, link alla radio e ai mix. Nel Press Kit c'è solo una riga.
- URL dei canali YouTube e SoundCloud del collettivo.
- Mountain Waves: la pagina completa verrà costruita dopo, per ora solo stub.

## Regole
- Testi in italiano, tono diretto e asciutto, niente retorica da comunicato stampa. Usa solo i testi di `CONTENUTI.md`; non inventare date, line-up, numeri o citazioni.
- Prima di cambiare palette, struttura o stack rispetto a questo brief, chiedi.
