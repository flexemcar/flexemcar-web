export type Reel = {
  id: string;
  platform: "instagram" | "tiktok";
  videoUrl: string;
  coverImage: string | null;
  caption: string;
};

// Actualización manual: sustituye videoUrl y coverImage cuando haya contenido real.
// coverImage en null muestra un bloque de color de marca como placeholder.
export const reels: Reel[] = Array.from({ length: 10 }, (_, i) => ({
  id: `reel-${i + 1}`,
  platform: i % 2 === 0 ? "instagram" : "tiktok",
  videoUrl: "#",
  coverImage: null,
  caption: "Próximamente",
}));
