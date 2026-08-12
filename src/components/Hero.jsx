import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  EASE_CINEMA,
  prefersReducedMotion,
  splitLinesReveal,
} from "../lib/animations";

export default function Hero({ introReady = false }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const fallbackRef = useRef(null);
  const titleRef = useRef(null);
  const entranceActiveRef = useRef(false);
  const [useFallback, setUseFallback] = useState(prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-fade", { opacity: 0, y: 16 });
      gsap.set(titleRef.current, { opacity: 0 });

      const heroMedia = videoRef.current || fallbackRef.current;
      if (heroMedia) {
        gsap.set(heroMedia, { opacity: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useFallback) return;

    const onError = () => setUseFallback(true);
    video.addEventListener("error", onError);
    return () => video.removeEventListener("error", onError);
  }, [useFallback]);

  useEffect(() => {
    if (!introReady || entranceActiveRef.current) return;
    entranceActiveRef.current = true;

    const cleanups = [];

    const ctx = gsap.context(() => {
      const heroMedia = useFallback ? fallbackRef.current : videoRef.current;

      if (prefersReducedMotion()) {
        gsap.set(heroMedia, { opacity: 1, clearProps: "transform" });
        gsap.set(".hero-fade", { opacity: 1, y: 0, clearProps: "transform" });
        gsap.set(titleRef.current, {
          opacity: 1,
          clearProps: "filter,transform",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE_CINEMA } });

      tl.to(
        heroMedia,
        { opacity: 1, duration: 0.6 },
        0
      );

      tl.add(() => {
        gsap.set(titleRef.current, { opacity: 1 });
        cleanups.push(
          splitLinesReveal(titleRef.current, {
            immediate: true,
            delay: 0,
            stagger: 0.05,
            duration: 0.85,
            ease: EASE_CINEMA,
            blur: true,
            blurFrom: 6,
            yPercent: 100,
          })
        );
      }, 0.2);

      tl.to(
        ".hero-fade",
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
        },
        0.55
      );
    }, sectionRef);

    return () => {
      entranceActiveRef.current = false;
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
    };
  }, [introReady, useFallback]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden lg:block lg:h-[100dvh] lg:min-h-[680px]"
    >
      <div className="relative z-0 order-1 h-[56dvh] w-full min-h-[280px] lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:h-auto lg:min-h-0 lg:w-[62%]">
        <div className="absolute inset-0 overflow-hidden">
          {useFallback ? (
            <img
              ref={fallbackRef}
              data-intro-hero
              src="/assets/hero-section.png"
              alt="Cinematic portrait — BE·WARE! Creative Studio"
              className="hero-film h-full w-full object-cover object-[62%_center]"
            />
          ) : (
            <video
              ref={videoRef}
              data-intro-hero
              className="hero-film h-full w-full object-cover object-[50%_40%] lg:object-[46%_42%]"
              autoPlay
              muted
              playsInline
              loop
              poster="/assets/hero-section.png"
              aria-label="BE·WARE! studio film"
            >
              <source src="/assets/hero-section-video.mp4" type="video/mp4" />
            </video>
          )}
          <div
            className="absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/35 to-transparent lg:block"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="container-site relative z-10 order-2 flex flex-1 items-center bg-bg py-10 pt-20 lg:absolute lg:inset-0 lg:order-none lg:bg-transparent lg:py-10 lg:pt-16">
        <div className="w-full max-w-[520px]">
          <p className="hero-fade label-eyebrow mb-6 text-muted sm:mb-8">
            BE-WARE! STUDIOS
          </p>

          <h1
            ref={titleRef}
            className="heading-serif text-[13vw] text-text sm:text-[68px] lg:text-[clamp(64px,6.2vw,112px)]"
            style={{ lineHeight: 0.92 }}
          >
            Not just
            <br />
            a studio.
            <br />
            <em className="italic text-accent">A new way</em>
            <br />
            <em className="italic text-accent">of seeing.</em>
          </h1>

          <div className="hero-fade mt-8 sm:mt-12">
            <a
              href="#services"
              className="pressable label-nav underline-link w-fit text-text"
            >
              Explore Our Universe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
