export type Reel = {
  id: string;
  platform: "instagram" | "tiktok";
  videoUrl: string;
  coverImage: string | null;
  caption: string;
  tiktokId: string | null;
};

// Los videos se gestionan desde el panel (/admin/videos, tabla `reels`).
// Esta lista es solo el respaldo por si la base de datos no responde.
export const fallbackReelUrls = [
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
];

// coverImage/caption son el placeholder por si el oEmbed de TikTok fallara.
export function toReel(videoUrl: string, id: string): Reel {
  return {
    id,
    platform: "tiktok",
    videoUrl,
    coverImage: null,
    caption: "Flexemcar en TikTok",
    tiktokId: videoUrl.match(/\/video\/(\d+)/)?.[1] ?? null,
  };
}
