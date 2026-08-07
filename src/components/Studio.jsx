import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import {
  clipReveal,
  fadeUp,
  parallaxImage,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Studio() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const cleanups = [];

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        clipReveal(imageRef.current, {
          trigger: sectionRef.current,
          start: "top 75%",
          duration: 1.35,
          from: "inset(0% 0% 100% 0%)",
        });
        parallaxImage(imageRef.current, sectionRef.current, 8);
      }

      cleanups.push(
        splitLinesReveal(headingRef.current, {
          trigger: sectionRef.current,
          start: "top 70%",
          stagger: 0.1,
        })
      );

      fadeUp(".studio-meta", {
        trigger: sectionRef.current,
        start: "top 70%",
        stagger: 0.12,
        delay: 0.1,
      });
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative w-full pb-20 pt-6 sm:pb-28 sm:pt-8 lg:pb-32"
    >
      <div className="container-site">
        <SectionDivider number="03" title="The Studio" />

        <div className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div className="relative w-full overflow-hidden border border-white/[0.12] lg:w-[62%]">
            <div className="aspect-[16/9] w-full overflow-hidden lg:aspect-[16/10]">
              <img
                ref={imageRef}
                src="/assets/studio-1-main-image.png"
                alt="Premium photography studio interior"
                className="h-[115%] w-full object-cover will-change-transform"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[38%]">
            <p className="studio-meta label-tiny text-muted">
              Our Space. Your Vision.
            </p>
            <h2
              ref={headingRef}
              className="heading-serif text-[11vw] text-text sm:text-5xl lg:text-[2.5vw] xl:text-[40px]"
            >
              Premium spaces
              <br />
              for limitless creativity.
            </h2>
            <a
              href="#studio"
              className="studio-meta label-nav group mt-3 inline-flex w-fit items-center gap-3 text-text"
              data-cursor="hover"
            >
              <span className="underline-link">Explore The Studio</span>
              <span className="arrow-slide" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
