'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { FormField } from '@/components/ui/FormField';
import { inputClassName, selectClassName, textareaClassName } from '@/lib/utils/formStyles';
import { SpinnerIcon, ArrowRightIcon } from '@/components/ui/icons';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });

  const { handleSubmit, isLoading, error, success } = useFormSubmit({
    successDuration: 5000,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSubmit(async () => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background-secondary/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-800">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name */}
        <FormField id="name" label="Name" required>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClassName()}
            placeholder="Your name"
          />
        </FormField>

        {/* Email */}
        <FormField id="email" label="Email" required>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClassName()}
            placeholder="your.email@example.com"
          />
        </FormField>

        {/* Category */}
        <FormField id="category" label="What is this regarding?" required>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className={selectClassName()}
          >
            <option value="general">General Inquiry</option>
            <option value="music">Music / Performance Booking</option>
            <option value="collaboration">Music Collaboration</option>
            <option value="engineering">Software Engineering / Consulting</option>
            <option value="other">Other</option>
          </select>
        </FormField>

        {/* Subject */}
        <FormField id="subject" label="Subject" required>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={inputClassName()}
            placeholder="Brief subject line"
          />
        </FormField>

        {/* Message */}
        <FormField id="message" label="Message" required>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={textareaClassName()}
            placeholder="Tell me more about your inquiry..."
          />
        </FormField>

        {/* Status Messages */}
        {success && (
          <Alert
            type="success"
            message="Message sent successfully! I'll get back to you soon."
          />
        )}

        {error && (
          <Alert
            type="error"
            title="Failed to send message"
            message={error}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-5 w-5" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
