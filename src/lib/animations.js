import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/** Soft cinematic easing — no bounce / elastic */
export const EASE = "power3.out";
/** Scroll / chrome */
export const EASE_UI = "power3.out";
/** Intro / hero load */
export const EASE_CINEMA = "power4.out";
/** Masks / cross-stage moves */
export const EASE_CINEMA_IO = "power4.inOut";

export const DUR = {
  press: 0.15,
  ui: 0.22,
  panel: 0.36,
  reveal: 0.85,
  image: 1.0,
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Blur is paint-costly — skip under reduced motion or coarse pointers on small screens */
export function allowBlurEffects() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  return true;
}

function wrapSplitLines(split, maskClass = "split-line-mask") {
  split.lines.forEach((line) => {
    const wrap = document.createElement("span");
    wrap.className = maskClass;
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });
}

/**
 * Split a heading into lines and reveal them upward.
 * Optional blur-in for cinematic headings (hero / intro / section H2s).
 * Preserves nested markup. Always snaps visible under reduced motion.
 * Returns a cleanup function.
 */
export function splitLinesReveal(element, options = {}) {
  if (!element) return () => {};

  const {
    trigger,
    start = "top 80%",
    delay = 0,
    stagger = 0.06,
    duration = DUR.reveal,
    ease = EASE_UI,
    immediate = false,
    blur = false,
    blurFrom = 6,
    yPercent = 100,
    maskClass = "split-line-mask",
    lineClass = "split-line",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, clearProps: "filter,transform" });
    return () => {};
  }

  const useBlur = blur && allowBlurEffects();

  const split = new SplitType(element, {
    types: "lines",
    lineClass,
    tagName: "span",
  });

  wrapSplitLines(split, maskClass);

  const fromVars = {
    yPercent,
    opacity: 0,
  };
  if (useBlur) {
    fromVars.filter = `blur(${blurFrom}px)`;
  }

  gsap.set(split.lines, fromVars);

  const tweenVars = {
    yPercent: 0,
    opacity: 1,
    duration,
    delay,
    stagger,
    ease,
    onComplete: () => {
      if (useBlur) {
        gsap.set(split.lines, { clearProps: "filter" });
      }
    },
  };

  if (useBlur) {
    tweenVars.filter = "blur(0px)";
  }

  if (!immediate) {
    tweenVars.scrollTrigger = {
      trigger: trigger || element,
      start,
      once: true,
    };
  }

  const tween = gsap.to(split.lines, tweenVars);

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
    duration = DUR.image,
    ease = EASE_UI,
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
      ease,
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

/**
 * Slow scrubbed parallax on an image inside an overflow-hidden parent.
 * Halves intensity on narrow viewports; skips under reduced motion.
 */
export function parallaxImage(image, trigger, yPercent = 10) {
  if (!image || !trigger) return null;
  if (prefersReducedMotion()) return null;

  const narrow =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const amount = narrow ? yPercent * 0.5 : yPercent;

  return gsap.to(image, {
    yPercent: amount,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/** Single scroll reveal — opacity + subtle y, no blur or clip */
export function revealOnce(targets, options = {}) {
  if (!targets) return null;

  const {
    trigger,
    start = "top 85%",
    delay = 0,
    duration = 0.5,
    y = 12,
    ease = EASE_UI,
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
    return null;
  }

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    delay,
    ease,
    scrollTrigger: {
      trigger: trigger || targets,
      start,
      once: true,
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
    stagger = 0.05,
    duration = 0.65,
    y = 16,
    ease = EASE_UI,
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
    return null;
  }

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration,
    delay,
    stagger,
    ease,
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
    duration: 0.7,
    ease: EASE_UI,
    scrollTrigger: {
      trigger: trigger || lineEl,
      start: "top 90%",
      once: true,
    },
  });
}
