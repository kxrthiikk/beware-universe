import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import { revealOnce } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Studio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnce(".studio-inner", {
        trigger: sectionRef.current,
        start: "top 80%",
        y: 12,
        duration: 0.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-40"
    >
      <div className="container-site">
        <SectionDivider number="03" title="The Studio" />

        <div className="studio-inner mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div className="relative w-full overflow-hidden border border-white/[0.12] lg:w-[62%]">
            <div className="aspect-[16/9] w-full lg:aspect-[16/10]">
              <img
                src="/assets/studio-1-main-image.png"
                alt="Premium photography studio interior"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[38%]">
            <p className="label-eyebrow text-muted">Our Space. Your Vision.</p>
            <h2 className="heading-section text-text">
              Premium spaces for limitless creativity.
            </h2>
            <a
              href="#studio"
              className="pressable label-nav underline-link mt-3 w-fit text-text"
            >
              Explore The Studio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
