import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { name: /sam swerczek/i })).toBeInTheDocument();
  });

  it('displays the main heading with correct text', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { name: /sam swerczek/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('displays the tagline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/crafting melodies & code/i)).toBeInTheDocument();
  });

  it('displays the professional roles', () => {
    render(<HeroSection />);
    expect(screen.getByText(/singer-songwriter • software engineer/i)).toBeInTheDocument();
  });

  it('renders call-to-action buttons with correct text and links', () => {
    render(<HeroSection />);

    // Check for "Explore Music" button
    const musicButton = screen.getByRole('link', { name: /explore music/i });
    expect(musicButton).toBeInTheDocument();
    expect(musicButton).toHaveAttribute('href', '/music');

    // Check for "Engineering & Blog" button
    const blogButton = screen.getByRole('link', { name: /engineering & blog/i });
    expect(blogButton).toBeInTheDocument();
    expect(blogButton).toHaveAttribute('href', '/blog');
  });

  it('renders scroll indicator with correct link', () => {
    render(<HeroSection />);

    const scrollLink = screen.getByRole('link', { name: /scroll to explore/i });
    expect(scrollLink).toBeInTheDocument();
    expect(scrollLink).toHaveAttribute('href', '#about');
  });

  it('displays scroll to explore text', () => {
    render(<HeroSection />);
    expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<HeroSection />);

    // Should have one main heading
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBe(1);

    // Should have navigation links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
