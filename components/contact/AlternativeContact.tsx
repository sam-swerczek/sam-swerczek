'use client';

import { motion } from 'framer-motion';
import SocialLinks from '@/components/music/SocialLinks';
import DirectEmailLink from './DirectEmailLink';

interface AlternativeContactProps {
  bookingEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  patreonUrl?: string;
}

export default function AlternativeContact({
  bookingEmail,
  instagramUrl,
  facebookUrl,
  linkedinUrl,
  tiktokUrl,
  patreonUrl,
}: AlternativeContactProps) {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Other Ways to Connect
            </h3>
            <p className="text-text-secondary">
              Prefer to reach out directly? Connect through social media or email
            </p>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <SocialLinks
              instagramUrl={instagramUrl}
              facebookUrl={facebookUrl}
              linkedinUrl={linkedinUrl}
              patreonUrl={patreonUrl}
              layout="horizontal"
            />
          </div>

          {/* Direct Email */}
          <DirectEmailLink email={bookingEmail} />
        </motion.div>
      </div>
    </div>
  );
}
