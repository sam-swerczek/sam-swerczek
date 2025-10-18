'use client';

import { sanitizeEmail } from '@/lib/utils/url-validation';

interface DirectEmailLinkProps {
  email?: string;
}

export default function DirectEmailLink({ email }: DirectEmailLinkProps) {
  const safeEmail = sanitizeEmail(email);

  if (!safeEmail) return null;

  return (
    <div className="bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 p-6 rounded-xl border border-accent-blue/20 text-center">
      <p className="text-text-secondary text-sm mb-2">Or send an email directly:</p>
      <a
        href={`mailto:${safeEmail}`}
        className="inline-flex items-center gap-2 text-lg font-semibold text-accent-blue hover:text-accent-teal transition-colors duration-300 group"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {safeEmail}
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
