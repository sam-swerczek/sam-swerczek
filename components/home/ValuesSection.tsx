'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LightbulbIcon, CodeIcon, StarIcon } from '@/components/ui/icons';
import { coreValues, type CoreValue } from '@/lib/config/content';
import { cardVariants, headerVariants, ANIMATION_TIMING } from '@/lib/config/animations';

/**
 * ValueCard - Inline subcomponent for displaying individual core values
 * Handles icon mapping, animations, and responsive styling
 */
const ValueCard = ({
  value,
  index,
  reduceMotion,
}: {
  value: CoreValue;
  index: number;
  reduceMotion: boolean;
}) => {
  // Map icon string to icon component
  const iconMap = {
    lightbulb: LightbulbIcon,
    code: CodeIcon,
    star: StarIcon,
  };

  const IconComponent = iconMap[value.icon as keyof typeof iconMap];

  // Determine border and shadow colors based on accent color
  const getBorderClasses = (accentColor: string) => {
    switch (accentColor) {
      case 'accent-blue':
        return 'border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-accent-blue/20';
      case 'accent-teal':
        return 'border-accent-teal/20 hover:border-accent-teal/40 hover:shadow-accent-teal/20';
      case 'accent-gold':
        return 'border-accent-gold/20 hover:border-accent-gold/40 hover:shadow-accent-gold/20';
      default:
        return 'border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-accent-blue/20';
    }
  };

  const getIconColorClass = (accentColor: string) => {
    switch (accentColor) {
      case 'accent-blue':
        return 'text-accent-blue';
      case 'accent-teal':
        return 'text-accent-teal';
      case 'accent-gold':
        return 'text-accent-gold';
      default:
        return 'text-accent-blue';
    }
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className={`
        bg-background-secondary/20
        backdrop-blur-sm
        border
        ${getBorderClasses(value.accentColor)}
        p-6
        rounded-lg
        transition-all
        duration-300
        hover:shadow-lg
        group
      `}
    >
      {/* Icon */}
      <IconComponent
        className={`w-10 h-10 mb-4 ${getIconColorClass(value.accentColor)} transition-transform duration-300 group-hover:scale-110`}
      />

      {/* Title */}
      <h3 className="text-xl font-bold text-text-primary font-montserrat mb-3">
        {value.title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary leading-relaxed">
        {value.description}
      </p>
    </motion.div>
  );
};

/**
 * ValuesSection - Displays core values in a responsive grid layout
 * Features staggered animations and respects reduced motion preferences
 */
export default function ValuesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-16 md:py-20 bg-background-primary overflow-hidden">
      {/* Background gradient - darker than other sections for visual separation */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy/50 via-background-primary to-background-navy/50" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto max-w-5xl px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={shouldReduceMotion}
          variants={headerVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-montserrat mb-4">
            Core Values
          </h2>
          <p className="text-lg text-text-secondary">
            Principles that guide my work
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {coreValues.map((value, index) => (
            <ValueCard
              key={value.id}
              value={value}
              index={index}
              reduceMotion={shouldReduceMotion || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
