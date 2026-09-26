import { useRef, useState, useEffect, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { links, projects, type Project, type VisualKind } from "../data/portfolio";
import { GhostWord, SectionHead } from "./chrome";
import { slideIn, viewportOnce } from "../lib/anim";

/* CSS-composed project preview with subtle pointer tilt. */
function ProjectVisual({ kind, compact }: { kind: VisualKind; compact?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 160, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ display: "contents" }}>
      <motion.div
        className={compact ? "mock sm" : "mock"}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        aria-hidden="true"
      >
        {kind === "aether" && (
          <>
            <div className="mock-sky">
              <div className="mock-temp">24°</div>
              <div className="mock-city">
                KOCHI<br />
                FEELS 26°
              </div>
            </div>
            <div className="mock-ai">
              <b>Aether AI</b> — light breeze, high clouds. Leave the umbrella; take
              the long way home.
            </div>
            <div className="mock-bars">
              {[40, 65, 50, 85, 60, 75, 45].map((hgt, i) => (
                <motion.i
                  key={i}
                  initial={{ height: "8%" }}
                  whileInView={{ height: `${hgt}%` }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
          </>
        )}
        {kind === "qr" && (
          <div className="qr-grid">
            {Array.from({ length: 81 }, (_, i) => {
              const cls = (i * 37 + 11) % 5 < 2 ? "f" : (i * 53 + 7) % 11 === 0 ? "a" : "";
              return <i key={i} className={cls} />;
            })}
          </div>
        )}
        {kind === "pass" && (
          <>
            <div className="mock-pass-head">
              <div className="mock-avatar" />
              <div className="mock-idlines">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="mock-rx">
              <b>RxDecode</b> — 2 medicines found · Amoxicillin 500mg · 3× daily ✓
            </div>
          </>
        )}
        {kind === "event" && (
          <>
            <div className="mock-ev live">
              <b>Opening Keynote</b>
              <span>09:30 · LIVE</span>
            </div>
            <div className="mock-ev">
              <b>Hack Night</b>
              <span>18:00 · HALL B</span>
            </div>
            <div className="mock-ev">
              <b>Demo Day</b>
              <span>SAT · MAIN STAGE</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function RailCard({ p }: { p: Project }) {
  return (
    <motion.article
      className="rail-card"
      variants={slideIn}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      data-cursor="view"
    >
      <div className={`rail-visual v-${p.visual}`}>
        <ProjectVisual kind={p.visual} compact />
        <span className="status">{p.status}</span>
      </div>
      <div className="rail-body">
        <p className="rail-meta">
          {p.year} · {p.index}
        </p>
        <h3 className="rail-name">{p.name}</h3>
        <p className="rail-tag">{p.tagline}</p>
        <p className="rail-desc">{p.description}</p>
        <div className="stack">
          {p.stack.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="work-links">
          <a href={p.github} target="_blank" rel="noopener">
            GitHub ↗
          </a>
          {p.live ? (
            <a href={p.live} target="_blank" rel="noopener">
              Live site ↗
            </a>
          ) : (
            <a className="missing" aria-hidden="true" tabIndex={-1}>
              Live — soon
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const secRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setProg(max > 0 ? rail.scrollLeft / max : 0);
    };
    onScroll();
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  const nudge = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <section className="section work-sec" id="work" aria-label="Selected work" ref={secRef}>
      <GhostWord word="WORK" progress={scrollYProgress} />
      <SectionHead
        index="01"
        label="Selected work"
        title={
          <>
            Work that <em>escaped the terminal.</em>
          </>
        }
        note="Small builds with real links — each one taught me something I didn't know before."
        link={{ label: "GitHub", href: links.github }}
      />
      <motion.div
        className="rail"
        ref={railRef}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {projects.map((p) => (
          <RailCard key={p.id} p={p} />
        ))}
      </motion.div>
      <div className="rail-foot">
        <div className="rail-track" aria-hidden="true">
          <motion.div className="rail-fill" style={{ scaleX: prog }} />
        </div>
        <div className="rail-nav">
          <button type="button" onClick={() => nudge(-1)} aria-label="Scroll projects left">
            ←
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Scroll projects right">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
