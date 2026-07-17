/* ═══════════════════════════════════════════════════════════════
   PLAYGROUND.JS — Interactive neural network classification demo
   2→8→1 network, tanh hidden, sigmoid output, SGD + BCE loss
   Backpropagation implemented from scratch, zero dependencies.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Utilities ─── */

function randn() {
  return Math.sqrt(-2 * Math.log(Math.random() + 1e-10)) *
         Math.cos(2 * Math.PI * Math.random());
}

/* ─── Neural Network Model ─── */

class NNModel {
  constructor() {
    this._init();
  }

  _init() {
    /* Xavier / He initialization for 2-input → 8-hidden → 1-output */
    const he2 = Math.sqrt(2 / 2);
    const he8 = Math.sqrt(2 / 8);
    this.w1 = Array.from({ length: 8 }, () => [randn() * he2, randn() * he2]);
    this.b1 = new Array(8).fill(0);
    this.w2 = Array.from({ length: 8 }, () => randn() * he8);
    this.b2 = 0;
    this.h  = new Array(8).fill(0);
    this.out = 0.5;
  }

  /* Forward pass — stores hidden activations for backprop */
  forward(x0, x1) {
    for (let i = 0; i < 8; i++) {
      this.h[i] = Math.tanh(this.w1[i][0] * x0 + this.w1[i][1] * x1 + this.b1[i]);
    }
    let z2 = this.b2;
    for (let i = 0; i < 8; i++) z2 += this.w2[i] * this.h[i];
    this.out = 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z2))));
    return this.out;
  }

  /* Predict without storing (used for canvas rendering) */
  predict(x0, x1) {
    let z2 = this.b2;
    for (let i = 0; i < 8; i++) {
      const h = Math.tanh(this.w1[i][0] * x0 + this.w1[i][1] * x1 + this.b1[i]);
      z2 += this.w2[i] * h;
    }
    return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z2))));
  }

  /* One full SGD pass over all points */
  trainStep(points, lr = 0.05) {
    if (!points.length) return 0;

    const n = points.length;
    const dw1 = Array.from({ length: 8 }, () => [0, 0]);
    const db1 = new Array(8).fill(0);
    const dw2 = new Array(8).fill(0);
    let   db2 = 0;
    let   totalLoss = 0;

    for (const { x0, x1, y } of points) {
      const yhat = this.forward(x0, x1);
      const eps  = 1e-7;
      totalLoss -= y * Math.log(yhat + eps) + (1 - y) * Math.log(1 - yhat + eps);

      const dOut = yhat - y; /* dL/d(sigmoid output) = yhat - y for BCE */

      for (let i = 0; i < 8; i++) {
        dw2[i] += dOut * this.h[i];
        const dHi = dOut * this.w2[i] * (1 - this.h[i] * this.h[i]); /* tanh' */
        dw1[i][0] += dHi * x0;
        dw1[i][1] += dHi * x1;
        db1[i]    += dHi;
      }
      db2 += dOut;
    }

    for (let i = 0; i < 8; i++) {
      this.w1[i][0] -= lr * dw1[i][0] / n;
      this.w1[i][1] -= lr * dw1[i][1] / n;
      this.b1[i]    -= lr * db1[i]    / n;
      this.w2[i]    -= lr * dw2[i]    / n;
    }
    this.b2 -= lr * db2 / n;

    return totalLoss / n;
  }
}

/* ─── Playground Controller ─── */

function initPlayground() {
  const canvas   = document.getElementById('playgroundCanvas');
  const hint     = document.getElementById('playgroundHint');
  const btnA     = document.getElementById('pgClassA');
  const btnB     = document.getElementById('pgClassB');
  const btnReset = document.getElementById('pgReset');
  const elEpoch  = document.getElementById('pgEpoch');
  const elLoss   = document.getElementById('pgLoss');
  const elPoints = document.getElementById('pgPoints');
  if (!canvas) return;

  /* Internal resolution — kept low for intentional pixel-art look */
  const W = 120;
  const H = 90;
  canvas.width  = W;
  canvas.height = H;

  const ctx     = canvas.getContext('2d');
  const imgData = ctx.createImageData(W, H);

  const model   = new NNModel();
  const points  = [];
  let activeClass = 0; /* 0 = Class A (amber), 1 = Class B (blue) */
  let epoch     = 0;
  let loss      = 0;
  let raf       = null;
  let hintShown = true;

  /* ─── Canvas rendering ─── */

  function renderBackground() {
    const data = imgData.data;
    for (let py = 0; py < H; py++) {
      const ny = 1 - (2 * py / (H - 1)); /* NN y: top=+1, bottom=-1 */
      for (let px = 0; px < W; px++) {
        const nx = (2 * px / (W - 1)) - 1;
        const p  = model.predict(nx, ny);
        const idx = (py * W + px) * 4;

        if (p >= 0.5) {
          /* Cyan (Class A) region */
          const a = (p - 0.5) * 2;
          data[idx]     = Math.round(10 - a * 7);  /* R: 10 → 3  */
          data[idx + 1] = Math.round(10 + a * 30); /* G: 10 → 40 */
          data[idx + 2] = Math.round(10 + a * 50); /* B: 10 → 60 */
        } else {
          /* Blue (Class B) region */
          const a = (0.5 - p) * 2;
          data[idx]     = Math.round(10 + a * 15); /* R: 10 → 25 */
          data[idx + 1] = Math.round(10 + a * 5);  /* G: 10 → 15 */
          data[idx + 2] = Math.round(10 + a * 50); /* B: 10 → 60 */
        }
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function renderPoints() {
    for (const pt of points) {
      const px = Math.round((pt.x0 + 1) / 2 * (W - 1));
      const py = Math.round((1 - pt.x1) / 2 * (H - 1));

      /* Outer ring */
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,10,10,0.85)';
      ctx.fill();

      /* Colored dot */
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.cls === 0 ? '#00d4ff' : '#5b8af5';
      ctx.fill();
    }
  }

  function render() {
    renderBackground();
    renderPoints();
  }

  /* ─── Training loop ─── */

  function loop() {
    if (points.length >= 2) {
      const stepsPerFrame = points.length < 10 ? 5 : 15;
      for (let i = 0; i < stepsPerFrame; i++) {
        loss = model.trainStep(points);
        epoch++;
      }
      updateStats();
    }
    render();
    raf = requestAnimationFrame(loop);
  }

  function updateStats() {
    if (elEpoch) elEpoch.textContent = epoch.toLocaleString();
    if (elLoss)  elLoss.textContent  = loss.toFixed(4);
    if (elPoints) elPoints.textContent = points.length;
  }

  /* ─── Click / touch interaction ─── */

  function canvasCoords(e) {
    const rect   = canvas.getBoundingClientRect();
    const src    = e.touches ? e.touches[0] : e;
    const cssX   = src.clientX - rect.left;
    const cssY   = src.clientY - rect.top;
    const px     = cssX * (W / rect.width);
    const py     = cssY * (H / rect.height);
    const nx     = (2 * px / (W - 1)) - 1;
    const ny     = 1 - (2 * py / (H - 1));
    return { x0: nx, x1: ny };
  }

  function placePoint(e) {
    e.preventDefault();
    const { x0, x1 } = canvasCoords(e);
    points.push({ x0, x1, cls: activeClass, y: activeClass === 0 ? 1 : 0 });

    if (hintShown && hint) {
      hint.classList.add('hidden');
      hintShown = false;
    }

    if (elPoints) elPoints.textContent = points.length;
  }

  canvas.addEventListener('click', placePoint);
  canvas.addEventListener('touchend', placePoint, { passive: false });

  /* ─── Class buttons ─── */

  function setClass(cls) {
    activeClass = cls;
    if (btnA) {
      btnA.classList.toggle('active', cls === 0);
      btnA.setAttribute('aria-pressed', cls === 0 ? 'true' : 'false');
    }
    if (btnB) {
      btnB.classList.toggle('active', cls === 1);
      btnB.setAttribute('aria-pressed', cls === 1 ? 'true' : 'false');
    }
  }

  btnA?.addEventListener('click', () => setClass(0));
  btnB?.addEventListener('click', () => setClass(1));

  /* ─── Reset ─── */

  function reset() {
    points.length = 0;
    epoch = 0;
    loss  = 0;
    model._init();
    if (hint) hint.classList.remove('hidden');
    hintShown = true;
    if (elEpoch)  elEpoch.textContent  = '—';
    if (elLoss)   elLoss.textContent   = '—';
    if (elPoints) elPoints.textContent = '0';
    render();
  }

  btnReset?.addEventListener('click', reset);

  /* ─── Start ─── */
  render();
  raf = requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', initPlayground);
