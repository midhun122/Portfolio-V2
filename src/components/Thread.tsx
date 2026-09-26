import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* A scroll-drawn glowing thread flowing from one section into the next.
   The curve is generated through fixed waypoints (Catmull-Rom), so the
   anchor nodes and comet always sit exactly on the line. Line strokes use
   non-scaling-stroke; nodes/comet are HTML so they stay perfectly round. */

type Pt = [number, number];

// Waypoints in a 1000x1000 space: left → center → right → center → left…
// Nodes sit ON pts[2], pts[4] and pts[6].
const PTS: Pt[] = [
  [80, -20],
  [480, 120],
  [900, 260],
  [520, 400],
  [110, 540],
  [480, 680],
  [900, 820],
  [520, 950],
  [150, 1020],
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
  const haloRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);
  // Path lengths are constant (static geometry) — measure once, never per frame.
  const lens = useRef<{ core: number; glow: number; halo: number; head: number } | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  // Tight spring: the line must track the scroll, not trail it.
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 26 });
  const n1 = useTransform(smooth, [0.06, 0.2], [0.15, 1]);
  const n2 = useTransform(smooth, [0.4, 0.55], [0.15, 1]);
  const n3 = useTransform(smooth, [0.74, 0.9], [0.15, 1]);
  const nodeOp = [n1, n2, n3];

  // Single cheap driver. The bright head is part of the line itself (last
  // 1.2% of the same dash window), so tip and trail share one computation
  // and can never disagree. Cached lengths, no layout reads, no filters.
  useMotionValueEvent(smooth, "change", (v) => {
    const t = clamp01(v);
    const core = coreRef.current;
    const glow = glowRef.current;
    const halo = haloRef.current;
    const head = headRef.current;
    if (!core || !glow || !halo || !head) return;
    if (!lens.current) {
      lens.current = {
        core: core.getTotalLength(),
        glow: glow.getTotalLength(),
        halo: halo.getTotalLength(),
        head: head.getTotalLength(),
      };
    }
    // Trail window ending exactly at t; head window is the same window's tip.
    const seg = (el: SVGPathElement, len: number, frac: number) => {
      const vis = Math.min(len * frac, len * t);
      el.style.strokeDasharray = `${vis.toFixed(1)} ${len.toFixed(1)}`;
      el.style.strokeDashoffset = `${(len * t - vis).toFixed(1)}`;
    };
    const L = lens.current;
    seg(core, L.core, 0.13);
    seg(glow, L.glow, 0.13);
    seg(halo, L.halo, 0.13);
    seg(head, L.head, 0.012);
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
          <defs>
            <linearGradient id="threadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9a648" stopOpacity="0" />
              <stop offset="0.2" stopColor="#d9a648" stopOpacity="1" />
              <stop offset="0.8" stopColor="#e9bd63" stopOpacity="1" />
              <stop offset="1" stopColor="#d9a648" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Faint dotted route: always visible, zero animation cost. The bright
              traveling segment (below) hugs the comet; nothing accumulates. */}
          <path
            d={D}
            fill="none"
            stroke="#d9a648"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1 9"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={haloRef}
            d={D}
            fill="none"
            stroke="url(#threadGrad)"
            strokeWidth="8"
            opacity="0.16"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
          <path
            ref={glowRef}
            d={D}
            fill="none"
            stroke="url(#threadGrad)"
            strokeWidth="4.5"
            opacity="0.32"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
          <path
            ref={coreRef}
            d={D}
            fill="none"
            stroke="url(#threadGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="0 10000"
          />
          <path
            ref={headRef}
            d={D}
            fill="none"
            stroke="#f5d78e"
            strokeWidth="5"
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
