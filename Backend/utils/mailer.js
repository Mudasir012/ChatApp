
const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const welcomeEmailHtml = (username) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ChatApp</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #060610;
      color: #fff;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      width: 100%;
      padding: 48px 16px;
      background:
        radial-gradient(ellipse 60% 40% at 20% 10%, rgba(124, 58, 237, 0.22) 0%, transparent 60%),
        radial-gradient(ellipse 50% 35% at 85% 85%, rgba(5, 150, 105, 0.18) 0%, transparent 55%),
        #060610;
    }

    .card {
      max-width: 600px;
      margin: 0 auto;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.07);
      background: rgba(12, 12, 28, 0.98);
      box-shadow:
        0 0 0 1px rgba(124, 58, 237, 0.1),
        0 32px 80px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    /* ── Header ── */
    .header {
      position: relative;
      padding: 40px 36px 36px;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(109, 40, 217, 0.9) 0%, rgba(16, 185, 129, 0.85) 100%);
      z-index: 0;
    }

    .header::after {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      z-index: 1;
    }

    .header-noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      z-index: 2;
      pointer-events: none;
    }

    .header-content { position: relative; z-index: 3; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 18px;
    }

    .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #86efac;
      box-shadow: 0 0 6px #86efac;
    }

    .header h1 {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      font-weight: 800;
      line-height: 1.1;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .header h1 .username {
      display: block;
      background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.75) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header p {
      margin-top: 10px;
      color: rgba(255, 255, 255, 0.75);
      font-size: 15px;
      line-height: 1.6;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent);
    }

    /* ── Body ── */
    .body { padding: 36px 36px 32px; }

    .section { margin-bottom: 30px; }
    .section:last-child { margin-bottom: 0; }

    .section-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #a78bfa;
      margin-bottom: 10px;
    }

    .section-label::before {
      content: '';
      display: block;
      width: 16px; height: 1px;
      background: #a78bfa;
      opacity: 0.6;
    }

    .section-copy {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.72);
      line-height: 1.75;
    }

    /* ── Feature pills ── */
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 13px;
      color: rgba(255, 255, 255, 0.65);
    }

    .pill-icon { font-size: 14px; }

    /* ── CTA Button ── */
    .cta-wrap { margin-top: 28px; }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 14px;
      background: linear-gradient(135deg, #7c3aed 0%, #059669 100%);
      color: #fff;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.01em;
      box-shadow:
        0 0 0 1px rgba(124, 58, 237, 0.4),
        0 8px 24px rgba(124, 58, 237, 0.3);
      transition: opacity 0.2s;
    }

    .button:hover { opacity: 0.9; }

    .button-arrow {
      font-size: 18px;
      line-height: 1;
    }

    /* ── Footer ── */
    .footer {
      padding: 22px 36px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .footer p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.38);
      line-height: 1.7;
    }

    .footer a {
      color: #a78bfa;
      text-decoration: none;
    }

    .footer strong {
      color: rgba(255, 255, 255, 0.55);
      font-weight: 600;
    }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .header { padding: 28px 22px 28px; }
      .header h1 { font-size: 26px; }
      .body { padding: 28px 22px 24px; }
      .footer { padding: 18px 22px 24px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <div class="header-noise"></div>
        <div class="header-content">
          <div class="badge">
            <span class="badge-dot"></span>
            Account activated
          </div>
          <h1>
            Welcome aboard,
            <span class="username">${username}!</span>
          </h1>
          <p>Your account is live. Your community is waiting for you.</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="body">

        <div class="section">
          <div class="section-label">Get started</div>
          <p class="section-copy">
            Set up your profile, pick a channel, and start chatting with your team.
            Your messages are end-to-end safe, your avatar is ready, and the server is live.
          </p>
          <div class="pills">
            <span class="pill"><span class="pill-icon">💬</span> Real-time messaging</span>
            <span class="pill"><span class="pill-icon">🔒</span> Encrypted</span>
            <span class="pill"><span class="pill-icon">📁</span> File sharing</span>
            <span class="pill"><span class="pill-icon">🎙️</span> Voice channels</span>
          </div>
        </div>

        <div class="section">
          <div class="section-label">Next step</div>
          <p class="section-copy">
            Complete your profile to let your teammates know who you are.
            It only takes a minute.
          </p>
          <div class="cta-wrap">
            <a class="button" href="${process.env.CLIENT_ORIGIN || "http://localhost:5173"}/profile-setup">
              Complete your profile
              <span class="button-arrow">→</span>
            </a>
          </div>
        </div>

      </div>

      <div class="footer">
        <p>Need help? Just reply to this email — we'll get back to you shortly.</p>
        <p style="margin-top:8px"><strong>The ChatApp Team</strong></p>
      </div>

    </div>
  </div>
</body>
</html>
`;

async function sendWelcomeEmail(to, username) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Welcome to ChatApp, ${username}!`,
      html: welcomeEmailHtml(username),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

module.exports = { sendWelcomeEmail };