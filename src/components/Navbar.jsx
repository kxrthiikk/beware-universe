import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: "Home", href: "#home", section: "home" },
  { label: "About", href: "#about", section: "about" },
  { label: "Services", href: "#services", section: "services" },
  { label: "Portfolio", href: "#portfolio", section: "portfolio" },
  { label: "Studio", href: "#studio", section: "studio" },
  { label: "Journal", href: "#journal", section: "journal" },
  { label: "Contact", href: "#contact", section: "contact" },
];

export default function Navbar({ introReady = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const playedRef = useRef(false);

  useEffect(() => {
    // Keep navbar hidden until intro finishes
    if (prefersReducedMotion()) {
      gsap.set("header", { opacity: 1, y: 0 });
      return;
    }
    gsap.set("header", { opacity: 0, y: -12 });
  }, []);

  useEffect(() => {
    if (!introReady || playedRef.current) return;
    playedRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set("header", { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      "header",
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 1, ease: EASE, delay: 0.15 }
    );
  }, [introReady]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = ["home", "services", "portfolio", "studio", "contact"];
    const triggers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-site flex h-[72px] items-center justify-between lg:h-[88px]">
        <a href="#home" className="leading-none" data-cursor="hover">
          <div className="font-sans text-[15px] font-semibold tracking-[0.16em] text-text sm:text-[16px]">
            BE&middot;WARE!
          </div>
          <div className="mt-[3px] text-[8px] font-medium tracking-[0.32em] text-muted">
            CREATIVE STUDIO
          </div>
        </a>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 xl:gap-10 lg:flex"
          aria-label="Primary"
        >
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-link label-nav text-text/90 hover:text-accent ${
                active === item.section ? "is-active" : ""
              }`}
              data-cursor="hover"
              aria-current={active === item.section ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center"
          data-cursor="hover"
        >
          <span className="relative flex h-[8px] w-[20px] flex-col justify-between">
            <span
              className={`h-px w-full bg-text transition-transform duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-text transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg/98 backdrop-blur-md lg:hidden">
          <div className="container-site flex h-[72px] items-center justify-between">
            <a
              href="#home"
              className="leading-none"
              onClick={() => setMenuOpen(false)}
            >
              <div className="font-sans text-[15px] font-semibold tracking-[0.16em]">
                BE&middot;WARE!
              </div>
              <div className="mt-[3px] text-[8px] font-medium tracking-[0.32em] text-muted">
                CREATIVE STUDIO
              </div>
            </a>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <span className="relative block h-[10px] w-[18px]">
                <span className="absolute left-0 top-[4.5px] h-px w-full rotate-45 bg-text" />
                <span className="absolute left-0 top-[4.5px] h-px w-full -rotate-45 bg-text" />
              </span>
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-7">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`heading-serif text-4xl transition-colors hover:text-accent ${
                  active === item.section ? "text-accent" : "text-text"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export { links as navLinks };
