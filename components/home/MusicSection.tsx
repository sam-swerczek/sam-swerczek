'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useYouTubePlayer } from '@/components/music/hooks/useYouTubePlayer';
import { PlayIcon } from '@/components/ui/icons';
import { containerVariants, headerVariants, fadeUpVariants } from '@/lib/config/animations';

export default function MusicSection() {
  const shouldReduceMotion = useReducedMotion();
  const { play, isPlaying, isReady } = useYouTubePlayer();

  return (
    <section id="music-section" className="relative py-16 md:py-20 bg-background-primary overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section heading */}
          <motion.div className="mb-8" variants={headerVariants} custom={shouldReduceMotion}>
            <h2 className="text-4xl font-bold text-text-primary font-montserrat">
              Music
            </h2>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeUpVariants} custom={shouldReduceMotion}>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 font-light">
              My songwriting is rooted in storytelling and authenticity. I write from personal experience,
              crafting melodies that connect emotionally and lyrics that resonate long after the song ends.
              Every track is an invitation to feel something real.
            </p>

            {/* Play Music Button */}
            <button
              onClick={play}
              disabled={!isReady}
              className="group w-auto px-6 py-3 bg-transparent border border-text-secondary/20 hover:border-text-secondary/40 disabled:border-text-secondary/10 text-text-primary disabled:text-text-secondary/50 rounded-lg transition-all duration-300 inline-flex items-center justify-center disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-blue/30 group-hover:border-accent-blue/50 disabled:border-accent-blue/20 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                  <PlayIcon className="w-4 h-4 text-accent-blue/70 group-hover:text-accent-blue group-disabled:text-accent-blue/40 transition-colors duration-300" />
                </span>
                <span className="font-medium">
                  {isPlaying ? 'Playing...' : 'Play Music'}
                </span>
              </span>
            </button>

            {!isReady && (
              <p className="text-sm text-text-secondary mt-4">
                Loading player...
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
