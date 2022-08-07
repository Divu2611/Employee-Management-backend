const express = require('express');
const router = express();

const auth = require("../middleware/auth");

const { Department } = require('../models/department');

router.get("/", [auth.auth], async (req, res) => {
    const departments = await Department.find();
    res.send(departments);
});

router.get("/:id", [auth.auth], async (req, res) => {

    const department = await Department.findById(req.params.id);
    if (!department) {
        return res.status(404).send("Department not found...");
    }

    res.send(department);
});

exports.router = router;