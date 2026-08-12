import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import { revealOnce } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    src: "/assets/portfolio-1.png",
    alt: "Editorial wedding portrait",
    position: "object-[center_20%]",
  },
  {
    src: "/assets/portfolio-2.png",
    alt: "Luxury product shot",
    position: "object-center",
  },
  {
    src: "/assets/portfolio-3.png",
    alt: "Cinematic fashion in forest",
    position: "object-[60%_center]",
  },
  {
    src: "/assets/portfolio-4.png",
    alt: "Professional cinema camera rig",
    position: "object-[40%_center]",
  },
];

export default function Portfolio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnce(".pf-header", {
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
      id="portfolio"
      ref={sectionRef}
      className="relative w-full pb-20 pt-6 sm:pb-28 sm:pt-8 lg:pb-32"
    >
      <div className="container-site">
        <SectionDivider number="02" title="Portfolio" />

        <div className="pf-header mt-12 flex flex-col gap-6 sm:mt-16 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
          <h2 className="heading-section max-w-lg text-text">
            Stories that speak beyond words.
          </h2>
          <a
            href="#portfolio"
            className="pressable label-nav underline-link w-fit shrink-0 text-text"
          >
            Browse Portfolio
          </a>
        </div>
      </div>

      <div className="mt-8 w-full px-[5vw] sm:mt-10">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.src}
              className="relative aspect-[3/4] overflow-hidden border border-white/[0.12]"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover ${item.position}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
