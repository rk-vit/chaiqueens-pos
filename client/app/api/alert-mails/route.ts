import { NextRequest,NextResponse } from "next/server";
import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // 465 for SSL, 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail ID
      pass: process.env.EMAIL_PASS, // Use App Password, not your actual Gmail password
    },
  });

export async function sendEmail(name:string,subject:string){
        const htmlContent = `
  <div style="font-family: Georgia, serif; font-size: 14px; color: #000; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 20px;">
      Modification Alert from Axion POS
    </p>

    <p>The following updates have been made in the system:</p>

    <p><strong>Action:</strong> ${subject}</p>
    <p><strong>Updated By:</strong> ${name}</p>

    <p><em>If this is not an authorized modification, please contact our POS Team.</em></p>

    <p style="margin-top: 30px;">
      Thank you,<br/>
      Axion POS Team
    </p>
  </div>
`;



    try {
        const info = await transporter.sendMail({
            from: "axiondevsoft@gmail.com", // Sender address
            to: "axiondevsoft@gmail.com, supriyaravi2007@gmail.com", // Receivers
            subject: "POS System Modification Alert", // Subject line
            html: htmlContent, // Plain text body
        });

        console.log("Message sent: %s", info.messageId);
        return true
    } catch (error) {
        console.error("Error sending email:", error);
        return false
    }
}

