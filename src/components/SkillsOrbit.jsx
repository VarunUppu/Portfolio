import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { ORBIT_SKILLS } from "../data.js";
import { RM, isMobile, scrollState } from "../lib/scroll.js";

const RINGS = [
  { r: 3.3, tilt: 1.0, rot: -0.35, dir: 1, speed: 1 },
  { r: 2.85, tilt: 1.3, rot: 0.9, dir: -1, speed: 0.8 },
  { r: 2.4, tilt: 0.75, rot: 1.9, dir: 1, speed: 1.2 },
];
const COUNT = [4, 3, 3];
const COLORS = ["#0B7A70", "#2A9FD6", "#0F2A33"];

function Scene({ drag, intro, hovered }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const asp = size.width / size.height;
    camera.position.z = Math.max(
      15.5,
      4.4 / (Math.tan((17.5 * Math.PI) / 180) * asp),
    ); // keeps the whole ring in view
    camera.updateProjectionMatrix();
  }, [size, camera]);
  const chips = useRef([]),
    els = useRef([]),
    dr = useRef(0),
    core = useRef(),
    v = new THREE.Vector3();
  const circles = useMemo(
    () =>
      RINGS.map((r) =>
        Array.from({ length: 129 }, (_, i) => [
          Math.cos((i / 128) * 6.2832) * r.r,
          Math.sin((i / 128) * 6.2832) * r.r,
          0,
        ]),
      ),
    [],
  );
  useFrame((_, dt) => {
    drag.current.v *= 0.94;
    dr.current += drag.current.v + (RM || hovered.current ? 0 : 0.35 * dt); // idle spin pauses while a chip is hovered
    const p = intro.current.p,
      k = 1 - Math.pow(1 - p, 3); // chips fly in as the section arrives
    ORBIT_SKILLS.forEach((_, i) => {
      const ri = i % 3,
        ring = RINGS[ri],
        idx = Math.floor(i / 3);
      const a =
        (idx / COUNT[ri]) * 6.2832 +
        ri * 1.1 +
        ring.dir * (dr.current * ring.speed + scrollState.y * 0.003) +
        (1 - k) * 2.5;
      const g = chips.current[i];
      if (!g) return;
      g.position.set(Math.cos(a) * ring.r * k, Math.sin(a) * ring.r * k, 0);
      g.getWorldPosition(v);
      const z = THREE.MathUtils.clamp(v.z / 3, -1, 1),
        el = els.current[i];
      if (el) {
        el.style.opacity = (0.7 + z * 0.3) * p;
        el.style.transform = `scale(${0.88 + z * 0.12})`;
      }
    });
    if (core.current)
      core.current.scale.setScalar(
        1 + Math.sin(performance.now() / 700) * 0.02,
      );
  });
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[4, 4, 6]} intensity={30} color="#ffffff" />
      <mesh ref={core}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshPhysicalMaterial
          color="#BDEBE4"
          emissive="#14B8A6"
          emissiveIntensity={0.45}
          roughness={0.25}
          clearcoat={1}
        />
        <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <span
            className="mono"
            style={{ fontSize: 34, fontWeight: 500, color: "#0F2A33" }}
          >
            &lt;/&gt;
          </span>
        </Html>
      </mesh>
      {RINGS.map((ring, ri) => (
        <group key={ri} rotation={[ring.tilt, 0, ring.rot]}>
          <Line
            points={circles[ri]}
            color={COLORS[ri]}
            lineWidth={1.3}
            dashed
            dashSize={0.04}
            gapSize={0.12}
            transparent
            opacity={0.7}
          />
          {ORBIT_SKILLS.map(
            ([name, dot], i) =>
              i % 3 === ri && (
                <group key={name} ref={(n) => (chips.current[i] = n)}>
                  <Html center zIndexRange={[10, 0]}>
                    <div
                      className="sc mono"
                      ref={(n) => (els.current[i] = n)}
                      tabIndex={0}
                      onPointerEnter={() => (hovered.current = true)}
                      onPointerLeave={() => (hovered.current = false)}
                      onFocus={() => (hovered.current = true)}
                      onBlur={() => (hovered.current = false)}
                    >
                      <i style={{ background: dot }} />
                      {name}
                    </div>
                  </Html>
                </group>
              ),
          )}
        </group>
      ))}
    </>
  );
}

export default function SkillsOrbit({ intro }) {
  const drag = useRef({ v: 0, down: false, lx: 0 }),
    hovered = useRef(false);
  const d = drag.current;
  return (
    <div
      id="orbit"
      role="group"
      aria-label="Interactive 3D skills orbit. Drag to spin, hover a skill to focus."
      onPointerDown={(e) => {
        d.down = true;
        d.lx = e.clientX;
      }}
      onPointerUp={() => (d.down = false)}
      onPointerLeave={() => (d.down = false)}
      onPointerMove={(e) => {
        if (d.down) {
          d.v = (e.clientX - d.lx) * 0.012;
          d.lx = e.clientX;
        }
      }}
    >
      <Canvas
        dpr={[1, isMobile() ? 1.25 : 2]}
        camera={{ position: [0, 0, 15.5], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene drag={drag} intro={intro} hovered={hovered} />
      </Canvas>
      {/* <div className="tip mono">Drag to spin · Hover a skill to focus</div> */}
    </div>
  );
}
