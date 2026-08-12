import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  EASE_CINEMA,
  EASE_CINEMA_IO,
  prefersReducedMotion,
} from "../lib/animations";
import { preloadCriticalAssets } from "../lib/preloadAssets";

/**
 * Logo-only brand opening (~2s). Dissolves into hero film underneath.
 * No taglines, shine loop, or hero peek — hero owns the narrative.
 */
export default function IntroLoader({ onComplete }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const monogramRef = useRef(null);
  const wordmaskRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const signaledRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("intro-active");

    const cleanupShell = () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("intro-active");
    };

    const signalSite = () => {
      if (signaledRef.current) return;
      signaledRef.current = true;
      onComplete?.();
    };

    const dismiss = () => {
      if (cancelled) return;
      cancelled = true;
      cleanupShell();
      setVisible(false);
    };

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const monogram = monogramRef.current;
      const wordmask = wordmaskRef.current;
      const narrow =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 768px)").matches;
      const holdScale = narrow ? 0.85 : 1;

      if (prefersReducedMotion()) {
        gsap.set(monogram, { clipPath: "inset(0 0 0 0)", opacity: 0 });
        gsap.set(wordmask, { clipPath: "inset(0 0% 0 0)" });
        preloadCriticalAssets().then(() => {
          if (cancelled) return;
          signalSite();
          gsap.to(root, {
            opacity: 0,
            duration: 0.35,
            ease: EASE_CINEMA,
            onComplete: dismiss,
          });
        });
        return;
      }

      gsap.set(monogram, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
      gsap.set(wordmask, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(stage, { scale: 1, opacity: 1 });
      gsap.set(root, { backgroundColor: "rgba(5,5,5,1)" });

      let assetsReady = false;
      let sequenceDone = false;

      const tryExit = () => {
        if (!assetsReady || !sequenceDone || cancelled) return;

        gsap
          .timeline({
            defaults: { ease: EASE_CINEMA },
            onComplete: dismiss,
          })
          .call(signalSite, null, 0)
          .to(
            stage,
            {
              scale: 0.97,
              opacity: 0,
              duration: 0.75,
              ease: EASE_CINEMA_IO,
            },
            0
          )
          .to(
            root,
            {
              backgroundColor: "rgba(5,5,5,0)",
              opacity: 0,
              duration: 0.85,
              ease: EASE_CINEMA_IO,
            },
            0.04
          );
      };

      const intro = gsap.timeline({
        defaults: { ease: EASE_CINEMA },
        onComplete: () => {
          sequenceDone = true;
          tryExit();
        },
      });

      intro
        .to({}, { duration: 0.22 * holdScale })
        .to(monogram, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.45,
          ease: EASE_CINEMA_IO,
        })
        .to({}, { duration: 0.18 * holdScale })
        .to(
          wordmask,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.85,
            ease: EASE_CINEMA_IO,
          },
          "-=0.04"
        )
        .to(
          monogram,
          { opacity: 0, duration: 0.35, ease: EASE_CINEMA },
          "<+=0.08"
        )
        .to({}, { duration: 0.35 * holdScale });

      preloadCriticalAssets().then(() => {
        if (cancelled) return;
        assetsReady = true;
        tryExit();
      });
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
      cleanupShell();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="intro-loader"
      role="status"
      aria-live="polite"
      aria-label="BE·WARE! Creative Studio"
      aria-busy="true"
    >
      <div ref={stageRef} className="intro-stage">
        <span ref={monogramRef} className="intro-monogram" aria-hidden="true">
          B
        </span>

        <div ref={wordmaskRef} className="intro-wordmask">
          <div className="intro-wordmark-inner">
            <span className="intro-wordmark">BE&middot;WARE!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
