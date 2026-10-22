import { goTo } from '../lib/scroll.js';
const go = (id) => (e) => { e.preventDefault(); goTo(id); };
export default function Footer() {
  return (
    <footer><div className="wrap">
      <a className="logo" href="#hero" onClick={go('#hero')}><i />Varun Uppu</a>
      <nav><a href="#experience" onClick={go('#experience')}>Work</a><a href="#about" onClick={go('#about')}>About</a><a href="#skills" onClick={go('#skills')}>Stack</a><a href="#contact" onClick={go('#contact')}>Contact</a></nav>
      <span>© 2026 Varun Uppu</span>
      <a className="mono" href="#hero" onClick={go('#hero')} style={{ fontSize: 12, letterSpacing: '.14em' }}>BACK TO TOP ↑</a>
    </div></footer>
  );
}
