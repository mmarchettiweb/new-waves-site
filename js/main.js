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
  // Nessuna richiesta a terzi al render: l'anteprima è un'immagine self-hosted (campo "thumb" in media.json,
  // percorso dalla root) oppure un riquadro grafico. L'iframe viene creato solo al click.
  // estrae video e/o playlist da un URL YouTube (watch, youtu.be, playlist)
  const ytParse = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return { v: u.pathname.slice(1) };
      return { v: u.searchParams.get('v'), list: u.searchParams.get('list') };
    } catch { return {}; }
  };
  const ytEmbed = (url) => {
    const { v, list } = ytParse(url);
    const base = 'https://www.youtube-nocookie.com/embed/';
    if (v) return `${base}${v}?autoplay=1&rel=0${list ? `&list=${list}` : ''}`;
    return list ? `${base}videoseries?list=${list}&autoplay=1&rel=0` : null;
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  const PLATFORM = { youtube: 'YouTube', soundcloud: 'SoundCloud' };

  const buildFacade = (item) => {
    const wrap = el('div', 'media-item');
    const btn = el('button', 'facade');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Riproduci: ${item.title} (${PLATFORM[item.platform] || ''})`);
    if (item.thumb) {
      const img = new Image();
      img.src = BASE + item.thumb; img.alt = ''; img.loading = 'lazy'; img.width = 640; img.height = 360;
      btn.append(img);
    }
    const play = el('span', 'facade__play'); play.setAttribute('aria-hidden', 'true');
    btn.append(el('span', 'facade__plat', PLATFORM[item.platform] || ''), play);
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.title = item.title; f.allow = 'autoplay; encrypted-media'; f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.src = item.platform === 'youtube'
        ? ytEmbed(item.url)
        : `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&auto_play=true&visual=true`;
      btn.replaceChildren(f);
      f.focus();
    }, { once: true });
    const meta = el('div', 'media-meta');
    meta.append(el('h3', '', item.title), el('p', '', [item.artist, item.date].filter(Boolean).join(' — ')));
    wrap.append(btn, meta);
    return wrap;
  };

  // segnaposto onesto quando non ci sono contenuti con URL
  const buildEmpty = () => {
    const wrap = el('div', 'media-item');
    const box = el('div', 'facade facade--empty');
    box.append(el('span', 'facade__empty', 'Set in arrivo'));
    wrap.append(box);
    return wrap;
  };

  const mediaHosts = document.querySelectorAll('[data-media]');
  const channelLinks = document.querySelectorAll('[data-channel]');
  if (mediaHosts.length || channelLinks.length) {
    fetch(`${BASE}data/media.json`).then((r) => r.json()).then((data) => {
      mediaHosts.forEach((host) => {
        const tag = host.dataset.mediaTag;
        const limit = Number(host.dataset.mediaLimit) || Infinity;
        const items = data.items.filter((i) => i.url && (i.platform !== 'youtube' || ytEmbed(i.url)) && (!tag || (i.tags || []).includes(tag))).slice(0, limit);
        if (!items.length) { host.append(buildEmpty()); return; }
        items.forEach((i) => host.append(buildFacade(i)));
        host.insertAdjacentElement('afterend', el('p', 'media-note', 'Contenuti esterni: al click si carica il player di YouTube o SoundCloud, che può impostare cookie di terze parti.'));
      });
      // pulsanti verso i canali: se l'URL manca restano visibili ma disattivati (nessun link finto)
      channelLinks.forEach((a) => {
        const url = (data.channels || {})[a.dataset.channel];
        if (url) { a.href = url; return; }
        a.removeAttribute('href');
        a.classList.add('btn--off');
        a.setAttribute('aria-disabled', 'true');
        a.textContent = `${a.dataset.channelLabel} — link in arrivo`;
      });
    }).catch(() => mediaHosts.forEach((h) => h.append(buildEmpty())));
  }

  /* 3. EVENTI ------------------------------------------------------------ */
  const eventHosts = document.querySelectorAll('[data-events]');
  if (eventHosts.length) {
    const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmt = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const row = (e) => {
      const name = e.link ? `<a href="${esc(e.link)}" rel="noopener">${esc(e.title)}</a>` : esc(e.title);
      const flyer = e.flyer ? `<img class="event__flyer" src="${BASE}${esc(e.flyer)}" alt="Flyer: ${esc(e.title)}" loading="lazy" />` : '';
      return `<article class="event"><p class="event__date">${esc(fmt(e.date))}</p><div><h3>${name}</h3><p>${esc(e.venue)}${e.city ? ' — ' + esc(e.city) : ''}</p></div>${flyer}</article>`;
    };
    // JSON-LD schema.org/Event generato dalle date future (solo nella pagina Eventi)
    const jsonLd = (list) => {
      if (!list.length || document.body.dataset.page !== 'eventi') return;
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(list.map((e) => ({
        '@context': 'https://schema.org', '@type': 'MusicEvent', name: e.title, startDate: e.date,
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Place', name: e.venue, address: { '@type': 'PostalAddress', addressLocality: e.city || undefined } },
        performer: { '@type': 'MusicGroup', name: 'New Waves Underground Movement' },
        ...(e.link ? { url: e.link } : {}),
      })));
      document.head.append(s);
    };
    const empty = `<div class="empty"><strong>Nessuna data in programma</strong><p>Le prossime date compaiono qui. Vuoi portarci nella tua serata?</p><a class="btn" href="mailto:newwavesundergroundmovement@gmail.com?subject=Booking%20New%20Waves">Scrivici per il booking →</a></div>`; // TODO: copy definitivo
    fetch(`${BASE}data/events.json`).then((r) => r.json()).then(({ events }) => {
      const today = new Date().toISOString().slice(0, 10);
      const up = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
      const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
      jsonLd(up);
      eventHosts.forEach((h) => {
        const kind = h.dataset.events;
        const list = kind === 'archive' ? past : kind === 'next' ? up.slice(0, 1) : up;
        h.innerHTML = list.length ? list.map(row).join('') : (kind === 'archive' ? '<p class="media-note">Archivio in costruzione.</p>' : empty);
      });
    }).catch(() => eventHosts.forEach((h) => { h.innerHTML = empty; }));
  }

  /* 4. REVEAL ALLO SCROLL ------------------------------------------------ */
  // Solo per ciò che sta sotto il fold; senza JS o con prefers-reduced-motion tutto resta visibile.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.remove('is-hidden'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('main > section:not(.hero) > *').forEach((n) => {
      if (n.getBoundingClientRect().top < innerHeight) return;
      n.classList.add('reveal', 'is-hidden');
      io.observe(n);
    });
  }
})();
