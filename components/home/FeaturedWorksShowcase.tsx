import Link from 'next/link';
import Image from 'next/image';
import { Song } from '@/lib/types';
import FeaturedSongCard from '@/components/home/FeaturedSongCard';
import SectionHeader from '@/components/ui/SectionHeader';

interface FeaturedProject {
  title: string;
  description: string;
  screenshot: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

interface FeaturedWorksShowcaseProps {
  featuredSong: Song | null;
  githubUrl: string;
}

export default function FeaturedWorksShowcase({ featuredSong, githubUrl }: FeaturedWorksShowcaseProps) {
  // Music tags - use song tags if available, otherwise default
  const musicTags = featuredSong?.tags || ["Singer-Songwriter", "Acoustic", "Indie Folk", "Live Session"];

  const featuredProject: FeaturedProject = {
    title: "Personal Website",
    description: "Modern portfolio site built with Next.js, showcasing dual identity as musician and engineer.",
    screenshot: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop&q=80",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    githubUrl: githubUrl,
    liveUrl: "/"
  };

  return (
    <section className="relative py-12 md:py-16 bg-background-primary overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-navy/50 to-background-primary" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <SectionHeader
            title="Featured Works"
            subtitle="A glimpse into my creative and technical pursuits"
            className="text-center"
          />

          {/* Split-screen showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative lg:items-stretch">
            {/* Center divider line - desktop only */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-blue/20 to-transparent transform -translate-x-1/2" />

            {/* Music Panel - Left */}
            {featuredSong && (
              <FeaturedSongCard song={featuredSong} tags={musicTags} />
            )}

            {/* Tech Panel - Right */}
            <div className="relative block">
              <div className="relative h-full p-6 md:p-8 rounded-xl bg-gradient-to-br from-accent-teal/5 to-transparent border border-accent-teal/20 backdrop-blur-sm flex flex-col">
                {/* Overline */}
                <p className="text-xs uppercase tracking-widest text-accent-teal font-semibold mb-3">
                  Featured Project
                </p>

                {/* Laptop/Coding Image */}
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80"
                    alt="Coding environment"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-text-primary font-montserrat mb-2">
                    {featuredProject.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    {featuredProject.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-background-secondary/50 border border-accent-teal/30 text-accent-teal"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <Link
                    href={featuredProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto px-6 py-2.5 bg-accent-teal/10 hover:bg-accent-teal/20 border border-accent-teal/30 hover:border-accent-teal/50 text-accent-teal rounded-lg transition-all duration-300 font-medium text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
