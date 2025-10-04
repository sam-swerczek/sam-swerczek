import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Sam Swerczek',
  description: 'Get in touch with Sam Swerczek for collaborations, bookings, or just to say hello.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-primary">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
            Whether you&apos;re interested in collaborating on a project, booking a performance,
            or just want to connect, I&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Additional Info */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Music Inquiries
              </h3>
              <p className="text-text-secondary">
                For booking performances, collaborations, or music-related opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Engineering Inquiries
              </h3>
              <p className="text-text-secondary">
                For consulting, technical discussions, or software development projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
