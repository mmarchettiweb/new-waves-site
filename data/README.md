# data/
- `events.json` — eventi (nessun evento inserito: il Press Kit non contiene date).
  Campi: `date` (YYYY-MM-DD), `title`, `venue`, `city`, `status` (upcoming|past), `link`, `flyer` (percorso in assets/img/eventi/).
- `media.json` — set YouTube/SoundCloud mostrati nella sezione Ascolta. Aggiungere un oggetto in `items` per ogni contenuto.
Per l'anteprima locale serve un server (`python3 -m http.server`): `fetch()` non funziona da `file://`.
