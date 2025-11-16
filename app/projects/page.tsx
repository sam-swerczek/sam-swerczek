import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon, GithubIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Projects | Sam Swerczek',
  description: 'Explore my software engineering and music projects.',
};

interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isInternal?: boolean;
}

const projects: Project[] = [
  {
    title: 'Interactive Chess Game',
    description: 'An interactive chess game where you can play against an AI opponent. Built with React, chess.js for game logic, and js-chess-engine for the AI. Features move highlighting, move history, undo functionality, and a link to challenge me on Lichess.',
    tags: ['React', 'TypeScript', 'Chess.js', 'AI'],
    liveUrl: '/projects/chess',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80',
    isInternal: true,
  },
  {
    title: 'Personal Portfolio Site',
    description: 'A modern, full-stack portfolio website built with Next.js, TypeScript, and Supabase. Features include a blog with comments, music showcase with YouTube integration, and admin dashboard.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sam-swerczek/sam-swerczek',
    liveUrl: 'https://www.samswerczek.com',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  },
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4 font-montserrat tracking-tight">
          Projects
        </h1>
        <p className="text-lg md:text-xl text-text-secondary">
          A collection of my software engineering work and creative projects.
        </p>
      </div>

      {/* Projects List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-background-secondary/30 backdrop-blur-sm border border-accent-blue/20 rounded-lg p-6 md:p-8 hover:border-accent-blue/40 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Project Image Circle */}
              {project.imageUrl && (
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-accent-blue/30 shadow-lg">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                  </div>
                </div>
              )}

              {/* Project Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 font-montserrat">
                  {project.title}
                </h2>

                <p className="text-text-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-accent-blue/10 text-accent-blue text-sm rounded-full border border-accent-blue/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-accent-blue/30 hover:border-accent-blue/60 text-text-primary rounded-lg transition-all duration-300 group"
                    >
                      <GithubIcon className="w-5 h-5" />
                      <span className="font-medium">View Code</span>
                      <ExternalLinkIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {project.liveUrl && project.isInternal ? (
                    <Link
                      href={project.liveUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-accent-teal/30 hover:border-accent-teal/60 text-text-primary rounded-lg transition-all duration-300 group"
                    >
                      <span className="font-medium">Play Game</span>
                      <ExternalLinkIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-accent-teal/30 hover:border-accent-teal/60 text-text-primary rounded-lg transition-all duration-300 group"
                    >
                      <span className="font-medium">View Live</span>
                      <ExternalLinkIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* More Coming Soon */}
        <div className="text-center py-8">
          <p className="text-text-secondary text-lg">
            More projects coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
