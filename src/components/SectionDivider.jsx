import { useEffect, useRef } from "react";
import { animateDivider } from "../lib/animations";

export default function SectionDivider({ number, title }) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tween = animateDivider(lineRef.current, rootRef.current);
    return () => {
      if (tween) tween.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="flex items-center gap-5 sm:gap-6">
      <span className="label-nav shrink-0 text-muted">{number}</span>
      <span
        ref={lineRef}
        className="divider-line h-px flex-1 bg-white/[0.12]"
      />
      <span className="label-nav shrink-0 text-muted">{title}</span>
    </div>
  );
}
