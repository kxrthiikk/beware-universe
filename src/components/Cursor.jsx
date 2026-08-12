import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/animations";

const LERP = 0.18;

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (prefersReducedMotion()) {
      cursor.style.display = "none";
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    let paused = document.documentElement.classList.contains("intro-active");

    const apply = () => {
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      if (!paused) {
        cx += (x - cx) * LERP;
        cy += (y - cy) * LERP;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.add("hovering");
      }
    };

    const onOut = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.remove("hovering");
      }
    };

    const syncPause = () => {
      paused = document.documentElement.classList.contains("intro-active");
    };

    const obs = new MutationObserver(syncPause);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    apply();
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
