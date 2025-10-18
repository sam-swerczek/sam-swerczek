'use client';

import { motion } from 'framer-motion';

export type IntentType = 'music' | 'code' | 'connect';

interface IntentCard {
  id: IntentType;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface IntentCardsProps {
  onSelectIntent: (intent: IntentType) => void;
}

const INTENT_CARDS: IntentCard[] = [
  {
    id: 'music',
    title: 'Music & Performance',
    description: 'Bookings, collaborations, production inquiries, or performance opportunities',
    badge: 'Most popular',
    accentColor: 'text-accent-blue',
    borderColor: 'border-accent-blue/50',
    bgColor: 'bg-accent-blue/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    id: 'code',
    title: 'Code & Engineering',
    description: 'Web development projects, technical consulting, or full-stack solutions',
    badge: 'Quick response',
    accentColor: 'text-accent-teal',
    borderColor: 'border-accent-teal/50',
    bgColor: 'bg-accent-teal/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'connect',
    title: 'Just Connect',
    description: 'General questions, feedback, friendly conversations, or anything else',
    badge: 'Always welcome',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-500/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function IntentCards({ onSelectIntent }: IntentCardsProps) {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            How can I help you?
          </h2>
          <p className="text-text-secondary text-lg">
            Choose what brings you here today
          </p>
        </motion.div>

        {/* Intent Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {INTENT_CARDS.map((card) => (
            <motion.button
              key={card.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectIntent(card.id)}
              className="group relative bg-background-secondary/30 backdrop-blur-sm p-8 rounded-2xl border border-text-secondary/10 hover:border-transparent transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary"
              aria-label={`Select ${card.title}`}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl ${card.borderColor} border opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className={`absolute inset-0 rounded-2xl ${card.borderColor} blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

              {/* Card Content */}
              <div className="relative">
                {/* Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${card.bgColor} ${card.accentColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 mb-4 rounded-xl ${card.bgColor} flex items-center justify-center ${card.accentColor} group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-blue group-hover:to-accent-teal transition-all duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Arrow indicator */}
                <div className="flex items-center gap-2 text-text-secondary/50 group-hover:text-accent-blue group-hover:gap-3 transition-all duration-300">
                  <span className="text-sm font-medium">Get started</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
