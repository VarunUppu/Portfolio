# Varun Sandesh Uppu – 3D Portfolio

React + Vite · Three.js via @react-three/fiber + drei · GSAP + ScrollTrigger · Lenis smooth scroll.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Where things are
| What | File |
|---|---|
| Design tokens + all styles (Mint aqua) | `src/styles.css` |
| Content you still need to fill in (GitHub/LinkedIn/email/resume) | `src/data.js` → `LINKS` |
| Smooth scroll (Lenis ⇄ GSAP ticker), motion media queries, the one ease | `src/lib/scroll.js` |
| Procedural avatar (follow cursor, drag to orbit, click to wave) | `src/components/Avatar.jsx` |
| Skills orbit (3 tilted rings, scroll-spin, drag, hover focus) | `src/components/SkillsOrbit.jsx` |
| Startup sequence (3.4 s, skippable, once per session) | `src/components/Loader.jsx` |
| Scroll transitions | Hero (orb glide), Education (timeline), Experience (slide-over), Projects (pin/stack/tilt), Skills (fly-in), Contact (glow, words, wave) |

## Open items
1. Real GitHub / LinkedIn URLs and the final email → `src/data.js`.
2. Put `resume.pdf` in `/public` and set `LINKS.resume = '/resume.pdf'`.
3. Project previews are abstract placeholders; swap `.pv` blocks in `Projects.jsx` for screenshots.
4. Swap the avatar for a GLB later: see the comment above `Rig` in `Avatar.jsx`.

## Motion rules implemented
One ease-out (`power3.out`), reveals 0.6–1 s, nav 0.3 s, `prefers-reduced-motion` skips the loader / Lenis / scrubs,
phones get simple fade-ups, no pinned stack and a lighter 3D render (lower DPR, orbit controls off).
