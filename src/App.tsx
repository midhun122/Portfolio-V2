import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { Cursor, Footer, Nav, Progress } from "./components/chrome";
import Hero from "./components/Hero";
import Work from "./components/Work";
import { About, Contact, Experience, Journey, Marquee, Writing } from "./components/Sections";
import { ThreadZone } from "./components/Thread";
import { initSmoothScroll } from "./lib/scroll";

export default function App() {
  const reduce = useReducedMotion();

  useEffect(() => initSmoothScroll(!reduce), [reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#work">
        Skip to work
      </a>
      <Progress />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Work />
        <About />
        <ThreadZone>
          <Experience />
          <Journey />
        </ThreadZone>
        <Writing />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
