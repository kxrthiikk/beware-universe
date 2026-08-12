import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import { revealOnce } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Weddings",
    subtitle: "Boundbylove",
    image: "/assets/creative-universe-1.png",
  },
  {
    title: "Commercial Productions",
    subtitle: "",
    image: "/assets/creative-universe-2.png",
  },
  {
    title: "Studio Rental",
    subtitle: "",
    image: "/assets/creative-universe-3.png",
  },
  {
    title: "Podcast Studio",
    subtitle: "",
    image: "/assets/creative-universe-4.png",
  },
  {
    title: "Education",
    subtitle: "Be-School",
    image: "/assets/creative-universe-5.png",
  },
  {
    title: "Post Production",
    subtitle: "Artbank",
    image: "/assets/creative-universe-7.png",
  },
];

export default function CreativeUniverse() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnce(".cu-inner", {
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
      id="services"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-40"
    >
      <div className="container-site">
        <SectionDivider number="01" title="Creative Universe" />

        <div className="cu-inner mt-12 lg:mt-16">
          <div className="mb-10 max-w-xl lg:mb-14">
            <h2 className="heading-section text-text">
              We don&apos;t just capture moments.
              <br />
              We craft worlds.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
              Explore our creative verticals and experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {services.map((item) => (
              <ServiceCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item }) {
  return (
    <a
      href="#services"
      className="pressable group relative aspect-[3/4] overflow-hidden border border-white/[0.12] bg-secondary"
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <div className="font-sans text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-text">
          {item.title}
        </div>
        {item.subtitle ? (
          <div className="mt-1 text-[11px] text-muted">{item.subtitle}</div>
        ) : null}
      </div>
    </a>
  );
}
