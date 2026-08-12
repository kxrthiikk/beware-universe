import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }) {
  const fabRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    if (reduced) {
      document.documentElement.classList.add("reduce-motion");
    }

    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      if (reduced) {
        document.documentElement.classList.remove("reduce-motion");
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const fab = fabRef.current;
    if (!fab) return;

    if (prefersReducedMotion()) {
      gsap.set(fab, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(fab, { opacity: 0, scale: 0.96 });

    const onReady = () => {
      if (document.documentElement.classList.contains("intro-active")) {
        return;
      }
      gsap.to(fab, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const obs = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("intro-active")) {
        onReady();
        obs.disconnect();
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (!document.documentElement.classList.contains("intro-active")) {
      onReady();
      obs.disconnect();
    }

    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text">
      {children}
      <a
        ref={fabRef}
        href="https://wa.me/"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-fab pressable fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-bg/90 shadow-lg shadow-black/40"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-accent" aria-hidden="true">
          <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.86.5 3.6 1.37 5.1L2 22l5.05-1.33A9.94 9.94 0 0 0 12.02 22C17.52 22 22 17.52 22 12S17.52 2 12.02 2Zm0 18.13c-1.6 0-3.1-.44-4.4-1.2l-.31-.19-3 .79.8-2.92-.2-.3a8.1 8.1 0 0 1-1.24-4.3c0-4.49 3.66-8.15 8.15-8.15A8.1 8.1 0 0 1 20.13 12a8.13 8.13 0 0 1-8.11 8.13Zm4.47-6.1c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </div>
  );
}
