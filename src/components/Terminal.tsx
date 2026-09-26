import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { links } from "../data/portfolio";
import { scrollToId } from "../lib/scroll";

interface Line {
  cmd?: string;
  out?: string;
}

const BOOT: Line[] = [
  { cmd: "whoami" },
  { out: "midhun — frontend developer, bca student" },
  { cmd: "stack --current" },
  { out: "react · typescript · tailwind · gemini · cloudflare" },
  { cmd: "status" },
  { out: "● building aether + inoqr — open to work" },
];

const HELP = "commands: whoami · stack · status · work · writing · mail · github · clear";

function run(raw: string): { outs: string[]; clear?: boolean } {
  const c = raw.trim().toLowerCase();
  if (!c) return { outs: [] };
  switch (c) {
    case "help":
      return { outs: [HELP] };
    case "whoami":
      return { outs: ["midhun sujith nair — bca student, kerala in"] };
    case "stack":
    case "stack --current":
      return { outs: ["react · typescript · tailwind · node · gemini · cloudflare"] };
    case "status":
      return { outs: ["● available for work — inbox open"] };
    case "work":
      scrollToId("#work");
      return { outs: ["scrolling you to the work…"] };
    case "writing":
    case "notes":
      scrollToId("#writing");
      return { outs: ["scrolling you to the notes…"] };
    case "mail":
    case "email":
    case "contact":
      window.location.href = `mailto:${links.email}`;
      return { outs: [`opening mail → ${links.email}`] };
    case "github":
      window.open(links.github, "_blank", "noopener");
      return { outs: ["opening github in a new tab…"] };
    case "linkedin":
      window.open(links.linkedin, "_blank", "noopener");
      return { outs: ["opening linkedin in a new tab…"] };
    case "clear":
      return { outs: [], clear: true };
    case "sudo":
      return { outs: ["nice try. this terminal has no sudo."] };
    case "hello":
    case "hi":
      return { outs: ["hey. type 'help' to look around."] };
    default:
      return { outs: [`command not found: ${raw.trim()} — try 'help'`] };
  }
}

export default function Terminal() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const inView = useInView(boxRef, { once: true, margin: "-40px" });

  // Boot sequence: types its own commands on first view.
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduce) {
      setLines(BOOT);
      setReady(true);
      return;
    }
    let i = 0;
    let ci = 0;
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      if (cancelled || i >= BOOT.length) {
        if (!cancelled) setReady(true);
        return;
      }
      const item = BOOT[i];
      if (item.cmd !== undefined) {
        if (ci <= item.cmd.length) {
          setTyping(item.cmd.slice(0, ci));
          ci++;
          t = setTimeout(step, 40 + Math.random() * 55);
        } else {
          setLines((p) => [...p, item]);
          setTyping("");
          ci = 0;
          i++;
          t = setTimeout(step, 200);
        }
      } else {
        setLines((p) => [...p, item]);
        i++;
        t = setTimeout(step, 340);
      }
    };
    t = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [inView, reduce]);

  // Keep latest output visible.
  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { outs, clear } = run(value);
    if (clear) setLines([]);
    else {
      const entry: Line[] = value.trim() ? [{ cmd: value.trim() }] : [];
      setLines((p) => [...p, ...entry, ...outs.map((out) => ({ out }))]);
    }
    setValue("");
  };

  return (
    <motion.aside
      className="term"
      aria-label="Interactive terminal"
      ref={boxRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="term-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>midhun@web ~</em>
      </div>
      <div className="term-out" ref={outRef} aria-live="polite">
        {lines.map((l, i) =>
          l.cmd !== undefined ? (
            <p key={i} className="t-cmd">
              <span aria-hidden="true">$ </span>
              {l.cmd}
            </p>
          ) : (
            <p key={i} className="t-out">
              {l.out}
            </p>
          )
        )}
        {!ready && (
          <p className="t-cmd">
            <span aria-hidden="true">$ </span>
            {typing}
            <span className="t-caret" aria-hidden="true" />
          </p>
        )}
      </div>
      <form className="term-in" onSubmit={onSubmit}>
        <span aria-hidden="true">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={ready ? "type 'help'…" : "booting…"}
          aria-label="Terminal input. Type help for commands."
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </motion.aside>
  );
}
