import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { links } from "../data/portfolio";
import { Magnetic } from "./chrome";
import Terminal from "./Terminal";

const lineWrap: Variants = {
  hidden: {},
  show: (d: number = 0) => ({ transition: { staggerChildren: 0.12, delayChildren: d } }),
};
const lineInner: Variants = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

/* Typewriter: types, holds, deletes, next word. */
const WORDS = ["frontend interfaces", "AI experiments", "serverless backends", "hardware that blinks"];
function useTypewriter() {
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? WORDS[0] : "");
  useEffect(() => {
    if (reduce) return;
    let wi = 0, ci = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const w = WORDS[wi];
      ci += del ? -1 : 1;
      setText(w.slice(0, ci));
      let ms = del ? 34 : 62;
      if (!del && ci === w.length) {
        ms = 1700;
        del = true;
      } else if (del && ci === 0) {
        del = false;
        wi = (wi + 1) % WORDS.length;
        ms = 420;
      }
      t = setTimeout(tick, ms);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [reduce]);
  return text;
}

/* Restrained cursor-reactive dot field. Off on touch / reduced-motion. */
function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (cv) cv.style.display = "none";
      return;
    }
    const ctx = cv.getContext("2d")!;
    let dots: { x: number; y: number }[] = [];
    let mx = -9999, my = -9999, w = 0, h = 0;

    const size = () => {
      const r = cv.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const gap = 46;
      for (let yy = gap / 2; yy < h; yy += gap)
        for (let xx = gap / 2; xx < w; xx += gap) dots.push({ x: xx, y: yy });
    };
    size();
    window.addEventListener("resize", size);
    const host = cv.parentElement!;
    const move = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const leave = () => {
      mx = -9999;
      my = -9999;
    };
    host.addEventListener("mousemove", move);
    host.addEventListener("mouseleave", leave);

    // Run the loop only while the hero is actually on screen — an always-on
    // full-viewport canvas is pure wasted GPU once you scroll past it.
    let raf = 0;
    let on = false;
    const draw = () => {
      raf = 0;
      if (!on) return;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my;
        const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 190);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1 + glow * 1.6, 0, Math.PI * 2);
        ctx.fillStyle =
          glow > 0.02
            ? `rgba(217,166,72,${(0.1 + glow * 0.55).toFixed(3)})`
            : "rgba(236,231,220,0.10)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (on && !raf) raf = requestAnimationFrame(draw);
    };
    const vis = () => {
      const r = host.getBoundingClientRect();
      on = r.bottom > 0 && r.top < window.innerHeight && !document.hidden;
      if (!on && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      kick();
    };
    const io = new IntersectionObserver(vis, { threshold: 0 });
    io.observe(host);
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("scroll", vis, { passive: true });
    vis();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("scroll", vis);
      window.removeEventListener("resize", size);
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, [reduce]);

  return <canvas className="hero-field" ref={ref} aria-hidden="true" />;
}

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypewriter();
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const ox = useSpring(mx, { stiffness: 46, damping: 20, mass: 0.8 });
  const oy = useSpring(my, { stiffness: 46, damping: 20, mass: 0.8 });

  return (
    <section
      className="hero"
      id="home"
      aria-label="Introduction"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
    >
      <DotField />
      {!reduce && (
        <motion.div className="hero-orb" aria-hidden="true" style={{ x: ox, y: oy, left: 0, top: 0 }} />
      )}
      <div className="hero-inner">
        <div className="hero-grid">
          <div>
            <motion.p
              className="kicker"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="k-dot" aria-hidden="true" />
              Midhun Sujith Nair
            </motion.p>

            <motion.h1
              className="hero-title"
              variants={lineWrap}
              custom={0.45}
              initial="hidden"
              animate="show"
            >
              <span className="line">
                <motion.span variants={lineInner}>Building for the web,</motion.span>
              </span>
              <span className="line">
                <motion.span variants={lineInner}>
                  curious <em>beyond it.</em>
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              I&apos;m Midhun - a BCA student and developer working mostly in
              frontend, currently stretching into backend, AI, cloud, and small
              hardware experiments.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Magnetic>
                <a className="btn-solid" href="#work">
                  View work <span aria-hidden="true">→</span>
                </a>
              </Magnetic>
              <a className="btn-line" href="#writing">
                Read the notes
              </a>
              <a className="text-link" href={links.github} target="_blank" rel="noopener">
                GitHub ↗
              </a>
              <a
                className="text-link"
                href={links.resume}
                download={links.resumeFilename}
                aria-label="Download resume as PDF"
              >
                Resume ↓
              </a>
              <a className="text-link" href={links.linkedin} target="_blank" rel="noopener">
                LinkedIn ↗
              </a>
            </motion.div>
          </div>

          <Terminal />
        </div>

        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.45 }}
        >
          <span>◷ Kerala, India</span>
          <span className="ok">● Available for work</span>
          <span className="typed">
            into <b>{typed}</b>
            <span className="caret" aria-hidden="true" />
          </span>
        </motion.div>
      </div>
      <a className="hero-down" href="#work" aria-label="Scroll to work">
        ↓
      </a>
    </section>
  );
}
