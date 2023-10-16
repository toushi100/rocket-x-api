import nodemailer from "nodemailer"
import Mail from 'nodemailer/lib/mailer';
require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY
const webHost = process.env.WEB_HOST


const fromEmailAddress = process.env.NO_RPLY_FROM_EMAIL;
const smtpHost = process.env.AWS_STMP_HOST ?? '';
const smtpPort = parseInt(process.env.AWS_STMP_PORT ?? '587', 10);
const smtpUser = process.env.AWS_STMP_USER ?? '';
const smtpPassword = process.env.AWS_STMP_PASSWORD ?? '';


const smtpTransport: Mail = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    },
});
export async function sendEmail(emailInfo){
const {email, subject,text, html} = emailInfo;
    try {
        const updatedData: Mail.Options = {
            to: email,
            html: html,
            text: text,
            from: fromEmailAddress,
            subject: subject,
        };

        smtpTransport.sendMail(updatedData).then((result: nodemailer.SentMessageInfo): void => {
            console.info("Email sent successfully");
        });
    } catch (e) {
        console.error(e);
    }


    return true
  }








