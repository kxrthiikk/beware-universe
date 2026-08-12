import { useRef } from "react";
import { navLinks } from "./Navbar";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
];

const footerLinks = navLinks.filter((l) =>
  ["Home", "Services", "Portfolio", "Studio", "Contact"].includes(l.label)
);

export default function Footer() {
  const footerRef = useRef(null);

  return (
    <footer ref={footerRef} className="relative w-full pb-8 pt-14 sm:pt-16">
      <div className="container-site">
        <div className="flex flex-col items-center gap-10 border-b border-white/[0.12] pb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <a href="#home" className="pressable leading-none">
            <div className="font-sans text-[15px] font-semibold tracking-[0.12em] text-text">
              BE&middot;WARE!
            </div>
            <div className="mt-[3px] text-[11px] font-medium tracking-[0.12em] text-muted">
              Creative Studio
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
                className="label-nav text-muted transition-colors duration-300 hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 sm:items-end">
            <nav className="flex items-center gap-5" aria-label="Social">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label-eyebrow text-muted transition-colors hover:text-text"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[11px] text-muted transition-colors hover:text-text"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-[11px] text-muted transition-colors hover:text-text"
              >
                Terms
              </a>
            </div>
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
