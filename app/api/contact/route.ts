import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Server-side validation
    const errors: string[] = [];
    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("Name is required");
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email address");
    }
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      errors.push("Subject is required");
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      errors.push("Message is required");
    } else if (message.trim().length < 10) {
      errors.push("Message must be at least 10 characters");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // ── Save to Supabase ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, errors: ["Server configuration error"] },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase.from("messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, errors: ["Failed to save message. Please try again."] },
        { status: 500 }
      );
    }

    // ── Send notification email via Resend ──
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: ["hello@portfolio.dev"],
          subject: `New portfolio message from ${name.trim()}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#4F46E5;">New Contact Message</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;"><strong>${name.trim()}</strong></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
              </table>
              <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:8px;">
                <p style="margin:0;white-space:pre-wrap;">${message.trim()}</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        // Don't fail the request if email fails — message is already saved
        console.error("Resend email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}
