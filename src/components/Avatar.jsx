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
  const ref = useRef(),
    [vis, setVis] = useState(true),
    [go, setGo] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setVis(e.isIntersecting);
        if (e.isIntersecting) setGo(true);
      },
      { rootMargin: "200px" },
    );
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
      {go && (
        <Suspense fallback={null}>
          <Canvas3D orbit={orbit} wave={wave} sparkles={sparkles} vis={vis} />
        </Suspense>
      )}
      {children}
      {hint && <span className="hint mono">{hint}</span>}
    </div>
  );
}
