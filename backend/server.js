const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email provider
  auth: {
    user: 'your-email@gmail.com', // Your email address
    pass: 'your-email-password', // Your email password (or app password)
  },
});

app.post('/send-email', (req, res) => {
  const { email, promotions, image } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your Purchase Details',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Here is a summary of your order:</p>
      <img src="${image}" alt="Order Summary" style="width: 100%; max-width: 400px;" />
      <p>Promotions: ${promotions ? 'Yes' : 'No'}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to send email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully!');
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
