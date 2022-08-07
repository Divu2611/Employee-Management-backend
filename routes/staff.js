const express = require('express');
const router = express();

const { Staff } = require('../models/staff');

const auth = require('../middleware/auth');

router.get("/", [auth.auth], async (req, res) => {
    const staffs = await Staff.find();
    res.send(staffs);
});

router.get("/:id", [auth.auth], async (req, res) => {
    const staff = await Staff.findOne({ employeeId: req.params.id });
    if (!staff) {
        return res.status(404).send("Staff not found");
    }

    res.send(staff);
});

exports.router = router;
