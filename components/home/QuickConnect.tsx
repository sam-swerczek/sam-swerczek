'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  SpotifyIcon,
  YoutubeIcon,
  InstagramIcon,
  AppleMusicIcon,
  GithubIcon,
  LinkedInIcon,
  EmailIcon,
  ArrowRightIcon
} from '@/components/ui/icons';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function QuickConnect() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const musicSocialLinks: SocialLink[] = [
    { name: 'Spotify', href: '#', icon: SpotifyIcon },
    { name: 'YouTube', href: '#', icon: YoutubeIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'Apple Music', href: '#', icon: AppleMusicIcon }
  ];

  const professionalLinks: SocialLink[] = [
    { name: 'GitHub', href: '#', icon: GithubIcon },
    { name: 'LinkedIn', href: '#', icon: LinkedInIcon },
    { name: 'Email', href: 'mailto:contact@samswerczek.com', icon: EmailIcon },
    { name: 'Contact', href: '/contact', icon: ArrowRightIcon }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Placeholder - will integrate with newsletter service later
    setTimeout(() => {
      setSubmitMessage('Thanks for subscribing! You\'ll hear from me soon.');
      setEmail('');
      setIsSubmitting(false);

      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-background-secondary/20 to-background-primary overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,158,255,0.05),transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Social Links - Left */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <h3 className="text-lg font-semibold text-text-primary mb-4 font-montserrat">
                Music & Social
              </h3>
              <div className="space-y-3">
                {musicSocialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background-secondary/30 hover:bg-accent-blue/10 border border-transparent hover:border-accent-blue/30 transition-all duration-300 group"
                    >
                      <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent-blue transition-colors" />
                      <span className="text-text-secondary group-hover:text-accent-blue transition-colors font-medium">
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Newsletter - Center (Primary) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary font-montserrat mb-3">
                  Stay Connected
                </h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  Get notified about new music releases and engineering insights
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg bg-background-secondary/50 border border-accent-blue/30 focus:border-accent-blue/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 text-text-primary placeholder-text-secondary/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-lg bg-accent-blue hover:bg-accent-teal disabled:bg-accent-blue/50 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/30 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>

                {/* Success message */}
                {submitMessage && (
                  <div className="mt-4 p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm text-center animate-fade-in">
                    {submitMessage}
                  </div>
                )}
              </form>

              {/* Privacy note */}
              <p className="text-xs text-text-secondary/60 text-center mt-4">
                No spam, unsubscribe anytime. Your email is safe with me.
              </p>
            </div>

            {/* Professional Links - Right */}
            <div className="lg:col-span-3 order-3">
              <h3 className="text-lg font-semibold text-text-primary mb-4 font-montserrat">
                Engineering & Contact
              </h3>
              <div className="space-y-3">
                {professionalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background-secondary/30 hover:bg-accent-teal/10 border border-transparent hover:border-accent-teal/30 transition-all duration-300 group"
                    >
                      <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent-teal transition-colors" />
                      <span className="text-text-secondary group-hover:text-accent-teal transition-colors font-medium">
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
