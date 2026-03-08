'use client';

import { useState } from 'react';

interface HeroBackgroundProps {
  imageUrl: string | null;
}

export default function HeroBackground({ imageUrl }: HeroBackgroundProps) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <img
        src={imageUrl}
        alt=""
        onError={() => setFailed(true)}
        className="w-full h-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-primary" />
    </div>
  );
}
