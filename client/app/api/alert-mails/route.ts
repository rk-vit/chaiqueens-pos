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

export async function sendEmail(name:string,email:string,subject:string,message:string){
    const content = `
    *Modification Alert from Axion POS*

    The following updates have been made in the system:

    *Subject*: ${subject}

    *Updated By*: ${name}

    If this is not an authorized modification , please contact our POS Team.

    Thank you,
    Axion POS Team
    `;

    try {
        const info = await transporter.sendMail({
            from: "axiondevsoft@gmail.com", // Sender address
            to: "revanthkannam05@gmail.com", // Receivers
            subject: "POS System Modification Alert", // Subject line
            text: content, // Plain text body
        });

        console.log("Message sent: %s", info.messageId);
        return true
    } catch (error) {
        console.error("Error sending email:", error);
        return false
    }

}

export async function POST(req:NextRequest) {
    const {name,email,subject,message} = await req.json();
    console.log(name,email,subject,message);
   const status = await sendEmail(name,email,subject,message);
   if(status){
    return NextResponse.json({text:"Success"},{status:200})
   }else{
    return NextResponse.json({text:"Failure"},{status:500})

   }
}