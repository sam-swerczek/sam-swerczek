import { getSiteConfig } from '@/lib/supabase/queries';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch all site config in a single call
  const siteConfig = await getSiteConfig();

  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value;
  const linkedinUrl = siteConfig.find(c => c.key === 'linkedin_url')?.value;

  return (
    <footer className="border-t border-background-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
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
