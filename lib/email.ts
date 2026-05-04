"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendShareEmail(
  to: string,
  electionTitle: string,
  shareIndex: number,
  shareValue: string,
) {
  const subject = `Secret Share for Election: ${electionTitle}`;
  const body = `Hello,

You have been designated as a key-holder for the election "${electionTitle}".

Your secret share:
- Index: ${shareIndex}
- Value: ${shareValue}

Please save this securely. You will need to submit this share when the election is closed for tallying.

Do not share this with anyone.

Best regards,
SigmaVote System`;

  await transporter.sendMail({
    from: `"SigmaVote" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text: body,
  });
}
