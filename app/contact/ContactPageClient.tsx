'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIntent, setSelectedIntent] = useState<IntentType | null>(null);

  // Read intent from URL on mount and when searchParams change
  useEffect(() => {
    const intentParam = searchParams.get('intent');
    if (intentParam === 'music' || intentParam === 'code') {
      setSelectedIntent(intentParam as IntentType);
    } else {
      setSelectedIntent(null);
    }
  }, [searchParams]);

  const handleSelectIntent = (intent: IntentType) => {
    // Update URL with intent parameter without adding to history
    router.replace(`/contact?intent=${intent}`, { scroll: false });
  };

  const handleBack = () => {
    // Navigate back to contact page without intent parameter
    router.replace('/contact', { scroll: false });
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
