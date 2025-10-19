"use client";

import { useEffect, useState } from "react";
import YouTubePlayerMini from "@/components/music/YouTubePlayerMini";

export default function PlayerBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative border-b border-background-secondary">
      {/* Subtle gradient background to match header */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/5 via-accent-blue/5 to-transparent opacity-30 -z-10" />

      <div className="relative container mx-auto px-4 py-2">
        <YouTubePlayerMini />
      </div>
    </div>
  );
}
