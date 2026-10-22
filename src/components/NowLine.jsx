import { useEffect, useState } from "react";
import { NOW } from "../data.js";
import { RM } from "../lib/scroll.js";

export default function NowLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (RM || NOW.length < 2) return; // no rotation for reduced motion or a single line
    const t = setInterval(() => setI((n) => (n + 1) % NOW.length), 3600);
    return () => clearInterval(t);
  }, []);
  const [label, text] = NOW[i];
  return (
    <div className="now" aria-live="polite">
      <i aria-hidden="true" />
      <span className="mono now-l">{label}</span>
      <span key={i} className="now-t">
        {text}
      </span>
    </div>
  );
}
