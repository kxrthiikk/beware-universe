import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { prefersReducedMotion } from "../lib/animations";
import { preloadCriticalAssets } from "../lib/preloadAssets";

const EASE_OUT = "power4.out";
const EASE_IN_OUT = "power4.inOut";

/**
 * Film-style brand opening. The site mounts underneath; this overlay
 * stages monogram → wordmark → taglines → dark hero peek → shine,
 * then hands off continuously into the homepage entrance.
 */
export default function IntroLoader({ onComplete }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const monogramRef = useRef(null);
  const wordmaskRef = useRef(null);
  const shineRef = useRef(null);
  const taglineRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const signaledRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let shineTimer = null;
    let shineTween = null;
    const splitCleanups = [];

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("intro-active");

    if (window.__lenis) {
      window.__lenis.stop();
    }

    const cleanupShell = () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("intro-active");
      if (window.__lenis) {
        window.__lenis.start();
      }
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
      const shine = shineRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const heroImg = document.querySelector("[data-intro-hero]");

      if (prefersReducedMotion()) {
        gsap.set(monogram, { clipPath: "inset(0 0 0 0)", opacity: 0 });
        gsap.set(wordmask, { clipPath: "inset(0 0% 0 0)" });
        gsap.set([line1, line2], { opacity: 1, y: 0 });
        preloadCriticalAssets().then(() => {
          if (cancelled) return;
          signalSite();
          gsap.to(root, {
            opacity: 0,
            duration: 0.35,
            ease: EASE_OUT,
            onComplete: dismiss,
          });
        });
        return;
      }

      // ── Initial states ──
      gsap.set(monogram, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
      gsap.set(wordmask, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(shine, { xPercent: -130, opacity: 0 });
      gsap.set(stage, { scale: 1, opacity: 1 });
      gsap.set(root, { backgroundColor: "rgba(5,5,5,1)" });

      if (heroImg) {
        gsap.set(heroImg, {
          clipPath: "inset(18% 18% 18% 18%)",
          scale: 1.02,
        });
      }

      let assetsReady = false;
      let sequenceDone = false;

      const playShineOnce = () => {
        shineTween?.kill();
        shineTween = gsap
          .timeline()
          .set(shine, { xPercent: -130, opacity: 0 })
          .to(shine, { opacity: 1, duration: 0.08 }, 0)
          .to(shine, { xPercent: 130, duration: 1.1, ease: EASE_IN_OUT }, 0)
          .to(shine, { opacity: 0, duration: 0.18 }, "-=0.18");
        return shineTween;
      };

      const startShineLoop = () => {
        const tick = () => {
          if (cancelled || (assetsReady && sequenceDone)) return;
          playShineOnce();
          shineTimer = window.setTimeout(tick, 2000);
        };
        shineTimer = window.setTimeout(tick, 2000);
      };

      const stopShineLoop = () => {
        if (shineTimer) {
          window.clearTimeout(shineTimer);
          shineTimer = null;
        }
      };

      const tryExit = () => {
        if (!assetsReady || !sequenceDone || cancelled) return;

        stopShineLoop();

        // Continuous handoff — homepage entrance begins as overlay dissolves
        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            onComplete: dismiss,
          })
          .call(signalSite)
          .to(shine, { opacity: 0, duration: 0.12 }, 0)
          .to(
            stage,
            {
              scale: 0.96,
              opacity: 0,
              duration: 0.8,
              ease: EASE_IN_OUT,
            },
            0
          )
          .to(
            taglineRef.current,
            { opacity: 0, duration: 0.55, ease: EASE_OUT },
            0
          )
          .to(
            root,
            {
              backgroundColor: "rgba(5,5,5,0)",
              opacity: 0,
              duration: 0.95,
              ease: EASE_IN_OUT,
            },
            0.04
          );
      };

      const prepLine = (el) => {
        if (!el) return null;
        const split = new SplitType(el, {
          types: "lines",
          lineClass: "intro-split-line",
          tagName: "span",
        });
        split.lines.forEach((line) => {
          const wrap = document.createElement("span");
          wrap.className = "intro-split-mask";
          line.parentNode.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        splitCleanups.push(() => split.revert());
        return split;
      };

      const split1 = prepLine(line1);
      const split2 = prepLine(line2);

      // ── Film opening ≈ 3.5–4s when assets are warm ──
      const intro = gsap.timeline({
        defaults: { ease: EASE_OUT },
        onComplete: () => {
          sequenceDone = true;
          startShineLoop();
          tryExit();
        },
      });

      intro
        // Scene 1 — darkness, then B mask reveal
        .to({}, { duration: 0.28 })
        .to(monogram, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.48,
          ease: EASE_IN_OUT,
        })
        .to({}, { duration: 0.22 })

        // Scene 2 — expand into BE·WARE! L→R (mask only)
        .to(
          wordmask,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: EASE_IN_OUT,
          },
          "-=0.04"
        )
        .to(
          monogram,
          { opacity: 0, duration: 0.38, ease: EASE_OUT },
          "<+=0.08"
        )

        // Scene 3 — taglines via SplitType (up + opacity)
        .add(() => {
          if (split1?.lines?.length) {
            gsap.to(split1.lines, {
              yPercent: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.04,
              ease: EASE_OUT,
            });
          }
        })
        .to({}, { duration: 0.42 })
        .add(() => {
          if (split2?.lines?.length) {
            gsap.to(split2.lines, {
              yPercent: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.04,
              ease: EASE_OUT,
            });
          }
        })

        // Scene 4 — barely-there hero behind translucent black
        .to(
          root,
          {
            backgroundColor: "rgba(5,5,5,0.82)",
            duration: 1.15,
            ease: EASE_IN_OUT,
          },
          "-=0.75"
        );

      if (heroImg) {
        intro.to(
          heroImg,
          {
            clipPath: "inset(10% 10% 10% 10%)",
            duration: 1.25,
            ease: EASE_IN_OUT,
          },
          "-=1.1"
        );
      }

      // Scene 5 — first bronze metallic shine (logo = loader)
      intro.to({}, { duration: 0.1 }).add(() => {
        playShineOnce();
      });

      // Assets in parallel — if slow, shine loops every 2s
      preloadCriticalAssets().then(() => {
        if (cancelled) return;
        assetsReady = true;
        tryExit();
      });
    }, rootRef);

    return () => {
      cancelled = true;
      if (shineTimer) window.clearTimeout(shineTimer);
      shineTween?.kill();
      splitCleanups.forEach((fn) => fn?.());
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
            <span ref={shineRef} className="intro-shine" aria-hidden="true" />
          </div>
        </div>

        <div ref={taglineRef} className="intro-tagline">
          <p ref={line1Ref} className="intro-tagline-line">
            Not just a studio.
          </p>
          <p ref={line2Ref} className="intro-tagline-line intro-tagline-accent">
            A new way of seeing.
          </p>
        </div>
      </div>
    </div>
  );
}
