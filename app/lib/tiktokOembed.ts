export type TiktokOembed = {
  thumbnailUrl: string;
  title: string;
};

// oEmbed público de TikTok: no requiere token ni cuenta de developer, pero solo
// sirve para un vídeo cuya URL ya conocemos (no lista "los últimos vídeos del
// perfil"). La miniatura que devuelve lleva una firma con expiración, por eso
// se revalida periódicamente en vez de guardarse fija.
export async function getTiktokOembed(videoUrl: string): Promise<TiktokOembed | null> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.warn(`No se pudo traer el oEmbed de TikTok (${res.status}): ${videoUrl}`);
      return null;
    }

    const data = await res.json();
    if (!data.thumbnail_url) return null;

    return {
      thumbnailUrl: data.thumbnail_url as string,
      title: (data.title as string) ?? "",
    };
  } catch {
    console.warn(`No se pudo traer el oEmbed de TikTok: ${videoUrl}`);
    return null;
  }
}
