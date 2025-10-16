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

const main = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "yourgmail@gmail.com", // 👈 change to your Gmail to test
      subject: "Nodemailer Test",
      text: "If you receive this, email config works ✅",
    });
    console.log("✅ Sent:", info.response);
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
};

main();
