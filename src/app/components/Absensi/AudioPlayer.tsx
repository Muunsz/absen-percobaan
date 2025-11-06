"use client";

import { useEffect } from "react";

export default function AudioPlayer({ src }: { src: string }) {
  useEffect(() => {
    const audio = new Audio(src);
    audio.play().catch(() => {
      // Autoplay diblokir oleh browser
    });
  }, [src]);

  return null;
}