# Report SEO e GEO — New Waves Underground Movement

Audit eseguito sui file locali. Modifiche **non committate**, da rivedere con `git diff`.
Dominio: **ancora `DOMINIO.TLD`** (canonical, og:url, sitemap, JSON-LD). Va sostituito in un colpo solo quando è definitivo.

---

## 1. Fatto

### Meta tag (title, description, Open Graph)
Titoli ~50-60 caratteri, description max 155, tutti unici. `og:title` e `og:description` ora identici a title e description. Aggiunto `og:site_name`.

| Pagina | Title (caratteri) | Description (caratteri) |
|---|---|---|
| `index.html` | New Waves — Collettivo bass music a Venezia e Pordenone (55) | 155 |
| `chi-siamo/index.html` | Chi siamo — i 5 membri di New Waves Underground Movement (56) | 142 |
| `bass-files/index.html` | Bass Files — interviste e dj set sulla scena italiana (53, invariato) | 142 |
| `radio-ombra/index.html` | Radio Ombra — la residenza di New Waves a Venezia (49, invariato) | 145 |
| `contatti/index.html` | Contatti e booking — New Waves Underground Movement (51) | 145 |
| `eventi/index.html` (noindex) | Prossime date ed eventi — New Waves Underground Movement (56) | 119 |
| `mountain-waves/index.html` | invariato (noindex) | invariato |

Le description riprendono solo fatti già presenti nei testi approvati. Le bio e le descrizioni di Bass Files e Radio Ombra **non sono state toccate**.

Verificato e già a posto: un solo `h1` per pagina, gerarchia h1→h2→h3 senza salti, `lang="it"`, canonical con barra finale coerente e senza parametri, `og:url` uguale al canonical, `twitter:card`, `og:locale`, `noindex` su Mountain Waves, Eventi e 404.

### Dati strutturati (JSON-LD statici, in `<head>`)
- **`index.html`**: `WebSite` + `MusicGroup` "New Waves Underground Movement" (nome, descrizione = frase della bio approvata, url, logo, generi, `areaServed` Venezia e Pordenone come aree geografiche, `sameAs` = 3 Instagram di CONTENUTI, `member` = 5 persone, `contactPoint` booking solo con la mail pubblica). Nessun telefono, nessun `LocalBusiness`.
- **`chi-siamo/index.html`**: `AboutPage`, `BreadcrumbList`, 5 `Person` collegati al gruppo (`memberOf`). Ruoli identici a quelli visibili. `sameAs` solo per Djambe, Dema e Coce (Instagram presenti nei documenti). "Lorenzo Demagistris" come `alternateName` di Dema (è già nella bio visibile). Foto dei membri come `image`.
- **`bass-files/index.html`**: `CreativeWorkSeries` "Bass Files" con descrizione, `creator` Djambe e Dema, `contributor` Drum And Bass Italia (solo nome), `sameAs` Instagram Bass Files, `BreadcrumbList`.
- **`radio-ombra/index.html`**: `CreativeWorkSeries` "New Waves a Radio Ombra" (la residenza), `creator` il gruppo, `contributor` `Organization` Radio Ombra con luogo Chet Bar (Venezia), `BreadcrumbList`.
- **`contatti/index.html`**: `ContactPage` + `MusicGroup` con `contactPoint` e `sameAs`, `BreadcrumbList`.
- **Eventi**: `js/main.js` genera `MusicEvent` **solo se `data/events.json` ha eventi futuri**, mai JSON-LD vuoto. Oggi c'è un evento reale (17/10/2026, CS Rivolta): lo schema viene generato sulla Home. Aggiunto `eventAttendanceMode: OfflineEventAttendanceMode`. Rimosso in precedenza `performer` (non è scritto che New Waves suoni quella data).
- **Mountain Waves e 404**: nessun JSON-LD (noindex).
- Ogni pagina interna contiene anche un nodo `WebSite` minimo, così i riferimenti `@id` sono risolti senza dipendere dalla Home.

**Scelte sui tipi**
- *Bass Files → `CreativeWorkSeries`*: è una serie di contenuti video (interviste + dj set). `RadioSeries`/`PodcastSeries` sono per serie audio con episodi `PodcastEpisode`; non descrivono bene un format video su YouTube.
- *Radio Ombra → `CreativeWorkSeries` con `Organization` collegata*: la pagina descrive la **residenza di New Waves** (un programma nostro), non la radio. Radio Ombra compare come organizzazione partner (`contributor`), senza URL perché il canale di Radio Ombra non è nei documenti.

### Accessibilità/immagini (rilevanti per SEO)
- Logo dell'header, immagine e logo dell'hero (decorativi): `alt=""` + `aria-hidden="true"` (header aggiornato in tutte le 7 pagine).
- Miniature dei video generate dal JS: `aria-hidden="true"`.
- Foto dei membri e illustrazione dei conduttori: già con `alt` descrittivo, `width`/`height`, WebP, `srcset`.
- `bass-files/index.html`: immagine dei conduttori ora `loading="lazy"` (su mobile è sotto la prima schermata); LCP mobile da 2,8 s a 2,5 s.
- Pulsante SoundCloud senza URL: ora è uno `<span>` e non un `<a>` senza `href` (Lighthouse segnalava "link non crawlable"). SEO Lighthouse da 92 a 100.

### Fallback senza JavaScript (GEO)
Aggiunti blocchi `<noscript>` con link reali: Home (data → Instagram New Waves; set → canale YouTube), Bass Files (→ playlist YouTube), Radio Ombra (→ canale YouTube New Waves). I crawler che non eseguono JS vedono almeno questi link.

### Link
- 7 pagine interne rispondono 200, `mailto` unico (`newwavesundergroundmovement@gmail.com`), nessuna ancora interna rotta.
- 41 link esterni: tutti con `target="_blank" rel="noopener"`. Instagram e YouTube rispondono 200 (Instagram risponde sempre 200: non prova che il profilo esista).

### File di supporto
- `docs/validate-jsonld.py`: controllo locale dei JSON-LD (sintassi, `@context`, `@id`, riferimenti, domini, `sameAs` ammessi, nomi presenti nel testo, nessun telefono). Esito attuale: **OK, 0 errori, 0 avvisi** su 5 pagine. Uso: `python3 docs/validate-jsonld.py`.
- `docs/SEO-GEO-REPORT.md`: questo file.

### Non toccati (già corretti o per tua regola)
`sitemap.xml` (home, chi-siamo, bass-files, radio-ombra, contatti; senza Mountain Waves e senza Eventi) e `robots.txt` (nessuna regola per crawler IA). `404.html` ha già `noindex`. Non esiste `.htaccess` nel progetto.

### Lighthouse (locale, 4 pagine)
Il preset mobile di Lighthouse emula 412×823, quello desktop 1350×940 (non esattamente 390 e 1280 px).

| Pagina | Mobile perf / a11y / SEO / BP | LCP | Desktop perf / a11y / SEO / BP |
|---|---|---|---|
| Home | 99 / 100 / 100 / 100 | 1,9 s | 100 / 100 / 100 / 100 |
| Chi siamo | 99 / 100 / 100 / 100 | 2,0 s | 100 / 100 / 100 / 100 |
| Bass Files | 97 / 100 / 100 / 100 | 2,5 s | 100 / 100 / 100 / 100 |
| Contatti | 99 / 100 / 100 / 100 | 1,8 s | 100 / 100 / 100 / 100 |

CLS ≈ 0 ovunque. Bass Files mobile è al limite del target (LCP 2,5 s).

---

## 2. Da decidere

1. **Dominio** (bloccante per il lancio): sostituire `DOMINIO.TLD` in canonical, og:url, og:image, sitemap, robots, JSON-LD. Il controllo `validate-jsonld.py` segnala se restano domini diversi.
2. **Immagine Open Graph 1200×630**: non esiste (`assets/img/og/` è vuota). Le pagine puntano a `…/assets/img/og/og-default.jpg`: finché non c'è, le anteprime social non mostrano immagine. Non l'ho inventata. Consiglio: marchio New Waves + texture dell'hero.
3. **Favicon**: esiste solo `assets/icons/favicon.svg` (segnaposto dello scheletro). Mancano un'icona PNG/`apple-touch-icon`.
4. **robots.txt e `noindex`** (Eventi, Mountain Waves): oggi sono sia `Disallow` sia `noindex`. Un crawler bloccato da `robots.txt` non legge il `noindex`, quindi l'URL potrebbe comparire comunque senza descrizione. Opzioni: (a) togliere i `Disallow` e tenere solo `noindex` (consigliato, è la pratica Google); (b) lasciare com'è (più prudente, meno pulito). Non l'ho cambiato perché la regola era voluta.
5. **Pagina Eventi**: resta non pubblicata (noindex, fuori da menu e sitemap). Con l'evento del 17/10 compare solo in Home. Quando c'è un calendario, rimetterla in menu e in sitemap e togliere `noindex`.
6. **Contenuto generato da JS**: eventi e video arrivano da `data/*.json` via `fetch`. Google esegue il JS, molti crawler IA no. Opzioni: (a) lasciare `noscript` + link (fatto); (b) un piccolo script facoltativo che scrive nell'HTML statico l'evento e i titoli dei video a ogni aggiornamento dei JSON (consigliato quando le date aumentano); (c) HTML statico scritto a mano (rischia di diventare vecchio). Non ho scritto date a mano nell'HTML per questo motivo.
7. **Crawler IA**: tabella qui sotto. Non ho aggiunto nessuna regola.
8. **`llms.txt`**: non creato. Non ci sono prove che i motori principali lo usino: oggi non vale lo sforzo.
9. **Logo nel JSON-LD**: `logo-mark.png` è bianco su trasparente; i motori lo mostrano su sfondo chiaro e quasi sparisce. Se serve per le ricerche, una versione su sfondo scuro o a colori.
10. **Nomi non uniformi** (da scegliere come "forma ufficiale"):
    - "New Waves" (brand breve) e "New Waves Underground Movement" (nome completo): ok, coerenti con CONTENUTI; nei JSON-LD il nome è il completo e il breve è `alternateName`.
    - "Drum And Bass Italia" (sito) contro "Drum&Bass Italia" (campo `artist` in `data/media.json`, copiato da YouTube).
    - "Mountain Waves" (menu, titoli, card) contro "Mountain Waves Fest" (bio, Instagram).
    - "Chet" (Home, card progetti, bio di Djambe e Dema) contro "Chet Bar" (Radio Ombra).
11. **Suggerimenti di testo** (non applicati: sono testi tuoi/approvati o miei):
    - Contatti: oggi apre con "Il booking passa dalla mail…". Per i motori IA sarebbe utile una frase autonoma, tipo: "Per il booking di New Waves Underground Movement, collettivo di bass music tra Venezia e Pordenone, scrivi a newwavesundergroundmovement@gmail.com."
    - Una breve sezione "Domande frequenti" (chi siamo, dove suoniamo, come si prenota, cosa serve in consolle) con markup `FAQPage`: possibile solo con testi che mi dai tu.
    - Anno di fondazione, se esiste: `foundingDate` nel JSON-LD.
    - Instagram di MRSN e Damnspark (e il cognome di Niko, se vuoi citarlo) per completare `sameAs`/`Person`.
    - Mountain Waves: quando la pagina è completa, `Event`/`Festival` con date e luogo reali.
12. **Redirect www / HTTPS**: dipende da dove sarà ospitato il sito (non c'è `.htaccess`). Proposta, **non applicata**:
    - Apache (`.htaccess`), con canonical senza `www`:
      ```apache
      RewriteEngine On
      RewriteCond %{HTTPS} off [OR]
      RewriteCond %{HTTP_HOST} ^www\. [NC]
      RewriteRule ^ https://dominio.tld%{REQUEST_URI} [L,R=301]
      ```
    - Se il canonical sceglie `www`, invertire l'host. Su GitHub Pages, Netlify o Cloudflare Pages `.htaccess` non funziona: HTTPS e redirect si impostano dal pannello dell'host. La 404 usa percorsi dalla root: va bene solo se il sito sta nella radice del dominio.

### Crawler IA (non configurati in `robots.txt`)

I nomi vanno ricontrollati nella documentazione di ciascun fornitore prima di scrivere le regole.

| Crawler | Di chi | A cosa serve | Se lo consenti | Se lo blocchi |
|---|---|---|---|---|
| GPTBot | OpenAI | Raccolta per addestrare modelli | Il sito può entrare nei dati di addestramento | Esclusione dall'addestramento |
| OAI-SearchBot | OpenAI | Indice di ricerca di ChatGPT | Il sito può essere citato nelle risposte con ricerca | Non compari nella ricerca di ChatGPT |
| ChatGPT-User | OpenAI | Pagine aperte su richiesta di un utente | Le risposte possono leggere il sito in tempo reale | Chi chiede a ChatGPT di leggerlo non ci riesce |
| ClaudeBot / Claude-SearchBot / Claude-User | Anthropic | Addestramento / ricerca / lettura su richiesta | Idem sopra, per Claude | Idem sopra |
| PerplexityBot / Perplexity-User | Perplexity | Indice per le risposte con fonti / lettura su richiesta | Citazioni con link al sito | Non compari tra le fonti |
| Google-Extended | Google | Solo controllo dell'uso per Gemini; **non** influisce su Ricerca Google | Il sito può servire a Gemini | Non influisce sul posizionamento in Google |
| Applebot-Extended | Apple | Controllo dell'uso per i modelli Apple | Può servire all'addestramento Apple | Esclusione, senza effetti su Siri/Spotlight |
| CCBot | Common Crawl | Archivio pubblico usato da molti modelli | Entra negli archivi aperti | Esclusione dagli archivi |

**Consiglio**: per un collettivo che vuole essere trovato, consentire i bot di **ricerca/citazione** (OAI-SearchBot, Claude-SearchBot, PerplexityBot) e decidere a parte sull'**addestramento** (GPTBot, ClaudeBot, Google-Extended, CCBot): bloccarli non penalizza il posizionamento in Google. Tutto resta consentito finché non aggiungi regole.

---

## 3. Da fare dopo la pubblicazione

1. Sostituire `DOMINIO.TLD` e rieseguire `python3 docs/validate-jsonld.py`.
2. **Google Search Console**: aggiungere la proprietà (meglio "Dominio"), inviare `https://<dominio>/sitemap.xml`, ispezionare la Home e le pagine interne con "Controlla URL" e richiedere l'indicizzazione.
3. **Bing Webmaster Tools**: importare la proprietà da Search Console e inviare la sitemap (Bing alimenta anche parte dei risultati degli assistenti IA).
4. Verificare i dati strutturati:
   - **Rich Results Test** (`https://search.google.com/test/rich-results`): incollare l'URL o il codice di una pagina; per Eventi (il `MusicEvent` generato dal JS) usare l'URL pubblicato, non il codice sorgente.
   - **Schema Markup Validator** (`https://validator.schema.org`): più completo sulla sintassi schema.org, non limitato ai tipi con rich results.
   - Nota: `CreativeWorkSeries`, `MusicGroup` e `Person` non producono rich results in Google, servono per le entità e i motori IA. Gli avvisi sui campi "consigliati" dell'evento (immagine, biglietti) sono normali.
5. Dopo 1-2 settimane: report "Pagine" in Search Console (indicizzate, escluse, `noindex` attese su Mountain Waves ed Eventi); cercare `site:<dominio>`.
6. Verificare i redirect: `http://`, `https://www.`, versione senza barra finale, e che la 404 si veda sul dominio.
7. Controllare le anteprime social con l'immagine OG (Facebook Sharing Debugger, LinkedIn Post Inspector) dopo averla creata.
8. Quando c'è il canale SoundCloud e il canale Radio Ombra: aggiungere gli URL a `data/media.json` e a `sameAs` dove opportuno.
9. Aggiornare il JSON-LD quando cambiano i ruoli o si aggiungono membri/eventi; ripetere il controllo con lo script.
