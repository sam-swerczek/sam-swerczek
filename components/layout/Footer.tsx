'use client';

import Link from 'next/link';
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  PatreonIcon,
  YoutubeIcon,
  SpotifyIcon,
  AppleMusicIcon,
  LinkedInIcon,
  GithubIcon,
} from '@/components/ui/icons';
import type { MusicSocialConfig, EngineeringSocialConfig, StreamingConfig } from '@/lib/supabase/config-helpers';

interface FooterProps {
  musicSocial: MusicSocialConfig;
  engineeringSocial: EngineeringSocialConfig;
  streaming: StreamingConfig;
  isCompact?: boolean;
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  hoverColor: string;
}

export default function Footer({ musicSocial, engineeringSocial, streaming, isCompact = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Build comprehensive social links array
  const socialLinks: SocialLink[] = [];

  // Music socials
  if (musicSocial.instagram_handle) {
    socialLinks.push({
      name: 'Instagram',
      url: musicSocial.instagram_handle,
      icon: <InstagramIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-pink-500',
    });
  }
  if (musicSocial.facebook_url) {
    socialLinks.push({
      name: 'Facebook',
      url: musicSocial.facebook_url,
      icon: <FacebookIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-blue-600',
    });
  }
  if (musicSocial.tiktok_url) {
    socialLinks.push({
      name: 'TikTok',
      url: musicSocial.tiktok_url,
      icon: <TikTokIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-white',
    });
  }
  if (musicSocial.patreon_url) {
    socialLinks.push({
      name: 'Patreon',
      url: musicSocial.patreon_url,
      icon: <PatreonIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-orange-500',
    });
  }

  // Streaming platforms
  if (streaming.youtube_music_url) {
    socialLinks.push({
      name: 'YouTube',
      url: streaming.youtube_music_url,
      icon: <YoutubeIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-red-600',
    });
  }
  if (streaming.spotify_url) {
    socialLinks.push({
      name: 'Spotify',
      url: streaming.spotify_url,
      icon: <SpotifyIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-green-500',
    });
  }
  if (streaming.apple_music_url) {
    socialLinks.push({
      name: 'Apple Music',
      url: streaming.apple_music_url,
      icon: <AppleMusicIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-pink-600',
    });
  }

  // Engineering socials
  if (engineeringSocial.linkedin_url) {
    socialLinks.push({
      name: 'LinkedIn',
      url: engineeringSocial.linkedin_url,
      icon: <LinkedInIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-blue-700',
    });
  }
  if (engineeringSocial.github_url) {
    socialLinks.push({
      name: 'GitHub',
      url: engineeringSocial.github_url,
      icon: <GithubIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-accent-blue',
    });
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Music', href: '/music' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative border-t border-background-secondary bg-background-primary overflow-hidden">
      {/* Background gradient matching hero section bottom - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className={`relative z-10 container mx-auto px-4 ${isCompact ? 'py-4' : 'py-8'}`}>
        <div className="flex flex-col items-center gap-4">
          {/* Name - hidden in compact mode */}
          {!isCompact && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-montserrat tracking-tight">
              Sam Swerczek
            </h2>
          )}

          {/* Social Icons - single non-wrapping line */}
          <div className="flex items-center gap-3 md:gap-4 flex-nowrap overflow-x-auto max-w-full pb-1 scrollbar-hide">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-text-secondary ${link.hoverColor} transition-colors flex-shrink-0`}
                aria-label={link.name}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Nav Links - hidden in compact mode */}
          {!isCompact && (
            <nav className="flex items-center gap-4 md:gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-text-secondary hover:text-accent-blue transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Copyright - hidden in compact mode */}
          {!isCompact && (
            <p className="text-text-secondary text-sm">
              © {currentYear} Sam Swerczek. All rights reserved.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
