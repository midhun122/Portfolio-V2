import { useRef, useState, useEffect, type FormEvent, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  capabilities,
  journey,
  links,
  marqueeItems,
  posts,
  roles,
} from "../data/portfolio";
import { GhostWord, Magnetic, SectionHead } from "./chrome";
import { fadeUp, slideIn, stagger, viewportOnce } from "../lib/anim";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ── stack ticker ── */
export function Marquee() {
  const half = (hidden: boolean) => (
    <div className="marquee-half" aria-hidden={hidden || undefined}>
      {marqueeItems.map((m) => (
        <span key={m}>
          {m} <i>·</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-label="Technologies">
      <div className="marquee-track">
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}

function useGhost() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, progress: scrollYProgress };
}

/* ── about: statement + honest stat tiles ── */
const TILE_ICONS: Record<string, ReactNode> = {
  projects: (
    <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="4.5" width="12" height="9" rx="2" />
      <path d="M5.5 4.5V3.2A1.2 1.2 0 016.7 2h2.6a1.2 1.2 0 011.2 1.2v1.3" />
    </svg>
  ),
  articles: (
    <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 13.5l.7-2.8L10.5 3.9a1.3 1.3 0 011.8 0l.8.8a1.3 1.3 0 010 1.8L6.3 13.3 3.5 14l-.5-.5z" strokeLinejoin="round" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="5.8" cy="5.4" r="2.4" />
      <path d="M1.5 13.5c.7-2.4 2.4-3.7 4.3-3.7s3.6 1.3 4.3 3.7" strokeLinecap="round" />
      <circle cx="11.4" cy="6" r="1.8" />
      <path d="M11.6 9.9c1.5.2 2.5 1.3 2.9 2.9" strokeLinecap="round" />
    </svg>
  ),
  sessions: (
    <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2.5" width="12" height="8" rx="1.5" />
      <path d="M8 10.5V13M5 13.5h6" strokeLinecap="round" />
      <circle cx="8" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const STATS: { value: number; label: string; icon: string }[] = [
  { value: 4, label: "Projects built", icon: "projects" },
  { value: 3, label: "Technical articles", icon: "articles" },
  { value: 20, label: "Students mentored", icon: "students" },
  { value: 5, label: "Sessions & workshops", icon: "sessions" },
];

/* Counts 00 → value on first scroll into view. Still under reduced-motion. */
function CountNum({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{String(n).padStart(2, "0")}</span>;
}

export function About() {
  const { ref, progress } = useGhost();
  // Gentle scroll-linked drift: the whole fan breathes left as you scroll.
  // (Entrance cascade lives on the cards themselves, so the two never fight.)
  const drift = useTransform(progress, [0, 1], [48, -48]);
  return (
    <section className="section about" id="about" aria-label="About" ref={ref}>
      <GhostWord word="ABOUT" progress={progress} />
      <SectionHead
        index="02"
        label="About"
        title={
          <>
            The human behind <em>the commits.</em>
          </>
        }
      />
      <div className="about-grid">
        <motion.div
          className="about-copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="statement">
            I care more about what I&apos;m building than the tools behind
            it — and whether it&apos;s genuinely useful to someone.
          </p>
          <p>
            I&apos;m Midhun, a BCA student from Kerala who enjoys turning
            ideas into things that actually work. I started with the web and
            gradually found myself exploring AI, cloud, open source, and
            hardware along the way.
          </p>
          <p>
            I learn mostly by building — and whenever I can, by sharing what
            I&apos;ve learned through web development and hardware workshops
            for other students.
          </p>
          <div className="about-links">
            <a href={links.github} target="_blank" rel="noopener">
              More on GitHub →
            </a>
          </div>
        </motion.div>
        <motion.div
          className="tiles"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {STATS.map((s) => (
            <motion.div className="tile" key={s.label} variants={fadeUp}>
              <span className="tile-ic" aria-hidden="true">
                {TILE_ICONS[s.icon]}
              </span>
              <span className="tile-n">
                <CountNum value={s.value} />+
              </span>
              <span className="tile-l">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="caps-block">
        <motion.p
          className="caps-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <span className="mono-dim">— Capabilities</span>
          The toolbox, by job.
        </motion.p>
        <motion.p
          className="caps-sub"
          variants={fadeUp}
          custom={0.08}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          Grouped by what each tool is for — not by how well I know it.
        </motion.p>
        <motion.div
          className="fan"
          style={{ x: drift }}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {capabilities.map((g, i) => (
            <motion.div
              className="fan-card"
              key={g.group}
              variants={slideIn}
              style={{ rotate: [-2.5, 1.8, -1.2, 2.4][i % 4] }}
              whileHover={{ rotate: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            >
              <p className="fan-name">{g.group}</p>
              <p className="fan-intent">{g.intent}</p>
              <div className="cap-items">
                {g.items.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── experience: editorial rows, calm foreground ── */

export function Experience() {
  const { ref, progress } = useGhost();
  const smooth = useSpring(progress, { stiffness: 90, damping: 24 });
  return (
    <section className="section xp-sec" id="experience" aria-label="Experience" ref={ref}>
      <GhostWord word="EXPERIENCE" progress={progress} solid />
      <SectionHead
        index="03"
        label="Experience"
        title={
          <>
            Real teams, <em>real work.</em>
          </>
        }
        note="Two roles, both earned as a student — real teams, real responsibilities."
      />
      <div className="xp-progress" aria-hidden="true">
        <motion.div style={{ scaleX: smooth }} />
      </div>
      <motion.ol
        className="xp-rows"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {roles.map((r, i) => (
          <motion.li className="xp-row" key={r.role} variants={fadeUp}>
            <motion.span
              className="xp-rule"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
            <div className="xp-row-in">
              <div className="xp-left">
                <h3 className="xp-role">
                  <sup aria-hidden="true">0{i + 1}</sup>
                  {r.role}
                </h3>
                <p className="xp-co">
                  <span className="xp-chip" aria-hidden="true">
                    {r.org.charAt(0)}
                  </span>
                  {r.org}
                  <span className="xp-period">{r.period}</span>
                </p>
              </div>
              <div className="xp-right">
                <p className="xp-desc">{r.text}</p>
                <p className="xp-take">{r.takeaway}</p>
              </div>
            </div>
            {i === roles.length - 1 && (
              <motion.span
                className="xp-rule end"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              />
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

/* ── journey: sticky header, scrolling entries + timeline spine ── */
export function Journey() {
  const { ref, progress } = useGhost();
  // Straight skeleton spine: fill + head share one hand-measured value,
  // so they cannot disagree. Follows the same manual-progress pattern.
  const listRef = useRef<HTMLOListElement>(null);
  const spine = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      spine.set(clamp01((0.8 * vh - r.top) / (r.height + 0.25 * vh)));
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
  }, [spine]);
  const headTop = useTransform(spine, [0, 1], ["0%", "100%"]);
  return (
    <section className="section journey-sec" id="journey" aria-label="Journey" ref={ref}>
      <GhostWord word="PATH" progress={progress} />
      <div className="split">
        <div className="split-sticky">
          <SectionHead
            index="04"
            label="Journey"
            title={
              <>
                A path <em>built by doing.</em>
              </>
            }
            note="The learning trail behind the roles."
          />
        </div>
        <div className="entries-wrap">
          <div className="spine" aria-hidden="true">
            <motion.div className="spine-fill" style={{ scaleY: spine }} />
            <motion.div className="spine-head" style={{ top: headTop }} />
          </div>
        <motion.ol
          className="entries"
          ref={listRef}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {journey.map((m, i) => (
            <motion.li className="entry" key={m.phase} variants={fadeUp}>
              <p className="entry-idx">0{i + 1}</p>
              <div>
                <p className="entry-phase">
                  {m.phase} <span className={`estate is-${m.state}`}>{m.state}</span>
                </p>
                <h3 className="entry-title">{m.title}</h3>
                <p className="entry-text">{m.text}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
        </div>
      </div>
      <motion.div
        className="edu"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <p className="edu-label">Education</p>
        <div className="edu-row">
          <div>
            <h4>BCA, Computer Applications</h4>
            <p>Kristu Jyoti College of Management and Technology · Kerala, India</p>
          </div>
          <span>2025 – 2028 · expected</span>
        </div>
        <p className="edu-sub">Data Structures · Operating Systems · C · Web Development</p>
      </motion.div>
    </section>
  );
}

/* ── writing: topic-pill cards ── */
export function Writing() {
  const { ref, progress } = useGhost();
  return (
    <section className="section writing" id="writing" aria-label="Writing and experiments" ref={ref}>
      <GhostWord word="NOTES" progress={progress} />
      <SectionHead
        index="05"
        label="Writing / Experiments"
        title={
          <>
            Field notes from <em>the lab.</em>
          </>
        }
        note="Essays on AI, systems, and hardware — published with the Inovus Labs blog."
        link={{ label: "All articles", href: links.blog }}
      />
      <motion.div
        className="post-grid"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {posts.map((w) => (
          <motion.a
            className="post-card"
            key={w.index}
            href={w.url}
            target="_blank"
            rel="noopener"
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            data-cursor="read"
          >
            <p className="post-top">
              <span className="post-pill">{w.topic}</span>
              <span className="post-idx">/{w.index}</span>
            </p>
            <h3 className="post-title">{w.title}</h3>
            <p className="post-note">{w.note}</p>
            <span className="post-link">
              Read article <span aria-hidden="true">↗</span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

/* ── contact: form + elsewhere card ── */
type FormState = "idle" | "sending" | "sent" | "blocked" | "rejected";

export function Contact() {
  const { ref, progress } = useGhost();
  const [state, setState] = useState<FormState>("idle");
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture the form NOW: React nullifies e.currentTarget once the
    // synchronous dispatch ends, so touching it after an await throws.
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch(links.formspree, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setState("sent");
        form.reset();
      } else {
        // Server reachable but refused (spam filter, limits, inactive form…).
        // Status is logged so the cause can be looked up, not guessed.
        console.warn(`Contact form rejected: HTTP ${res.status}`);
        setState("rejected");
      }
    } catch (err) {
      // Network-level failure: privacy shields / ad-blockers blocking the
      // third-party POST are the usual cause (Brave Shields does this).
      console.warn("Contact form unreachable:", err);
      setState("blocked");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — mailto still works */
    }
  };

  const note =
    state === "sending"
      ? "Sending — one moment…"
      : state === "sent"
        ? "Received. I'll get back to you soon."
        : state === "blocked"
          ? "Couldn't reach the form service — privacy shields or ad-blockers sometimes block it."
          : state === "rejected"
            ? "The form service refused the message — the reason is logged to the console."
            : "";

  return (
    <section className="section contact" id="contact" aria-label="Contact" ref={ref}>
      <GhostWord word="HELLO" progress={progress} />
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <p className="sec-label">
          <motion.span
            className="rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />
          <span className="num">06</span>Contact
        </p>
        <h2 className="contact-title">
          Got something interesting? <em>Say hello.</em>
        </h2>
        <p className="avail">
          <span className="ok-dot" aria-hidden="true" />
          Available for work
        </p>
      </motion.div>
      <div className="contact-grid">
        <motion.form
          className="c-form"
          onSubmit={onSubmit}
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
          </label>
          <label className="full">
            Message
            <textarea name="message" placeholder="What are you building?" required />
          </label>
          <Magnetic className="magnetic">
            <button type="submit" className="btn-solid full" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send message ➤"}
            </button>
          </Magnetic>
          <p className="form-note" role="status" aria-live="polite">
            {note}
            {(state === "blocked" || state === "rejected") && (
              <>
                {" "}
                <a href={`mailto:${links.email}`}>Email me directly ↗</a>
              </>
            )}
          </p>
        </motion.form>
        <motion.div
          className="elsewhere"
          variants={fadeUp}
          custom={0.18}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="else-k">Elsewhere</p>
          <div className="else-row">
            <span className="else-ic" aria-hidden="true">✉</span>
            <span>
              <span className="else-l">Email</span>
              <a className="else-v" href={`mailto:${links.email}`}>
                {links.email}
              </a>
            </span>
            <button type="button" className="copy" onClick={copyEmail} aria-label="Copy email address">
              {copied ? "✓" : "⧉"}
            </button>
          </div>
          <a className="else-row" href={links.github} target="_blank" rel="noopener">
            <span className="else-ic" aria-hidden="true">⌨</span>
            <span>
              <span className="else-l">GitHub</span>
              <span className="else-v">midhun122</span>
            </span>
            <span className="else-go" aria-hidden="true">↗</span>
          </a>
          <a className="else-row" href={links.linkedin} target="_blank" rel="noopener">
            <span className="else-ic" aria-hidden="true">in</span>
            <span>
              <span className="else-l">LinkedIn</span>
              <span className="else-v">midhunsujithnair</span>
            </span>
            <span className="else-go" aria-hidden="true">↗</span>
          </a>
          <p className="else-note">Based in Kerala, India. I usually reply within a couple of days.</p>
        </motion.div>
      </div>
    </section>
  );
}
