const express = require('express');
const router = express();

const { Faculty } = require('../models/faculty');

const auth = require('../middleware/auth');

router.get("/", [auth.auth], async (req, res) => {
    const faculties = await Faculty.find();
    res.send(faculties);
});

router.get("/:id", [auth.auth], async (req, res) => {
    const faculty = await Faculty.findOne({ employeeId: req.params.id });
    if (!faculty) {
        return res.status(404).send("Faculty not found");
    }

    res.send(faculty);
});

exports.router = router;
