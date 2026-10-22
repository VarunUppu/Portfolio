import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AvatarStage from './Avatar.jsx';
import { LINKS } from '../data.js';
import { EASE } from '../lib/scroll.js';

export default function Contact() {
  const root = useRef(), [wave, setWave] = useState(false), [copied, setCopied] = useState('COPY');
  // SKILLS → CONTACT: glow brightens, headline reveals word by word, avatar waves hello
  useGSAP(() => {
    ScrollTrigger.create({ trigger: '#contact', start: 'top 85%', end: 'top 15%', scrub: true, onUpdate: (s) => root.current.querySelector('.box .glow').style.setProperty('--g', 0.25 + s.progress * 0.75) });
    gsap.from('.w', { y: '0.5em', opacity: 0, duration: 0.7, ease: EASE, stagger: 0.09, scrollTrigger: { trigger: '#ch', start: 'top 85%', once: true, onEnter: () => setWave(true) } });
  }, { scope: root });
  const copy = async () => { try { await navigator.clipboard.writeText(LINKS.email); setCopied('COPIED'); } catch (e) { setCopied('SELECT & COPY'); } setTimeout(() => setCopied('COPY'), 1800); };
  return (
    <section id="contact" ref={root}>
      <div className="wrap">
        <div className="head"><div className="label mono"><b>07</b><i />CONTACT</div><span className="cnt mono">07 / 07</span></div>
        <div className="box card">
          <div className="glow" />
          <div>
            <h2 id="ch">{'Let’s build something together.'.split(' ').map((w, i) => <span key={i}><span className="w">{w}</span> </span>)}</h2>
            <p>Looking for internships and developer roles. Reach out about a project, an opportunity or just to say hi.</p>
            <div className="cl">
              <button className="em" type="button" onClick={copy}><small className="mono">EMAIL</small><span>{LINKS.email} <small className="mono">{copied}</small></span></button>
              <div><small className="mono">PHONE</small><a href="tel:+917416978259">+91 74169 78259</a></div>
              <div><small className="mono">LOCATION</small>Karimnagar, Telangana</div>
              <a href={LINKS.github}><small className="mono">GITHUB</small>@VarunUppu ↗</a>
              <a href={LINKS.linkedin}><small className="mono">LINKEDIN</small>Varun Sandesh Uppu ↗</a>
            </div>
            <a className="btn p" href={LINKS.resume} download="Varun_Sandesh_Uppu_Resume.pdf">Download resume</a>
          </div>
          <AvatarStage id="s3" wave={wave} hint="Say hi!" />
        </div>
      </div>
    </section>
  );
}
