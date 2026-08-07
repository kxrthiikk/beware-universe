import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Soft cinematic easing — no bounce / elastic */
export const EASE = "power3.out";

/**
 * Split a heading into lines and reveal them upward.
 * Preserves nested markup (accent spans, italics, etc.).
 * Returns a cleanup function.
 */
export function splitLinesReveal(element, options = {}) {
  if (!element) return () => {};

  const {
    trigger,
    start = "top 80%",
    delay = 0,
    stagger = 0.1,
    duration = 1.05,
  } = options;

  if (prefersReducedMotion()) {
    return () => {};
  }

  const split = new SplitType(element, {
    types: "lines",
    lineClass: "split-line",
    tagName: "span",
  });

  split.lines.forEach((line) => {
    const wrap = document.createElement("span");
    wrap.className = "split-line-mask";
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });

  const tweenVars = {
    yPercent: 110,
    duration,
    delay,
    stagger,
    ease: EASE,
  };

  if (trigger || element) {
    tweenVars.scrollTrigger = {
      trigger: trigger || element,
      start,
      once: true,
    };
  }

  // If no external trigger was intended for load animations
  if (options.immediate) {
    delete tweenVars.scrollTrigger;
  }

  const tween = gsap.from(split.lines, tweenVars);

  return () => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    split?.revert();
  };
}

/** Clip-path image reveal. Returns the tween (or null). */
export function clipReveal(targets, options = {}) {
  if (!targets || (targets.length !== undefined && targets.length === 0)) {
    return null;
  }

  const {
    trigger,
    start = "top 80%",
    delay = 0,
    stagger = 0,
    duration = 1.25,
    from = "inset(100% 0% 0% 0%)",
    to = "inset(0% 0% 0% 0%)",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { clipPath: to });
    return null;
  }

  return gsap.fromTo(
    targets,
    { clipPath: from },
    {
      clipPath: to,
      duration,
      delay,
      stagger,
      ease: EASE,
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            once: true,
          }
        : undefined,
    }
  );
}

/** Slow scrubbed parallax on an image inside an overflow-hidden parent */
export function parallaxImage(image, trigger, yPercent = 10) {
  if (!image || !trigger) return null;
  if (prefersReducedMotion()) return null;

  return gsap.to(image, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/** Soft fade-up for secondary copy (not images) */
export function fadeUp(targets, options = {}) {
  if (!targets) return null;

  const {
    trigger,
    start = "top 85%",
    delay = 0,
    stagger = 0.08,
    duration = 0.9,
    y = 28,
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: "all" });
    return null;
  }

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease: EASE,
    scrollTrigger: {
      trigger: trigger || targets,
      start,
      once: true,
    },
  });
}

/** Section divider line: scaleX 0 → 1 from left */
export function animateDivider(lineEl, trigger) {
  if (!lineEl) return null;
  if (prefersReducedMotion()) {
    gsap.set(lineEl, { scaleX: 1 });
    return null;
  }

  gsap.set(lineEl, { scaleX: 0, transformOrigin: "left center" });

  return gsap.to(lineEl, {
    scaleX: 1,
    duration: 1.2,
    ease: EASE,
    scrollTrigger: {
      trigger: trigger || lineEl,
      start: "top 90%",
      once: true,
    },
  });
}
