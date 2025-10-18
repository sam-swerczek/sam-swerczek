'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { FormField } from '@/components/ui/FormField';
import { inputClassName, selectClassName, textareaClassName } from '@/lib/utils/formStyles';
import { SpinnerIcon, ArrowRightIcon } from '@/components/ui/icons';

export type IntentType = 'music' | 'code' | 'connect';

interface ContactFormProps {
  intent?: IntentType;
}

// Contextual configurations based on intent
const INTENT_CONFIG = {
  music: {
    categoryValue: 'music',
    messagePlaceholder: 'Tell me about your project, event, or collaboration idea. Include details like dates, location, or type of work you need...',
    submitButtonText: 'Send Music Inquiry',
    showProjectType: true,
    showProjectBudget: false,
  },
  code: {
    categoryValue: 'engineering',
    messagePlaceholder: 'Describe your project, technical challenges, or what you need help building. Include any relevant tech stack or timeline details...',
    submitButtonText: 'Send Project Inquiry',
    showProjectType: false,
    showProjectBudget: true,
  },
  connect: {
    categoryValue: 'general',
    messagePlaceholder: 'What\'s on your mind? I\'m all ears...',
    submitButtonText: 'Send Message',
    showProjectType: false,
    showProjectBudget: false,
  },
};

export default function ContactForm({ intent = 'connect' }: ContactFormProps) {
  const config = INTENT_CONFIG[intent];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: config.categoryValue,
    message: '',
    projectType: '',
    projectBudget: '',
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

      setFormData({ name: '', email: '', subject: '', category: config.categoryValue, message: '', projectType: '', projectBudget: '' });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
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

        {/* Hidden category field - auto-set based on intent */}
        <input type="hidden" name="category" value={formData.category} />

        {/* Contextual Field: Project Type (Music only) */}
        {config.showProjectType && (
          <FormField id="projectType" label="Project Type">
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className={selectClassName()}
            >
              <option value="">Select a project type</option>
              <option value="booking">Booking / Performance</option>
              <option value="feature">Feature / Collaboration</option>
              <option value="production">Production / Studio Work</option>
              <option value="other">Other</option>
            </select>
          </FormField>
        )}

        {/* Contextual Field: Project Budget (Code only) */}
        {config.showProjectBudget && (
          <FormField id="projectBudget" label="Project Budget">
            <select
              id="projectBudget"
              name="projectBudget"
              value={formData.projectBudget}
              onChange={handleChange}
              className={selectClassName()}
            >
              <option value="">Select a budget range</option>
              <option value="consulting">Consulting (Hourly)</option>
              <option value="fixed-small">Fixed Project ($5k-$15k)</option>
              <option value="fixed-medium">Fixed Project ($15k-$50k)</option>
              <option value="fixed-large">Fixed Project ($50k+)</option>
              <option value="discuss">Let&apos;s Discuss</option>
            </select>
          </FormField>
        )}

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
            placeholder={config.messagePlaceholder}
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
              {config.submitButtonText}
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
  );
}
