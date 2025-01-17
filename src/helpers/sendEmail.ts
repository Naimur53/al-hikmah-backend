import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import ApiError from '../errors/ApiError';
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = async (
  { to, multi }: { to: string; multi?: string[] },
  { subject, html, text }: { subject: string; html: string; text?: string },
) => {
  // const transport = await nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: config.emailUser,
  //     pass: config.emailUserPass,
  //   },
  // });
  const transport = await nodemailer.createTransport({
    host: 'smtp.privateemail.com', // or 'smtp.privateemail.com'
    port: 465, // or 465 for SSL or 587
    secure: true, // true for 465, false for 587
    auth: {
      user: config.emailUser,
      pass: config.emailUserPass,
    },
    tls: {
      // Enable TLS encryption
      ciphers: 'SSLv3',
    },
  });
  // send mail with defined transport object
  const mailOptions = {
    from: config.emailUser,
    to,
    subject,
    html,
    text,
  };
  // eslint-disable-next-line no-unused-vars
  if (multi?.length) {
    for (const recipient of multi) {
      const mailOptionsPer = {
        from: config.emailUser,
        to: recipient,
        subject,
        html,
        text,
      };

      try {
        // Send mail for each recipient
        await transport.sendMail({ ...mailOptionsPer });
        // console.log(`Email sent successfully to ${recipient}`);
      } catch (error) {
        // console.error(`Error sending email to ${recipient}:`, error);
      }
    }
  } else {
    try {
      const res = await transport.sendMail({ ...mailOptions });
      console.log(res);
    } catch (err) {
      console.log(err);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Sorry sending email is not available this time',
      );
    }
    // console.log('its the main success after send to one email');
  }
};
export default sendEmail;
