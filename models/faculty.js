const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const config = require('config');

const faculySchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },

    designation: {
        type: [String],
        required: true
    },

    department: {
        type: [String],
        required: true
    },

    researchArea: {
        type: [String],
        required: true
    }
});

faculySchema.methods.generateTypeToken = function () {
    return token = jwt.sign({
        EmployeeId: this.employeeId,
        Designation: this.designation,
        Department: this.department,
        ResearchArea: this.researchArea
    }, config.get('jwtPrivateKey'));
}

function isValidFaculty(body) {
    const schema = Joi.object({
        employeeId: Joi.string().required(),
        designation: Joi.array().items(Joi.string()).required(),
        department: Joi.array().items(Joi.string()).required(),
        researchArea: Joi.array().items(Joi.string()).required()
    });

    return schema.validate(body);
}

const Faculty = mongoose.model("Faculty", faculySchema);

exports.Faculty = Faculty;
exports.isValidFaculty = isValidFaculty;