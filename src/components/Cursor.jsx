import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Mascot cursor: visor pill with eyes that look where you move and blink. Ripple on click.
export default function Cursor() {
  const root = useRef(), cv = useRef();
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const el = root.current;
    gsap.set(el, { x: innerWidth / 2, y: innerHeight / 2 });
    const x = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' });
    const rot = gsap.quickTo(cv.current, 'rotation', { duration: 0.3, ease: 'power3' });
    let lx = 0, ly = 0, idle, blinkT;

    const blink = () => { el.classList.add('bl'); setTimeout(() => el.classList.remove('bl'), 140); };
    const loop = () => { blink(); blinkT = setTimeout(loop, 2000 + Math.random() * 3000); };
    loop();

    const move = (e) => {
      el.style.opacity = 1;
      x(e.clientX); y(e.clientY);
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      const c = gsap.utils.clamp;
      el.style.setProperty('--ex', c(-3, 3, dx * 0.6) + 'px');   // eyes look toward movement
      el.style.setProperty('--ey', c(-2, 2, dy * 0.6) + 'px');
      rot(c(-14, 14, dx * 0.6));                                  // tilts with speed
      clearTimeout(idle);
      idle = setTimeout(() => { el.style.setProperty('--ex', '0px'); el.style.setProperty('--ey', '0px'); rot(0); }, 120);
    };
    const down = () => { el.classList.add('press'); blink(); };
    const up = () => el.classList.remove('press');
    const click = (e) => {
      const r = document.createElement('div'); r.className = 'ripple';
      r.style.left = e.clientX - 20 + 'px'; r.style.top = e.clientY - 20 + 'px';
      document.body.append(r); gsap.to(r, { scale: 2.5, opacity: 0, duration: 0.6, onComplete: () => r.remove() });
    };
    const leave = () => (el.style.opacity = 0);

    addEventListener('pointermove', move);
    addEventListener('pointerdown', down); addEventListener('pointerup', up); addEventListener('click', click);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      clearTimeout(blinkT); clearTimeout(idle);
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', down); removeEventListener('pointerup', up); removeEventListener('click', click);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div id="mc" ref={root}>
      <div className="cv" ref={cv}><i className="ey" /><i className="ey" /></div>
    </div>
  );
}