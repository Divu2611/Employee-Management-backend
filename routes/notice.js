const express = require('express');
const router = express();

const { Notice } = require('../models/notice');

const auth = require('../middleware/auth');

router.post("/", [auth.auth], async (req, res) => {
    const newNotice = new Notice({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        date: req.body.date
    });

    try {
        const result = await newNotice.save();
        return res.send(result);
    } catch (exception) {
        for (error in exception.errors) {
            res.send(exception.errors[error].message);
        }
    }
});

router.get("/", [auth.auth], async (req, res) => {
    const notices = await Notice.find();
    res.send(notices);
});

exports.router = router;