'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ContactForm, { IntentType } from './ContactForm';
import SocialLinks from '@/components/music/SocialLinks';

interface ContextualFormProps {
  selectedIntent: IntentType | null;
  onBack: () => void;
  bookingEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  patreonUrl?: string;
}

const INTENT_LABELS = {
  music: 'Music & Performance',
  code: 'Code & Engineering',
  connect: 'Just Connect',
};

export default function ContextualForm({
  selectedIntent,
  onBack,
  bookingEmail,
  instagramUrl,
  facebookUrl,
  linkedinUrl,
  tiktokUrl,
  patreonUrl,
}: ContextualFormProps) {
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll to form when it appears
  useEffect(() => {
    if (selectedIntent && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedIntent]);

  // Handle Escape key to go back
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedIntent) {
        onBack();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedIntent, onBack]);

  return (
    <AnimatePresence>
      {selectedIntent && (
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="py-12 px-4"
        >
          <div className="container mx-auto max-w-3xl">
            {/* Breadcrumb Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={onBack}
              className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-primary rounded-lg px-2 py-1"
              aria-label="Back to options"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to options</span>
            </motion.button>

            {/* Form Container with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-background-secondary/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-text-secondary/10 shadow-2xl"
            >
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  {INTENT_LABELS[selectedIntent]}
                </h2>
                <p className="text-text-secondary">
                  Fill out the form below and I&apos;ll get back to you within 24-48 hours
                </p>
              </div>

              {/* Contact Form */}
              <ContactForm intent={selectedIntent} />

              {/* Response Time Reminder */}
              <div className="mt-8 pt-6 border-t border-text-secondary/10">
                <div className="flex items-start gap-3 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    I read every message personally. You can expect a thoughtful response within 24-48 hours.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Alternative Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-12"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Prefer Another Way?
                </h3>
                <p className="text-text-secondary text-sm">
                  Reach out through social media or email
                </p>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <SocialLinks
                  instagramUrl={instagramUrl}
                  facebookUrl={facebookUrl}
                  linkedinUrl={linkedinUrl}
                  tiktokUrl={tiktokUrl}
                  patreonUrl={patreonUrl}
                  layout="horizontal"
                />
              </div>

              {/* Direct Email */}
              {bookingEmail && (
                <div className="text-center">
                  <div className="inline-block bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 p-6 rounded-xl border border-accent-blue/20">
                    <p className="text-text-secondary text-sm mb-2">Or send an email directly:</p>
                    <a
                      href={`mailto:${bookingEmail}`}
                      className="inline-flex items-center gap-2 text-lg font-semibold text-accent-blue hover:text-accent-teal transition-colors duration-300 group"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {bookingEmail}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
