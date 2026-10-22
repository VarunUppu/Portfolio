import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LINKS } from "../data.js";
import { EASE, RM } from "../lib/scroll.js";

const PROJECTS = [
  {
    date: "MAY 2026 – JUNE 2026",
    kind: "FLASK APP",
    title: "Confidential Government Order Storage System",
    text: "AES-256 file encryption, three admin tiers and Cloudflare Turnstile bot protection, with encrypted sharing and report workflows for Government, Collector and Local Body roles.",
    tags: ["Python", "Flask", "TinyDB", "Vanilla JS"],
    link: LINKS.projectA,
    live: LINKS.liveA,
    preview: (
      <>
        <div className="bar mono">
          <span>GO Storage · Dashboard</span>
          <span>●●●</span>
        </div>
        <div className="row">
          <div className="mono">
            ENCRYPTION<b>AES-256</b>
          </div>
          <div className="mono">
            ADMIN TIERS<b>3 roles</b>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: ".12em" }}>
          LIGHT / DARK · 16 TEMPLATES
        </div>
      </>
    ),
  },
  {
    date: "SEP 2023 – OCT 2023",
    kind: "PYTHON TOOL",
    title: "Data Analytical Tool for HR",
    text: "A Python tool that automates the analysis of employee data, so HR teams can make informed decisions with far less manual effort.",
    tags: ["Python"],
    link: LINKS.projectB,
    live: LINKS.liveB,
    preview: (
      <>
        <div className="bar mono">
          <span>PYTHON</span>
          <span>hr_analytics.py</span>
        </div>
        <div>
          <div className="big">30%</div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: ".1em" }}>
            efficiency gain in HR analytics
          </div>
        </div>
        <div className="row">
          <div />
          <div />
          <div />
        </div>
      </>
    ),
  },
];

const rest = (p) => ({
  x: p * 18,
  y: p * 12,
  rotate: p * 3,
  scale: 1 - p * 0.04,
});

export default function Projects() {
  const root = useRef(),
    refs = useRef([]),
    deckRef = useRef(),
    busy = useRef(false),
    act = useRef("init"),
    drag = useRef(null);
  const [order, setOrder] = useState(PROJECTS.map((_, i) => i));
  const n = PROJECTS.length,
    dur = RM ? 0 : 0.55;

  useGSAP(
    () => {
      gsap.from(".deck", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: ".deck", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  // size the deck to the tallest card so there is no dead space
  useLayoutEffect(() => {
    const fit = () => {
      let m = 0;
      refs.current.forEach((c) => {
        c.style.bottom = "auto";
        c.style.height = "auto";
        m = Math.max(m, c.offsetHeight);
        c.style.bottom = "";
        c.style.height = "";
      });
      if (deckRef.current) deckRef.current.style.height = m + "px";
    };
    fit();
    document.fonts?.ready.then(fit);
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  // every time the order changes, glide each card to its slot in the stack
  useLayoutEffect(() => {
    order.forEach((idx, p) => {
      const el = refs.current[idx],
        r = { ...rest(p), opacity: p > 3 ? 0 : 1, duration: dur, ease: EASE };
      if (p === 0 && act.current === "prev")
        gsap.fromTo(el, { x: -460, rotate: -16, scale: 1 }, r);
      else gsap.to(el, r);
    });
    act.current = "next";
  }, [order]); // eslint-disable-line

  const flick = (dir = 1) => {
    // top card flies off and goes to the back
    if (busy.current || n < 2) return;
    busy.current = true;
    gsap.to(refs.current[order[0]], {
      x: dir * 460,
      rotate: dir * 16,
      duration: RM ? 0 : 0.4,
      ease: "power2.in",
      onComplete: () => {
        act.current = "next";
        setOrder((o) => [...o.slice(1), o[0]]);
        busy.current = false;
      },
    });
  };
  const prev = () => {
    // last card comes back to the front
    if (busy.current || n < 2) return;
    busy.current = true;
    act.current = "prev";
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
    setTimeout(() => (busy.current = false), 450);
  };

  const down = (e) => {
    if (e.target.closest("a,button") || busy.current) return;
    drag.current = { x: e.clientX, dx: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.dx = dx;
    gsap.set(refs.current[order[0]], { x: dx, rotate: dx * 0.05 });
  };
  const up = () => {
    if (!drag.current) return;
    const dx = drag.current.dx;
    drag.current = null;
    if (Math.abs(dx) > 100) flick(Math.sign(dx));
    else
      gsap.to(refs.current[order[0]], {
        ...rest(0),
        duration: 0.4,
        ease: EASE,
      });
  };

  return (
    <section id="projects" ref={root} style={{ background: "var(--alt)" }}>
      <div className="wrap">
        <div className="head">
          <div className="label mono">
            <b>05</b>
            <i />
            SELECTED PROJECTS
          </div>
          <span className="cnt mono">DRAG, SWIPE OR USE THE ARROWS</span>
        </div>
        <h2>Things I’ve built.</h2>
        <div
          className="deck"
          ref={deckRef}
          tabIndex={0}
          role="group"
          aria-label="Project deck. Use the left and right arrow keys to shuffle."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") flick(1);
            if (e.key === "ArrowLeft") prev();
          }}
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="dc card"
              ref={(el) => (refs.current[i] = el)}
              style={{ zIndex: n - order.indexOf(i) }}
            >
              <div className="pv">{p.preview}</div>
              <div className="d mono">
                <span>{p.date}</span>
                <span>{p.kind}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="dc-btns">
                <a
                  className="btn"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
                {p.live && (
                  <a
                    className="btn p"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="dk-ctl">
          <button
            className="dk-b"
            type="button"
            aria-label="Previous project"
            onClick={prev}
          >
            ←
          </button>
          <span className="mono">
            {String(order[0] + 1).padStart(2, "0")} /{" "}
            {String(n).padStart(2, "0")}
          </span>
          <button
            className="dk-b"
            type="button"
            aria-label="Next project"
            onClick={() => flick(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
