import { getSiteConfig } from '@/lib/supabase/queries';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch all site config in a single call
  const siteConfig = await getSiteConfig();

  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value;
  const linkedinUrl = siteConfig.find(c => c.key === 'linkedin_url')?.value;

  return (
    <footer className="relative border-t border-background-secondary mt-auto bg-background-primary overflow-hidden">
      {/* Background gradient matching hero section bottom - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © {currentYear} Sam Swerczek. All rights reserved.
          </p>

          <div className="flex gap-6">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-blue transition-colors"
              >
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-blue transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
