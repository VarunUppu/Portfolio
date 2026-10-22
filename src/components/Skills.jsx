import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SkillsOrbit from "./SkillsOrbit.jsx";
import { SKILL_GROUPS } from "../data.js";

export default function Skills() {
  const root = useRef(),
    intro = useRef({ p: 0 });
  // PROJECTS → SKILLS: chips fly in and rotate around the core as you scroll (the orbit also spins with scroll; dragging takes over)
  useGSAP(
    () => {
      gsap.to(intro.current, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 80%",
          end: "top 25%",
          scrub: true,
        },
      });
    },
    { scope: root },
  );
  return (
    <section id="skills" ref={root}>
      <div
        className="glow"
        style={{
          top: 200,
          left: -200,
          width: 760,
          height: 760,
          background:
            "radial-gradient(circle,rgba(20,184,166,.3),transparent 66%)",
        }}
      />
      <div className="wrap">
        <div className="head">
          <div className="label mono">
            <b>06</b>
            <i />
            SKILLS
          </div>
          <span className="cnt mono">06 / 07</span>
        </div>
        <h2>My toolkit, in orbit.</h2>
        <div className="sk">
          <SkillsOrbit intro={intro} />
          <div className="groups">
            {SKILL_GROUPS.map(([title, color, items, soft]) => (
              <div key={title} className={"g card" + (soft ? " sf" : "")}>
                <h3 className="mono" style={{ color }}>
                  {title}
                </h3>
                <div>
                  {items.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
