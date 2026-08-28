import { reels, type Reel } from "@/app/data/reels";
import { getTiktokOembed } from "@/app/lib/tiktokOembed";

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

export async function getReels(): Promise<Reel[]> {
  return Promise.all(
    reels.map(async (reel) => {
      if (reel.platform !== "tiktok" || reel.videoUrl === "#") return reel;

      const oembed = await getTiktokOembed(reel.videoUrl);
      if (!oembed) return reel;

      return {
        ...reel,
        coverImage: oembed.thumbnailUrl,
        caption: oembed.title ? truncate(oembed.title, 90) : reel.caption,
      };
    })
  );
}
