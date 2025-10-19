import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSiteConfig } from '@/lib/supabase/queries';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';

const resend = new Resend(process.env.RESEND_API_KEY);

const categoryLabels: Record<string, string> = {
  general: 'General Inquiry',
  music: 'Music / Performance Booking',
  collaboration: 'Music Collaboration',
  engineering: 'Software Engineering / Consulting',
  other: 'Other',
};

// Maximum input lengths for security
const MAX_LENGTHS = {
  name: 100,
  email: 255,
  subject: 200,
  message: 5000,
  projectType: 100,
  projectBudget: 100,
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 requests per minute per IP
    const ip = getClientIp(request);
    const isAllowed = rateLimit(
      ip,
      RATE_LIMITS.CONTACT_FORM.endpoint,
      RATE_LIMITS.CONTACT_FORM.maxRequests,
      RATE_LIMITS.CONTACT_FORM.windowMs
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { name, email, subject, category, message, projectType, projectBudget } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (name.length > MAX_LENGTHS.name ||
        email.length > MAX_LENGTHS.email ||
        subject.length > MAX_LENGTHS.subject ||
        message.length > MAX_LENGTHS.message) {
      return NextResponse.json(
        { error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (projectType && (typeof projectType !== 'string' || projectType.length > MAX_LENGTHS.projectType)) {
      return NextResponse.json(
        { error: 'Invalid project type' },
        { status: 400 }
      );
    }

    if (projectBudget && (typeof projectBudget !== 'string' || projectBudget.length > MAX_LENGTHS.projectBudget)) {
      return NextResponse.json(
        { error: 'Invalid project budget' },
        { status: 400 }
      );
    }

    // Get contact email from site config
    const config = await getSiteConfig('general');
    const contactEmail = config.find(c => c.key === 'contact_email')?.value;

    if (!contactEmail) {
      console.error('Contact email not configured in site settings');
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Note: You can verify your own domain in Resend for custom sender
      to: contactEmail,
      subject: `[${categoryLabels[category] || 'Contact'}] ${escapeHtml(subject)}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>From:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${escapeHtml(categoryLabels[category] || category)}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            ${projectType ? `<p style="margin: 5px 0;"><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>` : ''}
            ${projectBudget ? `<p style="margin: 5px 0;"><strong>Project Budget:</strong> ${escapeHtml(projectBudget)}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #666; font-size: 12px;">
            This email was sent from your website's contact form.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
