const nodemailer = require('nodemailer');

var htmlcontent = `
Hi this is a test Email body.
`
// Create a transporter using SMTP details
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'mahimaquadras@outlook.com',
    pass: 'Momdadkumar1!',
  },
});

// Define the email options
const mailOptions = {
  from: 'mahimaquadras@outlook.com',
  to: 'princebaretto@gmail.com',
  subject: 'Subject of the email',
  text: htmlcontent,
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
