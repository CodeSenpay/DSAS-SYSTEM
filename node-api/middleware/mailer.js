import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmailToStudent(email, appointment_status, transaction_title) {
  const statusMap = {
    approved: { color: "green", text: "Approved" },
    declined: { color: "red", text: "Declined" },
  };
  const statusKey = String(appointment_status).toLowerCase();
  const { color: statusColor, text: statusText } = statusMap[statusKey] || {
    color: "black",
    text:
      String(appointment_status).charAt(0).toUpperCase() +
      String(appointment_status).slice(1).toLowerCase(),
  };

  const hasTitle = Boolean(transaction_title);
  const transactionText = hasTitle ? ` for <strong>${transaction_title}</strong>` : "";
  const transactionTextPlain = hasTitle ? ` for "${transaction_title}"` : "";
  const subject = `Appointment ${statusText}${hasTitle ? `: ${transaction_title}` : ""}`;

  const text = `Dear Student,

Your appointment${transactionTextPlain} has been ${statusText.toLowerCase()}. Please check your account or contact the office for further details.

Thank you,
DSAS System`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
      <h2 style="color: #2d7ff9; margin-top: 0;">Appointment ${statusText}${hasTitle ? `: <span style="color:#333">${transaction_title}</span>` : ""}</h2>
      <p style="font-size: 16px; color: #333;">
        Your appointment${transactionText} has been 
        <strong style="color: ${statusColor};">${statusText}</strong>.
      </p>
      <p style="font-size: 14px; color: #555;">Please check your account or contact the office for further details.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 0 0;">
      <p style="font-size: 12px; color: #aaa; margin-top: 16px;">DSAS System</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text,
    html,
  };

  try {
    const mailResult = await transporter.sendMail(mailOptions);
    if (mailResult.accepted?.length) {
      return { success: true, message: "Email sent to student", mailResult };
    }
    return { success: false, message: "Failed to send email" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
      error: error?.message,
    };
  }
}

transporter
  .verify()
  .then(() => console.log("SMTP verified ✅"))
  .catch((err) => console.error("Verification failed:", err));

export default transporter;
