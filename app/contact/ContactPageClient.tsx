'use client';

import { useState } from 'react';
import ContactHero from '@/components/contact/ContactHero';
import IntentCards from '@/components/contact/IntentCards';
import ContextualForm from '@/components/contact/ContextualForm';
import type { IntentType } from '@/components/contact/ContactForm';

interface ContactPageClientProps {
  profileImageUrl?: string;
  bookingEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  patreonUrl?: string;
}

export default function ContactPageClient({
  profileImageUrl,
  bookingEmail,
  instagramUrl,
  facebookUrl,
  linkedinUrl,
  tiktokUrl,
  patreonUrl,
}: ContactPageClientProps) {
  const [selectedIntent, setSelectedIntent] = useState<IntentType | null>(null);

  const handleSelectIntent = (intent: IntentType) => {
    setSelectedIntent(intent);
  };

  const handleBack = () => {
    setSelectedIntent(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Always visible */}
      <ContactHero profileImageUrl={profileImageUrl} />

      {/* Intent Cards - Hidden when form is shown */}
      {!selectedIntent && (
        <IntentCards onSelectIntent={handleSelectIntent} />
      )}

      {/* Contextual Form - Shown when intent is selected */}
      <ContextualForm
        selectedIntent={selectedIntent}
        onBack={handleBack}
        bookingEmail={bookingEmail}
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
        linkedinUrl={linkedinUrl}
        tiktokUrl={tiktokUrl}
        patreonUrl={patreonUrl}
      />
    </div>
  );
}
