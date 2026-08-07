const CRITICAL_IMAGES = [
  "/assets/hero-section.png",
  "/assets/creative-universe-1.png",
  "/assets/creative-universe-2.png",
  "/assets/creative-universe-3.png",
  "/assets/creative-universe-4.png",
  "/assets/creative-universe-5.png",
  "/assets/creative-universe-6.png",
  "/assets/creative-universe-7.png",
  "/assets/creative-universe-8.png",
  "/assets/creative-universe-9.png",
  "/assets/portfolio-1.png",
  "/assets/portfolio-2.png",
  "/assets/portfolio-3.png",
  "/assets/portfolio-4.png",
  "/assets/studio-1-main-image.png",
  "/assets/cta-1.png",
];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve({ src, ok: true });
    img.onerror = () => resolve({ src, ok: false });
    img.src = src;
  });
}

/** Wait for fonts + critical images before dismissing the intro. */
export async function preloadCriticalAssets() {
  const fontReady =
    document.fonts?.ready?.catch?.(() => undefined) ?? Promise.resolve();

  const images = Promise.all(CRITICAL_IMAGES.map(loadImage));

  await Promise.all([fontReady, images]);

  // Brief settle so first paint of the page behind the loader is stable
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

export { CRITICAL_IMAGES };
