// Exact Mandelbrot geometry: bulb nuclei, bulb roots, child bulbs and mini-brots.
// Everything here is computed once and never depends on screen size.
import { content, Content } from './content';

export type C = [number, number];
export interface Bulb { N: C; root: C; r: number; period: number; phi: number; disc?: boolean; p?: number; q?: number }

const add = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const sub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]];
const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const sc = (k: number, a: C): C => [k * a[0], k * a[1]];
export const dist = (a: C, b: C) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Nucleus of a period-p component near c0 (Newton on f_c^p(0) = 0).
export function newton(c0: C, p: number): C {
  let c: C = [c0[0], c0[1]];
  for (let it = 0; it < 60; it++) {
    let zr = 0, zi = 0, dr = 0, di = 0;
    for (let k = 0; k < p; k++) {
      const ndr = 2 * (zr * dr - zi * di) + 1, ndi = 2 * (zr * di + zi * dr);
      const nzr = zr * zr - zi * zi + c[0], nzi = 2 * zr * zi + c[1];
      dr = ndr; di = ndi; zr = nzr; zi = nzi;
    }
    const den = dr * dr + di * di;
    if (!den) break;
    const sr = (zr * dr + zi * di) / den, si = (zi * dr - zr * di) / den;
    c = [c[0] - sr, c[1] - si];
    if (Math.abs(sr) + Math.abs(si) < 1e-15) break;
  }
  return c;
}

// Exact bulb root: solve f^p(z) = z and (f^p)'(z) = e^{2πit} for (z, c) with 2-D Newton.
function rootExact(cg: C, p: number, t: number, lim: number): { c: C; res: number } {
  const lam: C = [Math.cos(2 * Math.PI * t), Math.sin(2 * Math.PI * t)];
  let c: C = [cg[0], cg[1]], z: C = [0, 0];
  for (let i = 0; i < 3000; i++) { z = add(mul(z, z), c); if (z[0] * z[0] + z[1] * z[1] > 16) { z = [0, 0]; break; } }
  let res = Infinity;
  for (let it = 0; it < 80; it++) {
    let w = z, A: C = [1, 0], B: C = [0, 0], Cc: C = [0, 0], D: C = [0, 0];
    for (let k = 0; k < p; k++) {
      const nC = sc(2, add(mul(A, A), mul(w, Cc)));
      const nD = sc(2, add(mul(A, B), mul(w, D)));
      const nA = sc(2, mul(w, A));
      const nB = add(sc(2, mul(w, B)), [1, 0]);
      w = add(mul(w, w), c); A = nA; B = nB; Cc = nC; D = nD;
    }
    const F1 = sub(w, z), F2 = sub(A, lam), J11 = sub(A, [1, 0]);
    res = Math.hypot(F1[0], F1[1]) + Math.hypot(F2[0], F2[1]);
    const det = sub(mul(J11, D), mul(B, Cc));
    if (!(det[0] || det[1])) break;
    let dz = div(sub(mul(B, F2), mul(F1, D)), det);
    let dc = div(sub(mul(Cc, F1), mul(J11, F2)), det);
    const m = Math.hypot(dc[0], dc[1]);
    if (m > lim) { dz = sc(lim / m, dz); dc = sc(lim / m, dc); }
    z = add(z, dz); c = add(c, dc);
    if (!isFinite(c[0]) || !isFinite(z[0])) return { c: cg, res: Infinity };
    if (Math.hypot(dz[0], dz[1]) + Math.hypot(dc[0], dc[1]) < 1e-15) break;
  }
  return { c, res };
}

const bulbFrom = (N: C, root: C, period: number): Bulb => ({ N, root, period, r: dist(N, root), phi: Math.atan2(root[1] - N[1], root[0] - N[0]) });
const cardioidRoot = (p: number, q: number): C => { const a = 2 * Math.PI * p / q; return [Math.cos(a) / 2 - Math.cos(2 * a) / 4, Math.sin(a) / 2 - Math.sin(2 * a) / 4]; };

function cardioidBulb(p: number, q: number): Bulb {
  const root = cardioidRoot(p, q), a = 2 * Math.PI * p / q;
  let nx = (Math.cos(a) - Math.cos(2 * a)) / 2, ny = (Math.sin(a) - Math.sin(2 * a)) / 2;
  const L = Math.hypot(nx, ny), r = Math.sin(Math.PI * p / q) / (q * q);
  return bulbFrom(newton([root[0] + r * nx / L, root[1] + r * ny / L], q), root, q);
}

// Child bulb of `parent` at internal angle p/q.
function child(parent: Bulb, p: number, q: number): Bulb {
  const t = p / q;
  let root: C | null = null;
  if (parent.disc) {
    root = [-1 + 0.25 * Math.cos(2 * Math.PI * t), 0.25 * Math.sin(2 * Math.PI * t)];
  } else {
    for (const s of [1, -1]) {
      const a = parent.phi + s * 2 * Math.PI * t;
      const guess: C = [parent.N[0] + parent.r * Math.cos(a), parent.N[1] + parent.r * Math.sin(a)];
      const R = rootExact(guess, parent.period, t, parent.r * 0.2);
      if (R.res < 1e-8 && dist(R.c, guess) < parent.r * 0.45) { root = R.c; break; }
    }
    if (!root) { const a = parent.phi + 2 * Math.PI * t; root = [parent.N[0] + parent.r * Math.cos(a), parent.N[1] + parent.r * Math.sin(a)]; }
  }
  const ux = root[0] - parent.N[0], uy = root[1] - parent.N[1], L = Math.hypot(ux, uy);
  const re = parent.r * Math.sin(Math.PI * t) / (q * q);
  const guess: C = [root[0] + re * ux / L, root[1] + re * uy / L];
  let N = newton(guess, parent.period * q);
  if (!isFinite(N[0]) || dist(N, guess) > re * 1.2) N = guess;
  return { ...bulbFrom(N, root, parent.period * q), p, q };
}

// Child bulbs in order of size; the first N are used for N items.
const CHILD_TS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [4, 5], [3, 7], [4, 7], [2, 7], [5, 7], [3, 8], [5, 8], [1, 6], [5, 6]];
// Cardioid bulbs free for About facts (1/5 = Skills, 2/3 = Hackathons, 1/2 = Projects).
const FACT_TS: [number, number][] = [[1, 4], [3, 4], [4, 5], [2, 5], [3, 5], [1, 6], [5, 6], [2, 7], [5, 7]];
// Real-axis mini-brot nuclei on the antenna, biggest first.
const MINIBROTS: [number, number][] = [[-1.75488, 3], [-1.9408, 4], [-1.86078, 5], [-1.62541, 5], [-1.98542, 5], [-1.90728, 6], [-1.99637, 6], [-1.67406, 6]];
// Period-doubling bifurcation points on the real axis.
const BIF = [-0.75, -1.25, -1.3680989, -1.3940462, -1.3996312, -1.4008287, -1.4010853, -1.4011402];

function kidsOf<T>(parent: Bulb, items: T[], ts?: [number, number][] | null): (Bulb & T & { i: number })[] {
  const list = ts || CHILD_TS;
  return items.map((it, i) => ({ ...child(parent, list[i % list.length][0], list[i % list.length][1]), i, ...it }));
}

function sizeEst(c: C, p: number): C {
  let zr = 0, zi = 0, lr = 1, li = 0, br = 1, bi = 0;
  for (let i = 1; i < p; i++) {
    const nzr = zr * zr - zi * zi + c[0], nzi = 2 * zr * zi + c[1];
    zr = nzr; zi = nzi;
    const nlr = 2 * (zr * lr - zi * li), nli = 2 * (zr * li + zi * lr);
    lr = nlr; li = nli;
    const d = lr * lr + li * li;
    br += lr / d; bi -= li / d;
  }
  const l2r = lr * lr - li * li, l2i = 2 * lr * li;
  const dr = br * l2r - bi * l2i, di = br * l2i + bi * l2r, dd = dr * dr + di * di;
  return [dr / dd, -di / dd];
}

function build(d: Content) {
  const two: Bulb = { N: [-1, 0], root: [-0.75, 0], r: 0.25, period: 2, phi: 0, disc: true };
  const skill = bulbFrom(newton([0.3795, 0.3349], 5), cardioidRoot(1, 5), 5);
  const south = bulbFrom(newton([-0.1226, -0.7449], 3), cardioidRoot(2, 3), 3);
  const north = bulbFrom(newton([-0.1226, 0.7449], 3), cardioidRoot(1, 3), 3);
  let fi = 0;
  const facts = d.facts.map((f) => {
    const b = f.opens === 'education' ? north : (() => { const t = FACT_TS[fi++ % FACT_TS.length]; return cardioidBulb(t[0], t[1]); })();
    return { ...f, c: b.N };
  });
  const roles = d.roles.map((x, k) => {
    const a = BIF[k + 2], b = BIF[k + 3];
    return { ...x, k, c: [(a + b) / 2, 0] as C, r: Math.abs(a - b) / 2, period: 8 << k };
  });
  const chans = d.chans.map((x, j) => {
    const m = MINIBROTS[j % MINIBROTS.length], N = newton([m[0], 0], m[1]);
    return { ...x, j, p: m[1], N, size: sizeEst(N, m[1]) };
  });
  return {
    two, skill, south, north, facts, roles, chans,
    projects: kidsOf(two, d.projects),
    skills: kidsOf(skill, d.skills),
    hacks: kidsOf(south, d.hacks),
    eduKids: kidsOf(north, d.edu, d.edu.length === 2 ? [[1, 3], [2, 3]] : null),
  };
}

export type Geo = ReturnType<typeof build>;
let cached: Geo | null = null;
export function geo(): Geo { return cached || (cached = build(content)); }

// Home landmarks: anchor in the set, plus label elbow/end as offsets (stage px) from that anchor,
// so the labels travel with the set at any window size.
export const MARKS: { key: string; label: string; c: C; elbow: C | null; end: C; side: 'left' | 'right' }[] = [
  { key: 'projects', label: 'Projects', c: [-1.0, 0], elbow: [-57, -128], end: [-185, -128], side: 'left' },
  { key: 'skills', label: 'Skills', c: [0.3795, 0.3349], elbow: [59, -80], end: [120, -80], side: 'right' },
  { key: 'about', label: 'About', c: [-0.2, 0], elbow: null, end: [267, 0], side: 'right' },
  { key: 'hackathons', label: 'Hackathons', c: [-0.1226, -0.7449], elbow: [51, 71], end: [187, 71], side: 'right' },
  { key: 'experience', label: 'Experience', c: [-1.3968, 0], elbow: [-46, 232], end: [-176, 232], side: 'left' },
  { key: 'contact', label: 'Contact', c: [-1.75488, 0], elbow: [-55, 120], end: [-209, 120], side: 'left' },
];
