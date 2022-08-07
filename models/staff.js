const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const config = require('config');

const staffSchema = new mongoose.Schema({
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
    }
});

staffSchema.methods.generateTypeToken = function () {
    return token = jwt.sign({
        EmployeeId: this.employeeId,
        Designation: this.designation,
        Department: this.department
    }, config.get('jwtPrivateKey'));
}

function isValidStaff(body) {
    const schema = Joi.object({
        employeeId: Joi.string().required(),
        designation: Joi.array().items(Joi.string()).required(),
        department: Joi.array().items(Joi.string()).required()
    });

    return schema.validate(body);
}

const Staff = mongoose.model("Staff", staffSchema);

exports.Staff = Staff;
exports.isValidStaff = isValidStaff;