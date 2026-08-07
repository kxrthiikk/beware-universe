import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "./SectionDivider";
import {
  EASE,
  clipReveal,
  fadeUp,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Weddings",
    subtitle: "Boundbylove",
    image: "/assets/creative-universe-1.png",
    icon: "ring",
  },
  {
    title: "Commercial Productions",
    subtitle: "",
    image: "/assets/creative-universe-2.png",
    icon: "camera",
  },
  {
    title: "Studio Rental",
    subtitle: "",
    image: "/assets/creative-universe-3.png",
    icon: "cube",
  },
  {
    title: "Podcast Studio",
    subtitle: "",
    image: "/assets/creative-universe-4.png",
    icon: "mic",
  },
  {
    title: "Education",
    subtitle: "Be-School",
    image: "/assets/creative-universe-5.png",
    icon: "cap",
  },
  {
    title: "Kids & Family",
    subtitle: "Totski",
    image: "/assets/creative-universe-6.png",
    icon: "users",
  },
  {
    title: "Post Production",
    subtitle: "Artbank",
    image: "/assets/creative-universe-7.png",
    icon: "monitor",
  },
  {
    title: "Wedding Design",
    subtitle: "Be-Wed!",
    image: "/assets/creative-universe-8.png",
    icon: "flower",
  },
  {
    title: "Future Ventures",
    subtitle: "Coming Soon",
    image: "/assets/creative-universe-9.png",
    icon: "spark",
  },
];

function ServiceIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-3.5 w-3.5",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "ring") {
    return (
      <svg {...common}>
        <circle cx="9" cy="15" r="4" />
        <circle cx="15" cy="15" r="4" />
        <path d="M12 4l2.2 5" />
      </svg>
    );
  }
  if (name === "camera") {
    return (
      <svg {...common}>
        <path d="M4 8h3l1.4-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3" />
      </svg>
    );
  }
  if (name === "cube") {
    return (
      <svg {...common}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M4.5 7.5 12 12l7.5-4.5M12 12v9" />
      </svg>
    );
  }
  if (name === "mic") {
    return (
      <svg {...common}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </svg>
    );
  }
  if (name === "cap") {
    return (
      <svg {...common}>
        <path d="M12 5 2 9.5 12 14l10-4.5L12 5Z" />
        <path d="M6 12v4.5c0 1.4 2.7 3 6 3s6-1.6 6-3V12" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17.5" cy="10" r="2.2" />
        <path d="M21 20c0-2.6-1.7-4.8-4-5.6" />
      </svg>
    );
  }
  if (name === "monitor") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  if (name === "flower") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM12 15a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM3 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0ZM15 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
    </svg>
  );
}

export default function CreativeUniverse() {
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
          duration: 1.05,
        })
      );

      fadeUp(".cu-meta", {
        trigger: sectionRef.current,
        start: "top 70%",
        delay: 0.15,
        stagger: 0.1,
      });

      const images = gsap.utils.toArray(".service-card-image");
      if (prefersReducedMotion()) {
        gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)" });
      } else {
        clipReveal(images, {
          trigger: ".service-grid",
          start: "top 80%",
          stagger: 0.08,
          duration: 1.15,
          from: "inset(100% 0% 0% 0%)",
          to: "inset(0% 0% 0% 0%)",
        });

        gsap.from(".service-card", {
          y: 40,
          duration: 0.9,
          stagger: 0.08,
          ease: EASE,
          scrollTrigger: {
            trigger: ".service-grid",
            start: "top 80%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, []);

  const rowOne = services.slice(0, 4);
  const rowTwo = services.slice(4);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full pb-20 pt-16 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24"
    >
      <div className="container-site">
        <SectionDivider number="01" title="Creative Universe" />

        <div className="mt-12 flex flex-col gap-12 lg:mt-16 lg:flex-row lg:gap-14 xl:gap-16">
          <div className="flex w-full flex-col justify-between gap-10 lg:w-[28%] lg:shrink-0">
            <h2
              ref={headingRef}
              className="heading-serif text-[11vw] text-text sm:text-5xl lg:text-[2.6vw] xl:text-[42px]"
            >
              We don&apos;t just
              <br />
              capture moments.
              <br />
              We craft worlds.
            </h2>

            <div className="cu-meta space-y-6">
              <p className="max-w-[240px] text-[13px] leading-relaxed text-muted">
                Explore our creative verticals and experiences.
              </p>
              <a
                href="#services"
                className="label-nav group inline-flex items-center gap-3 text-text"
                data-cursor="hover"
              >
                <span className="underline-link">View All Services</span>
                <span className="arrow-slide" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="service-grid flex flex-1 flex-col gap-3 sm:gap-3.5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5">
              {rowOne.map((item) => (
                <ServiceCard key={item.title} item={item} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3.5">
              {rowTwo.map((item) => (
                <ServiceCard key={item.title} item={item} />
              ))}
            </div>
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
      className="service-card group relative aspect-[3/4] overflow-hidden border border-white/[0.12] bg-secondary"
      data-cursor="hover"
    >
      <img
        src={item.image}
        alt={item.title}
        className="service-card-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
      />
      <div className="service-card-overlay absolute inset-0 bg-black/30 transition-opacity duration-500 ease-out group-hover:opacity-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3">
        <div className="min-w-0">
          <div className="mb-1.5 text-white/80">
            <ServiceIcon name={item.icon} />
          </div>
          <div className="font-sans text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-text sm:text-[11px]">
            {item.title}
          </div>
          {item.subtitle ? (
            <div className="mt-0.5 text-[11px] text-muted">{item.subtitle}</div>
          ) : null}
        </div>
        <span className="arrow-slide mb-0.5 shrink-0 text-text/80" aria-hidden="true">
          →
        </span>
      </div>
    </a>
  );
}
