'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CodeIcon } from '@/components/ui/icons';
import { containerVariants, fadeUpVariants } from '@/lib/config/animations';

interface EngineeringSectionProps {
  engineeringImageUrl?: string;
  githubUrl: string;
}

export default function EngineeringSection({ engineeringImageUrl, githubUrl }: EngineeringSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="engineering-section" className="relative py-24 md:py-36 bg-background-primary overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
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
              {/* Image - Left Side (Circle) */}
              {engineeringImageUrl && (
                <div className="relative group flex-shrink-0 order-first">
                  {/* Glow effect behind image - using accent-teal */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-accent-teal via-accent-blue to-accent-teal rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />

                  {/* Circular Image container */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent-teal/20 shadow-xl bg-background-secondary">
                    <Image
                      src={engineeringImageUrl}
                      alt="Engineering workspace"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                </div>
              )}

              {/* Text Content - Right Side */}
              <div className="flex-1 text-center">
                <p className="text-base md:text-xl text-text-secondary leading-relaxed font-light">
                  <span>This website was built in partnership with my good friend, Claude. Let me show you how.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full bg-accent-teal/10 hover:bg-accent-teal/15 backdrop-blur-sm rounded-b-2xl border border-text-secondary/10 border-t-0 px-6 py-3 flex items-center justify-center transition-colors duration-300"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-teal/30 group-hover:border-accent-teal/50 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                <CodeIcon className="w-4 h-4 text-accent-teal/70 group-hover:text-accent-teal transition-colors duration-300" />
              </span>
              <span className="font-medium text-text-primary">
                View on GitHub
              </span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
