import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSiteConfig } from '@/lib/supabase/queries';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';
import { sanitizeText } from '@/lib/utils/sanitize';

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
 * Validates email format with proper TLD (at least 2 characters)
 */
function isValidEmail(email: string): boolean {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for valid TLD (at least 2 characters)
  const tldRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return tldRegex.test(email);
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

    const body = await request.json();
    const { name, email: rawEmail, subject, category, message, projectType, projectBudget } = body;

    // Trim and clean email
    const email = rawEmail?.trim();

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
    let config;
    let contactEmail;

    try {
      config = await getSiteConfig('general');
      contactEmail = config.find(c => c.key === 'contact_email')?.value;
    } catch (configError) {
      console.error('Failed to fetch site config:', configError);
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    if (!contactEmail) {
      console.error('Contact email not configured in site settings');
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    console.log('Contact email from config:', contactEmail);

    // Sanitize all user inputs before including in email
    const sanitizedName = sanitizeText(name);
    const sanitizedEmail = sanitizeText(email);
    const sanitizedSubject = sanitizeText(subject);
    const sanitizedMessage = sanitizeText(message);
    const sanitizedCategory = sanitizeText(categoryLabels[category] || category);
    const sanitizedProjectType = projectType ? sanitizeText(projectType) : null;
    const sanitizedProjectBudget = projectBudget ? sanitizeText(projectBudget) : null;

    // Send email via Resend
    try {
      console.log('Attempting to send email with replyTo:', email);

      const result = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Note: You can verify your own domain in Resend for custom sender
        to: contactEmail,
        subject: `[${categoryLabels[category] || 'Contact'}] ${sanitizedSubject}`,
        replyTo: email, // Use original email (already validated above)
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>From:</strong> ${sanitizedName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${sanitizedCategory}</p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${sanitizedSubject}</p>
              ${sanitizedProjectType ? `<p style="margin: 5px 0;"><strong>Project Type:</strong> ${sanitizedProjectType}</p>` : ''}
              ${sanitizedProjectBudget ? `<p style="margin: 5px 0;"><strong>Project Budget:</strong> ${sanitizedProjectBudget}</p>` : ''}
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

            <p style="color: #666; font-size: 12px;">
              This email was sent from your website's contact form.
            </p>
          </div>
        `,
      });

      console.log('Resend API response:', result);

      // Check if Resend returned an error
      if (result.error) {
        console.error('Resend API error:', result.error);
        return NextResponse.json(
          { error: `Failed to send email: ${result.error.message}` },
          { status: 500 }
        );
      }
    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please check your email configuration.' },
        { status: 500 }
      );
    }

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
