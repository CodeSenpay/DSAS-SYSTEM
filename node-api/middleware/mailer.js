import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});


transporter.verify()
  .then(() => console.log('SMTP verified ✅'))
  .catch(err => console.error('Verification failed:', err));

export default transporter;