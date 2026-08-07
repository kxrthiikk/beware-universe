import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollIndicator from "./ScrollIndicator";
import SideSocials from "./SideSocials";
import {
  EASE,
  parallaxImage,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ introReady = false }) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const parallaxRef = useRef(null);
  const titleRef = useRef(null);
  const playedRef = useRef(false);

  // Prepare hidden state until intro completes — page is fully mounted behind the loader
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, {
        clipPath: "inset(18% 18% 18% 18%)",
        scale: 1.02,
      });
      gsap.set(".hero-fade", { opacity: 0, y: 16 });
      gsap.set(".hero-side", { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!introReady || playedRef.current) return;
    playedRef.current = true;

    const cleanups = [];

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(imageRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          clearProps: "transform",
        });
        gsap.set(".hero-fade", { clearProps: "all" });
        gsap.set(".hero-side", { clearProps: "all" });
        gsap.set(titleRef.current, { clearProps: "all" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Cinematic hero image reveal
      tl.to(
        imageRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.65,
        },
        0
      );

      // Heading — SplitType line-by-line after image starts revealing
      tl.add(() => {
        gsap.set(titleRef.current, { opacity: 1 });
        cleanups.push(
          splitLinesReveal(titleRef.current, {
            immediate: true,
            delay: 0,
            stagger: 0.1,
            duration: 1.05,
          })
        );
      }, 0.35);

      // Label + CTAs
      tl.to(
        ".hero-fade",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
        },
        0.85
      );

      // Side chrome: indicators, socials, scroll cue
      tl.to(
        ".hero-side",
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
        },
        1.05
      );

      parallaxImage(parallaxRef.current, sectionRef.current, 10);
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, [introReady]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden lg:block lg:h-[100svh] lg:min-h-[680px]"
    >
      <div className="container-site relative z-10 flex flex-1 items-center pb-10 pt-24 lg:absolute lg:inset-0 lg:pb-10 lg:pt-16">
        <div className="w-full max-w-[560px]">
          <p className="hero-fade label-tiny mb-6 text-muted sm:mb-8">
            BE-WARE! STUDIOS
          </p>

          <h1
            ref={titleRef}
            className="heading-serif text-[13vw] text-text sm:text-[68px] lg:text-[clamp(64px,6.2vw,112px)]"
            style={{ lineHeight: 0.9 }}
          >
            Not just
            <br />
            a studio.
            <br />
            <em className="italic text-accent">A new way</em>
            <br />
            <em className="italic text-accent">of seeing.</em>
          </h1>

          <div className="hero-fade mt-8 flex flex-col gap-7 sm:mt-12 sm:flex-row sm:items-center sm:gap-10">
            <a
              href="#services"
              className="label-nav underline-link w-fit text-text"
              data-cursor="hover"
            >
              Explore Our Universe
            </a>

            <button
              type="button"
              className="group inline-flex w-fit items-center gap-4"
              aria-label="Play reel"
              data-cursor="hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors duration-300 group-hover:border-accent">
                <span
                  className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[9px] border-y-transparent border-l-text transition-colors group-hover:border-l-accent"
                  aria-hidden="true"
                />
              </span>
              <span className="label-nav text-text">Play Reel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-0 h-[52vh] w-full min-h-[280px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[65%]">
        <div className="absolute inset-0 overflow-hidden">
          <div ref={parallaxRef} className="h-[115%] w-full will-change-transform">
            <img
              ref={imageRef}
              data-intro-hero
              src="/assets/hero-section.png"
              alt="Cinematic portrait — BE·WARE! Creative Studio"
              className="h-full w-full object-cover object-[68%_center]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-bg/80 lg:via-bg/10 lg:to-transparent" />
        </div>

        <div className="hero-side hidden lg:block">
          <ScrollIndicator />
          <SideSocials />
        </div>

        <div className="hero-side absolute bottom-5 right-5 z-20 flex items-center gap-3 sm:bottom-7 sm:right-8 lg:bottom-9 lg:right-12">
          <span className="label-tiny text-[9px] text-white/70">
            Scroll to explore
          </span>
          <span className="scroll-cue-arrow text-white/70" aria-hidden="true">
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}
