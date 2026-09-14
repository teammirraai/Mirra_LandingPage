"use client";

import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section className="px-6 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
      <h1 className="mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-balance text-ink-900 sm:text-6xl sm:leading-[1.08]">
        No More Endless Browsing, Just Ask MIRRA!
      </h1>

      <div className="relative mx-auto mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(23,19,15,0.12)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/MirraVideo.mp4" type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-surface backdrop-blur transition-colors hover:bg-ink/85"
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M11 5 6 9H3v6h3l5 4V5z"
                fill="currentColor"
              />
              <path
                d="m16 9 5 6M21 9l-5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
              <path
                d="M15.5 8.5a5 5 0 0 1 0 7M18 6a9 9 0 0 1 0 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="mx-auto mt-20 max-w-xl text-base text-ink-700 sm:mt-24 sm:text-lg">
        Tell Mirra what you need. It finds clothes that match your wardrobe,
        suggests you what to wear and what&rsquo;s actually missing from your
        closet.
      </p>
    </section>
  );
}
