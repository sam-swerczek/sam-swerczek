import { render, screen } from '@testing-library/react';
import SocialLinks from '../SocialLinks';

describe('SocialLinks', () => {
  beforeEach(() => {
    // sanitizeUrl logs rejected URLs; keep test output clean
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing when no links are configured', () => {
    const { container } = render(<SocialLinks />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the links that are configured', () => {
    render(
      <SocialLinks
        instagramUrl="https://www.instagram.com/samswerczekmusic/"
        facebookUrl="https://www.facebook.com/samswerczekmusic/"
        linkedinUrl="https://www.linkedin.com/in/samswerczek"
      />
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://www.instagram.com/samswerczekmusic/',
      'https://www.facebook.com/samswerczekmusic/',
      'https://www.linkedin.com/in/samswerczek',
    ]);
    expect(screen.queryByText(/configure exactly/i)).not.toBeInTheDocument();
  });

  it('renders TikTok and Patreon when their URLs are set', () => {
    render(
      <SocialLinks
        tiktokUrl="https://www.tiktok.com/@samswerczek"
        patreonUrl="https://www.patreon.com/samswerczek"
      />
    );

    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('drops links with unsafe or invalid URLs', () => {
    render(
      <SocialLinks
        facebookUrl="javascript:alert(1)"
        linkedinUrl="not a url"
        patreonUrl="https://www.patreon.com/samswerczek"
      />
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://www.patreon.com/samswerczek');
  });

  it('opens links in a new tab safely', () => {
    render(<SocialLinks facebookUrl="https://www.facebook.com/samswerczekmusic/" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
