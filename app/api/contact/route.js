import { NextResponse, NextRequest } from "next/server";
import { log } from "node:console";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
   const body = await req.json();

  try {
    const { firstName, lastName, email, message } = body;
    const emailHtml = `
      <div style="background:#f6f8fa;padding:40px 0;min-height:100vh;font-family:Segoe UI,Arial,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.07);padding:32px 28px;">
          <div style="border-bottom:2px solid #4B6F34;padding-bottom:12px;margin-bottom:24px;">
            <h2 style="color:#4B6F34;font-size:1.5rem;margin:0 0 4px 0;">New MicroDevelopment Message</h2>
            <div style="color:#674816;font-size:1rem;">From: <strong>${firstName} ${lastName}</strong></div>
            <div style="color:#202020;font-size:0.97rem;">Email: <a href="mailto:${email}" style="color:#4B6F34;text-decoration:underline;">${email}</a></div>
          </div>
          <div style="margin-bottom:18px;">
            <div style="color:#323539;font-weight:600;margin-bottom:6px;">Message:</div>
            <div style="color:#404040;line-height:1.7;font-size:1.05rem;background:#f7f7f7;padding:16px 14px;border-radius:8px;">${message.replace(/\n/g, '<br/>')}</div>
          </div>
          <div style="margin-top:32px;color:#AC7825;font-size:0.95rem;text-align:center;">This message was sent from the MicroDevelopment Consulting Limited website contact form.</div>
        </div>
      </div>
    `;
    await resend.emails.send({
      from: `MicroDevelopment Consulting Limited <microdevelopmentng.com>`,
      to: "hassanaabdll1@gmail.com",
      subject: `New MicroDevelopment Message from ${firstName}`,
      react: emailHtml,
    });
     if (error) {
      return NextResponse.json(
        { message: "Email sending failed", error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error },
      { status: 500 }
    );
  }
} 