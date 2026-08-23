/* ═══════════════════════════════════════════════════════════════
   MAIN.JS — Theme toggle, smooth scroll, initialization
   ═══════════════════════════════════════════════════════════════ */

/* ─── Theme ─── */

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  /* Read persisted preference, fall back to dark */
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  toggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ─── Smooth Scroll ─── */

function initSmoothScroll() {
  /* All anchor links that point to an in-page id */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href   = link.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      /* Account for fixed nav height */
      const offset = 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Hero Load Animation ─── */

function initHeroLoad() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  /* Slight delay so the canvas has a moment to initialize */
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroContent.classList.add('loaded');
    }, 80);
  });
}

/* ─── Init ─── */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSmoothScroll();
  initHeroLoad();
});
