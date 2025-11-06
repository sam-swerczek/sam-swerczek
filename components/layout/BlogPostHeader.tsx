'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BlogPostHeaderProps {
  heroImageUrl?: string;
}

export default function BlogPostHeader({ heroImageUrl }: BlogPostHeaderProps) {
  return (
    <div className="bg-background-primary/95 border-b border-background-secondary shadow-lg">
      <div className="container mx-auto px-4 py-4 md:py-5 lg:py-6">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left: Back to Blog */}
          <Link
            href="/blog"
            className="text-text-secondary/60 hover:text-accent-teal transition-colors duration-200 text-sm flex items-center gap-1.5 group"
          >
            <svg
              className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Blog
          </Link>

          {/* Center: Profile Info */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              {heroImageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent-blue/30 group-hover:border-accent-blue/60 transition-colors">
                  <Image
                    src={heroImageUrl}
                    alt="Sam Swerczek"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
            </div>
            <div className="text-center hidden sm:block">
              <div className="font-montserrat font-bold text-text-primary group-hover:text-accent-blue transition-colors text-sm">
                Sam Swerczek
              </div>
              <div className="text-xs text-text-secondary/70">
                Software Engineer & Musician
              </div>
            </div>
          </Link>

          {/* Right: Jump to Comments */}
          <a
            href="#comments"
            className="text-text-secondary/60 hover:text-accent-teal transition-colors duration-200 text-sm flex items-center gap-1.5 group"
          >
            Comments
            <svg
              className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
