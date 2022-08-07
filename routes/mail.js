const express = require('express');
const nodemailer = require('nodemailer');

const router = express();

router.post("/", async (req, res) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: req.body.from,
            pass: req.body.password
        }
    });

    var mailOptions = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(400).send(error);
        else return res.send("Main Sent...");
    });
});

exports.router = router;
