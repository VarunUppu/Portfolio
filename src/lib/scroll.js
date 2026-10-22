import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const RM =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion:reduce)").matches;
export const isMobile = () => matchMedia("(max-width:860px)").matches;
export const DESKTOP_MOTION =
  "(min-width:861px) and (prefers-reduced-motion:no-preference)";
export const MOBILE_MOTION =
  "(max-width:860px) and (prefers-reduced-motion:no-preference)";
export const EASE = "power3.out"; // the one ease-out curve

export const scrollState = { y: 0 };
export let lenis = null;

let wipe = null;
export const setWipe = (fn) => {
  wipe = fn;
};
export const jumpTo = (target) => {
  lenis?.scrollTo(target, { immediate: true, force: true, offset: -10 });
  ScrollTrigger.update();
};

// Smooth inertial scroll, driven by GSAP's ticker so every ScrollTrigger stays in sync.
export function initScroll() {
  const onNative = () => (scrollState.y = window.scrollY);
  if (RM) {
    window.addEventListener("scroll", onNative, { passive: true });
    return () => window.removeEventListener("scroll", onNative);
  }
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", (e) => {
    scrollState.y = e.scroll;
    ScrollTrigger.update();
  });
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

export const goTo = (target) => {
  const el = document.querySelector(target);
  const far =
    el && Math.abs(el.getBoundingClientRect().top) > innerHeight * 0.5;
  if (lenis && wipe && far) return wipe(target); // long jump: play the transition
  if (lenis) lenis.scrollTo(target, { offset: -10, duration: 1.3 });
  else el?.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
};
