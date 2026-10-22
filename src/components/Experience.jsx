import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DESKTOP_MOTION, MOBILE_MOTION, EASE } from '../lib/scroll.js';

export default function Experience() {
  const root = useRef();
  useGSAP(() => {
    const mm = gsap.matchMedia(), st = { trigger: '#job', start: 'top 85%', once: true };
    // EDUCATION → EXPERIENCE: the internship card sweeps in from the right and covers the education stack
    mm.add(DESKTOP_MOTION, () => { gsap.from('#job', { x: 140, opacity: 0, duration: 1, ease: EASE, scrollTrigger: st }); });
    mm.add(MOBILE_MOTION, () => { gsap.from('#job', { y: 24, opacity: 0, duration: 0.7, ease: EASE, scrollTrigger: st }); });
    return () => mm.revert();
  }, { scope: root });
  return (
    <section id="experience" ref={root}>
      <div className="wrap">
        <div className="head"><div className="label mono"><b>04</b><i />EXPERIENCE</div><span className="cnt mono">04 / 07</span></div>
        <h2>Shipping inside a real product.</h2>
        <article className="job card" id="job">
          <div>
            <div className="k mono"><span>JUL 2025 – AUG 2025</span><span>INTERNSHIP</span></div>
            <h3>Software Development Intern</h3><div className="co">The Art of Living</div>
            <div className="tags"><span>MongoDB</span><span>Express.js</span><span>React.js</span><span>Node.js</span><span>TypeScript</span></div>
          </div>
          <div>
            <h4>Asset Registry module</h4><p>Built a full-stack module with complete CRUD, a responsive modal-driven React UI and optimized backend APIs for efficient asset management.</p>
            <h4>Faster, more reliable</h4><p style={{ margin: 0 }}>Used MongoDB Aggregation Pipelines to shrink API payloads and speed up UI loads, and fixed an asynchronous race condition that caused false error reports.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
