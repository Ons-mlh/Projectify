import nodemailer from "nodemailer"

export async function sendVerificationEmail(email: string, token: string) {
    console.log("Mailer config:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    from: process.env.EMAIL_FROM,
  })
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

  await transporter.sendMail({
    from: `Projectify <${process.env.EMAIL_FROM}>`, 
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #0f766e;">Welcome to Projectify!</h2>
        <p>Thanks for signing up. Please verify your email by clicking the button below:</p>
        <a href="${verifyUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #0f766e; 
                  color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Verify Email
        </a>
        <p style="color: #888; margin-top: 16px; font-size: 14px;">
          This link expires in 24 hours. If you didn't sign up, ignore this email.
        </p>
      </div>
    `,
  })
}