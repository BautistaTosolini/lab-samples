import nodemailer from 'nodemailer';

const mailer = process.env.MAILER
const password = <string>process.env.NODEMAILER_PASSWORD

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: mailer,
    pass: password,
  }
})

transporter.verify()
  .then(() => {
    console.log('Nodemailer is working!')
  });