'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Song } from '@/lib/types';

interface FeaturedSongCardProps {
  song: Song;
  tags: string[];
}

export default function FeaturedSongCard({ song, tags }: FeaturedSongCardProps) {
  const router = useRouter();

  const handleLearnMore = () => {
    // Navigate to the music page
    router.push('/music');
  };

  return (
    <div className="relative block text-left w-full">
      <div className="relative h-full p-6 md:p-8 rounded-xl bg-gradient-to-br from-accent-blue/5 to-transparent border border-accent-blue/20 backdrop-blur-sm flex flex-col">
        {/* Overline */}
        <p className="text-xs uppercase tracking-widest text-accent-blue font-semibold mb-3">
          Featured Music
        </p>

        {/* Profile Image */}
        <div className="relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden">
          <Image
            src="/apple-touch-icon.png"
            alt="Sam Swerczek"
            fill
            className="object-cover"
          />
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-2xl font-bold text-text-primary font-montserrat mb-2">
            {song.title}
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            {song.content_type === 'video'
              ? 'Watch live performances and music videos'
              : 'Listen to my latest single'}
          </p>

          {/* Music tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-background-secondary/50 border border-accent-blue/30 text-accent-blue"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Learn More Button */}
          <button
            onClick={handleLearnMore}
            className="mt-auto px-6 py-2.5 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 hover:border-accent-blue/50 text-accent-blue rounded-lg transition-all duration-300 font-medium"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
