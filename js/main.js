/* NEW WAVES — main.js
   Moduli: 1 Navigazione mobile · 2 Facade media (YouTube/SoundCloud) · 3 Eventi.
   Nessuna dipendenza. I dati vengono da /data/*.json (serve un server locale: fetch non funziona da file://). */
(() => {
  'use strict';

  // percorso base: le pagine in sottocartella stanno un livello sotto la root
  const BASE = document.body.dataset.page && document.body.dataset.page !== 'home' ? '../' : './';

  /* 1. NAVIGAZIONE MOBILE ------------------------------------------------ */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const set = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); toggle.focus(); } });
  }

  /* 2. FACADE MEDIA ------------------------------------------------------ */
  // L'iframe di terze parti viene creato solo al click.
  const ytId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1);
      return u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
    } catch { return null; }
  };

  const buildFacade = (item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'facade';
    btn.setAttribute('aria-label', `Riproduci: ${item.title}`);
    if (item.platform === 'youtube') {
      const id = ytId(item.url);
      if (id) {
        const img = new Image();
        img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; // TODO: valutare miniature self-hosted (privacy)
        img.alt = ''; img.loading = 'lazy'; img.width = 480; img.height = 360;
        btn.append(img);
      }
    }
    const play = document.createElement('span');
    play.className = 'facade__play'; play.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span');
    title.className = 'facade__title'; title.textContent = item.title;
    btn.append(play, title);
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.title = item.title; f.allow = 'autoplay; encrypted-media'; f.allowFullscreen = true;
      f.loading = 'lazy'; f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.src = item.platform === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${ytId(item.url)}?autoplay=1&rel=0`
        : `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&auto_play=true&visual=true`;
      btn.replaceChildren(f);
    }, { once: true });
    return btn;
  };

  const mediaHosts = document.querySelectorAll('[data-media]');
  if (mediaHosts.length) {
    fetch(`${BASE}data/media.json`).then((r) => r.json()).then((data) => {
      mediaHosts.forEach((host) => {
        const tag = host.dataset.mediaTag;
        const limit = Number(host.dataset.mediaLimit) || Infinity;
        const items = data.items.filter((i) => i.url && (!tag || (i.tags || []).includes(tag))).slice(0, limit);
        if (!items.length) { host.innerHTML = '<p class="media-note">Set in arrivo.</p>'; return; }
        items.forEach((i) => host.append(buildFacade(i)));
        host.insertAdjacentHTML('afterend', '<p class="media-note">Al click si carica il player di YouTube o SoundCloud, che può usare cookie di terze parti.</p>');
      });
    }).catch(() => mediaHosts.forEach((h) => { h.innerHTML = '<p class="media-note">Contenuti non disponibili.</p>'; }));
  }

  /* 3. EVENTI ------------------------------------------------------------ */
  const eventHosts = document.querySelectorAll('[data-events]');
  if (eventHosts.length) {
    const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const row = (e) => `<article class="event"><p class="event__date">${esc(e.date)}</p><div><h3>${esc(e.title)}</h3><p>${esc(e.venue)}${e.city ? ' — ' + esc(e.city) : ''}</p></div></article>`;
    fetch(`${BASE}data/events.json`).then((r) => r.json()).then(({ events }) => {
      const today = new Date().toISOString().slice(0, 10);
      const up = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
      const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
      eventHosts.forEach((h) => {
        const kind = h.dataset.events;
        const list = kind === 'archive' ? past : kind === 'next' ? up.slice(0, 1) : up;
        h.innerHTML = list.length ? list.map(row).join('')
          : '<p>Nessuna data in programma. <a href="mailto:newwavesundergroundmovement@gmail.com?subject=Booking%20New%20Waves">Scrivici per il booking</a>.</p>'; // TODO: copy definitivo
      });
    }).catch(() => {});
  }
})();
