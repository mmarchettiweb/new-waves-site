# Audit tecnico pre-pubblicazione — New Waves Underground Movement

Data: 13/10/2026 · Solo file locali, nessuna azione git · Backup dello stato iniziale: `../backup-audit-20261013/` (copia identica, verificata con `diff -r` prima di toccare qualsiasi file).

**Esito in breve.** Il sito era già in buono stato: nessun link rotto, accessibilità Lighthouse 100 su tutte le pagine, nessuna richiesta a terzi al primo caricamento. Ho corretto 6 errori HTML, il `robots.txt`, la 404, il CSS (regole morte, `!important`, token, aree di tocco, focus) e una piccola cosa nel JS, e ho creato l'`.htaccess`. Gli screenshot prima/dopo coincidono (vedi F3): il design non è cambiato. Restano 23 punti che richiedono una tua decisione (sezione D); i due che bloccano di più la pubblicazione sono **l'immagine OG che non esiste** e **il dominio**.

**File modificati (8):** `index.html`, `bass-files/index.html`, `radio-ombra/index.html`, `mountain-waves/index.html`, `404.html`, `css/style.css`, `js/main.js`, `robots.txt`.
**File creati (2):** `.htaccess`, `docs/AUDIT-TECNICO.md`.
Nessun file cancellato, spostato o rinominato. Per tornare indietro su un file: copialo da `../backup-audit-20261013/`.

**Strumenti usati (installati in una cartella temporanea, non nel progetto):** Lighthouse 13.5 (mobile, Chrome headless), Nu Html Checker `vnu` 26.10 (il validator W3C, in locale), Chrome headless via puppeteer per console, rete, DOM e screenshot, Apache 2.4 di macOS per provare l'`.htaccess`, `docs/validate-jsonld.py` del progetto.

---

## A. Tabella per pagina

Title, description e alt già presenti non sono stati modificati. Le proposte sono solo proposte.

| Pagina | Title (caratteri) | Description | H1 | H2 | Canonical | Robots | Open Graph / Twitter | Alt mancanti | Proposta | Esito |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | New Waves — Collettivo bass music a Venezia e Pordenone (55) | 155 car. | NEW WAVES. | 6 | autoreferenziale | indicizzabile | completo; **immagine assente** | 0 su 3 (decorative, `alt=""`) | Title e description: nessuna. H1: contiene solo il brand, il tema sta nell'etichetta sopra. Proposta: aggiungere al `<h1>` un testo nascosto alla vista, es. "— collettivo bass music a Venezia e Pordenone" | OK |
| `/chi-siamo/` | Chi siamo — i 5 membri di New Waves Underground Movement (56) | 142 car. | Chi siamo. | 4 | autoreferenziale | indicizzabile | completo; **immagine assente** | 0 su 6 | Nessuna | OK |
| `/bass-files/` | Bass Files — interviste e dj set sulla scena italiana (53) | 142 car. | Bass Files. | 4 | autoreferenziale | indicizzabile | completo; **immagine assente** | 0 su 2 | Title senza brand e senza genere. Proposta: "Bass Files — interviste e dj set drum & bass \| New Waves" (56) | OK |
| `/radio-ombra/` | Radio Ombra — la residenza di New Waves a Venezia (49) | 145 car. | Radio Ombra. | 4 | autoreferenziale | indicizzabile | completo; **immagine assente** | 0 su 1 | Facoltativa: "Radio Ombra — residenza bass music di New Waves a Venezia" (57) | OK |
| `/contatti/` | Contatti e booking — New Waves Underground Movement (51) | 145 car. | Contatti. | 3 | autoreferenziale | indicizzabile | completo; **immagine assente** | 0 su 1 | H2 molto corti ("Scrivici.", "Rider.", "Social."). Proposta: "Booking via mail.", "Rider tecnico.", "Instagram." | OK |
| `/eventi/` | Prossime date ed eventi — New Waves Underground Movement (56) | 119 car. (corta) | Eventi. | 4 | autoreferenziale | `noindex, follow` | completo; **immagine assente** | 0 su 1 | Solo quando la pubblichi, description più lunga: "Prossime date e archivio delle serate di New Waves Underground Movement: jungle, drum & bass e dubstep tra Venezia e Pordenone, con locale e città di ogni data." (160) | OK (non pubblicata) |
| `/mountain-waves/` | Mountain Waves Fest — in arrivo (31) | 76 car. | MOUNTAIN WAVES. | 1 | autoreferenziale | `noindex, follow` | completo dopo la correzione (mancava `og:site_name`); **immagine assente** | 0 su 1 | Nessuna finché è uno stub | OK (stub) |
| `404.html` | 404 — Pagina non trovata · New Waves (36) | **NUOVO – da approvare:** "Pagina non trovata sul sito di New Waves Underground Movement. Torna alla home." (79) | NON QUI. | 0 | assente (corretto per una 404) | `noindex` | assente (non serve) | 0 su 0 | Aggiungere header e footer del sito: vedi D4 | OK con riserva |

Note alla tabella:
- Tutti i title sono unici, come le description. `og:title`, `og:description` e `og:url` coincidono con title, description e canonical. `twitter:card` è `summary_large_image`; titolo, testo e immagine li prende dai tag OG.
- Un solo `<h1>` e un solo `<main>` per pagina. Gerarchia h1 → h2 → h3 senza salti, verificata anche sul DOM dopo l'esecuzione del JS (i titoli di set ed eventi sono `<h3>` sotto un `<h2>`). Nessun titolo usato solo per lo stile.
- Ogni `<img>` ha `alt`, `width` e `height`, comprese le miniature generate dal JS (640×360).

---

## B. Problemi corretti

### B1. Struttura e percorsi
- Nessuna correzione necessaria: 0 link interni rotti, 0 ancore mancanti, 0 risorse 404 tra CSS, JS, font, immagini e JSON (script che segue tutti i link di 8 pagine sul server locale). L'unico riferimento a un file inesistente è l'immagine OG (D2).

### B2. HTML
| Problema trovato | Correzione | Verifica |
|---|---|---|
| 6 errori del validator: `<a>` senza `href` con attributo `rel` (pulsanti "Tutti i set su YouTube", "Tutti gli episodi su YouTube", "Tutti i mix su SoundCloud" in Home, Bass Files, Radio Ombra) | Ai pulsanti YouTube ho messo l'`href` direttamente nell'HTML (stessi URL di `data/media.json`), con `target="_blank" rel="noopener"`. Al pulsante SoundCloud, che non ha URL, ho tolto `rel` | vnu: **0 errori** su 8 pagine (prima 6) |
| Senza JavaScript quei pulsanti non portavano da nessuna parte | Conseguenza della correzione sopra: ora i pulsanti YouTube funzionano anche senza JS e sono link leggibili dai crawler | Prova con JS disattivato |
| `mountain-waves/`: mancava `og:site_name`, presente nelle altre 6 pagine | Aggiunto | grep |
| `404.html`: nessuna description; nessun `<link rel="icon">`, quindi il browser cercava `/favicon.ico` e la console mostrava un errore 404 | Aggiunti description (nuova, da approvare), `theme-color`, favicon e preload del font dei titoli, con percorsi dalla root | Console pulita; Lighthouse best practice 96 → 100 |

Verificato e già a posto: doctype, `lang="it"`, charset e viewport su 8 pagine; landmark `header`, `nav`, `main`, `footer` e skip link su 7 pagine; nessun ID duplicato (anche dopo il JS); nessun tag non chiuso né attributo deprecato; tutti i link esterni con `rel="noopener"`; tutti i `mailto:` con oggetto; nessun "clicca qui".
**Header e footer:** confronto reale tra i file (tolti prefisso dei percorsi e `aria-current`): **identici in 7 pagine su 7**. `aria-current="page"` è sulla voce giusta in Home, Chi siamo, Bass Files, Radio Ombra, Contatti. Eventi e Mountain Waves non sono nel menu, quindi non hanno voce attiva. La 404 non ha header né footer (D4).

### B3. SEO
| Problema trovato | Correzione | Verifica |
|---|---|---|
| `robots.txt` bloccava `/eventi/` e `/mountain-waves/` con `Disallow`, e le stesse pagine hanno `noindex`. Le due cose insieme si annullano: se il crawler non può aprire la pagina non legge il `noindex`, e l'indirizzo può finire lo stesso nei risultati (senza descrizione), perché è linkato dalla Home e dal footer | Tolte le due righe `Disallow`. Le pagine restano fuori dall'indice grazie al `noindex` e fuori dalla sitemap | Lighthouse: `robots.txt` valido. **Nota:** questa correzione cambia una scelta scritta nel brief ("Eventi fuori da robots"). L'obiettivo resta lo stesso, non farle indicizzare. Se preferisci com'era, rimetti le due righe dal backup |

Verificato e già a posto: canonical autoreferenziale su 7 pagine; `sitemap.xml` con le sole 5 pagine indicizzabili e il segnaposto `DOMINIO.TLD`; `/mountain-waves/` e `/eventi/` in `noindex` e assenti dalla sitemap; 404 in `noindex`.

**Dati strutturati.** 5 blocchi statici (Home, Chi siamo, Bass Files, Radio Ombra, Contatti): sintassi valida e riferimenti `@id` risolti (`docs/validate-jsonld.py`: OK). Proprietà controllate a mano contro schema.org: tutte esistenti per il tipo usato. `MusicGroup` ha `member` (5 persone) e `sameAs`. `BreadcrumbList` è presente nelle 4 pagine interne indicizzabili (vedi D17). `MusicEvent` è generato dal JS solo da `data/events.json`, che oggi contiene 1 evento reale (17/10/2026, CS Rivolta): ho letto il blocco generato in Home ed Eventi, è JSON valido con `name`, `startDate` e `location` con indirizzo. Nessun dato inventato. Non misurato: Rich Results Test e Schema Markup Validator, che sono servizi online e vogliono un indirizzo pubblico.

### B4. Immagini
Nessuna correzione necessaria nell'HTML. Verificato: `alt` descrittivi su foto e illustrazione, `alt=""` sulle decorative; `width`/`height` coerenti con le dimensioni reali dei file; `loading="lazy"` su tutto ciò che sta sotto la prima schermata; `fetchpriority="high"` solo sull'immagine dell'hero, che è davvero l'elemento LCP della Home su mobile e desktop. Tutte le immagini servite sono WebP con nomi minuscoli e trattini. Nessuno slot foto vuoto: tutti e 5 i membri hanno la foto.

### B5. CSS (`css/style.css`)
**Selettori rimossi** (controllati su 8 pagine a 360 e 1366 px dopo l'esecuzione del JS, e cercati in `main.js` e nei JSON):
- `.wrap` — mai usato
- `.photo-slot span` — etichetta dei vecchi slot vuoti, non più presente
- `.event h3 a` — il JS non mette link nei titoli degli eventi
- `.bf-bg--grid` e `.bf-bg--grid span` — "variante B" dello sfondo, mai attivata
- `.bf-figure--bw .photo-slot img` — variante bianco e nero dell'illustrazione, mai attivata

**Dichiarazioni ridondanti rimosse:** `mix-blend-mode: normal` (valore predefinito) su `.hero__mark`; `font-weight: 500` ripetuto su `.btn`; le due regole `main > section` consecutive unite in una.

**Selettori senza corrispondenza ma tenuti**, perché attivati dal JS: `.site-nav.is-open`, `.facade iframe`, `.facade--playing`, `.facade--empty`, `.facade__empty`, `.event__flyer`, `.empty` (e figli), `.reveal`, `.is-hidden`.

| Problema trovato | Correzione |
|---|---|
| 3 `!important` evitabili: 2 su `.hero`, 1 su `.project__tag` | Tolti. `.hero` vince già su `main > section` per specificità; `.project__tag` è diventato `.project .project__tag`. Restano solo i 3 nel blocco `prefers-reduced-motion`, che sono necessari |
| 4 colori scritti a mano fuori dai token: `rgba(255,90,31,.12)`, `rgba(255,90,31,.1)`, `rgba(10,10,10,0)`, `#000` | Nuovi token `--c-accent-a12`, `--c-accent-a10`, `--c-bg-a0`, `--c-black`, con gli stessi valori |
| La variabile `--fs-display` per desktop era ridefinita nella sezione "Pagine" | Spostata nella sezione Tokens |
| I commenti dei token riportavano contrasti imprecisi (7,6 e 6,6) | Aggiornati ai valori calcolati (8,1 e 6,3) |
| Focus da tastiera sulle anteprime del carosello: il contorno arancione veniva tagliato sul lato sinistro | Contorno disegnato dentro il riquadro, visibile su 4 lati |
| Aree di tocco sotto i 44 px su mobile: logo (36), link con freccia (22), link Instagram in Contatti e "in arrivo" in Eventi (17), menu su tablet (35), footer (28) | Area cliccabile allargata senza cambiare l'aspetto: logo 44, link con freccia 50, link in Contatti 45, menu tablet 45. Footer portato a 36, il massimo senza sovrapporre le righe (vedi D6) |

Verificato e già a posto: font self-hosted in woff2 con `font-display: swap`; preload del solo Archivo; nessuna richiesta a Google Fonts; `prefers-reduced-motion` rispettato da CSS e JS; focus visibile su tutti i 25 elementi raggiungibili con Tab in Bass Files; ordine del file font → tokens → base → layout → componenti → pagine → utility.

**Contrasti calcolati (WCAG, soglia AA 4,5:1 per il testo, 3:1 per i bordi dei controlli):**

| Coppia | Rapporto | AA |
|---|---|---|
| Testo `#f2f0eb` su nero `#0a0a0a` | 17,4:1 | sì |
| Testo su `#141414` | 16,2:1 | sì |
| Grigio `#a8a59f` su nero | 8,1:1 | sì |
| Grigio `#a8a59f` su `#141414` | 7,5:1 | sì |
| Arancione `#ff5a1f` su nero (date, numeri, tag) | 6,3:1 | sì |
| Arancione su `#141414` | 5,9:1 | sì |
| Nero su arancione (bottoni) | 6,3:1 | sì |
| Bordo grigio dei bottoni ghost su nero | 8,1:1 | sì |
| Linee `#2a2a2a` su nero | 1,4:1 | sono separatori decorativi, non richiesto. Unico caso dubbio: il bordo tratteggiato del pulsante disattivato "link in arrivo", che però non è un controllo attivo |
| **Hero su mobile, misurato sui pixel reali dietro al testo** | vedi D5 | **no in due punti** |

**Dimensioni:** 25,3 KB (6,7 KB gzip, 5,9 KB brotli); prima 24,8 KB. È cresciuto di 0,5 KB: i token e le aree di tocco pesano più delle regole tolte.
**Stima del CSS critico:** al primo caricamento su mobile il browser usa tra il 13% (404) e il 45% (Bass Files) del foglio, cioè 3,4–11,2 KB non compressi (copertura misurata con Chrome; conta tutte le regole applicate alla pagina, quindi è un limite superiore del CSS della prima schermata).

### B6. JavaScript (`js/main.js`)
| Problema trovato | Correzione |
|---|---|
| Codice morto: `f.allow` assegnato due volte, la prima sovrascritta subito | Tolta la prima assegnazione |
| Se `media.json` non si caricava, il pulsante SoundCloud restava un finto link senza destinazione | In caso di errore diventa lo stesso riquadro "link in arrivo" del caso normale; i pulsanti YouTube restano attivi grazie all'`href` nell'HTML |

Verificato: **0 errori e 0 avvisi in console** su 8 pagine a 360 e 1366 px; nessuna dipendenza esterna; 11,96 KB (4,9 KB gzip), sotto i 15 KB; `fetch` con gestione dell'errore per media ed eventi.
**Facade:** al primo caricamento **0 richieste a domini terzi e 0 iframe** su tutte le pagine (registro di rete). Le miniature dei video sono file locali in `assets/img/media/`: **nessuna richiesta a `i.ytimg.com`**, quindi il punto privacy sulle miniature YouTube non si pone. Dopo il click l'iframe punta a `www.youtube-nocookie.com` (provato in Home e Bass Files); da quel momento YouTube carica le proprie risorse e può impostare cookie, come dice l'avviso già presente sotto i player.

### B7. Hostinger
Creato `.htaccess` (sezione G) e provato su Apache 2.4 in locale.

---

## C. Problemi NON corretti, con motivo

| Problema | Perché non l'ho corretto |
|---|---|
| 140 note del validator "trailing slash on void elements" (`<meta ... />`) | Sono note di stile, non errori. Toglierle significa toccare quasi ogni riga dell'`<head>` senza alcun effetto |
| CSS e JS non minificati (Lighthouse stima 6 KB + 4 KB) | Il progetto non ha build step per regola. La compressione del server riduce già il CSS del 73% e il JS del 59% |
| Foglio di stile che blocca il rendering (stima Lighthouse 280–730 ms) | Servirebbe mettere il CSS critico in linea in 8 file HTML da tenere allineati a mano. Le pagine sono già a 97–100 |
| CSS non usato per pagina (14–21 KB) | È un unico foglio per tutte le pagine: scelta di struttura, in cache dopo la prima visita |
| Spaziature in `rem` scritte direttamente, senza token | Sarebbe una riscrittura di tutto il foglio, con rischio di differenze visive e nessun beneficio per chi visita |
| Miniature video 640×360 più grandi del necessario su mobile (Lighthouse: fino a 170 KB risparmiabili in Bass Files, 87 KB in Radio Ombra) | Mancano gli originali e uno strumento per ricomprimere WebP: ricomprimere file già compressi peggiora la qualità. Si risolve rigenerandole a 480 px dagli originali |
| Nessuna versione AVIF | I WebP sono già leggeri; AVIF raddoppierebbe i file da gestire per pochi KB |
| Preload del solo Archivo, mentre l'elemento LCP delle pagine interne su mobile è un paragrafo in Inter Tight | La tua regola è "preload solo del font critico". Lo segnalo: è la causa principale dell'LCP di 2,5 s in Bass Files |
| CLS tra 0 e 0,007 a seconda della prova (Home, Radio Ombra) | È il cambio di font al caricamento, e succede anche sul codice originale (provato 3 volte sul backup: 0,002). Molto sotto la soglia di 0,1. Si azzererebbe con un font di riserva tarato (`size-adjust`), che richiede prove visive |
| `<img>` del flyer evento generato dal JS senza `width`/`height` | Nessun evento ha un flyer oggi e il CSS fissa già la proporzione 4:5, quindi non c'è salto di layout |
| Campo `status` in `events.json` non letto dal JS | Il JS decide "prossimo" o "passato" dalla data. Non è un errore, ma il campo è solo descrittivo |
| File originali in `assets/` con maiuscole e spazi (`IMMAGINE INSTAGRAM bass files.JPG`, `MRSN.jpg`, `Damnspark.jpeg`) | Non sono referenziati e non vanno caricati: rinominarli equivale a spostarli, cosa esclusa dai vincoli |
| `README.md`, `data/README.md` e l'elenco TODO di `CLAUDE.md` non aggiornati (parlano di font da fare, eventi vuoti, foto mancanti) | Sono documenti di lavoro, non vanno sul server |
| INP | Non misurabile in laboratorio. Come indicatore sostitutivo riporto il TBT: **0 ms su tutte le pagine** |
| Compressione brotli, redirect HTTPS reale, comportamento su LiteSpeed | Non verificabili in locale: vedi i test della sezione G |

---

## D. Da decidere

**Bloccanti per la pubblicazione**

1. **Dominio definitivo, e versione con o senza `www`.** Tutti gli indirizzi usano `DOMINIO.TLD` (elenco e comando nella sezione G). La scelta sul `www` deve essere la stessa in canonical, sitemap e `.htaccess`.
2. **Immagine OG 1200×630: non esiste.** Sette pagine dichiarano `assets/img/og/og-default.jpg`, ma la cartella `og/` è vuota: oggi una condivisione su WhatsApp, Instagram o Facebook esce senza immagine. Quando c'è, aggiungo anche `og:image:width`, `og:image:height` e `og:image:alt`.
3. **Favicon definitiva.** Quella attuale è un segnaposto (tre barre). Mancano anche `favicon.ico` e l'icona per iOS.

**Design e testi**

4. **404 con header e footer.** Oggi la 404 ha solo "Torna alla home". Per avere link utili propongo di aggiungere header e footer identici alle altre pagine, con percorsi dalla root. Cambia la struttura della pagina, quindi non l'ho fatto.
5. **Contrasto nell'hero su mobile (360 px).** Misurato sui pixel reali dietro al testo, nel punto peggiore: l'etichetta grigia "Collettivo bass music — Venezia / Pordenone" passa sopra il marchio e scende a **3,5:1**; il sottotitolo "Jungle — Drum & Bass — Dubstep" sopra la striscia più chiara della texture scende a **3,6:1** (4,6:1 sul 95% dell'area). Soglia AA: 4,5:1. Su desktop l'etichetta non tocca il marchio. Proposte, non applicate: etichetta dell'hero in bianco caldo `#f2f0eb` solo su mobile (7,6:1 calcolato sullo stesso punto), oppure marchio più tenue o più in alto; per il sottotitolo una sfumatura scura più alta alla base dell'hero.
6. **Link del footer su mobile.** Area di tocco portata da 28 a 36 px senza cambiare l'aspetto. Per arrivare a 44 servono 8 px in più tra una riga e l'altra.
7. **Link `@mountainwavesfest` nella pagina Mountain Waves.** Alto 20 px e con il solo nome utente come testo. Proposta: "Instagram @mountainwavesfest" con lo stile dei link con freccia.
8. **Titoli e H1:** le proposte della tabella A (H1 della Home, title di Bass Files e Radio Ombra, H2 di Contatti, description di Eventi, description nuova della 404).
9. **"Marsiattack" o "MRSN".** L'introduzione in Home e Chi siamo dice "Djambe, Dema, Coce, Marsiattack e Damnspark"; schede, description e dati strutturati dicono "MRSN" ("già Marsiattack").
10. **Testo dello stato "nessuna data".** In `main.js` è segnato come provvisorio (`TODO: copy definitivo`). Diventa visibile in Home dal 18/10/2026, il giorno dopo l'unico evento in calendario.

**Contenuti e URL mancanti**

11. **Pagina Eventi.** È in `noindex` e fuori dal menu, ma ora un evento reale c'è. Decidi se pubblicarla (togliere `noindex`, aggiungerla a menu e sitemap) e se hai altre date da inserire.
12. **Canale SoundCloud.** URL vuoto in `data/media.json`: tre pulsanti mostrano "link in arrivo", e il testo di Bass Files dice che le puntate sono "sul canale SoundCloud di New Waves".
13. **Radio Ombra:** link al canale YouTube di Radio Ombra e giorno del mese della diretta (TODO nel codice). Oggi il link di riserva porta al canale di New Waves.
14. **Instagram di MRSN e Damnspark** (TODO nel codice).
15. **Associazione foto → nome dei membri:** nei documenti è ancora "da confermare".
16. **Miniature dei video.** Sono copie locali di copertine di canali di altri (Drum&Bass Italia, Radio Ombra): conferma di avere il loro consenso.

**SEO**

17. **Breadcrumb.** Le 4 pagine interne dichiarano un `BreadcrumbList` nei dati strutturati, ma in pagina non c'è un breadcrumb visibile (solo l'etichetta "New Waves — Chi siamo"). O si aggiunge un breadcrumb visibile, o si accetta così.
18. **`sameAs` del collettivo.** Manca il canale YouTube ufficiale. L'avevo aggiunto, ma il validatore del progetto accetta solo URL presenti in `docs/CONTENUTI.md`, dove non c'è: l'ho tolto. Se lo aggiungi a `CONTENUTI.md` lo rimetto. Due dubbi in più: gli Instagram di Mountain Waves Fest e di Bass Files sono profili di altre entità, non del collettivo; e a MRSN si potrebbe dare `alternateName: "Marsiattack"`.
19. **Contenuti leggibili senza JavaScript.** Set, episodi ed eventi arrivano dai JSON. Chi non esegue JS (i crawler di ChatGPT, Claude e Perplexity, e in parte Bing) vede solo il testo di riserva:

    | Dove | Cosa vede un crawler senza JS |
    |---|---|
    | Home, "Prossima data" | Solo un link all'Instagram. Nome, data e luogo dell'evento **mancano** |
    | Home, "Ascolta" | Link al canale YouTube. I titoli dei set **mancano** |
    | Bass Files, "Episodi" | Link alla playlist. I titoli degli episodi (Ardimann, Was A Be, Frame) **mancano** |
    | Radio Ombra, "Puntate" | Link al canale YouTube. I titoli delle puntate **mancano** |
    | Eventi, "Prossime date" | "Attiva JavaScript…" e un link mail. L'evento **manca** |
    | Eventi, "Archivio" | Niente |
    | Dati strutturati `MusicEvent` | Assenti (li crea il JS). Google esegue il JS e li vede |

    Proposta: un elenco HTML di link (titolo → YouTube) dentro ogni contenitore, che il JS sostituisce con le anteprime. Significa scrivere gli stessi dati due volte, nell'HTML e nel JSON.
20. **Sovrapposizioni tra pagine e link interni mancanti.**
    - Home e Chi siamo puntano entrambe a "collettivo bass music Venezia Pordenone" e i primi due paragrafi sono identici. Rischio basso (la Home è la pagina naturale per quella ricerca), ma un'apertura diversa in Chi siamo le distinguerebbe.
    - Il rider compare in Chi siamo e in Contatti; Contatti rimanda già al rider completo.
    - Chi siamo cita Bass Files, Radio Ombra e Mountain Waves Fest nel testo e nelle bio, senza link. Bass Files cita Djambe e Dema senza link alle loro schede. Chi siamo non linka la pagina Contatti (solo la mail).
21. **Crawler IA in `robots.txt`:** nessuna regola, quindi tutti ammessi. La scelta era già aperta nel report SEO precedente.

**Gestione**

22. **Cache lunga e file con lo stesso nome.** L'`.htaccess` dà 1 anno di cache a CSS, JS, font e immagini, come richiesto. Se poi modifichi `style.css`, `main.js` o sostituisci una foto senza cambiarle nome, chi ha già visitato il sito continua a vedere la versione vecchia. Soluzione: un numero di versione nei link (`style.css?v=2`), da cambiare a ogni modifica in 8 file. Dimmi se lo aggiungo ora, oppure se preferisci una cache più corta per CSS e JS.
23. **Soglie di peso delle immagini.** `assets/img/README.md`, citato nel brief e in un commento del CSS, **non esiste**: non ci sono limiti contro cui controllare. Pesi attuali dei file serviti: `damnspark.webp` 180 KB, `conduttori-1200.webp` 128 KB, `dema.webp` 107 KB, `conduttori-800.webp` 75 KB, `mrsn.webp` 69 KB; tutti gli altri sotto i 60 KB. Su mobile le foto dei membri arrivano nella versione da 480 px (9–35 KB). Se mi dai le soglie creo il file e segnalo chi le supera.

**Pagine privacy e cookie (compito separato).** I link vanno nel footer, dentro `<ul class="footer-links">`, come ultime due voci dopo "YouTube New Waves", in tutte e 7 le pagine (e nella 404 se le aggiungi il footer). L'avviso sotto i player ("Contenuti esterni: al click si carica il player…"), generato da `js/main.js`, potrà linkare la cookie policy.

---

## E. File da caricare e da escludere

Struttura verificata: una cartella per pagina con `index.html`, più `css/`, `js/`, `data/`, `assets/`. Nessuna cartella del tutto vuota: `assets/img/eventi/` e `assets/img/og/` contengono solo un `.gitkeep` (nessun flyer, nessuna immagine OG). La cartella `_da-assegnare` non esiste.

### Da caricare: 49 file, 1,45 MB
```
.htaccess
404.html
index.html
robots.txt
sitemap.xml
bass-files/index.html
chi-siamo/index.html
contatti/index.html
eventi/index.html
mountain-waves/index.html
radio-ombra/index.html
css/style.css
js/main.js
data/events.json
data/media.json
assets/fonts/archivo-var.woff2
assets/fonts/inter-tight-var.woff2
assets/fonts/jetbrains-mono-500.woff2
assets/icons/favicon.svg
assets/img/bass-files/conduttori-640.webp
assets/img/bass-files/conduttori-800.webp
assets/img/bass-files/conduttori-1200.webp
assets/img/brand/logo-mark-96.webp
assets/img/brand/logo-mark.webp
assets/img/brand/logo-mark.png          (usato solo come logo nei dati strutturati: serve)
assets/img/hero/hero-orange-800.webp
assets/img/hero/hero-orange-1400.webp
assets/img/hero/hero-orange.webp
assets/img/media/                        (10 file .webp, tutti)
assets/img/membri/                       (solo i 10 file .webp)
assets/img/partner/dnb-italia-logo.webp
```
Attenzione a `.htaccess`: inizia con un punto, quindi Finder e alcuni programmi FTP lo nascondono. Nel File Manager di Hostinger va attivata la visualizzazione dei file nascosti.

### Da NON caricare
| File | Motivo |
|---|---|
| `.git/`, `.gitignore`, i 4 `.gitkeep` | File di git |
| `.DS_Store` (4 file) | File di sistema di macOS |
| `docs/` (compreso questo report), `CLAUDE.md`, `README.md`, `data/README.md` | Documenti di lavoro |
| `assets/img/membri/MRSN.jpg` (7,5 MB) | Originale, non referenziato |
| `assets/img/bass-files/IMMAGINE INSTAGRAM bass files.JPG` (1,9 MB) | Originale, non referenziato |
| `assets/img/membri/Damnspark.jpeg` (330 KB) | Originale, non referenziato |
| `assets/img/partner/dnbita.png` (176 KB) | Originale, non referenziato |
| `assets/img/brand/logo-wordmark.png` (120 KB) | Non referenziato |

**File che si potrebbero eliminare dal progetto** (non l'ho fatto): i cinque originali qui sopra, se ne hai copia altrove, e i `.DS_Store`.

---

## F. Lighthouse mobile, prima e dopo

Server locale `python3 -m http.server`, senza compressione né cache. I punteggi sono Performance / Accessibilità / Best practice / SEO.

| Pagina | Prima | Dopo | LCP prima → dopo | CLS prima → dopo | TBT |
|---|---|---|---|---|---|
| Home | 99 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 1,9 s → 1,8 s | 0 → 0,002 | 0 ms |
| Chi siamo | 99 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 2,0 s → 2,0 s | 0 → 0 | 0 ms |
| Eventi | 100 / 100 / 100 / 66 | 100 / 100 / 100 / 66 | 1,7 s → 1,7 s | 0 → 0 | 0 ms |
| Bass Files | 97 / 100 / 100 / 100 | 97 / 100 / 100 / 100 | 2,5 s → 2,5 s | 0 → 0 | 0 ms |
| Radio Ombra | 99 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 2,1 s → 1,8 s | 0 → 0,007 | 0 ms |
| Contatti | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,8 s → 1,7 s | 0 → 0 | 0 ms |
| Mountain Waves | 99 / 100 / 100 / 66 | 99 / 100 / 100 / 66 | 1,8 s → 1,8 s | 0 → 0 | 0 ms |
| 404 | 99 / 100 / **96** / **54** | 100 / 100 / **100** / **63** | 1,6 s → 1,5 s | 0,004 → 0 | 0 ms |

Come leggere la tabella:
- Le correzioni erano di pulizia e conformità, non di velocità: i punteggi di performance non cambiano, e le differenze di 1 punto o di 0,1–0,3 s tra una prova e l'altra sono oscillazioni normali di Lighthouse. Il miglioramento misurabile è sulla 404.
- **SEO 66 su Eventi e Mountain Waves, 63 sulla 404:** l'unico controllo fallito è "la pagina è bloccata dall'indicizzazione", cioè il `noindex` voluto. Non è un problema.
- **INP** non è misurabile in laboratorio; il TBT, usato come indicatore sostitutivo, è 0 ms ovunque.

**Cause dei punti persi in performance (dopo):**
1. Il foglio di stile blocca il primo rendering (stima 430–730 ms a seconda della pagina).
2. Bass Files, LCP 2,5 s, al limite della soglia "buono": l'elemento LCP è il primo paragrafo, che aspetta il font del testo mentre la pagina scarica 272 KB di immagini (illustrazione e 4 miniature).
3. Immagini più grandi dello spazio in cui sono mostrate: Bass Files 170 KB, Radio Ombra 87 KB, Home 29 KB, Chi siamo 15 KB.
4. Solo sul server locale: nessuna compressione e nessuna cache.

**Prova con l'`.htaccess` attivo** (Apache 2.4 locale, gzip e cache, su una copia dei soli file da caricare). È un'indicazione, non il risultato di Hostinger:

| Pagina | Performance | LCP |
|---|---|---|
| Home | 100 | 1,7 s |
| Chi siamo | 100 | 1,7 s |
| Eventi | 100 | 1,6 s |
| Bass Files | 99 | 2,0 s |
| Radio Ombra | 100 | 1,7 s |
| Contatti | 100 | 1,5 s |
| Mountain Waves | 100 | 1,5 s |
| 404 | 100 | 1,4 s |

Con la compressione il peso della Home passa da 160 a 126 KB (HTML da 11,7 a 3,6 KB, CSS da 24,6 a 6,9 KB, JS da 11,9 a 5,2 KB). In questa prova il punteggio SEO non è attendibile e non lo riporto: Lighthouse non riusciva a scaricare `robots.txt` perché la mia simulazione di HTTPS non valeva per quella richiesta.

### F2. Mobile 360 px e desktop 1366 px
- **Scroll orizzontale:** assente su 8 pagine a entrambe le larghezze, e a 768 px sulle due pagine provate. Nessun elemento sporge oltre lo schermo.
- **Aree di tocco a 360 px:** tutte da 44 px in su, tranne i link del footer (36 px, D6), il link `@mountainwavesfest` (20 px, D7) e "Rider completo" in Contatti (15 px), che è un link dentro una frase.
- **Menu:** voci alte 79 px nel menu mobile aperto; 45 px di area di tocco a 768 px.

### F3. Controllo che il design non sia cambiato
Screenshot a pagina intera di 8 pagine a 360 e 1366 px, prima e dopo, confrontati pixel per pixel: 14 su 16 identici. Nelle altre due le differenze non sono visibili: 2 pixel su 7,7 milioni nella Home desktop, nessun pixel oltre la soglia di rumore in Chi siamo mobile.

---

## G. Hostinger: `.htaccess` e segnaposto del dominio

### Cosa fa ogni riga
| Righe | Cosa fa |
|---|---|
| `DirectoryIndex index.html` | Aprendo `/chi-siamo/` il server risponde con `chi-siamo/index.html` |
| `Options -Indexes` | Una cartella senza `index.html` (es. `/assets/img/`) non mostra l'elenco dei file |
| `ErrorDocument 404 /404.html` | Per un indirizzo inesistente mostra la 404 del sito, con codice 404 |
| `AddDefaultCharset utf-8` | Dichiara la codifica, così le lettere accentate sono sempre corrette |
| `RedirectMatch 404 "/\.(?!well-known/)"` (in `mod_alias`) | Risponde 404 a qualsiasi file o cartella che inizia con un punto (`.git`, `.DS_Store`, lo stesso `.htaccess`), nel caso finissero sul server. Lascia passare `/.well-known/`, usata per il certificato SSL |
| `RewriteEngine On` | Accende il modulo dei redirect |
| `RewriteCond %{HTTPS} !=on` | Condizione: la richiesta è arrivata in HTTP |
| `RewriteCond %{HTTP:X-Forwarded-Proto} !https` | Seconda condizione: non è già HTTPS a monte. Evita un giro infinito di redirect se davanti al sito c'è un proxy o una CDN |
| `RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]` | Redirect permanente (301) allo stesso indirizzo in HTTPS |
| Le due righe commentate con `DOMINIO.TLD` | Redirect da `www` alla versione senza `www`. Sono disattivate: si attivano dopo la decisione D1 |
| `AddType ...` (in `mod_mime`) | Dichiara il tipo corretto per woff2, webp, svg, json, xml. Di solito il server li conosce già; è una sicurezza |
| `AddOutputFilterByType BROTLI_COMPRESS ...` (in `mod_brotli`) | Comprime con brotli HTML, CSS, JS, JSON, SVG, XML e testo, se il modulo è attivo |
| `AddOutputFilterByType DEFLATE ...` (in `mod_deflate`) | Lo stesso con gzip, se brotli non c'è. Font woff2 e immagini WebP sono esclusi: sono già compressi |
| `ExpiresActive On` e `ExpiresDefault "access plus 1 hour"` | Attiva le scadenze di cache; un'ora per i tipi non elencati |
| `ExpiresByType text/html` e `application/json` a 0 secondi | Pagine e dati (`events.json`, `media.json`) vengono sempre ricontrollati: una data nuova si vede subito |
| `ExpiresByType` a 1 ora per xml e testo | `sitemap.xml` e `robots.txt` |
| `ExpiresByType` a 1 anno per CSS, JS, woff2, webp, png, jpeg, svg | Cache lunga (vedi D22) |
| `Header set Cache-Control "no-cache"` per `.html` e `.json` | Stessa regola scritta con l'intestazione moderna: il browser tiene la copia ma chiede sempre al server se è cambiata |
| `Header set Cache-Control "public, max-age=31536000"` per i file statici | Un anno, anche per le cache intermedie |
| `Header append Vary Accept-Encoding` | Dice alle cache intermedie che esistono una versione compressa e una no |

Ogni blocco che dipende da un modulo è dentro `<IfModule>`: se il modulo manca, quel blocco viene ignorato e il sito funziona lo stesso.

### Già provato in locale (Apache 2.4.62)
- HTTP → 301 verso HTTPS.
- Indirizzo inesistente → codice 404 con la pagina `404.html`, che carica il CSS dalla root.
- `/.htaccess`, `/.DS_Store`, `/.git/config` → 404; `/.well-known/` raggiungibile.
- HTML e JSON con `Cache-Control: no-cache`; CSS, JS, font, immagini con `max-age=31536000`; gzip attivo su HTML, CSS, JS, JSON, SVG, XML.
- Il redirect `www` → senza `www`, attivato solo sulla copia di prova: funziona.

### Da provare dopo il caricamento (non verificabile in locale)
1. `http://dominio` → un solo redirect 301 a `https://dominio`. Attiva prima il certificato SSL dal pannello Hostinger.
2. `https://www.dominio` e `https://dominio`: una delle due deve reindirizzare all'altra (D1).
3. `https://dominio/chi-siamo` senza barra finale → redirect a `/chi-siamo/` restando in HTTPS.
4. Un indirizzo a caso → pagina 404 con stile, e codice **404** (non 200) negli strumenti del browser.
5. `https://dominio/assets/img/` → nessun elenco di file.
6. Scheda Rete del browser: `content-encoding: br` oppure `gzip` su HTML, CSS e JS. Hostinger usa LiteSpeed, che gestisce la compressione per conto suo: se vedi `gzip` e non `br`, va bene lo stesso.
7. Scheda Rete: `cache-control: no-cache` su `data/events.json`. Prova pratica: cambia una data, ricarica, deve comparire subito.
8. Se il sito risponde con errore 500 appena caricato l'`.htaccess`, una direttiva non è ammessa dal piano: rinomina il file e ricaricalo aggiungendo un blocco alla volta.
9. Lighthouse sull'indirizzo pubblico, Rich Results Test sulla Home, e gli altri controlli del punto 3 di `docs/SEO-GEO-REPORT.md`.
10. La 404 usa percorsi dalla root: funziona solo se il sito sta nella cartella principale del dominio (`public_html`), non in una sottocartella.

### Tutti i punti dove compare `DOMINIO.TLD`: 127 occorrenze in 10 file
| File | Occorrenze | Righe | Cosa sono |
|---|---|---|---|
| `index.html` | 19 | 10, 17, 18, 29–100 | canonical, `og:url`, `og:image`, dati strutturati |
| `chi-siamo/index.html` | 40 | 10, 17, 18, 29–153 | come sopra |
| `bass-files/index.html` | 20 | 10, 17, 18, 29–91 | come sopra |
| `radio-ombra/index.html` | 18 | 10, 17, 18, 29–96 | come sopra |
| `contatti/index.html` | 15 | 10, 17, 18, 29–72 | come sopra |
| `eventi/index.html` | 3 | 11, 18, 19 | canonical, `og:url`, `og:image` |
| `mountain-waves/index.html` | 3 | 10, 17, 18 | canonical, `og:url`, `og:image` |
| `sitemap.xml` | 5 | 3–7 | i 5 indirizzi |
| `robots.txt` | 1 | 4 | indirizzo della sitemap |
| `.htaccess` | 3 | 24, 25, 26 | righe commentate del redirect `www` |

`404.html`, `css/`, `js/` e `data/` non contengono il segnaposto.

Sostituzione in un colpo solo, dalla cartella del sito (cambia `esempio.it` con il dominio, compreso `www.` se scegli quella versione):
```bash
grep -rl "DOMINIO.TLD" --exclude-dir=.git --exclude-dir=docs . | xargs sed -i '' 's/DOMINIO\.TLD/esempio.it/g'
python3 docs/validate-jsonld.py
```
Poi, se scegli la versione senza `www`, togli i `#` dalle righe 25 e 26 dell'`.htaccess`. Se scegli quella con `www`, quelle due righe vanno invertite: dimmelo e le preparo.
