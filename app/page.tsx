"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-navy to-background-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,158,255,0.1),transparent_50%)] animate-pulse"></div>
        </div>

        {/* Floating orbs for visual interest */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero Section with fade-in animation */}
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-text-primary via-accent-blue to-accent-teal bg-clip-text text-transparent animate-gradient-x">
                Sam Swerczek
              </h1>
            </div>

            {/* Tagline with delayed animation */}
            <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-xl md:text-3xl lg:text-4xl text-text-secondary mb-4 font-light">
                Crafting melodies & code
              </p>
              <div className="flex items-center justify-center gap-3 mb-16">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
                <p className="text-sm md:text-base text-text-secondary/80 uppercase tracking-widest">
                  Singer-Songwriter • Software Engineer
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent-gold to-transparent"></div>
              </div>
            </div>

            {/* CTAs with staggered animation */}
            <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                <Button
                  href="/music"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Explore Music
                </Button>
                <Button
                  href="/blog"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Engineering & Blog
                </Button>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className={`mt-20 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <a
                href="#about"
                className="flex flex-col items-center gap-2 text-text-secondary/50 hover:text-text-secondary/80 transition-colors"
              >
                <p className="text-sm uppercase tracking-wider">Scroll to explore</p>
                <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full p-1">
                  <div className="w-1.5 h-3 bg-text-secondary/50 rounded-full mx-auto animate-scroll"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="relative py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-text-primary via-accent-blue to-accent-teal bg-clip-text text-transparent">
              About Me
            </h2>

            <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
              <p>
                I&apos;m a multidisciplinary creator living at the intersection of art and technology.
                By day, I architect elegant software solutions, translating complex problems into
                clean, efficient code. By night (and weekends), I craft songs and perform,
                channeling emotions and stories into melodies.
              </p>

              <p>
                What might seem like two separate worlds actually share the same creative DNA.
                Both music and software engineering require pattern recognition, structured thinking,
                and the courage to iterate until something beautiful emerges. Whether I&apos;m debugging
                a tricky algorithm or fine-tuning a chord progression, I&apos;m solving puzzles and
                building something meaningful.
              </p>

              <p>
                On this site, you&apos;ll find two distinct paths: one showcasing my musical journey—performances,
                recordings, and upcoming shows—and another diving into my engineering insights, technical
                writing, and project explorations. Feel free to explore either (or both), and don&apos;t hesitate
                to reach out if you&apos;d like to collaborate, book a show, or just chat about code and creativity.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                href="/music"
                variant="primary"
                size="md"
              >
                View Music Portfolio
              </Button>
              <Button
                href="/blog"
                variant="secondary"
                size="md"
              >
                Read Engineering Blog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
