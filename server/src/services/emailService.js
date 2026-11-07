import nodemailer from 'nodemailer';

// =============================================================
// Transporter Initialization
// Supports any standard SMTP provider (Resend, Brevo, SendGrid,
// AWS SES, Gmail, Mailgun, etc.) with safe dev simulation fallback
// =============================================================
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      console.log(`[EMAIL SERVICE] Connected to SMTP server at ${host}:${port}`);
    } catch (err) {
      console.error('[EMAIL SERVICE] Failed to initialize SMTP transport:', err.message);
      transporter = null;
    }
  } else {
    // Development / unconfigured SMTP fallback: simulation mode
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n================== [EMAIL SIMULATION] ==================');
        console.log(`To:      ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        if (mailOptions.text) console.log(`Text:    ${mailOptions.text}`);
        console.log('========================================================\n');
        return { messageId: `simulated-${Date.now()}` };
      },
    };
    console.log('[EMAIL SERVICE] SMTP not fully configured in .env. Running in console simulation mode.');
  }

  return transporter;
}

function getDefaultFrom() {
  return process.env.SMTP_FROM || '"EduCollab Academic Portal" <onboarding@resend.dev>';
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'https://educollab.oluwadamilare.xyz';
}

// =============================================================
// Base HTML Email Shell
// =============================================================
function createEmailShell({ preheader, title, accentColor = '#4F46E5', contentHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #0f172a; padding: 40px 10px; }
    .main { background: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3); }
    .header { background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%); padding: 32px 36px; border-bottom: 3px solid ${accentColor}; text-align: left; }
    .brand-title { color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .brand-title span { color: #818cf8; }
    .brand-sub { color: #94a3b8; font-size: 13px; font-weight: 500; margin-top: 4px; }
    .body { padding: 36px; line-height: 1.6; }
    .h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
    .p { color: #475569; font-size: 15px; margin-bottom: 18px; }
    .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-val { color: #0f172a; font-weight: 600; text-align: right; }
    .btn-container { text-align: center; margin: 32px 0 16px 0; }
    .btn { display: inline-block; background-color: ${accentColor}; color: #ffffff !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 13px 28px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; text-align: center; font-size: 12px; color: #94a3b8; }
    .footer a { color: #64748b; text-decoration: underline; }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">${preheader}</div>
  <table class="wrapper" role="presentation" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table class="main" role="presentation" cellspacing="0" cellpadding="0">
          <tr>
            <td class="header">
              <div class="brand-title">Edu<span>Collab</span></div>
              <div class="brand-sub">Academic Knowledge & Resource Repository</div>
            </td>
          </tr>
          <tr>
            <td class="body">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 8px 0;">This is an automated administrative notification sent from the EduCollab Academic Portal.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} EduCollab. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// =============================================================
// 1. Welcome Email (Account Registration)
// =============================================================
export async function sendWelcomeEmail({ to, name, university, college, department, matricNo }) {
  if (!to) return;
  try {
    const client = getTransporter();
    const safeName = name || 'Student';
    const loginUrl = `${getFrontendUrl()}/signin`;

    const contentHtml = `
      <h1 class="h1">Welcome to EduCollab, ${safeName}! 🎓</h1>
      <p class="p">Your institutional student account has been successfully initialized. You now have unrestricted access to course lecture notes, past exam questions, lab manuals, and peer-reviewed academic materials.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px;">
          <tr>
            <td style="color: #64748b; font-weight: 500;">University:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${university || 'FUNAAB'}</td>
          </tr>
          ${college ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Academic Unit:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${college}</td>
          </tr>` : ''}
          ${department ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Department:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${department}</td>
          </tr>` : ''}
          ${matricNo ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Matric / ID:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${matricNo}</td>
          </tr>` : ''}
          <tr>
            <td style="color: #64748b; font-weight: 500;">Email Account:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${to}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Access Student Dashboard &rarr;</a>
      </div>

      <p class="p" style="font-size: 13px; color: #64748b; margin-top: 24px; text-align: center;">
        Need assistance or have material contributions? Visit the academic repository anytime.
      </p>
    `;

    const html = createEmailShell({
      preheader: `Welcome to EduCollab, ${safeName}! Your academic profile is ready.`,
      title: 'Welcome to EduCollab',
      accentColor: '#10B981', // Emerald
      contentHtml,
    });

    const info = await client.sendMail({
      from: getDefaultFrom(),
      to,
      subject: `Welcome to EduCollab, ${safeName}! 🎓 Your account is ready`,
      text: `Welcome to EduCollab, ${safeName}!\nYour account has been created for ${university || 'FUNAAB'} (${department || 'Student'}).\nLog in here: ${loginUrl}`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR sendWelcomeEmail]:', err.message);
    return { success: false, error: err.message };
  }
}

// =============================================================
// 2. Password Reset OTP Verification Email
// =============================================================
export async function sendPasswordOtpEmail({ to, name, code }) {
  if (!to || !code) return;
  try {
    const client = getTransporter();
    const safeName = name || 'Student';
    const resetUrl = `${getFrontendUrl()}/updatepw`;

    const contentHtml = `
      <h1 class="h1">Password Reset Request 🔐</h1>
      <p class="p">Hello ${safeName},</p>
      <p class="p">We received a request to reset the password for your EduCollab account. Use the 6-digit security code below to complete the verification process.</p>
      
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="color: #a5b4fc; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your Verification Security Code</div>
        <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ffffff; font-family: monospace;">${code}</div>
        <div style="color: #cbd5e1; font-size: 12px; margin-top: 8px;">Valid for 15 minutes. Do not share this code with anyone.</div>
      </div>

      <p class="p">Enter this code on the password reset page to choose your new password:</p>

      <div class="btn-container">
        <a href="${resetUrl}" class="btn">Enter Security Code &rarr;</a>
      </div>

      <p class="p" style="font-size: 13px; color: #94a3b8; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        <strong>Security Notice:</strong> If you did not initiate this request, your account may be compromised. You can safely ignore this email or reach out to institutional support if you have concerns.
      </p>
    `;

    const html = createEmailShell({
      preheader: `Your EduCollab password verification code is ${code}`,
      title: 'Password Reset Verification Code',
      accentColor: '#6366F1', // Indigo
      contentHtml,
    });

    const info = await client.sendMail({
      from: getDefaultFrom(),
      to,
      subject: `[EduCollab] ${code} is your password reset security code`,
      text: `Hello ${safeName},\nYour EduCollab password reset verification code is: ${code}\nThis code expires in 15 minutes.\nReset page: ${resetUrl}`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR sendPasswordOtpEmail]:', err.message);
    return { success: false, error: err.message };
  }
}

// =============================================================
// 3. Material Upload Confirmation (Queued for Review)
// =============================================================
export async function sendMaterialUploadConfirmation({ to, name, courseCode, title, college, department }) {
  if (!to) return;
  try {
    const client = getTransporter();
    const safeName = name || 'Student';
    const statusUrl = `${getFrontendUrl()}/upload`;

    const contentHtml = `
      <h1 class="h1">Material Queued for Verification 📄</h1>
      <p class="p">Hello ${safeName},</p>
      <p class="p">Thank you for contributing to the academic repository! Your uploaded study material has been received and added to the administrative review queue.</p>
      
      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px;">
          <tr>
            <td style="color: #64748b; font-weight: 500;">Course Code:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${courseCode}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 500;">Document Title:</td>
            <td style="color: #0f172a; font-weight: 600; text-align: right;">${title}</td>
          </tr>
          ${college ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Unit:</td>
            <td style="color: #0f172a; font-weight: 600; text-align: right;">${college}</td>
          </tr>` : ''}
          ${department ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Department:</td>
            <td style="color: #0f172a; font-weight: 600; text-align: right;">${department}</td>
          </tr>` : ''}
          <tr>
            <td style="color: #64748b; font-weight: 500;">Current Status:</td>
            <td style="color: #d97706; font-weight: 700; text-align: right;">Pending Faculty Review</td>
          </tr>
        </table>
      </div>

      <p class="p">Our academic administrative team will verify the content formatting and syllabus alignment before publishing it to the student vault. You will receive an email notification as soon as the review is complete.</p>

      <div class="btn-container">
        <a href="${statusUrl}" class="btn">View Submissions &rarr;</a>
      </div>
    `;

    const html = createEmailShell({
      preheader: `Your upload for ${courseCode} (${title}) is queued for review.`,
      title: 'Material Upload Queued',
      accentColor: '#F59E0B', // Amber
      contentHtml,
    });

    const info = await client.sendMail({
      from: getDefaultFrom(),
      to,
      subject: `[EduCollab] Study Material Upload Received: ${courseCode}`,
      text: `Hello ${safeName},\nYour study material "${title}" for ${courseCode} has been queued for review.\nCheck your submissions at: ${statusUrl}`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR sendMaterialUploadConfirmation]:', err.message);
    return { success: false, error: err.message };
  }
}

// =============================================================
// 4. Material Review Decision (Approved / Rejected)
// =============================================================
export async function sendMaterialStatusEmail({ to, name, courseCode, title, status, reviewer, reviewNotes }) {
  if (!to) return;
  try {
    const client = getTransporter();
    const safeName = name || 'Student';
    const isApproved = status === 'approved';
    const accentColor = isApproved ? '#10B981' : '#EF4444'; // Emerald vs Red
    const materialsUrl = isApproved ? `${getFrontendUrl()}/colleges` : `${getFrontendUrl()}/upload`;

    const statusBadge = isApproved
      ? '<span style="display:inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #d1fae5; color: #065f46; font-weight: 700; font-size: 13px;">APPROVED & PUBLISHED</span>'
      : '<span style="display:inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #fee2e2; color: #991b1b; font-weight: 700; font-size: 13px;">REVISION REQUIRED / DECLINED</span>';

    const contentHtml = `
      <h1 class="h1">${isApproved ? 'Material Approved & Published! 🎉' : 'Material Review Update 📋'}</h1>
      <p class="p">Hello ${safeName},</p>
      <p class="p">
        ${isApproved
          ? 'Great news! Your uploaded study material has been thoroughly reviewed and approved by the academic desk. It is now live in the repository vault for all students to access.'
          : 'Your uploaded study material was reviewed by the academic desk. Unfortunately, it could not be approved for publication in its current form.'}
      </p>

      <div class="info-box">
        <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px;">
          <tr>
            <td style="color: #64748b; font-weight: 500;">Course Code:</td>
            <td style="color: #0f172a; font-weight: 700; text-align: right;">${courseCode || 'N/A'}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 500;">Title:</td>
            <td style="color: #0f172a; font-weight: 600; text-align: right;">${title || 'Study Material'}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 500;">Review Decision:</td>
            <td style="text-align: right;">${statusBadge}</td>
          </tr>
          ${reviewer ? `
          <tr>
            <td style="color: #64748b; font-weight: 500;">Reviewed By:</td>
            <td style="color: #0f172a; font-weight: 600; text-align: right;">${reviewer}</td>
          </tr>` : ''}
          ${reviewNotes ? `
          <tr>
            <td style="color: #64748b; font-weight: 500; vertical-align: top;">Feedback Notes:</td>
            <td style="color: #1e293b; font-weight: 500; text-align: right; background-color: #f1f5f9; padding: 8px 12px; border-radius: 6px;">${reviewNotes}</td>
          </tr>` : ''}
        </table>
      </div>

      <div class="btn-container">
        <a href="${materialsUrl}" class="btn">
          ${isApproved ? 'Browse Repository Vault &rarr;' : 'Upload Revised Document &rarr;'}
        </a>
      </div>

      <p class="p" style="font-size: 13px; color: #64748b; margin-top: 24px; text-align: center;">
        ${isApproved
          ? 'Thank you for enriching your university’s academic community!'
          : 'You are welcome to re-upload after addressing the feedback notes above.'}
      </p>
    `;

    const html = createEmailShell({
      preheader: isApproved
        ? `Congratulations! Your study material for ${courseCode} was approved.`
        : `Update regarding your study material for ${courseCode}.`,
      title: isApproved ? 'Material Approved' : 'Material Review Update',
      accentColor,
      contentHtml,
    });

    const info = await client.sendMail({
      from: getDefaultFrom(),
      to,
      subject: isApproved
        ? `[Approved] Your study material for ${courseCode} is now live! 🎓`
        : `[Update] Review decision regarding your study material for ${courseCode}`,
      text: `Hello ${safeName},\nYour submission "${title}" for ${courseCode} status is: ${status.toUpperCase()}.\nFeedback: ${reviewNotes || 'None'}\nVisit: ${materialsUrl}`,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR sendMaterialStatusEmail]:', err.message);
    return { success: false, error: err.message };
  }
}
