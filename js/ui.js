/* ═══════════════════════════════════════════════════════════════
   UI.JS — Nav behavior, scroll progress, mobile menu,
           back-to-top, active link tracking, contact form
   ═══════════════════════════════════════════════════════════════ */

/* ─── Scroll Progress Bar ─── */

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percent    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${percent}%`;
    bar.setAttribute('aria-valuenow', Math.round(percent));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── Navigation: scroll state + active section highlighting ─── */

function initNav() {
  const nav     = document.getElementById('nav');
  const links   = document.querySelectorAll('.nav-link[data-section]');
  if (!nav) return;

  /* Add .scrolled class after the hero */
  function updateScrolled() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* Highlight the nav link for the currently visible section */
  const sections = Array.from(links).map(link => {
    return document.getElementById(link.dataset.section);
  }).filter(Boolean);

  function updateActiveLink() {
    const scrollY      = window.scrollY;
    const windowHeight = window.innerHeight;
    let activeSection  = null;

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) {
        activeSection = section.id;
      }
    });

    links.forEach(link => {
      if (link.dataset.section === activeSection) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateScrolled();
    updateActiveLink();
  }, { passive: true });

  updateScrolled();
  updateActiveLink();
}

/* ─── Mobile Menu ─── */

function initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('navMobile');
  const close    = document.getElementById('navMobileClose');
  const backdrop = document.getElementById('navBackdrop');
  if (!toggle || !menu) return;

  const links = menu.querySelectorAll('.nav-mobile-link, .btn');
  let isOpen  = false;

  function open() {
    isOpen = true;
    menu.classList.add('open');
    backdrop.classList.add('visible');
    menu.removeAttribute('aria-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('open');
    backdrop.classList.remove('visible');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (isOpen) closeMenu(); else open();
  });

  close.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      return;
    }
    /* Focus trap: keep Tab navigation inside the open menu */
    if (e.key === 'Tab' && isOpen) {
      const focusable = Array.from(
        menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }
  });
}

/* ─── Back to Top Button ─── */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function update() {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── Contact Form ─── */

function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = form?.querySelector('.form-btn');
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, show) {
    input.style.borderColor = show ? 'rgba(239,68,68,0.7)' : '';
    input.style.boxShadow   = show ? '0 0 0 3px rgba(239,68,68,0.12)' : '';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.querySelector('#fname');
    const email   = form.querySelector('#femail');
    const message = form.querySelector('#fmessage');
    let valid     = true;

    [name, email, message].forEach(field => setError(field, false));

    if (!name.value.trim()) { setError(name, true); valid = false; }
    if (!validateEmail(email.value)) { setError(email, true); valid = false; }
    if (!message.value.trim()) { setError(message, true); valid = false; }
    if (!valid) return;

    /* Simulate async send */
    const originalText = btn.innerHTML;
    btn.disabled        = true;
    btn.innerHTML       = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      Sending…`;

    await new Promise(r => setTimeout(r, 1200));

    form.style.display = 'none';
    success.hidden     = false;
  });

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => setError(input, false));
  });
}

/* ─── Experience / Background Tabs ─── */

function initExpTabs() {
  const tabs   = document.querySelectorAll('.exp-tab');
  const panels = document.querySelectorAll('.exp-panel');
  let mapDone  = false;

  function activateTab(target) {
    tabs.forEach(t => {
      const on = t.dataset.tab === target;
      t.classList.toggle('exp-tab--active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(p => {
      p.classList.toggle('exp-panel--hidden', p.id !== `tab-${target}`);
    });
    if (target === 'research' && !mapDone && typeof L !== 'undefined') {
      mapDone = true;
      setTimeout(initResearchMap, 60);
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
}

function initResearchMap() {
  const el = document.getElementById('researchMap');
  if (!el) return;

  const dark   = document.documentElement.getAttribute('data-theme') === 'dark';
  const tiles  = dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const map = L.map('researchMap', { scrollWheelZoom: false, zoomControl: true })
    .setView([54, 159], 5);

  L.tileLayer(tiles, {
    attribution: '&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
    maxZoom: 10
  }).addTo(map);

  L.circleMarker([54, 159], {
    radius: 9, fillColor: '#00d4ff', color: 'rgba(0,212,255,0.35)',
    weight: 6, opacity: 1, fillOpacity: 0.9
  }).addTo(map).bindPopup('<b>Pacific Ocean Expedition</b><br>Near Kamchatka Peninsula');
}

/* ─── Research expand/collapse ─── */

function initResearchExpand() {
  const btn  = document.getElementById('researchExpandBtn');
  const body = document.getElementById('researchExpandBody');
  if (!btn || !body) return;

  btn.addEventListener('click', () => {
    const open = body.classList.toggle('research-expand--open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    const arrow = btn.querySelector('.research-expand-arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  });
}

/* ─── Initialize all UI ─── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNav();
  initMobileMenu();
  initBackToTop();
  initContactForm();
  initExpTabs();
  initResearchExpand();
});
