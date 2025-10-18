'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ContactHeroProps {
  profileImageUrl?: string;
}

export default function ContactHero({ profileImageUrl }: ContactHeroProps) {
  return (
    <div className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Floating orbs background - reusing pattern from HeroSection */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Personal Photo with Glow Effect */}
          {profileImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative group">
                {/* Glow effect behind image */}
                <div className="absolute -inset-2 bg-gradient-to-r from-accent-blue via-accent-teal to-accent-gold rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition duration-500"></div>

                {/* Image container */}
                <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden border-4 border-accent-blue/30 shadow-2xl bg-background-secondary">
                  <Image
                    src={profileImageUrl}
                    alt="Sam Swerczek"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary"
          >
            Let&apos;s Connect
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Whether you&apos;re looking to collaborate on music, build something amazing together,
            or just want to say hello—I&apos;d love to hear from you.
          </motion.p>

          {/* Response Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary/50 backdrop-blur-sm rounded-full border border-text-secondary/10"
          >
            <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Response time:</span> Typically within 24-48 hours
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
