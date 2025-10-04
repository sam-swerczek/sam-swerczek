import Image from 'next/image';
import { getSiteConfig } from '@/lib/supabase/queries';

export default async function AboutSection() {
  const siteConfig = await getSiteConfig('general');
  const profileImageUrl = siteConfig.find(c => c.key === 'profile_image_url')?.value;

  return (
    <section id="about" className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-text-primary">
          The Intersection
        </h2>

        {profileImageUrl ? (
          <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
            {/* Image floated to the left on desktop */}
            <div className="float-none md:float-left w-full md:w-64 mb-6 md:mb-0 md:mr-8 flex justify-center md:justify-start">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-accent-blue/30 shadow-xl">
                <Image
                  src={profileImageUrl}
                  alt="Sam Swerczek"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

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
        ) : (
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
        )}
      </div>
    </section>
  );
}
