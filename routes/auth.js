const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const router = express();

const { Employee } = require('../models/employee');
const { Faculty } = require('../models/faculty');
const { Staff } = require('../models/staff');

router.post("/", async (req, res) => {

    const { error } = areValidCredentials(req.body);
    if (error) {
        return res.status(400).send(error.message);
    }

    const employee = await Employee.findOne({ 'contact.email': req.body.email });
    if (!employee) {
        return res.status(400).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(req.body.password, employee.password);
    if (!validPassword) {
        return res.status(400).send("Invalid email or password");
    }

    let employeeType = null;
    if (employee.type === "Faculty") {
        employeeType = await Faculty.findOne({ employeeId: employee._id });
    } else {
        employeeType = await Staff.findOne({ employeeId: employee._id });
    }

    res.send({
        employee: employee.generateAuthToken(),
        employeeType: employeeType.generateTypeToken()
    });
});

function areValidCredentials(body) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(body);
}

exports.router = router;

