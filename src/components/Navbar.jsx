import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_UI, prefersReducedMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: "Home", href: "#home", section: "home" },
  { label: "Services", href: "#services", section: "services" },
  { label: "Portfolio", href: "#portfolio", section: "portfolio" },
  { label: "Studio", href: "#studio", section: "studio" },
  { label: "Contact", href: "#contact", section: "contact" },
];

export default function Navbar({ introReady = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const entranceActiveRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set("header", { opacity: 1 });
      return;
    }
    gsap.set("header", { opacity: 0 });
  }, []);

  useEffect(() => {
    if (!introReady || entranceActiveRef.current) return;
    entranceActiveRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set("header", { opacity: 1 });
      return () => {
        entranceActiveRef.current = false;
      };
    }

    const tween = gsap.to("header", {
      opacity: 1,
      duration: 0.4,
      ease: EASE_UI,
      delay: 0.12,
    });

    return () => {
      entranceActiveRef.current = false;
      tween.kill();
    };
  }, [introReady]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-site flex h-[72px] items-center justify-between lg:h-[88px]">
        <a href="#home" className="pressable leading-none">
          <div className="font-sans text-[15px] font-semibold tracking-[0.12em] text-text sm:text-[16px]">
            BE&middot;WARE!
          </div>
          <div className="mt-[3px] text-[11px] font-medium tracking-[0.12em] text-muted">
            Creative Studio
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
              className={`nav-link label-nav text-text/90 hover:text-text ${
                active === item.section ? "is-active" : ""
              }`}
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
          className="pressable relative flex h-10 w-10 items-center justify-center lg:hidden"
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

      <div
        className={`mobile-drawer fixed inset-0 z-50 flex flex-col bg-bg transition-opacity duration-250 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="container-site flex h-[72px] items-center justify-between">
          <a href="#home" className="leading-none" onClick={closeMenu}>
            <div className="font-sans text-[15px] font-semibold tracking-[0.12em]">
              BE&middot;WARE!
            </div>
            <div className="mt-[3px] text-[11px] font-medium tracking-[0.12em] text-muted">
              Creative Studio
            </div>
          </a>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="pressable flex h-10 w-10 items-center justify-center"
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
              onClick={closeMenu}
              className={`heading-serif text-4xl transition-colors hover:text-text ${
                active === item.section ? "text-accent" : "text-text"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { links as navLinks };
