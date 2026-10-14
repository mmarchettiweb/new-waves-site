# Report i18n — versione inglese

Modifiche solo locali, **nessuna azione git**. Dominio ancora `DOMINIO.TLD` (canonical, hreflang, og:url, sitemap, JSON-LD).
Testi inglesi da rivedere: `docs/EN-TESTI.md` (IT a sinistra, EN a destra). Ogni testo nuovo è marcato `<!-- DA REVISIONARE -->` nelle pagine EN.

## 1. Struttura finale

```
/                         IT home            /en/                    EN home
/chi-siamo/               IT                 /en/about/              EN
/eventi/        (noindex) IT                 /en/events/   (noindex) EN
/bass-files/              IT                 /en/bass-files/         EN
/radio-ombra/             IT                 /en/radio-ombra/        EN
/contatti/                IT                 /en/contact/            EN
/mountain-waves/ (noindex)IT                 /en/mountain-waves/ (noindex) EN
/404.html                 unica, percorsi dalla root (funziona anche da /en/…), con link a /en/
css/ js/ assets/ data/    condivisi, non duplicati
```

- Percorsi relativi: le pagine in `/en/` usano `../`, quelle in `/en/xxx/` usano `../../`. Il JS ricava la radice dal percorso del proprio `<script>`, quindi funziona a qualsiasi profondità.
- Header e footer sono duplicati nell'HTML (non caricati da JS), identici in tutte le pagine di una lingua; il footer e il menu EN puntano solo a pagine EN.

## 2. Pagine IT ↔ EN

| IT | EN | Indicizzata | In sitemap |
|---|---|---|---|
| `/` | `/en/` | sì | sì |
| `/chi-siamo/` | `/en/about/` | sì | sì |
| `/bass-files/` | `/en/bass-files/` | sì | sì |
| `/radio-ombra/` | `/en/radio-ombra/` | sì | sì |
| `/contatti/` | `/en/contact/` | sì | sì |
| `/eventi/` | `/en/events/` | no (noindex) | no |
| `/mountain-waves/` | `/en/mountain-waves/` | no (noindex) | no |

## 3. Cosa è stato fatto

**Selettore di lingua** — nel menu (header, e quindi anche nel menu mobile): "IT / EN" in micro-label monospace. La lingua attiva è `<span aria-current="true">` arancione, l'altra è un link alla **pagina gemella** con `lang`, `hreflang` e `aria-label` ("Switch language: English" / "Cambia lingua: Italiano"). Raggiungibile da tastiera. Nessun redirect automatico, nessun cookie o `localStorage`.

**SEO internazionale, per ogni pagina**
- `<html lang="it|en">`, canonical autoreferenziale.
- `hreflang` `it` / `en` / `x-default` (→ italiano) reciproci nell'HTML **e** nella `sitemap.xml` con `xhtml:link`.
- Title e description inglesi propri (non letterali), un solo `h1`, `og:locale` it_IT / en_GB con `og:locale:alternate`.
- JSON-LD: `inLanguage: en-GB`, testi in inglese, `BreadcrumbList` in EN, URL delle pagine EN; i `Person` e il gruppo mantengono lo stesso `@id` nelle due lingue (stessa entità).
- Mountain Waves ed Eventi restano `noindex` in entrambe le lingue e fuori dalla sitemap.

**JS (`js/main.js`, 13,2 KB)** — dizionario `{it, en}` scelto da `document.documentElement.lang`: stringhe dei player, "Set in arrivo", note sui contenuti esterni, stato vuoto degli eventi, etichette dei link evento, formato data (`17 OTT 2026` / `17 Oct 2026`), JSON-LD degli eventi con `inLanguage`. Il subject della mail resta `Booking New Waves`. Il fallback `<noscript>` esiste in EN.

**Dati** — `data/events.json`: aggiunto solo `city_en` ("Marghera (Venice)"); titoli e luoghi invariati. `data/media.json` invariato (titoli e autori non si traducono).

**CSS** — solo le regole del selettore di lingua (`.lang-switch`), nessun altro cambiamento di stile.

**File toccati**
- Nuovi: `en/index.html`, `en/about/`, `en/events/`, `en/bass-files/`, `en/radio-ombra/`, `en/contact/`, `en/mountain-waves/` (ognuno `index.html`), `docs/EN-TESTI.md`, `docs/I18N-REPORT.md`.
- Modificati: le 7 pagine IT (solo nel `<head>`: hreflang e `og:locale:alternate`; e nell'header: il selettore; i testi italiani non sono stati toccati), `404.html` (secondo pulsante "Back to the English site"), `sitemap.xml`, `js/main.js`, `css/style.css`, `data/events.json`, `docs/validate-jsonld.py` (ora controlla anche le pagine EN).
- `robots.txt`: invariato (resta com'è dopo la tua modifica, senza `Disallow`).

## 4. Verifica

| Controllo | Esito |
|---|---|
| Link interni e asset delle 14 pagine (36 URL distinti) | tutti 200 |
| `lang` di ogni pagina e canonical autoreferenziale | OK |
| hreflang reciproci (it, en, x-default) e `og:locale` | OK su tutte le coppie |
| Header e footer identici tra le pagine IT e tra le pagine EN (diff reale, normalizzando prefissi e pagina attiva) | OK |
| Stessa struttura h1/h2/h3 e stesso numero di `<a>`, `<img>`, `<section>`, `<article>`, `<li>` tra gemelle | OK |
| Un solo `h1`, description ≤ 155 caratteri, noindex uguale tra gemelle | OK |
| JSON-LD (`docs/validate-jsonld.py`) | OK, 10 blocchi in 10 pagine, 0 errori |
| Console senza errori, nessuna richiesta a terzi al primo caricamento, nessuno scroll orizzontale (390 e 1280 px) | OK su 14 pagine |
| 404: percorsi assoluti dalla root | OK |
| Menu mobile EN: selettore visibile, chiusura con Esc, Tab raggiunge il selettore | OK |

Non rieseguito Lighthouse sulle pagine EN (le pagine sono strutturalmente identiche alle IT, che erano a 96-100).

## 5. Testi da revisionare (priorità)

1. **Bio dei membri** (Home/About): fedeli all'italiano. Dove l'italiano è neutro per genere ("ha ideato", "nasce") ho usato il nome (Djambe, Dema, Coce, Damnspark) e per Coce "themself", per non attribuire pronomi. MRSN è al femminile come nel testo italiano.
2. **Slogan dell'hero e CTA**: "No hierarchy.", "Next date.", "Get in touch.", "A date at your place." (versione libera di "Una data nel tuo posto").
3. **"chiamate" → "gigs"**: nel testo del collettivo "numerose chiamate in tutto il territorio" è reso "plenty of gigs across the region".
4. **Ruoli**: "Public relations", "Audio and lighting tech", "Lighting", "Live visuals".
5. **Bass Files e Radio Ombra**: traduzioni fedeli; "selector" lasciato com'è (termine di scena).
6. **`Chet` / `Chet Bar`**: mantenuti come negli originali (in IT sono incoerenti, vedi `docs/SEO-GEO-REPORT.md`).

## 6. Problemi aperti

- **`DOMINIO.TLD`**: invariato, come richiesto. Va sostituito anche nei canonical/hreflang EN.
- **Immagine OG 1200×630**: ancora assente (vale per entrambe le lingue). Se vuoi una versione EN con testo, serve un file separato.
- **Pagine di privacy**: non esistono, quindi non ho aggiunto né il link alla versione italiana né la nota "Legally binding version: Italian" nel footer EN.
- **Manutenzione doppia**: le pagine EN sono file scritti a mano, come le IT: ogni modifica a un testo o all'header va fatta due volte. L'ho generato con uno script locale (non incluso nel repo, per rispettare "nessun build step"); posso metterlo in `docs/` se vuoi.
- **404 unica**: in italiano, con un pulsante verso `/en/`. Un host statico di solito serve una sola 404.
- **`CLAUDE.md`** parla ancora di "7 pagine": ora sono 14 (7 + 7).
- **Instagram di MRSN e Damnspark**, ruoli, foto: invariati rispetto all'italiano.

## 7. Da decidere

1. **Privacy**: creare le pagine privacy IT/EN? Solo allora aggiungo il link nel footer EN e la nota sulla versione vincolante.
2. **Slug**: `about`, `events`, `contact` (gli altri uguali all'italiano). Se vuoi alternative (`/en/chi-siamo/` non ha senso), dimmelo prima del lancio: cambiarli poi costa redirect.
3. **Eventi EN**: pubblicarla insieme a quella IT quando c'è un calendario; oggi è `noindex` ed esclusa dal menu e dalla sitemap.
4. **Tono**: il brief chiedeva non letterale ma non freddo; se le frasi dell'hero ti sembrano troppo libere o troppo asciutte, dimmi quali e le riscrivo in `docs/EN-TESTI.md` e nelle pagine.
5. **Selettore nel footer**: oggi sta solo nell'header/menu. Posso duplicarlo nel footer.
6. **`x-default`**: punta all'italiano (come richiesto). Se in futuro vuoi una pagina di scelta lingua, cambia solo i tre `hreflang="x-default"` e la sitemap.
