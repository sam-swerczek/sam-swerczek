import Button from '@/components/ui/Button';

export default function NavigationSection() {
  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
            Explore My Work
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Dive into my creative worlds—discover original music and live performances,
            or explore technical insights and engineering projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Music Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-background-secondary/50 hover:bg-background-secondary transition-all duration-300 hover:border-accent-blue/50 hover:shadow-xl p-8 flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h3 className="text-2xl font-bold text-text-primary">Music & Performance</h3>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed flex-1">
                Singer-songwriter blending acoustic storytelling with contemporary sound.
                Stream my tracks, watch live sessions, and connect on social media.
              </p>
              <Button href="/music" variant="primary" size="md" className="w-full">
                Explore Music
              </Button>
            </div>
          </div>

          {/* Engineering Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-background-secondary/50 hover:bg-background-secondary transition-all duration-300 hover:border-accent-teal/50 hover:shadow-xl p-8 flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="text-2xl font-bold text-text-primary">Engineering & Blog</h3>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed flex-1">
                Deep dives into software architecture, meta-engineering concepts, and insights
                from building production systems.
              </p>
              <Button href="/blog" variant="secondary" size="md" className="w-full">
                Read Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
