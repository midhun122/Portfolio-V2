import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initSmoothScroll(on: boolean): () => void {
  if (!on) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  let raf = 0;
  const loop = (t: number) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  // Route all in-page anchors through Lenis for buttery jumps.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollToId(id);
  };
  document.addEventListener("click", onClick);
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("click", onClick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  if (lenis) lenis.scrollTo(id, { offset: -70, duration: 1.4 });
  else document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
