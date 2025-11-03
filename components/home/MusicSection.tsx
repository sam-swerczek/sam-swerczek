'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useYouTubePlayer } from '@/components/music/hooks/useYouTubePlayer';
import { PlayIcon } from '@/components/ui/icons';
import { containerVariants, headerVariants, fadeUpVariants } from '@/lib/config/animations';

interface MusicSectionProps {
  musicImageUrl?: string;
}

export default function MusicSection({ musicImageUrl }: MusicSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { play, isPlaying, isReady } = useYouTubePlayer();

  return (
    <motion.div
      id="music-section"
      className="w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.3 : 2.4,
            delay: shouldReduceMotion ? 0 : 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
          {/* Main Content Box */}
          <div className="bg-background-secondary/30 backdrop-blur-sm rounded-t-2xl border border-text-secondary/10 border-b-0 p-6 md:p-8">
            {/* Image and Text Row */}
            <div className="flex flex-row items-center gap-4 md:gap-8">
              {/* Text Content - Left Side */}
              <div className="flex-1 text-center">
                <p className="text-base md:text-xl text-text-secondary leading-relaxed font-light">
                  <span>My music explores the messy, beautiful art of being human. <br />Give it a listen.</span>
                </p>
              </div>

              {/* Image - Right Side (Circle) */}
              {musicImageUrl && (
                <div className="relative group flex-shrink-0">
                  {/* Glow effect behind image */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-accent-blue via-accent-teal to-accent-gold rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />

                  {/* Circular Image container */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent-blue/20 shadow-xl bg-background-secondary">
                    <Image
                      src={musicImageUrl}
                      alt="Sam in studio"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <button
            onClick={play}
            disabled={!isReady}
            className="group w-full bg-accent-blue/10 hover:bg-accent-blue/15 backdrop-blur-sm rounded-b-2xl border border-text-secondary/10 border-t-0 px-6 py-3 flex items-center justify-center transition-colors duration-300 disabled:cursor-not-allowed disabled:hover:bg-accent-blue/10"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-blue/30 group-hover:border-accent-blue/50 group-disabled:border-accent-blue/20 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                <PlayIcon className="w-4 h-4 text-accent-blue/70 group-hover:text-accent-blue group-disabled:text-accent-blue/40 transition-colors duration-300" />
              </span>
              <span className="font-medium text-text-primary group-disabled:text-text-secondary/50">
                {!isReady ? 'Loading...' : isPlaying ? 'Now Playing' : 'Listen Now'}
              </span>
            </span>
          </button>
    </motion.div>
  );
}
