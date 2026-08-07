import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navLinks } from "./Navbar";
import { fadeUp, prefersReducedMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = navLinks.filter((l) =>
  ["Home", "About", "Portfolio", "Studio", "Journal", "Contact"].includes(
    l.label
  )
);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      fadeUp(footerRef.current?.children, {
        trigger: footerRef.current,
        start: "top 92%",
        y: 24,
        duration: 0.85,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full pb-8 pt-14 sm:pt-16">
      <div className="container-site">
        <div className="flex flex-col items-center gap-10 border-b border-white/[0.12] pb-10 sm:flex-row sm:justify-between sm:gap-6">
          <a href="#home" className="leading-none" data-cursor="hover">
            <div className="font-sans text-[15px] font-semibold tracking-[0.16em] text-text">
              BE&middot;WARE!
            </div>
            <div className="mt-[3px] text-[8px] font-medium tracking-[0.32em] text-muted">
              CREATIVE STUDIO
            </div>
          </a>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
            aria-label="Footer"
          >
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="label-nav text-muted transition-colors duration-300 hover:text-accent"
                data-cursor="hover"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="label-tiny text-muted transition-colors hover:text-accent"
              data-cursor="hover"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="label-tiny text-muted transition-colors hover:text-accent"
              data-cursor="hover"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-center text-[11px] text-muted sm:text-left">
            &copy; 2025 Be-ware! Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
