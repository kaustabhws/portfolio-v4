import "server-only";
import nodemailer from "nodemailer";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  ownerName: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  if (!isEmailConfigured()) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465, // SSL on 465, STARTTLS on 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ── Shared email shell ─────────────────────────────────────── */
function shell(preheader: string, inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
</head>
<body style="margin:0;padding:0;background:#050506;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050506;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#0d0d0f;border:1px solid rgba(255,255,255,0.10);border-radius:24px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <!-- accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#00f0ff,#ff003c,#ffb800);"></td></tr>
        ${inner}
      </table>
      <p style="margin:20px 0 0;color:#52525b;font-size:11px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:0.06em;">
        Sent from your portfolio contact form
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Email 1: notification to the site owner ────────────────── */
function notificationHtml(i: ContactInput): string {
  const name = escapeHtml(i.name);
  const email = escapeHtml(i.email);
  const subject = escapeHtml(i.subject || "No subject");
  const message = escapeHtml(i.message).replace(/\r?\n/g, "<br/>");

  return shell(
    `New message from ${i.name}: ${i.subject || "No subject"}`,
    `
    <tr><td style="padding:40px 40px 8px;">
      <p style="margin:0 0 6px;color:#00f0ff;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">New message</p>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.2;">${subject}</h1>
    </td></tr>

    <tr><td style="padding:20px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
        <tr>
          <td style="padding:18px 20px;">
            <p style="margin:0 0 4px;color:#71717a;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">From</p>
            <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;">${name}</p>
            <a href="mailto:${email}" style="color:#00f0ff;font-size:14px;text-decoration:none;">${email}</a>
          </td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:20px 40px 40px;">
      <p style="margin:0 0 8px;color:#71717a;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Message</p>
      <p style="margin:0;color:#d4d4d8;font-size:15px;line-height:1.7;">${message}</p>
    </td></tr>
    `,
  );
}

/* ── Email 2: auto-reply to the visitor ─────────────────────── */
function autoReplyHtml(i: ContactInput): string {
  const name = escapeHtml(i.name);
  const owner = escapeHtml(i.ownerName);

  return shell(
    `Thanks for reaching out — ${i.ownerName} will be in touch.`,
    `
    <tr><td style="padding:40px 40px 8px;">
      <p style="margin:0 0 6px;color:#00f0ff;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Message received</p>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.25;">Thanks, ${name} 👋</h1>
    </td></tr>

    <tr><td style="padding:18px 40px 0;">
      <p style="margin:0;color:#d4d4d8;font-size:15px;line-height:1.7;">
        Your message just landed in my inbox — I appreciate you reaching out.
        I read everything personally and will get back to you within a day or two.
      </p>
      <p style="margin:18px 0 0;color:#d4d4d8;font-size:15px;line-height:1.7;">
        In the meantime, feel free to reply directly to this email if you have
        anything to add.
      </p>
    </td></tr>

    <tr><td style="padding:26px 40px 40px;">
      <p style="margin:0;color:#71717a;font-size:14px;">— ${owner}</p>
    </td></tr>
    `,
  );
}

/**
 * Send the owner notification (with the visitor as reply-to) and a branded
 * auto-reply to the visitor. Throws if SMTP isn't configured or the owner
 * notification fails; the auto-reply is best-effort.
 */
export async function sendContactEmails(input: ContactInput): Promise<void> {
  const transport = getTransport();
  if (!transport) {
    throw new Error("Email is not configured (SMTP_USER / SMTP_PASS missing).");
  }

  const owner = process.env.CONTACT_TO || (process.env.SMTP_USER as string);
  const from = `"${input.ownerName} — Portfolio" <${process.env.SMTP_USER}>`;

  // 1. Notify the owner (required)
  await transport.sendMail({
    from,
    to: owner,
    replyTo: `"${input.name}" <${input.email}>`,
    subject: `📬 ${input.subject || "New message"} — from ${input.name}`,
    text: `New message from ${input.name} <${input.email}>\nSubject: ${input.subject || "(none)"}\n\n${input.message}`,
    html: notificationHtml(input),
  });

  // 2. Auto-reply to the visitor (best-effort)
  try {
    await transport.sendMail({
      from,
      to: input.email,
      replyTo: owner,
      subject: `Thanks for reaching out — ${input.ownerName}`,
      text: `Hi ${input.name},\n\nThanks for your message — I'll get back to you within a day or two.\n\n— ${input.ownerName}`,
      html: autoReplyHtml(input),
    });
  } catch {
    // Don't fail the request if the courtesy auto-reply can't be sent.
  }
}
