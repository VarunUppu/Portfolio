import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTIONS } from '../data.js';
import { setWipe, jumpTo, lenis } from '../lib/scroll.js';

// Mint panel (with rounded top/bottom edges made from pseudo-elements) slides up over the page,
// the page jumps while it is fully covered, then the panel lifts away. Transforms only, so it stays on the GPU.
export default function Transition() {
  const panel = useRef(), inner = useRef(), num = useRef(), name = useRef(), busy = useRef(false);
  useEffect(() => {
    setWipe((target) => {
      if (busy.current) return; busy.current = true;
      const i = Math.max(0, SECTIONS.findIndex(([s]) => s === target.replace('#', '')));
      num.current.textContent = String(i + 1).padStart(2, '0');
      name.current.textContent = i === 0 ? 'Home' : SECTIONS[i][1];
      const p = panel.current, off = innerHeight + 100;
      lenis?.stop();                                            // no scrolling underneath
      gsap.timeline({ onComplete: () => { busy.current = false; lenis?.start(); } })
        .set(p, { display: 'flex', y: off })
        .to(p, { y: 0, duration: 0.7, ease: 'power3.inOut', force3D: true })
        .fromTo(inner.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.25')
        .add(() => {
          jumpTo(target);
          ScrollTrigger.getAll().forEach((st) => st.getTween?.()?.progress(1));   // finish scrubbed animations instantly
        })
        .to({}, { duration: 0.35 })                             // short hold while the page settles
        .to(inner.current, { opacity: 0, duration: 0.2 }, '<')
        .to(p, { y: -off, duration: 0.7, ease: 'power3.inOut' })
        .set(p, { display: 'none' });
    });
    return () => setWipe(null);
  }, []);
  return (
    <div id="tr" ref={panel} aria-hidden="true">
      <div className="tr-in" ref={inner}><span className="mono" ref={num} /><b ref={name} /></div>
    </div>
  );
}