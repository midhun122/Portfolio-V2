import { motion, useScroll, useTransform } from "framer-motion";

/* One continuous environment: faint structural grid + a single soft amber
   wash (plus a far weaker secondary where composition needs it). Fixed,
   pointer-transparent, above base fills, below all content. The primary
   wash drifts slower than anything else on the page. */
export default function Atmosphere() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="gridlines" />
      <motion.div className="ambient a1" style={{ y }} />
      <div className="ambient a2" />
    </div>
  );
}
