import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = ["home", "services", "portfolio", "studio", "contact"];

export default function ScrollIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const triggers = [];

    SECTIONS.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const scrollTo = (index) => {
    const id = SECTIONS[index];
    const target = document.getElementById(id);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: 0, duration: 1.15 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="absolute right-4 top-[42%] z-20 hidden flex-col items-center gap-3 sm:flex lg:right-7"
      role="navigation"
      aria-label="Section progress"
    >
      {SECTIONS.map((id, i) => {
        const isActive = i === active;
        return (
          <button
            key={id}
            type="button"
            aria-label={`Go to ${id}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => scrollTo(i)}
            className="pressable flex items-center justify-center p-1"
            data-cursor="hover"
          >
            <span
              className={
                isActive
                  ? "h-[7px] w-[7px] rounded-full bg-accent transition-[width,height,background-color] duration-200 ease-out"
                  : "h-[5px] w-[5px] rounded-full border border-white/40 transition-[width,height,background-color] duration-200 ease-out"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
