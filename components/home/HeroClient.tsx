'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MusicIcon, CodeIcon } from '@/components/ui/icons';

interface HeroClientProps {
  heroImageUrl?: string;
}

export default function HeroClient({ heroImageUrl }: HeroClientProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Calculate which side is more in focus based on mouse position
  const leftFocus = mousePosition.x < 0.5 ? 1 : 0.5;
  const rightFocus = mousePosition.x >= 0.5 ? 1 : 0.5;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Split Image Background - Only visible on desktop */}
      <div className="absolute inset-0 hidden md:block">
        {/* Left side - Music */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-700 ease-out"
          style={{
            opacity: leftFocus * 0.4,
            filter: `blur(${(1 - leftFocus) * 3}px) brightness(${0.6 + leftFocus * 0.3})`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80)',
              transform: `scale(${1 + (1 - leftFocus) * 0.05})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background-primary/40" />
          {/* Gradient fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 via-60% to-background-primary" />
        </div>

        {/* Right side - Tech */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-700 ease-out"
          style={{
            opacity: rightFocus * 0.4,
            filter: `blur(${(1 - rightFocus) * 3}px) brightness(${0.6 + rightFocus * 0.3})`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80)',
              transform: `scale(${1 + (1 - rightFocus) * 0.05})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background-primary/40" />
          {/* Gradient fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 via-60% to-background-primary" />
        </div>

        {/* Center divider line - subtle */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-accent-blue/20 to-transparent" />
      </div>

      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary/95 via-background-navy/90 to-background-primary/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,158,255,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      {/* Floating orbs for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Personal Image - Left side on desktop, top on mobile */}
            {heroImageUrl && (
              <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="relative group">
                  {/* Glow effect behind image */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-teal to-accent-gold rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

                  {/* Image container */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-accent-blue/30 shadow-2xl bg-background-secondary">
                    <Image
                      src={heroImageUrl}
                      alt="Sam Swerczek"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Text content - Right side on desktop */}
            <div className="text-center flex-1">
              {/* Hero Section with fade-in animation */}
              <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-primary font-montserrat tracking-tight whitespace-nowrap">
                  Sam Swerczek
                </h1>
              </div>

              {/* Tagline with delayed animation */}
              <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary mb-4 font-light">
                  Crafting melodies & products
                </p>
                <div className="flex items-center justify-center gap-3 mb-12">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
                  <p className="text-sm md:text-base text-text-secondary/80 uppercase tracking-widest">
                    Singer-Songwriter • Software Engineer
                  </p>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent-gold to-transparent"></div>
                </div>
              </div>

              {/* CTAs with staggered animation */}
              <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/music"
                    className="group w-full sm:w-auto sm:min-w-[160px] px-6 py-3 bg-transparent border border-text-secondary/20 hover:border-text-secondary/40 text-text-primary rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-blue/30 group-hover:border-accent-blue/50 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <MusicIcon className="w-4 h-4 text-accent-blue/70 group-hover:text-accent-blue transition-colors duration-300" />
                      </span>
                      <span className="font-medium">Explore Music</span>
                    </span>
                  </Link>
                  <Link
                    href="/blog"
                    className="group w-full sm:w-auto sm:min-w-[160px] px-6 py-3 bg-transparent border border-text-secondary/20 hover:border-text-secondary/40 text-text-primary rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-teal/30 group-hover:border-accent-teal/50 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <CodeIcon className="w-4 h-4 text-accent-teal/70 group-hover:text-accent-teal transition-colors duration-300" />
                      </span>
                      <span className="font-medium">Engineering & Blog</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - hidden on large screens */}
          <div className={`mt-20 transition-all duration-1000 delay-700 text-center lg:hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <a
              href="#about"
              className="inline-flex flex-col items-center gap-2 text-text-secondary/50 hover:text-text-secondary/80 transition-colors"
            >
              <p className="text-sm uppercase tracking-wider">Scroll to explore</p>
              <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full p-1">
                <div className="w-1.5 h-3 bg-text-secondary/50 rounded-full mx-auto animate-scroll"></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
