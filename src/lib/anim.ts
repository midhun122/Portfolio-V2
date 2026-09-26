import type { Variants } from "framer-motion";

/** Shared entrance language: rise + fade, expo-out.
    NOTE: no blur filter here — animating blur on large cards forces
    full repaints every frame and janks on weaker GPUs. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Horizontal entrance: slides in from the right, settles left. */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 140 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Mirror entrance: slides in from the left. */
export const slideInL: Variants = {
  hidden: { opacity: 0, x: -140 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export const viewportOnce = { once: true, margin: "-80px" } as const;
