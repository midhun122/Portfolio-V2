import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/* Scroll-drawn thread floating ABOVE the content (like the reference):
   thin, pointer-transparent, always visible — it can never hide behind
   panels because it never goes behind them. The bright head is part of the
   line itself, so tip and trail share one computation. */

type Pt = [number, number];

// Enters off the left edge, cruises the middle band in wide gentle arcs,
// exits off the right edge. Narrow swing = no sudden turns.
const PTS: Pt[] = [
  [-60, 130],
  [350, 210],
  [580, 300],
  [620, 420],
  [500, 520],
  [420, 630],
  [540, 730],
  [620, 830],
  [960, 975],
];
const NODES = [
  { x: PTS[2][0], y: PTS[2][1] },
  { x: PTS[4][0], y: PTS[4][1] },
  { x: PTS[6][0], y: PTS[6][1] },
];

function smoothPath(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const D = smoothPath(PTS);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function ThreadZone({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  // Path lengths are constant (static geometry) — measure once, never per frame.
  const lens = useRef<{ core: number; glow: number; head: number } | null>(null);
  const reduce = useReducedMotion();
  // Manual progress from a fresh rect every scroll frame — no cached
  // measurements to go stale. The tip is pinned to the viewport CENTER, so
  // it cannot run ahead of (or lag behind) the scroll at any speed: it IS
  // the scroll position. Raw value drives the draw, no spring in between.
  const raw = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const trackTop = r.top + window.scrollY + 150;
      const trackH = Math.max(1, r.height - 230);
      raw.set(clamp01((window.scrollY + 0.5 * vh - trackTop) / trackH));
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [raw]);
  const n1 = useTransform(raw, [0.3, 0.42], [0.15, 1]);
  const n2 = useTransform(raw, [0.45, 0.58], [0.15, 1]);
  const n3 = useTransform(raw, [0.61, 0.74], [0.15, 1]);
  const nodeOp = [n1, n2, n3];

  // Continuous draw from the path start; head fused to the tip.
  useMotionValueEvent(raw, "change", (v) => {
    const t = clamp01(v);
    const core = coreRef.current;
    const glow = glowRef.current;
    const head = headRef.current;
    if (!core || !glow || !head) return;
    if (!lens.current) {
      lens.current = {
        core: core.getTotalLength(),
        glow: glow.getTotalLength(),
        head: head.getTotalLength(),
      };
    }
    const seg = (el: SVGPathElement, len: number, frac: number) => {
      const vis = Math.min(len * frac, len * t);
      el.style.strokeDasharray = `${vis.toFixed(1)} ${len.toFixed(1)}`;
      el.style.strokeDashoffset = `${(len * t - vis).toFixed(1)}`;
    };
    const L = lens.current;
    seg(core, L.core, 1);
    seg(glow, L.glow, 1);
    seg(head, L.head, 0.014);
  });

  if (reduce) return <>{children}</>;

  return (
    <div className="thread-zone" ref={ref}>
      <div className="thread-track" aria-hidden="true">
        <svg
          className="thread-svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          {/* Faint dotted route: always visible, zero animation cost. */}
          <path
            d={D}
            fill="none"
            stroke="#d9a648"
            strokeOpacity="0.16"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1 9"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={glowRef}
            d={D}
            fill="none"
            stroke="#d9a648"
            strokeWidth="3.5"
            opacity="0.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
          <path
            ref={coreRef}
            d={D}
            fill="none"
            stroke="#e9bd63"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
          <path
            ref={headRef}
            d={D}
            fill="none"
            stroke="#f5d78e"
            strokeWidth="4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
        </svg>
        {NODES.map((n, i) => (
          <motion.div
            key={i}
            className="thread-node"
            style={{
              left: `${(n.x / 1000) * 100}%`,
              top: `${(n.y / 1000) * 100}%`,
              opacity: nodeOp[i],
            }}
          >
            <span />
          </motion.div>
        ))}
      </div>
      {children}
    </div>
  );
}
