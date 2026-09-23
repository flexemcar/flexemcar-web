"use client";

import { useEffect, useRef, useState } from "react";

export default function TallerVideoBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) video.play().catch(() => {});
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.75rem] ring-4 ring-brand-orange/70 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]">
      <video
        ref={videoRef}
        src="/video/taller-propio.mp4"
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Activar sonido" : "Silenciar vídeo"}
        className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-dark-1000/80 text-white backdrop-blur transition hover:bg-dark-1000"
      >
        {muted ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path
              d="M16 8.5a4.5 4.5 0 0 1 0 7"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
              opacity={0.4}
            />
            <path d="M2 2l20 20" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3Z" />
            <path
              d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
