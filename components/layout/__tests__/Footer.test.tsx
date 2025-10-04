import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock the Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  getSiteConfig: jest.fn(() =>
    Promise.resolve([
      { key: 'github_url', value: 'https://github.com/samswerczek' },
      { key: 'linkedin_url', value: 'https://linkedin.com/in/samswerczek' },
      { key: 'instagram_music', value: 'https://instagram.com/samswerczek' },
    ])
  ),
}));

describe('Footer', () => {
  it('renders without crashing', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays copyright text with current year', async () => {
    const currentYear = new Date().getFullYear();
    const FooterResolved = await Footer();
    render(FooterResolved);

    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Sam Swerczek`, 'i'));
    expect(copyrightText).toBeInTheDocument();
  });

  it('displays "All rights reserved" text', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it('renders social media links', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
  });

  it('social links have correct hrefs', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });

    expect(githubLink).toHaveAttribute('href', 'https://github.com/samswerczek');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/samswerczek');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/samswerczek');
  });

  it('social links open in new tab', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    const links = screen.getAllByRole('link').filter((link) =>
      ['GitHub', 'LinkedIn', 'Instagram'].includes(link.textContent || '')
    );

    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders footer with proper semantic HTML', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders all expected links', async () => {
    const FooterResolved = await Footer();
    render(FooterResolved);

    const links = screen.getAllByRole('link');
    // Should have 3 links: GitHub, LinkedIn, Instagram
    expect(links).toHaveLength(3);
  });
});
