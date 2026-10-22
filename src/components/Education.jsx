import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LINKS } from "../data.js";
import { EASE } from "../lib/scroll.js";

export default function Education() {
  const root = useRef();
  useGSAP(
    () => {
      // ABOUT → EDUCATION: the glowing line draws itself; each card fades up when its dot lights
      ScrollTrigger.create({
        trigger: "#tl",
        start: "top 70%",
        end: "bottom 70%",
        scrub: true,
        onUpdate: (s) =>
          root.current
            .querySelector("#tl")
            .style.setProperty("--p", s.progress),
      });
      gsap.utils.toArray(".it").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleClass: { targets: el, className: "in" },
            once: true,
          },
        });
      });
      gsap.from(".certs > div", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: ".certs", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );
  return (
    <section
      id="education"
      ref={root}
      style={{ background: "var(--alt)", paddingBottom: 170 }}
    >
      <div className="wrap">
        <div className="head">
          <div className="label mono">
            <b>03</b>
            <i />
            EDUCATION
          </div>
          {/* <span className="cnt mono">TIMELINE FILLS AS YOU SCROLL</span> */}
        </div>
        <h2>Where I learned the craft.</h2>
        <div className="tl" id="tl">
          <div className="it card">
            <div className="d mono">
              SEPT 2023 – MAY 2027<em>In progress</em>
            </div>
            <h3>Computer Science and Engineering (Undergrad)</h3>
            <div className="s">
              Kommuri Pratap Reddy Institute of Technology, Hyderabad
            </div>
            <p>
              Building full-stack projects alongside coursework, including a
              secure government-order storage system with AES-256 file
              encryption.
            </p>
            <div className="tags">
              <span>Python</span>
              <span>MERN Stack</span>
              <span>REST APIs</span>
            </div>
          </div>
          <div className="it card">
            <div className="d mono">
              JUNE 2021 – MARCH 2023<em>MPC</em>
            </div>
            <h3>Intermediate (MPC)</h3>
            <div className="s">Trinity Junior College, Karimnagar</div>
            <p>
              Mathematics, Physics and Chemistry, the foundation before moving
              into computer science.
            </p>
          </div>
          <div className="it card">
            <div className="d mono">JULY 2020 – MAY 2021</div>
            <h3>Secondary school (SSC)</h3>
            <p style={{ margin: 0 }}>
              Siddhartha High School, Karimnagar. English medium.
            </p>
          </div>
        </div>
        <div className="label mono" style={{ marginTop: 50 }}>
          <i />
          CERTIFICATIONS
        </div>
        <div className="certs">
          <div className="card">
            <b>Introduction to C</b>
            <span className="mono">September 2023</span>
          </div>
          <div className="card">
            <b>Introduction to Python</b>
            <span className="mono">April 2024</span>
          </div>
          <div className="card">
            <b>Python Certification</b>
            <span className="mono">Kaggle · May 2024</span>
          </div>
          <div className="card">
            <b>Introduction to Java</b>
            <span className="mono">August 2024</span>
          </div>
        </div>
        {/* <a className="btn" href={LINKS.resume} download="Varun_Sandesh_Uppu_Resume.pdf">
          Download full resume
        </a> */}
      </div>
    </section>
  );
}
