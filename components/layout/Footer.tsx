import { getSiteConfig } from '@/lib/supabase/queries';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch site config for footer links
  const siteConfig = await getSiteConfig('general');

  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value || 'https://github.com/samswerczek';
  const linkedinUrl = siteConfig.find(c => c.key === 'linkedin_url')?.value || 'https://linkedin.com/in/samswerczek';
  const instagramUrl = siteConfig.find(c => c.key === 'instagram_music')?.value || siteConfig.find(c => c.key === 'instagram_url')?.value || 'https://instagram.com/samswerczek';

  return (
    <footer className="border-t border-background-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © {currentYear} Sam Swerczek. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-blue transition-colors"
            >
              GitHub
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-blue transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-blue transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
