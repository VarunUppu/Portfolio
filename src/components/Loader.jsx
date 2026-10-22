import { useEffect, useRef, useState } from 'react';
import { RM } from '../lib/scroll.js';

const ease = (t) => 1 - Math.pow(1 - t, 3);
const COLS = ['#14B8A6', '#7CD4FF', '#0F2A33'];
const PTS = Array.from({ length: 28 }, (_, i) => { const a = i * 2.4, r = 100 + (i % 5) * 40; return { x: 200 + Math.cos(a) * r * 1.3, y: 230 + Math.sin(a) * r * 1.1, c: COLS[i % 3], r: 2 + (i % 3) }; });

// Startup sequence (~3.4s): boot 0–0.6, particles 0.6–1.8, orb→avatar 1.8–2.8, curtain split 2.8–3.4. Once per session, skippable.
export default function Loader({ onDone }) {
  const cv = useRef(), [txt, setTxt] = useState('INITIALISING SCENE'), [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false), [gone, setGone] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return; finished.current = true;
    setOpen(true); onDone();
    try { sessionStorage.setItem('seen', '1'); } catch (e) {}
    setTimeout(() => setGone(true), 700);
  };

  useEffect(() => {
    let seen = false; try { seen = sessionStorage.getItem('seen'); } catch (e) {}
    if (seen || RM) { finished.current = true; setGone(true); onDone(); return; }
    const c = cv.current.getContext('2d'); let raf; const t0 = performance.now();
    const frame = (now) => {
      if (finished.current) return;
      const t = (now - t0) / 1000;
      setPct(Math.min(100, Math.round((t / 3.4) * 100)));
      setTxt(t < 0.6 ? 'INITIALISING SCENE' : t < 1.8 ? 'LOADING PARTICLES' : t < 2.8 ? 'RIGGING AVATAR' : 'READY');
      c.clearRect(0, 0, 400, 480); c.setLineDash([]); c.fillStyle = '#0F2A33';
      if (t < 0.6) {
        PTS.forEach((p) => { c.globalAlpha = 0.2; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); });
        c.globalAlpha = 1; c.fillStyle = '#14B8A6'; c.beginPath(); c.arc(200, 230, 4 + Math.sin(t * 14), 0, 7); c.fill();
        c.strokeStyle = 'rgba(20,184,166,.45)'; c.beginPath(); c.arc(200, 230, 14, 0, 7); c.stroke();
      } else if (t < 1.8) {
        const k = ease((t - 0.6) / 1.2);
        PTS.forEach((p) => {
          const x = p.x + (200 - p.x) * k, y = p.y + (230 - p.y) * k;
          c.strokeStyle = 'rgba(11,122,112,.3)'; c.setLineDash([2, 5]); c.beginPath(); c.moveTo(p.x + (200 - p.x) * k * 0.6, p.y + (230 - p.y) * k * 0.6); c.lineTo(x, y); c.stroke(); c.setLineDash([]);
          c.fillStyle = p.c; c.beginPath(); c.arc(x, y, p.r + 1, 0, 7); c.fill();
        });
        const g = c.createRadialGradient(200, 230, 0, 200, 230, 40 + k * 20); g.addColorStop(0, '#fff'); g.addColorStop(0.5, 'rgba(20,184,166,.7)'); g.addColorStop(1, 'rgba(20,184,166,0)');
        c.fillStyle = g; c.fillRect(100, 130, 200, 200); c.fillStyle = '#fff'; c.strokeStyle = '#14B8A6'; c.lineWidth = 2; c.beginPath(); c.arc(200, 230, 12, 0, 7); c.fill(); c.stroke();
      } else {
        const k = ease(Math.min(1, (t - 1.8) / 1)), R = 12 + k * 96, g = c.createRadialGradient(200 - R * 0.3, 230 - R * 0.4, 0, 200, 230, R);
        g.addColorStop(0, '#fff'); g.addColorStop(0.55, '#EAF8F5'); g.addColorStop(1, '#A5D9D0');
        c.fillStyle = g; c.shadowColor = '#7CD4FF'; c.shadowBlur = 30 * k; c.beginPath(); c.arc(200, 230, R, 0, 7); c.fill(); c.shadowBlur = 0;
        if (k > 0.4) {
          c.globalAlpha = (k - 0.4) / 0.6; c.fillStyle = '#0F2A33'; c.beginPath(); c.roundRect(200 - R * 0.7, 230 - R * 0.2, R * 1.4, R * 0.58, R * 0.3); c.fill();
          c.fillStyle = '#7CD4FF'; c.shadowColor = '#7CD4FF'; c.shadowBlur = 12;
          [-1, 1].forEach((s) => { c.beginPath(); c.roundRect(200 + s * R * 0.3 - 9, 230 - R * 0.1, 18, R * 0.28, 9); c.fill(); });
          c.shadowBlur = 0; c.beginPath(); c.roundRect(200 - R * 1.05, 230 - R * 0.2, R * 0.22, R * 0.55, R * 0.1); c.roundRect(200 + R * 0.83, 230 - R * 0.2, R * 0.22, R * 0.55, R * 0.1); c.fill(); c.globalAlpha = 1;
        }
      }
      c.fillStyle = 'rgba(15,42,51,.14)'; c.fillRect(32, 436, 336, 3); c.fillStyle = '#14B8A6'; c.fillRect(32, 436, 336 * Math.min(1, t / 3.4), 3);
      if (t >= 2.8) setOpen(true);                // curtain split begins
      if (t >= 3.4) return finish();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line

  if (gone) return null;
  return (
    <div id="loader" className={open ? 'open' : ''} role="status" aria-label="Loading">
      <div className="h h1" /><div className="h h2" />
      <div className="c">
        <canvas ref={cv} width="400" height="480" aria-hidden="true" />
        <div id="lt" className="mono">{txt}</div>
        <div id="pct" className="mono">{String(pct).padStart(2, '0')}<small>%</small></div>
        <button id="skip" type="button" onClick={finish}>SKIP</button>
      </div>
    </div>
  );
}
