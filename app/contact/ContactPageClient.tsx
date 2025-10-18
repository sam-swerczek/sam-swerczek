'use client';

import { useState } from 'react';
import ContactHero from '@/components/contact/ContactHero';
import IntentCards from '@/components/contact/IntentCards';
import type { IntentType } from '@/components/contact/IntentCards';
import AlternativeContact from '@/components/contact/AlternativeContact';
import ContextualForm from '@/components/contact/ContextualForm';

interface ContactPageClientProps {
  profileImageUrl?: string;
  contactImageUrl?: string;
  bookingEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  patreonUrl?: string;
}

export default function ContactPageClient({
  profileImageUrl,
  contactImageUrl,
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
      <ContactHero
        contactImageUrl={contactImageUrl}
        profileImageUrl={profileImageUrl}
      />

      {/* Intent Cards - Hidden when form is shown */}
      {!selectedIntent && (
        <>
          <IntentCards onSelectIntent={handleSelectIntent} />
          <AlternativeContact
            bookingEmail={bookingEmail}
            instagramUrl={instagramUrl}
            facebookUrl={facebookUrl}
            linkedinUrl={linkedinUrl}
            tiktokUrl={tiktokUrl}
            patreonUrl={patreonUrl}
          />
        </>
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
