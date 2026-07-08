const nodemailer = require("nodemailer");

const PROGRAM_EMAIL = "youthstockeducationprogram@gmail.com";

function clean(value) {
  return String(value || "").trim();
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const firstName = clean(request.body?.firstName);
  const lastName = clean(request.body?.lastName);
  const email = clean(request.body?.email);
  const phone = clean(request.body?.phone);
  const grade = clean(request.body?.grade);

  if (!firstName || !lastName || !email || !phone || !grade) {
    return response.status(400).json({ error: "Please complete every application field." });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return response.status(500).json({ error: "Email sending is not configured yet." });
  }

  if (process.env.GMAIL_USER !== PROGRAM_EMAIL) {
    return response.status(500).json({ error: "Sender email is not configured correctly." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const text = [
    "Youth Stock Education Program Application",
    "",
    `First name: ${firstName}`,
    `Last name: ${lastName}`,
    `Email: ${email}`,
    `Phone number: ${phone}`,
    `Grade for the 2026-2027 school year: ${grade}`
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"Youth Stock Education Program" <${process.env.GMAIL_USER}>`,
      to: PROGRAM_EMAIL,
      replyTo: email,
      subject: "Youth Stock Education Program Application",
      text
    });

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({ error: "Email could not be sent." });
  }
};
