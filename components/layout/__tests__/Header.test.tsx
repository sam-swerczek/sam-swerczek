import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock usePathname for different routes
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays the site logo/brand name', () => {
    render(<Header />);
    const brandLink = screen.getByRole('link', { name: /sam swerczek/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders all navigation links with correct text', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^music$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^blog$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^contact$/i })).toBeInTheDocument();
  });

  it('navigation links point to correct routes', () => {
    render(<Header />);

    const homeLink = screen.getAllByRole('link', { name: /home/i })[0];
    const musicLink = screen.getByRole('link', { name: /^music$/i });
    const blogLink = screen.getByRole('link', { name: /^blog$/i });
    const contactLink = screen.getByRole('link', { name: /^contact$/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(musicLink).toHaveAttribute('href', '/music');
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('highlights the active home link when on home page', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Header />);

    const homeLink = screen.getAllByRole('link', { name: /home/i })[0];
    expect(homeLink).toHaveClass('text-accent-blue');
  });

  it('highlights the active music link when on music page', () => {
    mockUsePathname.mockReturnValue('/music');
    render(<Header />);

    const musicLink = screen.getByRole('link', { name: /^music$/i });
    expect(musicLink).toHaveClass('text-accent-blue');
  });

  it('highlights the active blog link when on blog page', () => {
    mockUsePathname.mockReturnValue('/blog');
    render(<Header />);

    const blogLink = screen.getByRole('link', { name: /^blog$/i });
    expect(blogLink).toHaveClass('text-accent-blue');
  });

  it('highlights the active blog link when on blog post page', () => {
    mockUsePathname.mockReturnValue('/blog/my-post');
    render(<Header />);

    const blogLink = screen.getByRole('link', { name: /^blog$/i });
    expect(blogLink).toHaveClass('text-accent-blue');
  });

  it('highlights the active contact link when on contact page', () => {
    mockUsePathname.mockReturnValue('/contact');
    render(<Header />);

    const contactLink = screen.getByRole('link', { name: /^contact$/i });
    expect(contactLink).toHaveClass('text-accent-blue');
  });

  it('renders header with proper semantic HTML', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders all expected navigation items', () => {
    render(<Header />);

    const links = screen.getAllByRole('link');
    // Should have 5 links: logo/brand + 4 nav links (Home, Music, Blog, Contact)
    expect(links).toHaveLength(5);
  });
});
