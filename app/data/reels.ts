export type Reel = {
  id: string;
  platform: "instagram" | "tiktok";
  videoUrl: string;
  coverImage: string | null;
  caption: string;
  tiktokId: string | null;
};

// Solo TikTok por ahora (Instagram descartado). Basta con pegar la URL real
// del vídeo en videoUrl — la miniatura y el texto se traen en vivo desde
// TikTok (ver app/lib/tiktokOembed.ts) y se mantienen actualizados solos.
// coverImage/caption aquí son solo el placeholder por si el fetch fallara.
export const reels: Reel[] = [
  "https://www.tiktok.com/@flexemcar/video/7679028117096254753",
  "https://www.tiktok.com/@flexemcar/video/7678741195236986145",
  "https://www.tiktok.com/@flexemcar/video/7678660953638030624",
  "https://www.tiktok.com/@flexemcar/video/7678390368164908320",
  "https://www.tiktok.com/@flexemcar/video/7677519027475860769",
  "https://www.tiktok.com/@flexemcar/video/7674666840487906592",
  "https://www.tiktok.com/@flexemcar/video/7674633341680749856",
  "https://www.tiktok.com/@flexemcar/video/7673896192169807137",
  "https://www.tiktok.com/@flexemcar/video/7673192556695538976",
  "https://www.tiktok.com/@flexemcar/video/7673164693531266337",
].map((videoUrl, i) => ({
  id: `reel-${i + 1}`,
  platform: "tiktok" as const,
  videoUrl,
  coverImage: null,
  caption: "Flexemcar en TikTok",
  tiktokId: videoUrl.match(/\/video\/(\d+)/)?.[1] ?? null,
}));
