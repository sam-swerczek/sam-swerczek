import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSiteConfig } from '@/lib/supabase/queries';

const resend = new Resend(process.env.RESEND_API_KEY);

const categoryLabels: Record<string, string> = {
  general: 'General Inquiry',
  music: 'Music / Performance Booking',
  collaboration: 'Music Collaboration',
  engineering: 'Software Engineering / Consulting',
  other: 'Other',
};

export async function POST(request: Request) {
  try {
    const { name, email, subject, category, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get contact email from site config
    const config = await getSiteConfig('general');
    const contactEmail = config.find(c => c.key === 'contact_email')?.value;

    if (!contactEmail) {
      console.error('Contact email not configured in site settings');
      return NextResponse.json(
        { error: 'Contact form is not properly configured. Please set your contact email in the admin settings.' },
        { status: 500 }
      );
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Note: You can verify your own domain in Resend for custom sender
      to: contactEmail,
      subject: `[${categoryLabels[category] || 'Contact'}] ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${categoryLabels[category] || category}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
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
