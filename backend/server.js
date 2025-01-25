const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Set up the email transport (using Gmail in this example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omitiranisrael@gmail.com',
        pass: 'israelogo', // Use App Password or environment variable
    },
});

// Route to handle the image upload and send email
app.post('/send-email', upload.single('image'), (req, res) => {
    const imageFile = req.file;
    const senderEmail = req.body.senderEmail;

    if (!imageFile) {
        return res.status(400).send({ success: false, message: 'No file uploaded.' });
    }

    if (!senderEmail) {
        return res.status(400).send({ success: false, message: 'Sender email is required.' });
    }

    const mailOptions = {
        from: senderEmail,
        to: 'omitiranisrael@gmail.com', // Your email
        subject: `New Image from ${senderEmail}`,
        text: `You have received a new image from ${senderEmail}.`,
        attachments: [
            {
                filename: imageFile.originalname,
                path: imageFile.path,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
        res.status(200).send({ success: true, message: 'Email sent successfully!' });
    });
});

// Serve static files
app.use(express.static('public'));

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
