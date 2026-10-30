import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Canvas3D = lazy(() => import("./AvatarCanvas.jsx"));

export default function AvatarStage({
  id,
  orbit = false,
  wave = false,
  sparkles = false,
  hint,
  style,
  children,
}) {
  const ref = useRef();
  const [vis, setVis] = useState(true),
    [go, setGo] = useState(false),
    [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return; // safety: never observe a missing element
    const io = new IntersectionObserver(
      ([e]) => {
        setVis(e.isIntersecting);
        if (e.isIntersecting) setGo(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
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
      <div className={"sk-av" + (ready ? " off" : "")} aria-hidden="true">
        <div className="m" />
      </div>
      {go && (
        <Suspense fallback={null}>
          <Canvas3D
            orbit={orbit}
            wave={wave}
            sparkles={sparkles}
            vis={vis}
            onReady={() => setReady(true)}
          />
        </Suspense>
      )}
      {children}
      {hint && <span className="hint mono">{hint}</span>}
    </div>
  );
}
