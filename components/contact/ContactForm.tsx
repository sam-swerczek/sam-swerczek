'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
            What is this regarding? *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors"
          >
            <option value="general">General Inquiry</option>
            <option value="music">Music / Performance Booking</option>
            <option value="collaboration">Music Collaboration</option>
            <option value="engineering">Software Engineering / Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors"
            placeholder="Brief subject line"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors resize-none"
            placeholder="Tell me more about your inquiry..."
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium">Message sent successfully! I&apos;ll get back to you soon.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-start gap-2 text-red-400">
              <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Failed to send message</p>
                <p className="text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-4 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
