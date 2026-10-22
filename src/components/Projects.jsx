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
    screenshot: "/screens/CGOS.png",
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
    screenshot: "",
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
  {
    // date: "SEP 2023 – OCT 2023",
    kind: "React App",
    title: "Social Media Dashboard",
    text: "A web-based analytics dashboard that consolidates social media performance metrics, including followers, engagement rate, reach, and impressions, into interactive visualizations to help users monitor performance across multiple platforms.",
    tags: ["React", "TypeScript", "Express.js", "Analytics"],
    link: LINKS.projectC,
    live: LINKS.liveC,
    screenshot: "",
    preview: (
      <>
        <div className="bar mono">
          <span>Dashboard · Overview</span>
          <span>SAMPLE DATA</span>
        </div>
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 56 }}
          aria-hidden="true"
        >
          <polyline
            points="0,48 25,40 50,44 75,28 100,32 125,18 150,24 175,10 200,14"
            fill="none"
            stroke="#0F2A33"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <polyline
            points="0,54 25,50 50,52 75,42 100,46 125,36 150,40 175,30 200,34"
            fill="none"
            stroke="#1B7DAE"
            strokeWidth="2"
            strokeDasharray="3 4"
            strokeLinecap="round"
            opacity=".7"
          />
        </svg>
        <div className="row">
          <div className="mono">
            FOLLOWERS
            <span className="mb" style={{ width: "72%" }} />
          </div>
          <div className="mono">
            ENGAGEMENT
            <span className="mb" style={{ width: "48%" }} />
          </div>
          <div className="mono">
            REACH
            <span className="mb" style={{ width: "86%" }} />
          </div>
        </div>
      </>
    ),
  },
  {
    // date: "SEP 2023 – OCT 2023",
    kind: "Full-Stack",
    title: "VenueFlow",
    text: "Smart stadium crowd management REST API — built with Node.js, Express, Firebase Admin SDK, and deployed on Google Cloud Run.",
    tags: ["React", "Node.js", "Express.js", "Firebase", "Crowd Management"],
    link: LINKS.projectD,
    live: LINKS.liveD,
    screenshot: "",
    preview: (
      <>
        <div className="bar mono">
          <span>VenueFlow · Live crowd</span>
          <span>● LIVE</span>
        </div>
        <div className="gates">
          {[
            ["A", 70],
            ["B", 42],
            ["C", 90],
            ["D", 28],
          ].map(([g, h]) => (
            <div key={g}>
              <i
                style={{
                  height: h + "%",
                  background:
                    h > 80
                      ? "#0F2A33"
                      : h > 55
                        ? "#1B7DAE"
                        : "rgba(255,255,255,.85)",
                }}
              />
              <span className="mono">GATE {g}</span>
            </div>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: ".12em" }}>
          NODE · EXPRESS · FIREBASE · CLOUD RUN
        </div>
      </>
    ),
  },
  {
    // date: "SEP 2023 – OCT 2023",
    kind: "AI Assistant",
    title: "ElectionPath AI",
    text: "A persona-based, AI-powered election education assistant built with Gemini 2.0 Flash, Google Translate API, and Google Calendar API — zero build tools, no backend, just open the file.",
    tags: ["Javascript", "Gemini AI", "Google APIs"],
    link: LINKS.projectE,
    live: LINKS.liveE,
    screenshot: "",
    preview: (
      <>
        <div className="bar mono">
          <span>ElectionPath AI</span>
          <span>GEMINI 2.0 FLASH</span>
        </div>
        <div className="chat">
          <span className="b u">How do I register to vote?</span>
          <span className="b a">
            Here is a simple step-by-step guide for you…
          </span>
        </div>
        <div className="pills mono">
          <span>TRANSLATE </span>
          <span>ADD TO CALENDAR</span>
        </div>
      </>
    ),
  },
];

const rest = (p) => {
  const k = Math.ceil(p / 2),
    s = p === 0 ? 0 : p % 2 ? 1 : -1,
    m = innerWidth < 861;
  return {
    x: s * k * (m ? 14 : 60),
    y: k * (m ? 12 : 14),
    rotate: s * k * (m ? 4 : 10),
    scale: 1 - k * (m ? 0.03 : 0.035),
  };
};

const THR = () => (innerWidth < 861 ? 60 : 100); // drag distance that triggers a flick
const mix = (a, b, t) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rotate: a.rotate + (b.rotate - a.rotate) * t,
  scale: a.scale + (b.scale - a.scale) * t,
});



export default function Projects() {
  const root = useRef(),
    refs = useRef([]),
    deckRef = useRef(),
    busy = useRef(false),
    act = useRef("init"),
    drag = useRef(null);
  const [order, setOrder] = useState(PROJECTS.map((_, i) => i));
  const [flip, setFlip] = useState({});
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
        r = { ...rest(p), opacity: p > 4 ? 0 : 1, duration: dur, ease: EASE };
      if (p === 0 && act.current === "prev")
        gsap.fromTo(el, { x: -460, rotate: -16, scale: 1 }, r);
      else gsap.to(el, r);
    });
    act.current = "next";
  }, [order]); // eslint-disable-line

  // back cards follow the drag: each one slides toward the slot of the card in front of it
  const pull = (t) =>
    order.forEach((idx, p) => {
      if (p)
        gsap.to(refs.current[idx], {
          ...mix(rest(p), rest(p - 1), t),
          duration: 0.15,
          ease: "power1.out",
          overwrite: true,
        });
    });
  const settle = (shift, d) =>
    order.forEach((idx, p) => {
      // shift 0 = back to rest, 1 = advance one slot
      if (p)
        gsap.to(refs.current[idx], {
          ...rest(p - shift),
          duration: d,
          ease: EASE,
          overwrite: true,
        });
    });

  const flick = (dir = 1) => {
    // top card flies off and goes to the back
    if (busy.current || n < 2) return;
    busy.current = true;
    settle(1, RM ? 0 : 0.4);
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
    pull(Math.min(Math.abs(dx) / THR(), 1)); // 0 = untouched, 1 = about to flick
  };
  const up = () => {
    if (!drag.current) return;
    const dx = drag.current.dx;
    drag.current = null;
    if (Math.abs(dx) > THR()) flick(Math.sign(dx));
    else {
      gsap.to(refs.current[order[0]], {
        ...rest(0),
        duration: 0.4,
        ease: EASE,
      });
      settle(0, 0.4);
    }
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
              <div className={"pvw" + (flip[i] ? " flip" : "")}>
                <div className="pv front">{p.preview}</div>
                {p.screenshot && (
                  <>
                    <div className="pv back">
                      <img
                        src={p.screenshot}
                        alt={`${p.title} screenshot`}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                    </div>
                    <button
                      type="button"
                      className="flipb mono"
                      aria-pressed={!!flip[i]}
                      aria-label={
                        flip[i] ? "Show sketch preview" : "Show screenshot"
                      }
                      onClick={() => setFlip((f) => ({ ...f, [i]: !f[i] }))}
                    >
                      {flip[i] ? "SKETCH" : "SCREENSHOT"} ↻
                    </button>
                  </>
                )}
              </div>
              <div className="d mono">
                {p.date && <span>{p.date}</span>}
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
        <p className="dk-hint mono">SWIPE TO SHUFFLE</p>
      </div>
    </section>
  );
}
