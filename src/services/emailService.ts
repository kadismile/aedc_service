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

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    Logger.info('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    Logger.error('Error sending email: %O', error);
    throw new Error('Email sending failed');
  }
};

