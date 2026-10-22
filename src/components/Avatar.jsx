import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RM, isMobile } from "../lib/scroll.js";

// Cursor position shared by every avatar (-1..1)
const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });
}

const Mat = ({ c, glow }) => (
  <meshStandardMaterial
    color={c}
    roughness={0.45}
    metalness={0.05}
    emissive={glow ? c : "#000000"}
    emissiveIntensity={glow ? 1.1 : 0}
  />
);

/**
 * Procedural avatar built from primitives. To use a real model later:
 * replace the contents of <group ref={g}> with  <primitive object={useGLTF('/avatar.glb').scene} />
 * and keep `armR` pointed at the right-arm node so the wave still works.
 */
function Rig({ wave }) {
  const g = useRef(),
    armR = useRef(),
    w = useRef(0),
    waveProp = useRef(wave);
  waveProp.current = wave;
  const eyes = useRef(),
    eyeL = useRef(),
    eyeR = useRef(),
    mouth = useRef();
  const blink = useRef({ next: 0, start: -10 }),
    look = useRef({ x: 0, y: 0, nx: 0, ny: 0, next: 0 }),
    hap = useRef(0);
  const chest = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d");
    x.fillStyle = "#EEF9F5";
    x.font = "500 56px monospace";
    x.textAlign = "center";
    x.fillText("</>", 64, 84);
    return new THREE.CanvasTexture(c);
  }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current.rotation.y += (mouse.x * 0.5 - g.current.rotation.y) * 0.08; // follows the cursor
    g.current.rotation.x += (mouse.y * 0.2 - g.current.rotation.x) * 0.08;
    g.current.position.y = RM ? 0 : Math.sin(t * 1.6) * 0.08;
    if (waveProp.current || w.current > 0) {
      armR.current.rotation.z = 2.4 + Math.sin(t * 10) * 0.4;
      if (!waveProp.current) w.current -= 0.008;
    } else armR.current.rotation.z += (0.2 - armR.current.rotation.z) * 0.1;
    // ---- eyes ----
    const now = performance.now() / 1000;
    const B = blink.current,
      L = look.current;
    if (now > B.next) {
      B.start = now;
      B.next = now + 2 + Math.random() * 3;
      if (Math.random() < 0.2) B.next = now + 0.35;
    }
    let lid = 1;
    const bt = now - B.start;
    if (bt >= 0 && bt < 0.14) lid = Math.max(0.08, Math.abs(bt / 0.07 - 1));

    hap.current +=
      ((waveProp.current || w.current > 0 ? 1 : 0) - hap.current) * 0.12;
    const H = hap.current;

    if (now > L.next) {
      L.nx = (Math.random() - 0.5) * 0.05;
      L.ny = (Math.random() - 0.5) * 0.03;
      L.next = now + 1 + Math.random() * 2;
    }
    L.x += (mouse.x * 0.07 + L.nx - L.x) * 0.15;
    L.y += (-mouse.y * 0.04 + L.ny - L.y) * 0.15;
    eyes.current.position.set(L.x, 0.97 + L.y, 0);

    const sy = Math.min(1, Math.max(0.08, lid)),
      sx = 1; // clamped, can never blow up
    eyeL.current.scale.set(sx, sy, 1);
    eyeR.current.scale.set(sx, sy, 1);
    mouth.current.scale.set(1 + 0.3 * H, 1 + 0.5 * H, 1);
  });
  return (
    <group ref={g} onClick={() => (w.current = 1.2)}>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.95, 40, 40]} />
        <Mat c="#F4FBFA" />
      </mesh>
      {/* visor, now pushed out in front of the face */}
      <mesh position={[0, 0.97, 0.72]} scale={[1, 0.62, 0.5]}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshStandardMaterial color="#0F2A33" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* eyes */}
      <group ref={eyes} position={[0, 0.97, 0]}>
        {[
          [-0.28, eyeL],
          [0.28, eyeR],
        ].map(([x, r]) => (
          <group key={x} ref={r} position={[x, 0, 1.03]}>
            <mesh scale={[1, 1.35, 0.45]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <Mat c="#7CD4FF" glow />
            </mesh>
            <mesh position={[-0.03, 0.07, 0.035]}>
              {" "}
              {/* sparkle highlight */}
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* smile, moved below the visor */}
      <mesh
        ref={mouth}
        position={[0, 0.48, 0.77]}
        rotation={[0.15, 0, Math.PI]}
      >
        <torusGeometry args={[0.13, 0.026, 8, 16, Math.PI]} />
        <Mat c="#0F2A33" />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.97, 0.84]} scale={[0.9, 1.3, 0.6]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <Mat c="#7CD4FF" glow />
        </mesh>
      ))}

      {[-1, 1].map((s) => (
        <mesh key={s} position={[s, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.2, 20]} />
          <Mat c="#7CD4FF" />
        </mesh>
      ))}
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[1, 0.06, 10, 40, Math.PI]} />
        <Mat c="#7CD4FF" />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <Mat c="#14B8A6" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <Mat c="#14B8A6" glow />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <capsuleGeometry args={[0.72, 0.7, 8, 24]} />
        <Mat c="#14B8A6" />
      </mesh>
      <mesh position={[0, -0.4, 0.8]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={chest} transparent />
      </mesh>
      <group position={[-0.95, -0.1, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.8, 12]} />
          <Mat c="#14B8A6" />
        </mesh>
        <mesh position={[0, -0.82, 0]}>
          <sphereGeometry args={[0.17, 12, 12]} />
          <Mat c="#ffffff" />
        </mesh>
      </group>
      <group ref={armR} position={[0.95, -0.1, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.8, 12]} />
          <Mat c="#14B8A6" />
        </mesh>
        <mesh position={[0, -0.82, 0]}>
          <sphereGeometry args={[0.17, 12, 12]} />
          <Mat c="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

export default function AvatarStage({
  id,
  orbit = false,
  wave = false,
  hint,
  style,
  children,
}) {
  const ref = useRef();
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className="stage"
      id={id}
      ref={ref}
      style={style}
      role="img"
      aria-label="Interactive 3D avatar"
    >
      <Canvas
        frameloop={vis ? "always" : "never"}
        dpr={[1, isMobile() ? 1.25 : 2]}
        camera={{ position: [0, 0.3, 8.6], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 5]} intensity={0.9} />
        <Rig wave={wave} />
        {orbit && (
          <OrbitControls
            enabled={!isMobile()}
            enableZoom={false}
            enablePan={false}
            enableDamping
            minPolarAngle={Math.PI / 2.8}
            maxPolarAngle={Math.PI / 1.8}
          />
        )}
      </Canvas>
      {children}
      {hint && <span className="hint mono">{hint}</span>}
    </div>
  );
}
