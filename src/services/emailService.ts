import nodemailer from 'nodemailer';

import Logger from '../libs/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    
    Logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    Logger.error(`Error sending email: ${error}`);
    throw new Error(`Could not send email: ${error}`);
  }
};
