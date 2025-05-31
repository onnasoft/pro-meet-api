import { Resend } from 'resend';

const resend = new Resend('re_JcZtpuB8_Lv1iiTGpndctEUMpVbehwUXs');

async function sendEmail() {
  await resend.emails.send({
    from: 'Acme <info@pro-meets.com>',
    to: ['jtorres990@gmail.com'],
    subject: 'hello world',
    html: '<p>it works!</p>',
  });
}

sendEmail()
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error('Error sending email:', error));
