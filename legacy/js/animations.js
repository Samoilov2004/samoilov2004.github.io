/* ═══════════════════════════════════════════════════════════════
   ANIMATIONS.JS — Canvas particle system, scroll reveals,
                   skill bar animations, achievement counters
   ═══════════════════════════════════════════════════════════════ */

/* ─── Hero Canvas: Neural Network Particles ─── */

class NeuralCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.nodes  = [];
    this.mouse  = { x: null, y: null };
    this.raf    = null;
    this.w      = 0;
    this.h      = 0;
    this.dpr    = Math.min(window.devicePixelRatio, 2);

    this.config = {
      count:       55,
      connectDist: 155,
      speed:       0.35,
      nodeMin:     1.2,
      nodeMax:     2.8,
      mouseRadius: 180,
      mouseForce:  0.0015,
    };

    this._resizeHandler  = this._onResize.bind(this);
    this._mouseHandler   = this._onMouse.bind(this);
    this._leaveHandler   = this._onLeave.bind(this);

    this._init();
  }

  _init() {
    this._resize();
    this._buildNodes();
    this._bindEvents();
    this._loop();

    setTimeout(() => this.canvas.classList.add('ready'), 400);
  }

  _resize() {
    this.w = this.canvas.offsetWidth;
    this.h = this.canvas.offsetHeight;
    this.canvas.width  = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _buildNodes() {
    const { count, speed, nodeMin, nodeMax } = this.config;
    this.nodes = Array.from({ length: count }, () => {
      const r = nodeMin + Math.random() * (nodeMax - nodeMin);
      return {
        x:       Math.random() * this.w,
        y:       Math.random() * this.h,
        vx:      (Math.random() - 0.5) * speed,
        vy:      (Math.random() - 0.5) * speed,
        r,
        base:    r,
        active:  Math.random() > 0.82,
        phase:   Math.random() * Math.PI * 2,
      };
    });
  }

  _getNodeColor(isDark) {
    return isDark ? [0, 212, 255] : [0, 160, 200];
  }

  _getActiveColor(isDark) {
    return isDark ? [0, 240, 255] : [0, 180, 220];
  }

  _update(t) {
    const { mouseRadius, mouseForce } = this.config;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    this.nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -10) n.x = this.w + 10;
      else if (n.x > this.w + 10) n.x = -10;
      if (n.y < -10) n.y = this.h + 10;
      else if (n.y > this.h + 10) n.y = -10;

      if (this.mouse.x !== null) {
        const dx   = this.mouse.x - n.x;
        const dy   = this.mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseRadius) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          n.vx += dx * force;
          n.vy += dy * force;
          const maxSpeed = 1.2;
          const s = Math.hypot(n.vx, n.vy);
          if (s > maxSpeed) {
            n.vx = (n.vx / s) * maxSpeed;
            n.vy = (n.vy / s) * maxSpeed;
          }
        }
      }

      if (n.active) {
        n.r = n.base + Math.sin(t * 0.0015 + n.phase) * 0.6;
      }
    });
  }

  _draw(t) {
    const ctx     = this.ctx;
    const isDark  = document.documentElement.getAttribute('data-theme') !== 'light';
    const [nr, ng, nb] = this._getNodeColor(isDark);
    const [ar, ag, ab] = this._getActiveColor(isDark);
    const { connectDist } = this.config;

    ctx.clearRect(0, 0, this.w, this.h);

    const len = this.nodes.length;
    for (let i = 0; i < len; i++) {
      const a = this.nodes[i];
      for (let j = i + 1; j < len; j++) {
        const b    = this.nodes[j];
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < connectDist) {
          const alpha = (1 - dist / connectDist) * (isDark ? 0.13 : 0.09);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${nr},${ng},${nb},${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    this.nodes.forEach(n => {
      if (n.active) {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
        const gAlpha = isDark ? 0.18 : 0.1;
        glow.addColorStop(0, `rgba(${ar},${ag},${ab},${gAlpha})`);
        glow.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${isDark ? 0.75 : 0.55})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nr},${ng},${nb},${isDark ? 0.35 : 0.22})`;
        ctx.fill();
      }
    });
  }

  _loop(t = 0) {
    this._update(t);
    this._draw(t);
    this.raf = requestAnimationFrame(ts => this._loop(ts));
  }

  _bindEvents() {
    window.addEventListener('resize', this._resizeHandler, { passive: true });

    const hero = this.canvas.parentElement;
    hero.addEventListener('mousemove', this._mouseHandler, { passive: true });
    hero.addEventListener('mouseleave', this._leaveHandler, { passive: true });
  }

  _onResize() {
    this._resize();
    this._buildNodes();
  }

  _onMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _onLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._resizeHandler);
    const hero = this.canvas.parentElement;
    if (hero) {
      hero.removeEventListener('mousemove', this._mouseHandler);
      hero.removeEventListener('mouseleave', this._leaveHandler);
    }
  }
}

/* ─── Scroll Reveal (IntersectionObserver) ─── */

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  items.forEach(el => {
    if (!el.closest('.hero-content')) {
      observer.observe(el);
    }
  });
}

/* ─── Skill Bar Reveal ─── */

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  bars.forEach(bar => {
    const level = bar.dataset.level;
    if (level) bar.style.setProperty('--skill-level', level);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ─── Achievement Counter Animations ─── */

function initCounters() {
  const cards = document.querySelectorAll('.ach-number[data-target]');
  if (!cards.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const value    = target * eased;
      const display  = isFloat ? value.toFixed(1) : Math.round(value);
      el.textContent = `${prefix}${display}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  cards.forEach(el => observer.observe(el));
}

/* ─── Export init ─── */
function initAnimations() {
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    new NeuralCanvas(canvas);
  }

  initReveal();
  initSkillBars();
  initCounters();
}

document.addEventListener('DOMContentLoaded', initAnimations);
