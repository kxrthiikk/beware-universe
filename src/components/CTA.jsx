import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnce } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnce(".cta-inner", {
        trigger: sectionRef.current,
        start: "top 85%",
        y: 12,
        duration: 0.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-white/[0.12]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/cta-1.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-bg/70" />
      </div>

      <div className="cta-inner container-site relative flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24">
        <h2 className="heading-section max-w-xl text-text">
          Let&apos;s create something extraordinary together.
        </h2>

        <a
          href="#contact"
          className="pressable label-nav underline-link shrink-0 text-text"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
