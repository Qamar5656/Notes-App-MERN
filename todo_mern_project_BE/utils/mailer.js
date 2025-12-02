import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((success, error) => {
  if (success) {
    console.log("Mailer is ready to send mails");
  } else {
    console.log("Mailer is facing errors while sending mails");
  }
});
export default transporter;
