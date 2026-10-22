import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTIONS } from "../data.js";
import { goTo } from "../lib/scroll.js";

const TOP = [
  ["Work", "experience"],
  ["About", "about"],
  ["Stack", "skills"],
  ["Contact", "contact"],
];
const PILL = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Stack", "skills"],
  ["Contact", "contact"],
];
const ACTIVE = {
  about: "about",
  education: "about",
  experience: "projects",
  projects: "projects",
  skills: "skills",
  contact: "contact",
};

export default function Nav() {
  const [pill, setPill] = useState(false),
    [active, setActive] = useState("hero"),
    [open, setOpen] = useState(false),
    bar = useRef();
  useEffect(() => {
    const ts = [
      ScrollTrigger.create({
        start: 80,
        end: "max",
        onToggle: (s) => setPill(s.isActive),
      }), // collapses to a pill after 80px
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (s) =>
          (bar.current.style.transform = `scaleX(${s.progress})`),
      }),
      ...SECTIONS.map(([id]) =>
        ScrollTrigger.create({
          trigger: "#" + id,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (s) => s.isActive && setActive(id),
        }),
      ),
    ];
    return () => ts.forEach((t) => t.kill());
  }, []);
  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    goTo("#" + id);
  };
  const links = PILL;
  return (
    <>
      <div id="bar" ref={bar} />
      <header id="nav" className={pill ? "pill" : ""}>
        <a className="logo" href="#hero" onClick={go("hero")}>
          <i />
          Varun Uppu
        </a>
        <ul>
          {links.map(([l, id]) => (
            <li key={id}>
              <a
                href={"#" + id}
                className={pill && ACTIVE[active] === id ? "on" : ""}
                onClick={go(id)}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a className="cta" href="#contact" onClick={go("contact")}>
          Let’s talk
        </a>
        <button
          id="burger"
          aria-expanded={open}
          aria-controls="menu"
          style={{ zIndex: 60 }}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>
      <div id="menu" className={open ? "open" : ""}>
        {[
          "hero",
          "about",
          "education",
          "experience",
          "projects",
          "skills",
          "contact",
        ].map((id, i) => (
          <a
            key={id}
            href={"#" + id}
            onClick={go(id)}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {id === "hero" ? "Home" : id[0].toUpperCase() + id.slice(1)}
          </a>
        ))}
        <div className="orb" aria-hidden="true" />
      </div>
      <div id="rail" aria-hidden="true">
        {SECTIONS.map(([id, n]) => (
          <a
            key={id}
            href={"#" + id}
            data-n={n}
            tabIndex={-1}
            className={active === id ? "on" : ""}
            onClick={go(id)}
          />
        ))}
      </div>
    </>
  );
}
