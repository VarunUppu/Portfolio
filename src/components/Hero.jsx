import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AvatarStage from "./Avatar.jsx";
import { LINKS } from "../data.js";
import { goTo, DESKTOP_MOTION, EASE, RM } from "../lib/scroll.js";
import NowLine from './NowLine.jsx';

export default function Hero({ ready }) {
  const root = useRef();
  // Headline lines slide up through a mask once the curtain opens
  useGSAP(
    () => {
      if (RM) return;
      gsap.set(".ln span", { yPercent: 110 });
      if (ready)
        gsap.to(".ln span", {
          yPercent: 0,
          duration: 1,
          ease: EASE,
          stagger: 0.12,
        });
    },
    { scope: root, dependencies: [ready] },
  );

  // HERO → ABOUT: the hero avatar shrinks and travels to the About avatar (scrubbed by scroll)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        const s1 = root.current.querySelector("#s1"),
          s2 = document.querySelector("#s2");
        const d = () => {
          const a = s1.getBoundingClientRect(),
            b = s2.getBoundingClientRect();
          return {
            dx: b.left + b.width / 2 - (a.left + a.width / 2),
            dy: b.top + b.height / 2 - (a.top + a.height / 2),
            k: b.height / a.height,
          };
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            endTrigger: "#about",
            end: "top 45%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.to(
          "#s1 .fc, #s1 .hint, #s1 .orbring",
          { opacity: 0, duration: 0.2 },
          0,
        )
          .to(
            s1,
            {
              x: () => d().dx,
              y: () => d().dy,
              scale: () => d().k,
              duration: 1,
            },
            0,
          )
          .to(s1, { opacity: 0, duration: 0.15 }, 0.85);
        gsap.fromTo(
          s2,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#about",
              start: "top 55%",
              end: "top 40%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root}>
      <div
        className="glow"
        style={{
          top: "8%",
          left: -220,
          width: 720,
          height: 720,
          background:
            "radial-gradient(circle,rgba(20,184,166,.3),transparent 66%)",
        }}
      />
      <div
        className="glow"
        style={{
          bottom: -200,
          right: -200,
          width: 680,
          height: 680,
          background:
            "radial-gradient(circle,rgba(124,212,255,.5),transparent 66%)",
        }}
      />
      <div className="wrap" style={{ position: "relative" }}>
        <div className="hero">
          <div>
            <NowLine />
            <h1>
              <span className="ln">
                <span>Varun </span>
              </span>
              <span className="ln">
                <span>
                  Sandesh <em>Uppu</em>
                </span>
              </span>
            </h1>
            <p>
              Motivated Computer Science student with strong programming and
              problem-solving skills, passionate about building impactful
              software solutions.
            </p>
            <div className="bt">
              <a
                className="btn p"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  goTo("#projects");
                }}
              >
                View my work{" "}
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="btn" href={LINKS.resume} download="Varun_Sandesh_Uppu_Resume.pdf">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
                </svg>
                Download CV
              </a>
            </div>
          </div>
          <AvatarStage
            id="s1"
            orbit
            // hint="Drag to orbit · Click to wave"
            style={{ height: "min(66vh,600px)" }}
          >
            <div className="orbring" aria-hidden="true">
              <svg viewBox="0 0 560 560" preserveAspectRatio="none">
                <ellipse
                  cx="280"
                  cy="280"
                  rx="270"
                  ry="110"
                  fill="none"
                  stroke="#0B7A70"
                  strokeOpacity=".7"
                  strokeWidth="2"
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="262" r="9" fill="#14B8A6" />
                <circle cx="520" cy="352" r="6" fill="#7CD4FF" />
              </svg>
            </div>
            <span className="fc mono" style={{ left: 0, top: "18%" }}>
              <i style={{ background: "#7CD4FF" }} />
              React
            </span>
            <span
              className="fc mono"
              style={{ right: 0, top: "10%", animationDelay: "-1s" }}
            >
              <i style={{ background: "#14B8A6" }} />
              MongoDB
            </span>
            <span
              className="fc mono"
              style={{ left: "4%", bottom: "22%", animationDelay: "-2s" }}
            >
              <i style={{ background: "#2A9FD6" }} />
              TypeScript
            </span>
            <span
              className="fc mono"
              style={{ right: "2%", bottom: "30%", animationDelay: "-3s" }}
            >
              <i style={{ background: "#0B7A70" }} />
              Node.js
            </span>
          </AvatarStage>
        </div>
        <div className="hfoot mono">
          <span>SCROLL TO EXPLORE</span>
          <nav>
            <a href={LINKS.github}>GITHUB ↗</a>
            <a href={LINKS.linkedin}>LINKEDIN ↗</a>
            <a href={"mailto:" + LINKS.email}>EMAIL ↗</a>
          </nav>
          <span>01 / 07</span>
        </div>
      </div>
    </section>
  );
}
