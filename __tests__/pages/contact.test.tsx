import { render, screen } from '@testing-library/react';
import ContactPage from '@/app/contact/page';

// Mock the ContactForm component
jest.mock('@/components/contact/ContactForm', () => {
  return function MockContactForm() {
    return (
      <div data-testid="contact-form">
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  };
});

describe('Contact Page Integration', () => {
  it('renders the page heading', () => {
    render(<ContactPage />);

    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/Whether you're interested in collaborating/i)
    ).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    render(<ContactPage />);

    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
  });

  it('renders music inquiries section', () => {
    render(<ContactPage />);

    expect(screen.getByText('Music Inquiries')).toBeInTheDocument();
    expect(
      screen.getByText(/For booking performances, collaborations/i)
    ).toBeInTheDocument();
  });

  it('renders engineering inquiries section', () => {
    render(<ContactPage />);

    expect(screen.getByText('Engineering Inquiries')).toBeInTheDocument();
    expect(
      screen.getByText(/For consulting, technical discussions/i)
    ).toBeInTheDocument();
  });

  it('has proper page structure with container and max width', () => {
    const { container } = render(<ContactPage />);

    const mainContainer = container.querySelector('.container.mx-auto.max-w-3xl');
    expect(mainContainer).toBeInTheDocument();
  });
});
