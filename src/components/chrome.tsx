import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { scrollToTop } from "../lib/scroll";
import { fadeUp, viewportOnce } from "../lib/anim";

/* ── scroll progress bar ── */
export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/* ── cursor: dot + trailer ring, grows over [data-cursor] zones ── */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dx = useSpring(-100, { stiffness: 900, damping: 55, mass: 0.3 });
  const dy = useSpring(-100, { stiffness: 900, damping: 55, mass: 0.3 });
  const rx = useSpring(-100, { stiffness: 220, damping: 24, mass: 0.6 });
  const ry = useSpring(-100, { stiffness: 220, damping: 24, mass: 0.6 });
  const [hov, setHov] = useState(false);
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: globalThis.MouseEvent) => {
      dx.set(e.clientX);
      dy.set(e.clientY);
      rx.set(e.clientX);
      ry.set(e.clientY);
    };
    const over = (e: globalThis.MouseEvent) => {
      const t = e.target as HTMLElement;
      setGrow(!!t.closest?.("[data-cursor]"));
      setHov(!!t.closest?.("a, button, input, textarea"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [reduce, dx, dy, rx, ry]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" aria-hidden="true" style={{ x: dx, y: dy, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        className="cursor-ring"
        aria-hidden="true"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: grow ? 2.6 : hov ? 1.6 : 1, opacity: grow ? 0.95 : hov ? 0.9 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </>
  );
}

/* ── magnetic wrapper: subtle pull toward cursor ── */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── floating pill nav with scroll-spy ── */
const ICONS: Record<string, ReactNode> = {
  home: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2" strokeLinecap="round" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="4.5" width="12" height="9" rx="2" />
      <path d="M5.5 4.5V3.2A1.2 1.2 0 016.7 2h2.6a1.2 1.2 0 011.2 1.2v1.3" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="5.2" r="2.6" />
      <path d="M2.5 13.5c.8-2.6 2.9-4 5.5-4s4.7 1.4 5.5 4" strokeLinecap="round" />
    </svg>
  ),
  journey: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.5 13.5c3-1 2-5 4.5-6s3-4.5 6.5-5" strokeLinecap="round" strokeDasharray="2.4 1.8" />
      <circle cx="13" cy="2.8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  writing: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 13.5l.7-2.8L10.5 3.9a1.3 1.3 0 011.8 0l.8.8a1.3 1.3 0 010 1.8L6.3 13.3 3.5 14l-.5-.5z" strokeLinejoin="round" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="2" />
      <path d="M3 5.5l5 3.5 5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" />
      <circle cx="8" cy="6.4" r="1.7" />
      <path d="M4.8 11.4c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4" strokeLinecap="round" />
    </svg>
  ),
};

const NAV = [
  { id: "work", label: "Work", href: "#work" },
  { id: "about", label: "About", href: "#about" },
  { id: "writing", label: "Writing", href: "#writing" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export function Nav() {
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-38% 0px -55% 0px" }
    );
    ["home", "work", "about", "experience", "journey", "writing", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 420);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      className={`nav-float${hidden ? " hidden" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
    >
      <nav className="pill" aria-label="Sections">
        <a className="pill-mark" href="#top" aria-label="Back to top">
          m<span>.</span>n
        </a>
        <span className="pill-div" aria-hidden="true" />
        {NAV.map((n) => (
          <a
            key={n.id}
            href={n.href}
            className={`pill-link${active === n.id ? " active" : ""}`}
            aria-current={active === n.id ? "true" : undefined}
          >
            {ICONS[n.id]}
            <span>{n.label}</span>
          </a>
        ))}
        <a className="pill-cta" href="#contact">
          Let&apos;s talk
        </a>
      </nav>
    </motion.header>
  );
}

/* ── giant ghost word with scroll parallax ── */
export function GhostWord({ word, progress }: { word: string; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], ["4%", "-8%"]);
  return (
    <div className="ghost" aria-hidden="true">
      <motion.span style={{ x }}>{word}</motion.span>
    </div>
  );
}

/* ── section heading: drawing dash rule + rising title + pill link ── */
export function SectionHead({
  index,
  label,
  title,
  note,
  link,
}: {
  index: string;
  label: string;
  title: ReactNode;
  note?: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="sec-head">
      <motion.p
        className="sec-label"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.span
          className="rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <span className="num">{index}</span>
        {label}
      </motion.p>
      <div className="sec-title-row">
        <motion.h2
          className="sec-title"
          variants={fadeUp}
          custom={0.08}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {title}
        </motion.h2>
        {link && (
          <motion.a
            className="sec-pill"
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener" : undefined}
            variants={fadeUp}
            custom={0.14}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {link.label} <span aria-hidden="true">→</span>
          </motion.a>
        )}
      </div>
      {note && (
        <motion.p
          className="sec-note"
          variants={fadeUp}
          custom={0.16}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {note}
        </motion.p>
      )}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <p>© {year} Midhun Sujith Nair — designed & built by hand.</p>
      <p className="foot-r">
        <a href="https://github.com/midhun122" target="_blank" rel="noopener">
          GitHub
        </a>
        <button onClick={scrollToTop} type="button">
          Top ↑
        </button>
      </p>
    </footer>
  );
}
