const express = require('express');
const router = express();

const { Leave } = require('../models/leave');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post("/", [auth.auth, admin.admin], async (req, res) => {
    const newLeave = new Leave({
        type: req.body.type
    });

    const result = await newLeave.save();

    res.send(result);
});

router.get("/", [auth.auth], async (req, res) => {
    const leaves = await Leave.find();
    res.send(leaves);
});

router.get("/:id", [auth.auth], async (req, res) => {

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
        return res.status(404).send("Leave not found...");
    }

    res.send(leave);
})

exports.router = router;