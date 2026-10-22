import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader.jsx";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Transition from './components/Transition.jsx';
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Education from "./components/Education.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { initScroll, lenis } from "./lib/scroll.js";

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => initScroll(), []);
  useEffect(() => {
    // hold scroll during the startup sequence
    if (ready) lenis?.start();
    else lenis?.stop();
  }, [ready]);
  useEffect(() => {
    // recalc trigger positions once fonts/layout settle
    const r = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(r);
    addEventListener("load", r);
    return () => removeEventListener("load", r);
  }, []);
  const done = useCallback(() => setReady(true), []);
  return (
    <>
      <div className="dots" aria-hidden="true" />
      <Cursor />
      <Transition />
      <Loader onDone={done} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
