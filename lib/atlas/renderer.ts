// Mandelbrot renderer with a render cache.
// Every image is stored in complex-plane coordinates, so it stays valid across zooms and
// window resizes. Zoom animations only scale stored images; no fractal maths runs per frame.

export interface View { cx: number; cy: number; scale: number } // scale = complex units per stage px

interface Entry { canvas: HTMLCanvasElement; w: number; h: number; cx: number; cy: number; es: number }
interface Job { key: string; cx: number; cy: number; w: number; h: number; y: number; es: number; full: boolean; maxIt: number; img: ImageData | null; prio: boolean }

const STOPS = [[0, 9, 11, 22], [0.3, 22, 52, 128], [0.55, 64, 132, 232], [0.78, 242, 163, 58], [0.9, 255, 232, 190], [1, 9, 11, 22]];
let LUT: Uint8Array | null = null;
function lut() {
  if (LUT) return LUT;
  const n = 1024, out = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let k = 0;
    while (k < STOPS.length - 2 && t > STOPS[k + 1][0]) k++;
    const a = STOPS[k], b = STOPS[k + 1], f = (t - a[0]) / (b[0] - a[0]);
    out[i * 3] = a[1] + (b[1] - a[1]) * f; out[i * 3 + 1] = a[2] + (b[2] - a[2]) * f; out[i * 3 + 2] = a[3] + (b[3] - a[3]) * f;
  }
  return (LUT = out);
}

export class FractalRenderer {
  private cache: Record<string, Entry> = {};
  private fullOrder: string[] = [];
  private jobs: Job[] = [];
  private pumping = false;
  private dead = false;
  private homeKey = '';
  moving = false;
  // canvas pixels, and canvas pixels per stage px
  CW = 1; CH = 1; ppx = 1; homeScale = 3 / 760;
  onIdleFrame: (() => void) | null = null;

  constructor(private canvas: HTMLCanvasElement) {}

  destroy() { this.dead = true; }

  // cssW/cssH: canvas size on screen. k: CSS px per stage px. homeScale: the home view's scale.
  setSize(cssW: number, cssH: number, k: number, homeScale: number) {
    const dpr = Math.min(1.5, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    this.CW = Math.max(1, Math.round(cssW * dpr));
    this.CH = Math.max(1, Math.round(cssH * dpr));
    this.ppx = k * dpr;
    this.homeScale = homeScale;
    if (this.canvas.width !== this.CW) this.canvas.width = this.CW;
    if (this.canvas.height !== this.CH) this.canvas.height = this.CH;
  }

  private iters(scale: number) {
    return Math.max(160, Math.min(2400, Math.floor(160 + 130 * Math.log10(Math.max(1, this.homeScale / scale)))));
  }

  // Render width `w` canvas pixels covering the whole canvas for view v.
  schedule(v: View, frac: number, prio = false) {
    const w = Math.max(1, Math.round(this.CW * frac)), h = Math.max(1, Math.round(w * this.CH / this.CW));
    const es = (v.scale / this.ppx) * (this.CW / w);
    const key = v.cx.toPrecision(15) + ',' + v.cy.toPrecision(15) + ',' + es.toPrecision(12) + '@' + w + 'x' + h;
    if (this.cache[key]) return key;
    const queued = this.jobs.find((x) => x.key === key);
    if (queued) {
      if (prio && !queued.prio) { queued.prio = true; this.jobs.splice(this.jobs.indexOf(queued), 1); this.jobs.unshift(queued); }
      return key;
    }
    const job: Job = { key, cx: v.cx, cy: v.cy, w, h, y: 0, es, full: frac >= 1, maxIt: this.iters(v.scale), img: null, prio };
    if (prio) this.jobs.unshift(job); else this.jobs.push(job);
    this.pump();
    return key;
  }

  markHome(key: string) { this.homeKey = key; }

  // Escape-time rows with early exits for the interior: cardioid / 2-bulb test plus periodicity
  // checking, so points inside the set stop as soon as their orbit repeats.
  private rows(j: Job, n: number) {
    if (!j.img) j.img = new ImageData(j.w, j.h);
    const { w, h } = j, d = j.img.data, L = lut(), s = j.es, maxIt = j.maxIt;
    const end = Math.min(h, j.y + n);
    for (let py = j.y; py < end; py++) {
      const ci = j.cy - (py - h / 2) * s;
      for (let px = 0; px < w; px++) {
        const cr = j.cx + (px - w / 2) * s, o = (py * w + px) * 4;
        d[o + 3] = 255;
        const xq = cr - 0.25, q = xq * xq + ci * ci;
        if (q * (q + xq) <= 0.25 * ci * ci || (cr + 1) * (cr + 1) + ci * ci <= 0.0625) { d[o] = 5; d[o + 1] = 6; d[o + 2] = 10; continue; }
        let zr = 0, zi = 0, zr2 = 0, zi2 = 0, i = 0, pr = 0, pim = 0, per = 0, lim = 8, inside = false;
        while (i < maxIt && zr2 + zi2 < 256) {
          zi = 2 * zr * zi + ci; zr = zr2 - zi2 + cr; zr2 = zr * zr; zi2 = zi * zi; i++;
          if (Math.abs(zr - pr) < 1e-14 && Math.abs(zi - pim) < 1e-14) { inside = true; break; }
          if (++per === lim) { per = 0; lim *= 2; pr = zr; pim = zi; }
        }
        if (inside || i >= maxIt) { d[o] = 5; d[o + 1] = 6; d[o + 2] = 10; continue; }
        const nu = i + 1 - Math.log(Math.log(zr2 + zi2) / 2 / Math.LN2) / Math.LN2;
        const li = Math.floor(((Math.sqrt(Math.max(nu, 0)) * 0.14) % 1) * 1023) * 3;
        d[o] = L[li]; d[o + 1] = L[li + 1]; d[o + 2] = L[li + 2];
      }
    }
    j.y = end;
  }

  private pump() {
    if (this.pumping) return;
    this.pumping = true;
    const run = () => {
      if (this.dead) return;
      const t0 = performance.now();
      while (this.jobs.length && performance.now() - t0 < 10) {
        const j = this.jobs[0];
        if (this.moving && !j.prio) break;
        this.rows(j, 6);
        if (j.y >= j.h) {
          const cv = document.createElement('canvas');
          cv.width = j.w; cv.height = j.h;
          cv.getContext('2d')!.putImageData(j.img!, 0, 0);
          this.cache[j.key] = { canvas: cv, w: j.w, h: j.h, cx: j.cx, cy: j.cy, es: j.es };
          j.img = null;
          this.jobs.shift();
          if (j.full) {
            this.fullOrder.push(j.key);
            while (this.fullOrder.length > 10) { const old = this.fullOrder.shift()!; if (old !== this.homeKey) delete this.cache[old]; }
          }
          if (!this.moving && this.onIdleFrame) this.onIdleFrame();
        }
      }
      if (this.jobs.length) setTimeout(run, this.moving && !this.jobs[0].prio ? 60 : 0);
      else this.pumping = false;
    };
    setTimeout(run, 0);
  }

  kick() { this.pump(); }

  // Draw every stored image that overlaps the view, coarse to fine.
  compose(v: View) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    const sp = v.scale / this.ppx;
    ctx.fillStyle = '#0A0D1A';
    ctx.fillRect(0, 0, this.CW, this.CH);
    ctx.imageSmoothingEnabled = true;
    const list = Object.values(this.cache).sort((a, b) => b.es - a.es);
    for (const e of list) {
      const k = e.es / sp, dw = e.w * k, dh = e.h * k;
      if (dw < 16) continue;
      const dx = this.CW / 2 + (e.cx - v.cx) / sp - dw / 2, dy = this.CH / 2 - (e.cy - v.cy) / sp - dh / 2;
      if (dx > this.CW || dy > this.CH || dx + dw < 0 || dy + dh < 0) continue;
      ctx.drawImage(e.canvas, dx, dy, dw, dh);
    }
  }
}
