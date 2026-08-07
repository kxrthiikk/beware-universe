import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import {
  clipReveal,
  fadeUp,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { src: "/assets/portfolio-1.png", alt: "Editorial wedding portrait" },
  { src: "/assets/portfolio-2.png", alt: "Luxury product shot" },
  { src: "/assets/portfolio-3.png", alt: "Cinematic fashion in forest" },
  { src: "/assets/portfolio-4.png", alt: "Professional cinema camera rig" },
];

export default function Portfolio() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const cleanups = [];

    const ctx = gsap.context(() => {
      cleanups.push(
        splitLinesReveal(headingRef.current, {
          trigger: sectionRef.current,
          start: "top 75%",
          stagger: 0.1,
        })
      );

      fadeUp(".pf-meta", {
        trigger: sectionRef.current,
        start: "top 70%",
        delay: 0.12,
      });

      const images = gsap.utils.toArray(".pf-image");
      if (prefersReducedMotion()) {
        gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)" });
      } else {
        clipReveal(images, {
          trigger: ".pf-gallery",
          start: "top 80%",
          stagger: 0.1,
          duration: 1.2,
          from: "inset(100% 0% 0% 0%)",
        });
      }
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full pb-20 pt-6 sm:pb-28 sm:pt-8 lg:pb-32"
    >
      <div className="container-site">
        <SectionDivider number="02" title="Portfolio" />

        <div className="mt-12 flex flex-col gap-12 lg:mt-16 lg:flex-row lg:gap-14">
          <div className="flex w-full flex-col justify-between gap-10 lg:w-[26%] lg:shrink-0">
            <h2
              ref={headingRef}
              className="heading-serif text-[11vw] text-text sm:text-5xl lg:text-[2.6vw] xl:text-[42px]"
            >
              Stories that
              <br />
              speak beyond
              <br />
              words.
            </h2>
            <a
              href="#portfolio"
              className="pf-meta label-nav group inline-flex w-fit items-center gap-3 text-text"
              data-cursor="hover"
            >
              <span className="underline-link">Browse Portfolio</span>
              <span className="arrow-slide" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="pf-gallery grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5">
            {items.map((item) => (
              <div
                key={item.src}
                className="group relative aspect-[3/4] overflow-hidden border border-white/[0.12]"
                data-cursor="hover"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="pf-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-black/10 opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
