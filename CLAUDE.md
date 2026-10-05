# New Waves — sito vetrina (HTML/CSS/JS statico)

Brief completo: `docs/PROMPT.md`. Contenuti reali: `docs/CONTENUTI.md`. Non inventare date, line-up, numeri o citazioni.

## Regole non negoziabili
- Statico: nessun framework, nessun build step obbligatorio, nessuna dipendenza esterna a runtime.
- Palette: nero `#0A0A0A`, bianco caldo `#F2F0EB`, arancione `#FF5A1F` (unico accento). Angoli netti, look underground. Token in `css/style.css` (`:root`).
- Header e footer identici in tutte le 7 pagine (sono duplicati nell'HTML: se modifichi uno, modifica tutti).
- Percorsi relativi (`../css/style.css` nelle sottocartelle). `404.html` usa percorsi dalla root.
- Contenuti dinamici solo da `data/events.json` e `data/media.json`.
- Embed YouTube/SoundCloud solo con facade (iframe al click, `youtube-nocookie.com`).
- Telefoni personali non pubblicati. Mountain Waves resta `noindex` e fuori da sitemap finché non è completa.
- Accessibilità WCAG 2.1 AA, mobile-first, `prefers-reduced-motion` rispettato.

## Come lavorare
- Anteprima locale: `python3 -m http.server 8000` (serve per `fetch` dei JSON).
- Prima di costruire il design: proponi sitemap, wireframe testuale, font e token e aspetta l'ok.
- Procedi una pagina alla volta: Home → Chi siamo → Eventi → Bass Files → Radio Ombra → Contatti → stub Mountain Waves.
- Dopo ogni pagina: screenshot mobile+desktop, console senza errori, Lighthouse.
- Lavora su branch + PR (`feat/...`) per la review CodeRabbit; non dichiarare una review che non è stata eseguita.
- TODO aperti: cerca `TODO` nel codice (URL YouTube/SoundCloud, dominio, OG image, favicon, font, foto MRSN/Damnspark, associazione foto-nome).
