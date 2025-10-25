'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function AboutMe() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -50,
      scale: shouldReduceMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20 bg-background-primary overflow-hidden">
      {/* Background gradient matching activity timeline - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section heading */}
          <motion.div className="text-center mb-8" variants={headerVariants}>
            <h2 className="text-4xl font-bold text-text-primary font-montserrat">
              About Me
            </h2>
          </motion.div>

          {/* Content */}
          <motion.div variants={contentVariants}>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-light text-center">
              I'm a{' '}
              <span className="text-accent-blue font-medium">singer-songwriter</span>
              {' '}creating music that connects and a{' '}
              <span className="text-accent-teal font-medium">software engineer</span>
              {' '}building innovative solutions. Whether I'm composing or coding, I'm driven by the pursuit of crafting experiences that resonate.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
