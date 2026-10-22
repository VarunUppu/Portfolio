import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AvatarStage from "./Avatar.jsx";
import { EASE } from "../lib/scroll.js";

export default function About() {
  const root = useRef();
  useGSAP(
    () => {
      gsap.from(".rv", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: EASE,
        scrollTrigger: { trigger: ".rv", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );
  return (
    <section id="about" ref={root}>
      <div className="wrap">
        <div className="head">
          <div className="label mono">
            <b>02</b>
            <i />
            ABOUT ME
          </div>
          <span className="cnt mono">02 / 07</span>
        </div>
        <div className="two">
          <AvatarStage
            id="s2"
            wave
            // hint="CLICK · Avatar follows your cursor"
            style={{ height: 320 }}
          />
          <div className="about rv">
            <h2>A developer who sweats the details.</h2>
            <p>
              Computer Science student from Karimnagar, passionate about
              building impactful software. I work across the MERN stack and
              Python, from REST APIs to responsive interfaces.
            </p>
            <p>
              I interned at The Art of Living, building an Asset Registry module
              and speeding up its APIs. I like solving hard problems, and I
              presented a seminar on Large Language Models at Aarohan-2K24.
            </p>
            <div className="facts">
              <div className="card">
                <span className="mono">BASED IN</span>Karimnagar, India
              </div>
              <div className="card">
                <span className="mono">EXPERIENCE</span>Software Dev Intern
              </div>
              <div className="card">
                <span className="mono">FOCUS</span>Full-stack (MERN)
              </div>
              <div className="card">
                <span className="mono">CURRENTLY</span>CSE undergrad, class of
                2027
              </div>
              <div className="card hl">
                <span className="mono">HIGHLIGHT</span>Presented a seminar on
                Large Language Models at Aarohan-2K24.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
