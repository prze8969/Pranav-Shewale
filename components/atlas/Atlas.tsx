'use client';

import React from 'react';
import s from './atlas.module.css';
import { content, target, targetName, Target } from '@/lib/atlas/content';
import { geo, MARKS, C } from '@/lib/atlas/geometry';
import { FractalRenderer, View } from '@/lib/atlas/renderer';

type Level = 'home' | 'projects' | 'project' | 'skills' | 'skill' | 'hackathons' | 'about' | 'edu' | 'experience' | 'contact' | 'channel';
interface State {
  level: Level; proj: number; peek: number; skill: number; speek: number; hack: number; role: number; chan: number;
  moving: boolean; zoom: number; hover: { re: number; im: number } | null; copied: boolean; ready: boolean; rev: number;
}
interface Layout { mobile: boolean; k: number; ox: number; oy: number; SW: number; SH: number; W: number; H: number }
interface Leader { ax: number; ay: number; points: string; stroke: string; w: number; delay: number }
interface Tag { lx: number; ly: number; tf: string; align: string; talign: 'left' | 'right' | 'center'; delay: number; maxw: number; border: string; bg: string; size: number; pressed?: boolean; label: string; sub: string; go?: (() => void) | null }
interface Row { num?: string; title: string; sub: string; go?: () => void; on?: boolean; info?: boolean }
interface Slice { name: string; sub: string; aria: string; half: number; nr: number; sr: number; a0: number; a1: number; mid: number; flip: boolean; on: boolean; maxFs: number; d: string; bg: string; peek: () => void; open: () => void }

const AMBER = '#F2A33A';
const f1 = (n: number) => Math.round(n * 10) / 10;
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- layout: a 1280×760 stage scaled to fit on desktop, a narrow portrait stage on phones ----------
function computeLayout(w: number, h: number): Layout {
  const W = Math.max(300, Math.round(w)), H = Math.max(400, Math.round(h));
  const kD = Math.min(W / 1280, H / 760);
  if (kD < 0.62) {
    const SW = Math.max(360, Math.min(560, W)), k = W / SW;
    return { mobile: true, k, ox: 0, oy: 0, SW, SH: H / k, W, H };
  }
  // Desktop: UI scales with the smaller of the two ratios, and the stage stretches to fill the
  // whole window, so everything below is placed relative to its centre and edges.
  return { mobile: false, k: kD, ox: 0, oy: 0, SW: W / kD, SH: H / kD, W, H };
}

function lay(L: Layout) {
  const { SW, SH } = L, cx0 = SW / 2, cy0 = SH / 2;
  if (!L.mobile) {
    return {
      home: { at: [cx0, cy0] as C, c: [-0.75, 0] as C, scale: 3.0 / 760, sheetTop: 0 },
      projRing: { c: [cx0, cy0] as C, box: 700, R: 346, r: 262, rpx: 175, sheetTop: 0 },
      subRing: { c: [cx0 - 80, cy0 + 10] as C, box: 700, R: 340, r: 236, rpx: 140, sheetTop: 0 },
      // The detail disc keeps a fixed gap to the right-hand panel, which is pinned to the right edge.
      detail: { c: [SW - 860, cy0 + 10] as C, rpx: 150, size: 300, fs: 30, pad: 36, sheetTop: 0 },
      about: { at: [SW - 440, cy0] as C, scale: 0.0033, sheetTop: 0 },
      edu: { c: [cx0, cy0 + 40] as C, rpx: 150, cardsTop: 0 },
      role: { c: [SW - 900, cy0 + 10] as C, rpx: 150, sheetTop: 0 },
      contact: { y: cy0, width: SW - 280, sheetTop: 0 },
      chan: { at: [cx0, cy0] as C, k: 0.0019 },
    };
  }
  const R = Math.min((SW - 12) / 2, SH * 0.26), ringY = R + 66, ringTop = ringY + R + 10;
  const homeScale = 2.62 / SW, homeY = SH * 0.36;
  const aboutY = Math.min(SH * 0.5, 440);
  return {
    home: { at: [cx0, homeY] as C, c: [-0.76, 0] as C, scale: homeScale, sheetTop: homeY + 1.2 / homeScale + 14 },
    projRing: { c: [cx0, ringY] as C, box: 2 * R + 8, R, r: R * 0.78, rpx: R * 0.48, sheetTop: ringTop },
    subRing: { c: [cx0, ringY] as C, box: 2 * R + 8, R, r: R * 0.74, rpx: R * 0.46, sheetTop: ringTop },
    detail: { c: [cx0, 150] as C, rpx: 86, size: 172, fs: 20, pad: 20, sheetTop: 252 },
    about: { at: [cx0, aboutY] as C, scale: 0.0052, sheetTop: aboutY + 175 },
    edu: { c: [cx0, 190] as C, rpx: 78, cardsTop: 320 },
    role: { c: [cx0, 160] as C, rpx: 92, sheetTop: 270 },
    contact: { y: 250, width: SW - 48, sheetTop: 330 },
    chan: { at: [cx0, SH * 0.44] as C, k: 1 / (SW * 0.85) },
  };
}
type Lay = ReturnType<typeof lay>;

function buildViews(L: Layout, P: Lay) {
  const g = geo(), { SW, SH } = L;
  const vAt = (c: C, sx: number, sy: number, sc: number): View => ({ cx: c[0] + (SW / 2 - sx) * sc, cy: c[1] + (sy - SH / 2) * sc, scale: sc });
  const disc = (N: C, r: number, at: C, rpx: number) => vAt(N, at[0], at[1], r / rpx);
  const xs = g.chans.map((m) => m.N[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  return {
    home: vAt(P.home.c, P.home.at[0], P.home.at[1], P.home.scale),
    projects: disc(g.two.N, g.two.r, P.projRing.c, P.projRing.rpx),
    project: g.projects.map((b) => disc(b.N, b.r, P.detail.c, P.detail.rpx)),
    skills: disc(g.skill.N, g.skill.r, P.subRing.c, P.subRing.rpx),
    skill: g.skills.map((b) => disc(b.N, b.r, P.detail.c, P.detail.rpx)),
    hackathons: disc(g.south.N, g.south.r, P.subRing.c, P.subRing.rpx),
    about: vAt([-0.2, 0], P.about.at[0], P.about.at[1], P.about.scale),
    edu: disc(g.north.N, g.north.r, P.edu.c, P.edu.rpx),
    role: g.roles.map((r) => disc(r.c, r.r, P.role.c, P.role.rpx)),
    contact: vAt([(x0 + x1) / 2, 0], SW / 2, P.contact.y, Math.max(0.00008, (x1 - x0) / P.contact.width)),
    chan: g.chans.map((m) => vAt([m.N[0] - 0.2 * m.size[0], m.N[1] - 0.2 * m.size[1]], P.chan.at[0], P.chan.at[1], P.chan.k * Math.hypot(m.size[0], m.size[1]))),
  };
}
type Views = ReturnType<typeof buildViews>;

function annulus(R: number, r: number, a0: number, a1: number, c: number) {
  const p = (rad: number, a: number) => (c + rad * Math.cos(a)).toFixed(2) + ' ' + (c + rad * Math.sin(a)).toFixed(2);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(R, a0)} A ${R} ${R} 0 ${large} 1 ${p(R, a1)} L ${p(r, a1)} A ${r} ${r} 0 ${large} 0 ${p(r, a0)} Z`;
}
function arcD(R: number, a0: number, a1: number, c: number) {
  const p = (a: number) => (c + R * Math.cos(a)).toFixed(2) + ' ' + (c + R * Math.sin(a)).toFixed(2);
  return `M ${p(a0)} A ${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`;
}
const pts = (list: number[][]) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');

const Arrow = ({ dir = 'right', size = 16 }: { dir?: 'left' | 'right'; size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'right' ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
  </svg>
);
const LongArrow = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const btnCircle: React.CSSProperties = { width: 44, height: 44, borderRadius: 22, border: '1px solid #2E3445', background: 'transparent', color: '#F1F3F7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const btnAmber: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 18px', borderRadius: 22, border: 'none', background: AMBER, color: '#07080C', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', textShadow: 'none' };
const chip: React.CSSProperties = { padding: '5px 10px', borderRadius: 7, background: '#1A1F2B', fontSize: 12.5, color: '#E3E7EE' };

export default class Atlas extends React.Component<{}, State> {
  state: State = { level: 'home', proj: 0, peek: 0, skill: 0, speek: 0, hack: 0, role: 0, chan: 0, moving: false, zoom: 1, hover: null, copied: false, ready: false, rev: 0 };

  private rootRef = React.createRef<HTMLDivElement>();
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private ringCanvas: HTMLCanvasElement | null = null;
  private ringLabels: Slice[] = [];
  private renderer: FractalRenderer | null = null;
  private LY: Layout = computeLayout(1280, 760);
  private P: Lay = lay(this.LY);
  private V: Views | null = null;
  private view: View = { cx: -0.75, cy: 0, scale: 3 / 760 };
  private raf = 0;
  private ro: ResizeObserver | null = null;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private started = false;

  // ---------- lifecycle ----------
  componentDidMount() {
    const canvas = this.canvasRef.current!, root = this.rootRef.current!;
    this.renderer = new FractalRenderer(canvas);
    this.renderer.onIdleFrame = () => this.renderer && this.renderer.compose(this.view);
    const measure = () => { const r = root.getBoundingClientRect(); this.relayout(r.width, r.height); };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => { if (this.resizeTimer) clearTimeout(this.resizeTimer); this.resizeTimer = setTimeout(measure, 120); });
      this.ro.observe(root);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.drawRingText());
  }
  componentDidUpdate() { this.drawRingText(); }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    if (this.ro) this.ro.disconnect();
    if (this.renderer) this.renderer.destroy();
  }

  private views(): Views { return this.V || (this.V = buildViews(this.LY, this.P)); }

  private relayout(w: number, h: number) {
    const next = computeLayout(w, h);
    if (this.started && next.W === this.LY.W && next.H === this.LY.H) return;
    this.LY = next;
    this.P = lay(next);
    this.V = null;
    cancelAnimationFrame(this.raf);
    const V = this.views(), r = this.renderer!;
    r.setSize(next.W, next.H, next.k, V.home.scale);
    r.moving = false;
    this.view = { ...this.viewFor(this.state) };
    if (!this.started) { this.started = true; r.markHome(r.schedule(V.home, 1, true)); }
    r.schedule(this.view, 1, true);
    r.compose(this.view);
    this.precompute();
    this.setState({ ready: true, moving: false, rev: this.state.rev + 1, zoom: V.home.scale / this.view.scale });
  }

  private precompute() {
    const V = this.views(), r = this.renderer!, H = V.home;
    const dests = [V.projects, V.skills, V.hackathons, V.about, V.contact, V.edu, ...V.role, ...V.project, ...V.skill, ...V.chan];
    dests.forEach((v) => r.schedule(v, 0.5));
    const paths: [View, View][] = [[H, V.projects], [H, V.skills], [H, V.hackathons], [H, V.about], [V.about, V.edu], [H, V.contact]];
    if (V.role.length) paths.push([H, V.role[0]]);
    for (let k = 1; k < V.role.length; k++) paths.push([V.role[k - 1], V.role[k]]);
    V.project.forEach((v) => paths.push([V.projects, v]));
    V.skill.forEach((v) => paths.push([V.skills, v]));
    V.chan.forEach((v) => paths.push([V.contact, v]));
    paths.forEach(([A, T]) => {
      for (let sc = A.scale / 4; sc > T.scale * 1.6; sc /= 4) {
        const w = (sc - T.scale) / (A.scale - T.scale);
        r.schedule({ cx: T.cx + (A.cx - T.cx) * w, cy: T.cy + (A.cy - T.cy) * w, scale: sc }, 1 / 3);
      }
    });
  }

  private viewFor(st: Pick<State, 'level' | 'proj' | 'skill' | 'role' | 'chan'>): View {
    const V = this.views();
    switch (st.level) {
      case 'projects': return V.projects;
      case 'project': return V.project[st.proj];
      case 'skills': return V.skills;
      case 'skill': return V.skill[st.skill];
      case 'hackathons': return V.hackathons;
      case 'about': return V.about;
      case 'edu': return V.edu;
      case 'experience': return V.role[st.role] || V.home;
      case 'contact': return V.contact;
      case 'channel': return V.chan[st.chan];
      default: return V.home;
    }
  }

  // ---------- camera ----------
  private animateTo(target: View) {
    const r = this.renderer!;
    cancelAnimationFrame(this.raf);
    r.schedule(target, 1, true);
    r.schedule(target, 0.5, true);
    const from = { ...this.view }, lf = Math.log(from.scale), lt = Math.log(target.scale);
    const dur = reduced() ? 0 : Math.min(2600, 1100 + 150 * Math.abs(lf - lt)), t0 = performance.now();
    r.moving = true;
    this.setState({ moving: true, hover: null, copied: false });
    const finish = () => {
      this.view = { ...target };
      r.moving = false;
      r.compose(this.view);
      r.kick();
      this.setState({ moving: false, zoom: this.views().home.scale / target.scale });
    };
    if (dur === 0) { finish(); return; }
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const sc = Math.exp(lf + (lt - lf) * e);
      const w = Math.abs(lf - lt) < 1e-6 ? 1 - e : (sc - target.scale) / (from.scale - target.scale);
      this.view = { cx: target.cx + (from.cx - target.cx) * w, cy: target.cy + (from.cy - target.cy) * w, scale: sc };
      if (k < 1) { r.compose(this.view); this.raf = requestAnimationFrame(step); } else finish();
    };
    this.raf = requestAnimationFrame(step);
  }

  private to(level: Level, extra: Partial<State> = {}) {
    const next = { ...this.state, level, ...extra };
    this.setState({ level, ...extra } as State);
    this.animateTo(this.viewFor(next));
  }
  goHome = () => this.to('home');
  go = (key: string) => {
    if (key === 'experience') { if (geo().roles.length) this.to('experience', { role: 0 }); return; }
    this.to(key as Level);
  };
  openProject = (i: number) => this.to('project', { proj: i, peek: i });
  openSkill = (i: number) => this.to('skill', { skill: i, speek: i });
  openRole = (k: number) => this.to('experience', { role: k });
  openChan = (j: number) => this.to('channel', { chan: j });
  openEdu = () => this.to('edu');
  openTarget = (t: Target) => { if (!t) return; if ('p' in t) this.openProject(t.p); else this.openRole(t.r); };
  stepDetail = (d: number) => {
    const g = geo(), st = this.state;
    if (st.level === 'project') this.openProject((st.proj + d + g.projects.length) % g.projects.length);
    else this.openSkill((st.skill + d + g.skills.length) % g.skills.length);
  };
  stepChan = (d: number) => { const n = geo().chans.length; this.openChan((this.state.chan + d + n) % n); };
  copyChan = () => {
    const v = geo().chans[this.state.chan].copy;
    try { navigator.clipboard?.writeText(v).catch(() => {}); } catch { /* ignore */ }
    this.setState({ copied: true });
  };

  onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.moving || this.LY.mobile) return;
    const r = e.currentTarget.getBoundingClientRect(), L = this.LY, v = this.view;
    const sx = (e.clientX - r.left - L.ox) / L.k, sy = (e.clientY - r.top - L.oy) / L.k;
    this.setState({ hover: { re: v.cx + (sx - L.SW / 2) * v.scale, im: v.cy - (sy - L.SH / 2) * v.scale } });
  };
  onLeave = () => { if (this.state.hover) this.setState({ hover: null }); };

  // ---------- ring of slices around a parent bulb ----------
  private buildRing(parent: { N: C; root: C }, kids: { N: C; i: number }[], R: { box: number; R: number; r: number }, peekIdx: number, S: (c: C) => number[], leaders: Leader[],
    onPeek: (i: number) => void, onOpen: (i: number) => void, labelOf: (i: number) => [string, string]) {
    const pc = S(parent.N), rt = S(parent.root);
    const rootAng = Math.atan2(rt[1] - pc[1], rt[0] - pc[0]);
    const TAU = Math.PI * 2, span = Math.PI * 1.3, start = rootAng + (TAU - span) / 2, step = span / Math.max(kids.length, 1), half = R.box / 2;
    const mid0 = (R.R + R.r) / 2, th = R.R - R.r, gapA = 0.05;
    const order = kids.map((b) => {
      const k = S(b.N);
      let rel = Math.atan2(k[1] - pc[1], k[0] - pc[0]) - rootAng;
      rel = ((rel % TAU) + TAU) % TAU;
      return { b, rel, k };
    }).sort((x, y) => x.rel - y.rel);
    const slices: Slice[] = order.map((o, k) => {
      const mid = start + step * (k + 0.5), on = o.b.i === peekIdx;
      const inner = [pc[0] + R.r * Math.cos(mid), pc[1] + R.r * Math.sin(mid)];
      leaders.push({ ax: o.k[0], ay: o.k[1], points: pts([o.k, inner]), stroke: on ? '#FFC266' : '#E9ECF2', w: on ? 2.4 : 1.6, delay: 300 + k * 60 });
      const lab = labelOf(o.b.i), flip = Math.sin(mid) > 0.15;
      return {
        name: lab[0], sub: th > 60 ? lab[1] : '', aria: 'Open ' + lab[0], half,
        nr: flip ? mid0 + th * 0.03 : mid0 - th * 0.02, sr: flip ? mid0 + th * 0.22 : mid0 - th * 0.2,
        a0: mid - step / 2 + gapA, a1: mid + step / 2 - gapA, mid, flip, on, maxFs: th > 60 ? 15 : 12.5,
        d: annulus(R.R, R.r, mid - step / 2 + 0.016, mid + step / 2 - 0.016, half),
        bg: on ? 'rgba(150,92,22,0.94)' : 'rgba(10,12,20,0.9)',
        peek: () => onPeek(o.b.i), open: () => onOpen(o.b.i),
      };
    });
    return { slices, left: pc[0] - half, top: pc[1] - half, box: R.box, half, outer: arcD(R.R, start, start + span, half), inner: arcD(R.r, start, start + span, half) };
  }

  // Curved slice labels: every character is measured and placed along its arc, upright on both halves.
  private setRingCanvas = (el: HTMLCanvasElement | null) => { this.ringCanvas = el; if (el) requestAnimationFrame(() => this.drawRingText()); };
  private drawRingText() {
    const el = this.ringCanvas, list = this.ringLabels;
    if (!el || !list.length) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const dpr = el.width / (list[0].half * 2);
    const family = (getComputedStyle(document.body).getPropertyValue('--font-inter') || 'Inter') + ', system-ui, sans-serif';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, el.width, el.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    const line = (text: string, rad: number, sl: Slice, weight: number, max: number, min: number, color: string) => {
      if (!text) return;
      const avail = rad * (sl.a1 - sl.a0) * 0.9;
      let fs = max, t = text;
      ctx.font = `${weight} ${fs}px ${family}`;
      let w = ctx.measureText(t).width;
      if (w > avail) { fs = Math.max(min, fs * avail / w); ctx.font = `${weight} ${fs}px ${family}`; w = ctx.measureText(t).width; }
      while (w > avail && t.length > 2) { t = t.slice(0, -1); w = ctx.measureText(t.trim() + '…').width; }
      if (t !== text) t = t.trim() + '…';
      w = ctx.measureText(t).width;
      const dir = sl.flip ? -1 : 1;
      let a = sl.mid - dir * (w / 2) / rad;
      for (const ch of Array.from(t)) {
        const cw = ctx.measureText(ch).width, ac = a + dir * (cw / 2) / rad;
        ctx.save();
        ctx.translate(sl.half + rad * Math.cos(ac), sl.half + rad * Math.sin(ac));
        ctx.rotate(ac + dir * Math.PI / 2);
        ctx.lineWidth = 3.5; ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.strokeText(ch, 0, 0);
        ctx.fillStyle = color; ctx.fillText(ch, 0, 0);
        ctx.restore();
        a += dir * cw / rad;
      }
    };
    list.forEach((sl) => {
      line(sl.name, sl.nr, sl, 600, sl.maxFs, 9.5, sl.on ? '#FFF4E2' : '#F1F3F7');
      line(sl.sub, sl.sr, sl, 500, 11.5, 9.5, sl.on ? '#FFE2B8' : '#BAC2D0');
    });
  }

  // Labels in a column, sorted by anchor height and evenly spaced, so they never overlap.
  private columnTags(anchors: { s: number[] }[], x: number, top: number, bottom: number, leaders: Leader[], make: (i: number) => Partial<Tag>) {
    const sorted = anchors.map((a, i) => ({ a, i })).sort((u, v) => u.a.s[1] - v.a.s[1]);
    const n = sorted.length, gap = n > 1 ? (bottom - top) / (n - 1) : 0;
    return sorted.map((o, k) => {
      const y = n > 1 ? top + gap * k : (top + bottom) / 2, sp = o.a.s;
      leaders.push({ ax: sp[0], ay: sp[1], points: pts([sp, [x - 40, y], [x, y]]), stroke: '#E9ECF2', w: 1.6, delay: 200 + k * 100 });
      return { lx: x + 6, ly: y, tf: '0px, -50%', align: 'flex-start', talign: 'left', delay: 550 + k * 100, maxw: 250, border: 'rgba(255,255,255,0.16)', bg: 'rgba(9,11,18,0.92)', size: 17, label: '', sub: '', ...make(o.i) } as Tag;
    });
  }

  // ======================================================================
  render() {
    const st = this.state, g = geo(), d = content, L = this.LY, P = this.P, m = L.mobile, lvl = st.level, idle = !st.moving;
    const { SW, SH } = L, cx0 = SW / 2;
    const v = this.view;
    const S = (c: C) => [SW / 2 + (c[0] - v.cx) / v.scale, SH / 2 - (c[1] - v.cy) / v.scale];
    const leaders: Leader[] = [], tagBtns: Tag[] = [], tagInfo: Tag[] = [], tagText: Tag[] = [], pins: { x: number; y: number; n: string; delay: number }[] = [];
    const pin = (p: number[], n: number, i: number) => pins.push({ x: p[0], y: p[1], n: String(n), delay: 300 + i * 80 });
    let ring: ReturnType<Atlas['buildRing']> | null = null;
    let center = { meta: '', name: '', sub: '', cta: '', open: () => {} };
    let sheet: { top: number; head: typeof center | null; rows: Row[] } | null = null;

    if (st.ready && idle) {
      if (lvl === 'home') {
        if (!m) {
          MARKS.forEach((mk, i) => {
            const a = S(mk.c), left = mk.side === 'left';
            const end = [a[0] + mk.end[0], a[1] + mk.end[1]], elbow = mk.elbow ? [a[0] + mk.elbow[0], a[1] + mk.elbow[1]] : null;
            leaders.push({ ax: a[0], ay: a[1], points: pts([a, ...(elbow ? [elbow] : []), end]), stroke: '#E9ECF2', w: 1.6, delay: 150 + i * 110 });
            tagBtns.push({ lx: end[0] + (left ? -6 : 6), ly: end[1], tf: left ? '-100%, -50%' : '0px, -50%', align: left ? 'flex-end' : 'flex-start', talign: left ? 'right' : 'left', delay: 550 + i * 110, border: 'rgba(255,255,255,0.16)', bg: 'rgba(9,11,18,0.92)', maxw: 260, size: 21, label: mk.label, sub: this.markSub(mk.key), go: () => this.go(mk.key) });
          });
        } else {
          MARKS.forEach((mk, i) => pin(S(mk.c), i + 1, i));
          sheet = { top: P.home.sheetTop, head: null, rows: MARKS.map((mk, i) => ({ num: String(i + 1), title: mk.label, sub: this.markSub(mk.key), go: () => this.go(mk.key) })) };
        }
      }

      const ringLevel = (parent: { N: C; root: C }, kids: { N: C; i: number }[], R: Lay['projRing'], peekIdx: number, onPeek: (i: number) => void, onOpen: (i: number) => void,
        labelOf: (i: number) => [string, string], head: typeof center, rowOf: (i: number) => Row) => {
        ring = this.buildRing(parent, kids, R, peekIdx, S, leaders, onPeek, onOpen, labelOf);
        center = head;
        if (m) sheet = { top: R.sheetTop, head, rows: kids.map((k) => ({ ...rowOf(k.i), on: k.i === peekIdx })) };
      };
      if (lvl === 'projects') {
        const pk = g.projects[st.peek];
        ringLevel(g.two, g.projects, P.projRing, st.peek, (i) => this.state.peek !== i && this.setState({ peek: i }), this.openProject, (i) => [g.projects[i].title, g.projects[i].badge],
          { meta: pk.badge, name: pk.title, sub: pk.tag, cta: 'Dive into its bulb', open: () => this.openProject(st.peek) },
          (i) => ({ title: g.projects[i].title, sub: g.projects[i].badge, go: () => this.openProject(i) }));
      }
      if (lvl === 'skills') {
        const sk = g.skills[st.speek];
        ringLevel(g.skill, g.skills, P.subRing, st.speek, (i) => this.state.speek !== i && this.setState({ speek: i }), this.openSkill, (i) => [g.skills[i].name, g.skills[i].tools.length + ' tools'],
          { meta: sk.tools.length + ' tools inside', name: sk.name, sub: sk.body, cta: 'Dive in', open: () => this.openSkill(st.speek) },
          (i) => ({ title: g.skills[i].name, sub: g.skills[i].tools.length + ' tools', go: () => this.openSkill(i) }));
      }
      if (lvl === 'hackathons') {
        const hk = g.hacks[st.hack], tg = target(hk.project);
        ringLevel(g.south, g.hacks, P.subRing, st.hack, (i) => this.state.hack !== i && this.setState({ hack: i }), (i) => this.openTarget(target(g.hacks[i].project)), (i) => [g.hacks[i].event, g.hacks[i].result],
          { meta: hk.result, name: hk.event, sub: hk.detail + (tg ? ' · ' + targetName(tg) : ''), cta: 'See the project', open: () => this.openTarget(tg) },
          (i) => ({ title: g.hacks[i].event, sub: g.hacks[i].result + ' · ' + targetName(target(g.hacks[i].project)), go: () => this.openTarget(target(g.hacks[i].project)) }));
      }

      if (lvl === 'about') {
        const anchors = g.facts.map((fc) => ({ fc, s: S(fc.c) }));
        if (!m) {
          this.columnTags(anchors, SW - 270, SH / 2 - 250, SH / 2 + 250, leaders, (i) => {
            const fc = g.facts[i];
            return fc.opens === 'education' ? { label: fc.title, sub: fc.text, go: this.openEdu } : { label: fc.text, sub: fc.title, go: null };
          }).forEach((t) => (t.go ? tagBtns : tagInfo).push(t));
        } else {
          anchors.forEach((a, i) => pin(a.s, i + 1, i));
          sheet = { top: P.about.sheetTop, head: null, rows: g.facts.map((fc, i) => fc.opens === 'education'
            ? { num: String(i + 1), title: fc.title, sub: fc.text, go: this.openEdu }
            : { num: String(i + 1), title: fc.title, sub: fc.text, info: true }) };
        }
      }

      if (lvl === 'experience' && !m) {
        const x0 = v.cx - (SW / 2 - 40) * v.scale, x1 = v.cx + ((SW - 660) - SW / 2) * v.scale;
        g.roles.forEach((x, k) => {
          const lo = x.c[0] - x.r, hi = x.c[0] + x.r, re = Math.max(lo + x.r * 0.15, Math.min(hi - x.r * 0.15, Math.max(x0, Math.min(x1, x.c[0]))));
          if (re < x0 || re > x1) return;
          const a = S([re, 0]), on = k === st.role, ly = on ? SH / 2 + 250 : SH / 2 - 240;
          leaders.push({ ax: a[0], ay: a[1], points: pts([a, [a[0], ly]]), stroke: on ? '#FFC266' : '#E9ECF2', w: on ? 2.2 : 1.6, delay: 250 + k * 100 });
          tagBtns.push({ lx: a[0], ly, tf: on ? '-50%, 0%' : '-50%, -100%', align: 'center', talign: 'center', delay: 500 + k * 100, maxw: 240, size: 18, pressed: on,
            border: on ? AMBER : 'rgba(255,255,255,0.16)', bg: on ? 'rgba(60,40,12,0.94)' : 'rgba(9,11,18,0.92)', label: x.company, sub: x.when, go: () => this.openRole(k) });
        });
      }

      if (lvl === 'contact') {
        const sorted = g.chans.map((c) => ({ c, a: S(c.N) })).sort((u, w) => u.a[0] - w.a[0]);
        if (!m) {
          sorted.forEach((o, k) => {
            const up = k % 2 === 0, ly = up ? SH / 2 - 80 : SH / 2 + 80;
            leaders.push({ ax: o.a[0], ay: o.a[1], points: pts([o.a, [o.a[0], ly]]), stroke: '#E9ECF2', w: 1.6, delay: 200 + k * 90 });
            tagText.push({ lx: o.a[0], ly, tf: up ? '-50%, -100%' : '-50%, 0%', align: 'center', talign: 'center', delay: 450 + k * 90, maxw: 240, border: '', bg: '', size: 18, label: o.c.name, sub: o.c.value, go: () => this.openChan(o.c.j) });
          });
        } else {
          sorted.forEach((o, k) => pin(o.a, k + 1, k));
          sheet = { top: P.contact.sheetTop, head: null, rows: sorted.map((o, k) => ({ num: String(k + 1), title: o.c.name, sub: o.c.value, go: () => this.openChan(o.c.j) })) };
        }
      }
    }

    this.ringLabels = ring ? (ring as ReturnType<Atlas['buildRing']>).slices : [];

    // ---------- shared panel geometry ----------
    const panelStyle = (sheetTop: number): React.CSSProperties => m
      ? { position: 'absolute', left: 0, top: sheetTop, width: SW, height: SH - sheetTop, boxSizing: 'border-box', padding: '18px 20px 32px', background: 'linear-gradient(to bottom, rgba(7,8,12,0.55) 0px, rgba(7,8,12,0.95) 30px, #07080C 80px)', display: 'flex', flexDirection: 'column', gap: 12 }
      : { position: 'absolute', left: SW - 520, top: SH / 2, width: 480, maxHeight: SH - 60, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12 };
    const titleFs = m ? 26 : 32;

    const crumbs: { label: string; go?: () => void; current: boolean }[] = [{ label: 'Overview', go: this.goHome, current: false }];
    if (lvl === 'projects' || lvl === 'project') crumbs.push({ label: 'Projects', go: () => this.go('projects'), current: lvl === 'projects' });
    if (lvl === 'project') crumbs.push({ label: g.projects[st.proj].title, current: true });
    if (lvl === 'skills' || lvl === 'skill') crumbs.push({ label: 'Skills', go: () => this.go('skills'), current: lvl === 'skills' });
    if (lvl === 'skill') crumbs.push({ label: g.skills[st.skill].name, current: true });
    if (lvl === 'hackathons') crumbs.push({ label: 'Hackathons', current: true });
    if (lvl === 'about' || lvl === 'edu') crumbs.push({ label: 'About', go: () => this.go('about'), current: lvl === 'about' });
    if (lvl === 'edu') crumbs.push({ label: 'Education', current: true });
    if (lvl === 'experience') crumbs.push({ label: 'Experience', current: true });
    if (lvl === 'contact' || lvl === 'channel') crumbs.push({ label: 'Contact', go: () => this.go('contact'), current: lvl === 'contact' });
    if (lvl === 'channel') crumbs.push({ label: g.chans[st.chan].name, current: true });

    const zoom = st.zoom || 1, digits = Math.min(10, 3 + Math.floor(Math.log10(Math.max(zoom, 1))));
    const hp = st.hover || { re: v.cx, im: v.cy };
    const readout = `c = ${hp.re < 0 ? '−' : ''}${Math.abs(hp.re).toFixed(digits)}${hp.im < 0 ? ' − ' : ' + '}${Math.abs(hp.im).toFixed(digits)}i   ·   zoom ×${zoom < 10 ? f1(zoom) : Math.round(zoom).toLocaleString('en-US')}`;

    const topShade = (h: number, desktopH: number) => (
      <div className={`${s.fade} ${s.none}`} style={m
        ? { position: 'absolute', left: 0, top: 0, width: SW, height: h, background: 'linear-gradient(to bottom, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.7) 55%, rgba(7,8,12,0) 100%)' }
        : { position: 'absolute', left: 0, top: 0, width: 900, height: desktopH, background: 'radial-gradient(ellipse 70% 80% at 0% 0%, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.75) 40%, rgba(7,8,12,0) 100%)' }} />
    );

    const body = (b: { title: string; tag: string; body: string }) => (
      <>
        <h2 className={s.grotesk} style={{ margin: 0, fontSize: titleFs, lineHeight: 1.08, fontWeight: 600 }}>{b.title}</h2>
        <span style={{ fontSize: 14, lineHeight: 1.45, color: '#F2C88A' }}>{b.tag}</span>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: '#E3E7EE' }}>{b.body}</p>
      </>
    );
    const bullets = (list: string[]) => list.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {list.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.5, color: '#DCE1EA' }}>
            <span aria-hidden="true" style={{ width: 6, height: 6, marginTop: 8, borderRadius: '50%', background: AMBER, flexShrink: 0 }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    );
    const chips = (list: string[]) => list.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{list.map((t) => <span key={t} style={chip}>{t}</span>)}</div>
    );
    const prevNext = (label: string) => (
      <>
        <div style={{ flexGrow: 1 }} />
        <button type="button" className={s.ghost} style={btnCircle} aria-label={'Previous ' + label} onClick={() => this.stepDetail(-1)}><Arrow dir="left" /></button>
        <button type="button" className={s.ghost} style={btnCircle} aria-label={'Next ' + label} onClick={() => this.stepDetail(1)}><Arrow /></button>
      </>
    );

    return (
      <div ref={this.rootRef} className={s.root} onMouseMove={this.onMove} onMouseLeave={this.onLeave}>
        <canvas ref={this.canvasRef} className={s.canvas} role="img" aria-label="Mandelbrot set used as the portfolio map" />
        {st.ready && (
          <div className={s.stage} style={{ left: L.ox, top: L.oy, width: SW, height: SH, transform: `scale(${L.k})` }}>
            {idle && !m && (lvl === 'project' || lvl === 'skill' || lvl === 'experience') && (
              <div className={`${s.fade} ${s.none}`} style={{ position: 'absolute', right: 0, top: 0, width: 660, height: SH, background: 'linear-gradient(to right, rgba(7,8,12,0) 0%, rgba(7,8,12,0.88) 34%, rgba(7,8,12,0.96) 100%)' }} />
            )}
            {idle && !m && lvl === 'about' && (
              <div className={`${s.fade} ${s.none}`} style={{ position: 'absolute', left: 0, top: 0, width: 560, height: SH, background: 'linear-gradient(to left, rgba(7,8,12,0) 0%, rgba(7,8,12,0.85) 40%, rgba(7,8,12,0.94) 100%)' }} />
            )}
            {idle && lvl === 'home' && topShade(220, 420)}
            {idle && lvl === 'contact' && topShade(200, 300)}
            {idle && m && lvl === 'about' && topShade(300, 300)}

            {idle && (
              <svg aria-hidden="true" className={s.none} width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: 'absolute', left: 0, top: 0 }}>
                {leaders.map((l, i) => (
                  <g key={i}>
                    <polyline className={s.lead} points={l.points} fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: l.delay + 'ms' }} />
                    <polyline className={s.lead} points={l.points} fill="none" stroke={l.stroke} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: l.delay + 'ms' }} />
                    <circle cx={l.ax} cy={l.ay} r={5} fill={AMBER} stroke="#07080C" strokeWidth={2} />
                  </g>
                ))}
              </svg>
            )}
            {idle && pins.map((p, i) => (
              <span key={i} aria-hidden="true" className={`${s.fade} ${s.none}`} style={{ position: 'absolute', left: p.x, top: p.y, width: 24, height: 24, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '2px solid #07080C', background: AMBER, color: '#07080C', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.7)', animationDelay: p.delay + 'ms' }}>{p.n}</span>
            ))}

            {/* ---------- home ---------- */}
            {idle && lvl === 'home' && (
              <div className={s.fade} style={{ position: 'absolute', left: m ? 20 : 48, top: m ? 22 : 44, width: m ? SW - 40 : 460, display: 'flex', flexDirection: 'column', gap: m ? 8 : 10 }}>
                <h1 className={`${s.grotesk} ${s.grad}`} style={{ margin: 0, fontSize: m ? 38 : 50, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.01em' }}>{d.me.name}</h1>
                <div aria-hidden="true" style={{ width: 120, height: 2, borderRadius: 1, background: 'linear-gradient(90deg, #F2A33A, rgba(242,163,58,0))' }} />
                <p style={{ margin: 0, fontSize: m ? 14.5 : 16, lineHeight: 1.5, fontWeight: 500, color: '#E8EBF1' }}>{d.me.headline}</p>
                {!m && <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: '#BAC2D0' }}>Every section is a real place on the Mandelbrot set. Pick a landmark to dive in.</p>}
              </div>
            )}

            {/* ---------- rings: projects, skills, hackathons ---------- */}
            {idle && ring && (() => {
              const rg = ring as ReturnType<Atlas['buildRing']>;
              return (
                <div className={`${s.ring} ${s.none}`} style={{ position: 'absolute', left: rg.left, top: rg.top, width: rg.box, height: rg.box, transformOrigin: `${rg.half}px ${rg.half}px` }}>
                  <svg aria-hidden="true" width={rg.box} height={rg.box} viewBox={`0 0 ${rg.box} ${rg.box}`} style={{ position: 'absolute', left: 0, top: 0 }}>
                    <path d={rg.outer} fill="none" stroke="rgba(233,236,242,0.35)" strokeWidth={1} />
                    <path d={rg.inner} fill="none" stroke="rgba(233,236,242,0.35)" strokeWidth={1} />
                  </svg>
                  {rg.slices.map((sl, i) => (
                    <button key={i} type="button" className={s.slice} aria-label={sl.aria} onClick={sl.open} onMouseEnter={sl.peek} onFocus={sl.peek}
                      style={{ position: 'absolute', left: 0, top: 0, width: rg.box, height: rg.box, padding: 0, border: 'none', background: sl.bg, clipPath: `path('${sl.d}')`, cursor: 'pointer', transition: 'background 0.2s ease', pointerEvents: 'auto' }} />
                  ))}
                  <canvas ref={this.setRingCanvas} width={rg.box * 2} height={rg.box * 2} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: rg.box, height: rg.box, pointerEvents: 'none' }} />
                  {!m && (
                    <div style={{ position: 'absolute', left: rg.half, top: rg.half, width: 240, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', pointerEvents: 'auto', textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{center.meta}</span>
                      <span className={s.grotesk} style={{ fontSize: 23, lineHeight: 1.12, fontWeight: 600 }}>{center.name}</span>
                      <span style={{ fontSize: 13, lineHeight: 1.5, color: '#D5DAE3' }}>{center.sub}</span>
                      <button type="button" className={s.lnk} style={{ ...btnAmber, height: 42, padding: '0 16px', fontSize: 13 }} onClick={center.open}><span>{center.cta}</span><LongArrow /></button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ---------- project / skill detail ---------- */}
            {idle && (lvl === 'project' || lvl === 'skill') && (() => {
              const isP = lvl === 'project', pr = g.projects[st.proj], sk = g.skills[st.skill];
              return (
                <>
                  <div className={`${s.disc} ${s.blur}`} style={{ position: 'absolute', left: P.detail.c[0], top: P.detail.c[1], width: P.detail.size, height: P.detail.size, transform: 'translate(-50%, -50%)', borderRadius: '50%', boxSizing: 'border-box', border: '1px solid rgba(242,163,58,0.55)', background: 'rgba(9,11,18,0.82)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center', padding: P.detail.pad }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{isP ? pr.badge : `Skill ${sk.i + 1} of ${g.skills.length}`}</span>
                    <span className={s.grotesk} style={{ fontSize: P.detail.fs, lineHeight: 1.08, fontWeight: 600 }}>{isP ? pr.title : sk.name}</span>
                    {!m && <span style={{ fontSize: 13, lineHeight: 1.45, color: '#D5DAE3' }}>{isP ? pr.tag : sk.tools.length + ' tools, each linked to real work'}</span>}
                  </div>
                  <div className={`${s.fade} ${s.scroll}`} style={panelStyle(P.detail.sheetTop)}>
                    {isP ? body({ title: pr.title, tag: pr.badge, body: pr.body }) : body({ title: sk.name, tag: 'Each tool links to the work that uses it', body: sk.body })}
                    {isP && bullets(pr.points)}
                    {!isP && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#BAC2D0' }}>Tap one to see where it is used</span>
                        {sk.tools.map(([name, id], i) => {
                          const t = target(id);
                          return t ? (
                            <button key={i} type="button" className={s.row} onClick={() => this.openTarget(t)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 46, padding: '0 14px', borderRadius: 12, border: '1px solid #2A3040', background: 'rgba(16,19,28,0.95)', color: '#F1F3F7', cursor: 'pointer', textAlign: 'left' }}>
                              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{name}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#F2C88A', whiteSpace: 'nowrap' }}>Used in {targetName(t)}<LongArrow /></span>
                            </button>
                          ) : (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 46, padding: '0 14px', borderRadius: 12, border: '1px solid #222736', background: 'rgba(16,19,28,0.7)' }}>
                              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{name}</span>
                              <span style={{ fontSize: 12.5, color: '#BAC2D0' }}>Daily setup</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {isP && pr.note && <span style={{ fontSize: 12.5, lineHeight: 1.5, color: '#BAC2D0' }}>{pr.note}</span>}
                    {isP && chips(pr.stack)}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      {isP && pr.links.map(([label, href]) => (
                        <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={s.lnk} style={btnAmber}>{label} ↗</a>
                      ))}
                      {prevNext(isP ? 'project' : 'skill')}
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ---------- about ---------- */}
            {idle && lvl === 'about' && (
              <div className={s.fade} style={m
                ? { position: 'absolute', left: 20, top: 70, width: SW - 40, display: 'flex', flexDirection: 'column', gap: 10 }
                : { position: 'absolute', left: 64, top: SH / 2, width: 420, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: AMBER }}>About me</span>
                <h1 className={`${s.grotesk} ${s.grad}`} style={{ margin: 0, fontSize: m ? 38 : 52, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.01em' }}>{d.me.name}</h1>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#F2C88A' }}>{d.me.headline}</span>
                <p style={{ margin: 0, fontSize: m ? 14.5 : 15, lineHeight: 1.65, color: '#E3E7EE' }}>{d.me.bio}</p>
              </div>
            )}

            {/* ---------- education ---------- */}
            {idle && lvl === 'edu' && (() => {
              const kids = g.eduKids.map((k) => ({ k, sp: S(k.N) }));
              const cards: { k: typeof g.eduKids[number]; x: number; y: number; w: number; tf: string; num: string; delay: number }[] = [];
              if (!m) {
                const place = (list: typeof kids, left: boolean) => list.sort((a, b) => a.sp[1] - b.sp[1]).forEach((o, k) => {
                  const top = SH / 2 - 200, n = list.length, ey = n > 1 ? top + (k * 400) / (n - 1) : Math.max(top - 10, Math.min(top + 380, o.sp[1]));
                  const ex = left ? Math.min(o.sp[0] - 60, cx0 - 240) : Math.max(o.sp[0] + 60, cx0 + 240);
                  leaders.push({ ax: o.sp[0], ay: o.sp[1], points: pts([o.sp, [ex, ey]]), stroke: '#FFC266', w: 2, delay: 300 + o.k.i * 150 });
                  cards.push({ k: o.k, x: ex, y: ey, w: 300, tf: left ? 'translate(-100%, -50%)' : 'translate(0, -50%)', num: '', delay: 500 + o.k.i * 150 });
                });
                place(kids.filter((o) => o.sp[0] < cx0), true);
                place(kids.filter((o) => o.sp[0] >= cx0), false);
              } else {
                kids.sort((a, b) => a.sp[0] - b.sp[0]).forEach((o, k) => {
                  pins.push({ x: o.sp[0], y: o.sp[1], n: String(k + 1), delay: 300 });
                  cards.push({ k: o.k, x: 16, y: P.edu.cardsTop + k * 150, w: SW - 32, tf: 'none', num: (k + 1) + ' · ', delay: 400 + k * 150 });
                });
              }
              return (
                <>
                  <svg aria-hidden="true" className={s.none} width={SW} height={SH} style={{ position: 'absolute', left: 0, top: 0 }}>
                    {leaders.map((l, i) => (
                      <g key={i}>
                        <polyline className={s.lead} points={l.points} fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth={5} strokeLinecap="round" />
                        <polyline className={s.lead} points={l.points} fill="none" stroke={l.stroke} strokeWidth={l.w} strokeLinecap="round" />
                        <circle cx={l.ax} cy={l.ay} r={5} fill={AMBER} stroke="#07080C" strokeWidth={2} />
                      </g>
                    ))}
                  </svg>
                  {m && kids.map((o, k) => (
                    <span key={'p' + k} aria-hidden="true" className={s.none} style={{ position: 'absolute', left: o.sp[0], top: o.sp[1], width: 24, height: 24, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '2px solid #07080C', background: AMBER, color: '#07080C', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: 'none' }}>{k + 1}</span>
                  ))}
                  <div className={s.fade} style={{ position: 'absolute', left: P.edu.c[0], top: P.edu.c[1], width: 220, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}>
                    <span className={s.grotesk} style={{ fontSize: m ? 22 : 28, fontWeight: 600 }}>Education</span>
                    <span style={{ fontSize: 13, lineHeight: 1.45, color: '#D5DAE3' }}>{d.edu.length} degrees, studied side by side</span>
                  </div>
                  {cards.map((c) => (
                    <div key={c.k.school} className={`${s.fade} ${s.blur}`} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, transform: c.tf, boxSizing: 'border-box', padding: '18px 20px', borderRadius: 18, border: '1px solid rgba(242,163,58,0.5)', background: 'rgba(9,11,18,0.94)', display: 'flex', flexDirection: 'column', gap: 8, animationDelay: c.delay + 'ms' }}>
                      <span className={s.grotesk} style={{ fontSize: 23, lineHeight: 1.1, fontWeight: 600 }}>{c.num}{c.k.school}</span>
                      <span style={{ fontSize: 14.5, lineHeight: 1.45, color: '#E3E7EE' }}>{c.k.degree}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
                        <span style={chip}>{c.k.years}</span>
                        <span style={{ ...chip, background: 'rgba(242,163,58,0.18)', fontWeight: 600, color: '#FFD9A0' }}>{c.k.score}</span>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}

            {/* ---------- experience ---------- */}
            {idle && lvl === 'experience' && (() => {
              const r = g.roles[st.role];
              return (
                <>
                  {m && (
                    <div className={s.fade} style={{ position: 'absolute', left: P.role.c[0], top: P.role.c[1], width: 200, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}>
                      <span className={s.grotesk} style={{ fontSize: 24, fontWeight: 600 }}>{r.company}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#F2C88A' }}>{r.when}</span>
                    </div>
                  )}
                  <div className={`${s.fade} ${s.scroll}`} style={panelStyle(P.role.sheetTop)}>
                    {m && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {g.roles.map((x, k) => (
                          <button key={x.id} type="button" className={s.row} aria-pressed={k === st.role} onClick={() => this.openRole(k)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minHeight: 52, padding: '8px 12px', borderRadius: 12, border: `1px solid ${k === st.role ? AMBER : '#2A3040'}`, background: k === st.role ? 'rgba(242,163,58,0.16)' : 'rgba(16,19,28,0.92)', color: '#F1F3F7', cursor: 'pointer', textAlign: 'left' }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{x.company}</span>
                            <span style={{ fontSize: 11.5, color: '#BAC2D0' }}>{x.when}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: AMBER }}>Experience · {st.role + 1} of {g.roles.length}</span>
                    <h2 className={s.grotesk} style={{ margin: 0, fontSize: titleFs, lineHeight: 1.1, fontWeight: 600 }}>{r.role}</h2>
                    <span style={{ fontSize: 15, fontWeight: 500, color: '#F2C88A' }}>{r.company} · {r.where} · {r.when}</span>
                    <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#D5DAE3' }}>{r.note}</span>
                    {bullets(r.points)}
                    {chips(r.chips)}
                  </div>
                </>
              );
            })()}

            {/* ---------- contact ---------- */}
            {idle && lvl === 'contact' && (
              <div className={s.fade} style={{ position: 'absolute', left: m ? 20 : 48, top: m ? 68 : 72, width: m ? SW - 40 : 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h2 className={`${s.grotesk} ${s.grad}`} style={{ margin: 0, fontSize: m ? 26 : 32, lineHeight: 1.05, fontWeight: 600 }}>{g.chans.length} mini-brots, {g.chans.length} ways in</h2>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#D5DAE3' }}>Tiny full copies of the set sit along the antenna. Each one is a channel. {m ? 'Tap' : 'Click'} one to dive in.</p>
              </div>
            )}
            {idle && lvl === 'channel' && (() => {
              const c = g.chans[st.chan];
              return (
                <div className={s.disc} style={{ position: 'absolute', left: P.chan.at[0], top: P.chan.at[1], width: m ? SW - 48 : 340, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}>
                  <span className={`${s.grotesk} ${s.grad}`} style={{ fontSize: 38, lineHeight: 1.05, fontWeight: 600 }}>{c.name}</span>
                  <span className={s.mono} style={{ fontSize: 14.5, lineHeight: 1.4, color: '#F2C88A', wordBreak: 'break-all' }}>{c.value}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <button type="button" className={s.ghost} onClick={this.copyChan} style={{ height: 44, padding: '0 18px', borderRadius: 22, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#F1F3F7', fontSize: 13.5, cursor: 'pointer' }}>{st.copied ? 'Copied' : 'Copy'}</button>
                    {c.href && <a href={c.href} target="_blank" rel="noopener noreferrer" className={s.lnk} style={btnAmber}>Open ↗</a>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button type="button" className={s.ghost} aria-label="Previous channel" onClick={() => this.stepChan(-1)} style={{ ...btnCircle, border: '1px solid rgba(255,255,255,0.3)' }}><Arrow dir="left" /></button>
                    <button type="button" className={s.ghost} aria-label="Next channel" onClick={() => this.stepChan(1)} style={{ ...btnCircle, border: '1px solid rgba(255,255,255,0.3)' }}><Arrow /></button>
                  </div>
                </div>
              );
            })()}

            {/* ---------- floating labels ---------- */}
            {idle && tagBtns.map((t, i) => (
              <button key={'b' + i} type="button" className={`${s.tag} ${s.blur} ${s.fade}`} aria-pressed={t.pressed} onClick={t.go || undefined}
                style={{ position: 'absolute', left: t.lx, top: t.ly, transform: `translate(${t.tf})`, display: 'flex', flexDirection: 'column', alignItems: t.align, gap: 2, minHeight: 44, maxWidth: t.maxw, padding: '8px 14px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.bg, color: '#F1F3F7', cursor: 'pointer', textAlign: t.talign, animationDelay: t.delay + 'ms' }}>
                <span className={s.grotesk} style={{ fontSize: t.size, lineHeight: 1.15, fontWeight: 600 }}>{t.label}</span>
                <span style={{ fontSize: 12, lineHeight: 1.35, color: '#C3CAD6' }}>{t.sub}</span>
              </button>
            ))}
            {idle && tagInfo.map((t, i) => (
              <div key={'i' + i} className={`${s.blur} ${s.fade}`}
                style={{ position: 'absolute', left: t.lx, top: t.ly, transform: `translate(${t.tf})`, display: 'flex', flexDirection: 'column', alignItems: t.align, gap: 3, maxWidth: t.maxw, padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(9,11,18,0.92)', textAlign: t.talign, animationDelay: t.delay + 'ms' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#F2C88A' }}>{t.sub}</span>
                <span style={{ fontSize: 15, lineHeight: 1.35, fontWeight: 600 }}>{t.label}</span>
              </div>
            ))}
            {idle && tagText.map((t, i) => (
              <button key={'t' + i} type="button" className={`${s.txt} ${s.fade}`} onClick={t.go || undefined}
                style={{ position: 'absolute', left: t.lx, top: t.ly, transform: `translate(${t.tf})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: 44, padding: '6px 8px', border: 'none', background: 'transparent', color: '#F1F3F7', cursor: 'pointer', textAlign: 'center', whiteSpace: 'nowrap', textShadow: '0 1px 2px #000, 0 2px 10px rgba(0,0,0,0.95)', animationDelay: t.delay + 'ms' }}>
                <span className={s.grotesk} style={{ fontSize: 18, lineHeight: 1.15, fontWeight: 600 }}>{t.label}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.35, color: '#F2C88A' }}>{t.sub}</span>
              </button>
            ))}

            {/* ---------- phone bottom sheet ---------- */}
            {idle && sheet && (() => {
              const sh = sheet as { top: number; head: typeof center | null; rows: Row[] };
              return (
                <div className={`${s.fade} ${s.scroll}`} style={{ position: 'absolute', left: 0, top: sh.top, width: SW, height: SH - sh.top, boxSizing: 'border-box', padding: '16px 16px 28px', background: 'linear-gradient(to bottom, rgba(7,8,12,0.5) 0px, rgba(7,8,12,0.94) 30px, #07080C 80px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sh.head && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '2px 4px 8px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: AMBER }}>{sh.head.meta}</span>
                      <span className={s.grotesk} style={{ fontSize: 24, lineHeight: 1.12, fontWeight: 600 }}>{sh.head.name}</span>
                      <span style={{ fontSize: 13.5, lineHeight: 1.5, color: '#D5DAE3' }}>{sh.head.sub}</span>
                      <button type="button" className={s.lnk} onClick={sh.head.open} style={{ ...btnAmber, alignSelf: 'flex-start', marginTop: 4 }}><span>{sh.head.cta}</span><LongArrow /></button>
                    </div>
                  )}
                  {sh.rows.map((r, i) => {
                    const num = r.num ? <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', background: AMBER, color: '#07080C', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textShadow: 'none' }}>{r.num}</span> : null;
                    return r.info ? (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '8px 14px', borderRadius: 14, border: '1px solid #222736', background: 'rgba(16,19,28,0.8)' }}>
                        {num}
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#F2C88A' }}>{r.title}</span>
                          <span style={{ fontSize: 15, lineHeight: 1.4, fontWeight: 600 }}>{r.sub}</span>
                        </span>
                      </div>
                    ) : (
                      <button key={i} type="button" className={s.row} onClick={r.go} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '8px 14px', borderRadius: 14, border: `1px solid ${r.on ? AMBER : '#2A3040'}`, background: 'rgba(16,19,28,0.92)', color: '#F1F3F7', cursor: 'pointer', textAlign: 'left' }}>
                        {num}
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{r.title}</span>
                          <span style={{ fontSize: 12.5, lineHeight: 1.4, color: '#BAC2D0' }}>{r.sub}</span>
                        </span>
                        <span style={{ color: '#F2C88A', display: 'flex' }}><Arrow /></span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* ---------- breadcrumbs + readout ---------- */}
            {lvl !== 'home' && (
              <nav aria-label="Zoom depth" className={`${s.blur} ${s.fade} ${s.scroll}`} style={{ position: 'absolute', left: m ? 12 : 24, top: m ? 12 : 24, maxWidth: SW - (m ? 24 : 48), overflowX: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 24, background: 'rgba(9,11,18,0.92)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {crumbs.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color: '#8A93A6', display: 'flex', flexShrink: 0 }}><Arrow size={14} /></span>}
                    <button type="button" onClick={c.go} disabled={c.current} style={{ display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', borderRadius: 18, border: 'none', background: c.current ? 'rgba(242,163,58,0.2)' : 'transparent', color: '#F1F3F7', fontSize: 13.5, fontWeight: 500, cursor: c.current ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>{c.label}</button>
                  </React.Fragment>
                ))}
              </nav>
            )}
            {!m && (
              <div className={`${s.mono} ${s.none}`} style={{ position: 'absolute', left: 24, bottom: 20, padding: '8px 12px', borderRadius: 8, background: 'rgba(9,11,18,0.88)', fontSize: 12, color: '#D5DAE3' }}>{readout}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  private markSub(key: string) {
    const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
    if (key === 'projects') return n(content.projects.length, 'build', 'builds');
    if (key === 'skills') return n(content.skills.length, 'stack', 'stacks');
    if (key === 'about') return 'Who I am';
    if (key === 'hackathons') return n(content.hacks.length, 'event', 'events');
    if (key === 'experience') return n(content.roles.length, 'role', 'roles');
    return 'Get in touch';
  }
}
