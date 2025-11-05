/**
 * Shared animation configuration for consistent timing and motion across the app
 * All Framer Motion animation values centralized here for easy adjustment
 */

export const ANIMATION_TIMING = {
  // Easing curves - using cubic-bezier values
  easeOutCubic: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOutCubic: [0.65, 0.05, 0.35, 1] as const,

  // Durations (in seconds)
  fast: 0.3,
  medium: 0.6,
  slow: 1.4,

  // Stagger delays (in seconds)
  staggerShort: 0.1,
  staggerMedium: 0.2,
  staggerLong: 0.5,

  // Viewport amounts for whileInView triggers (0-1 scale)
  viewportAmount: 0.3,
} as const;

/**
 * Container variants for staggered children animations
 * Use with motion.div that wraps multiple animated children
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_TIMING.staggerLong,
      delayChildren: ANIMATION_TIMING.staggerMedium,
    },
  },
};

/**
 * Fade-up animation variants with scale
 * Respects reduced motion preferences via custom prop
 * Usage: variants={fadeUpVariants} custom={shouldReduceMotion}
 */
export const fadeUpVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 40,
    scale: reduceMotion ? 1 : 0.95,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.slow,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Header animation variants (for section headings)
 * Includes scale and vertical movement
 */
export const headerVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : -50,
    scale: reduceMotion ? 1 : 0.8,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.slow,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Card animation variants with stagger support
 * Use with index-based delays for cascading effect
 */
export const cardVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 40,
    scale: reduceMotion ? 1 : 0.98,
  }),
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.medium,
      delay: index * ANIMATION_TIMING.staggerShort,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  }),
};

/**
 * Slide-in from left variants (for music/creative content)
 */
export const slideInLeftVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    x: reduceMotion ? 0 : -40,
    scale: reduceMotion ? 1 : 0.98,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.medium,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Slide-in from right variants (for engineering/technical content)
 */
export const slideInRightVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    x: reduceMotion ? 0 : 40,
    scale: reduceMotion ? 1 : 0.98,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.medium,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Long slide-in from left variants (for activity timeline music cards)
 * Used for more dramatic entrance animations with extended duration
 */
export const slideInLeftLongVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    x: reduceMotion ? 0 : -100,
    scale: reduceMotion ? 1 : 0.92,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.slow,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Long slide-in from right variants (for activity timeline engineering cards)
 * Used for more dramatic entrance animations with extended duration
 */
export const slideInRightLongVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    x: reduceMotion ? 0 : 100,
    scale: reduceMotion ? 1 : 0.92,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TIMING.slow,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

/**
 * Semantic aliases for Activity Timeline
 * Music cards slide from left (creative/artistic direction)
 * Engineering cards slide from right (technical/logical direction)
 */
export const activityMusicCardVariants = slideInLeftLongVariants;
export const activityEngineeringCardVariants = slideInRightLongVariants;
