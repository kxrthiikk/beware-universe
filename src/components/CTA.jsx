import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  clipReveal,
  fadeUp,
  parallaxImage,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    const cleanups = [];

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        clipReveal(imageRef.current, {
          trigger: sectionRef.current,
          start: "top 85%",
          duration: 1.4,
          from: "inset(0% 0% 100% 0%)",
        });

        if (thumbRef.current) {
          clipReveal(thumbRef.current, {
            trigger: sectionRef.current,
            start: "top 85%",
            duration: 1.2,
            delay: 0.1,
            from: "inset(100% 0% 0% 0%)",
          });
        }

        parallaxImage(imageRef.current, sectionRef.current, 12);
      }

      cleanups.push(
        splitLinesReveal(headingRef.current, {
          trigger: sectionRef.current,
          start: "top 80%",
          stagger: 0.1,
        })
      );

      fadeUp(".cta-meta", {
        trigger: sectionRef.current,
        start: "top 80%",
        delay: 0.15,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-white/[0.12]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/cta-1.png"
          alt=""
          className="h-[125%] w-full object-cover object-center will-change-transform"
        />
        <div className="absolute inset-0 bg-bg/70" />
      </div>

      <div className="container-site relative flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24">
        <div className="cta-meta hidden w-[120px] shrink-0 overflow-hidden opacity-80 lg:block xl:w-[140px]">
          <img
            ref={thumbRef}
            src="/assets/cta-1.png"
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <h2
          ref={headingRef}
          className="heading-serif max-w-xl text-[10vw] text-text sm:text-5xl lg:text-[2.8vw] xl:text-[48px]"
        >
          Let&apos;s create something
          <br />
          <em className="italic text-accent">extraordinary together.</em>
        </h2>

        <div className="cta-meta flex shrink-0 items-center gap-6">
          <a
            href="#contact"
            className="label-nav group inline-flex items-center gap-4 text-text"
            data-cursor="hover"
          >
            <span className="underline-link">Get in Touch</span>
            <span className="arrow-slide" aria-hidden="true">
              →
            </span>
          </a>

          <div
            className="hidden h-16 w-16 items-center justify-center rounded-full border border-accent/50 text-center sm:flex"
            aria-hidden="true"
          >
            <span className="font-serif text-[11px] leading-tight text-accent">
              BE
              <br />
              ·
              <br />
              W!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
