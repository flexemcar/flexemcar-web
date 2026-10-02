import { getReelRows } from "@/app/lib/getReels";
import { getTiktokOembed } from "@/app/lib/tiktokOembed";
import { deleteReelAction, moveReelAction } from "@/app/admin/reelActions";
import AddReelForm from "@/app/admin/videos/AddReelForm";

export default async function AdminVideosPage() {
  const rows = await getReelRows();
  const reels = rows
    ? await Promise.all(
        rows.map(async (r) => ({ ...r, oembed: await getTiktokOembed(r.video_url) }))
      )
    : null;

  return (
    <div className="px-4 sm:px-6 py-8">
      <h1 className="font-heading uppercase font-extrabold text-2xl text-warm-50">
        Vídeos de TikTok{reels ? ` (${reels.length})` : ""}
      </h1>
      <p className="mt-1 text-sm text-warm-50/60">
        Son los vídeos de la sección «Día a día» de la web, en este orden.
      </p>

      {reels === null ? (
        <p className="mt-8 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300">
          No se pueden cargar los vídeos ahora mismo. Inténtalo de nuevo en un momento.
        </p>
      ) : (
        <>
          <div className="mt-6">
            <AddReelForm />
          </div>

          <div className="mt-8 space-y-3">
            {reels.map((r, i) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-warm-50/5 border border-warm-50/10 p-3"
              >
                <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-lg bg-dark-900">
                  {r.oembed?.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- miniatura firmada de TikTok, cambia de URL
                    <img src={r.oembed.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-warm-50 line-clamp-2">
                    {i + 1}. {r.oembed?.title || "Vídeo de TikTok"}
                  </p>
                  <a
                    href={r.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-warm-50/50 hover:text-brand-orange break-all"
                  >
                    {r.video_url}
                  </a>
                  {!r.oembed && (
                    <p className="mt-1 text-xs font-semibold text-red-300">
                      TikTok no encuentra este vídeo (¿borrado o privado?). Conviene quitarlo.
                    </p>
                  )}
                </div>
                <div className="flex w-full items-center gap-2 border-t border-warm-50/10 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                  <form action={moveReelAction.bind(null, r.id, "up")}>
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Subir"
                      className="rounded-full border border-warm-50/20 px-3 py-1 text-sm text-warm-50 hover:border-brand-orange disabled:opacity-30"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveReelAction.bind(null, r.id, "down")}>
                    <button
                      type="submit"
                      disabled={i === reels.length - 1}
                      aria-label="Bajar"
                      className="rounded-full border border-warm-50/20 px-3 py-1 text-sm text-warm-50 hover:border-brand-orange disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>
                  <form action={deleteReelAction.bind(null, r.id)} className="ml-auto sm:ml-2">
                    <button
                      type="submit"
                      disabled={reels.length <= 1}
                      className="text-sm font-semibold text-red-400 hover:text-red-300 disabled:opacity-30"
                    >
                      Quitar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
