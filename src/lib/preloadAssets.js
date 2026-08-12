const HERO_POSTER = "/assets/hero-section.png";
const HERO_VIDEO = "/assets/hero-section-video.mp4";

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve({ src, ok: true });
    img.onerror = () => resolve({ src, ok: false });
    img.src = src;
  });
}

function loadVideo(src) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const finish = (ok) => resolve({ src, ok });
    video.addEventListener("loadeddata", () => finish(true), { once: true });
    video.addEventListener("error", () => finish(false), { once: true });
    video.src = src;
    video.load();
  });
}

/** Wait for fonts + hero poster + video first frame before dismissing intro. */
export async function preloadCriticalAssets() {
  const fontReady =
    document.fonts?.ready?.catch?.(() => undefined) ?? Promise.resolve();

  await Promise.all([
    fontReady,
    loadImage(HERO_POSTER),
    loadVideo(HERO_VIDEO),
  ]);

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

export { HERO_POSTER, HERO_VIDEO };
