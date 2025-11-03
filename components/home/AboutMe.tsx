'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function AboutMe() {
  const shouldReduceMotion = useReducedMotion();

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section id="about" className="relative pt-24 md:pt-32 pb-40 md:pb-56 bg-background-primary overflow-hidden">
      {/* Background gradient matching activity timeline - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 80 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: shouldReduceMotion ? 0.3 : 2.2,
                delay: shouldReduceMotion ? 0 : 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          {/* Quote Content */}
          <motion.div
            className="px-4 md:px-8"
            variants={contentVariants}
          >
            <blockquote className="relative pl-8 md:pl-12">
              {/* Opening quote mark */}
              <span className="absolute top-0 left-0 text-6xl md:text-7xl text-accent-blue/20 font-serif leading-none">&ldquo;</span>

              <div className="text-2xl md:text-3xl lg:text-4xl text-text-primary leading-relaxed font-light italic mb-6">
                <p className="text-left mb-2">
                  If art is how we decorate space,
                </p>
                <p className="text-right pr-8 md:pr-12 relative">
                  music is how we decorate time.
                  {/* Closing quote mark */}
                  <span className="absolute -right-2 md:right-0 top-0 text-6xl md:text-7xl text-accent-gold/20 font-serif leading-none">&rdquo;</span>
                </p>
              </div>
            </blockquote>

            <p className="text-base md:text-lg text-text-secondary/70 mt-8 font-light text-right pr-8 md:pr-12">
              — Jean-Michel Basquiat
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
