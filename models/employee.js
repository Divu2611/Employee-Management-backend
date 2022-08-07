const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const config = require('config');

const employeeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    personal: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            gender: {
                type: String,
                required: true
            },
            dateOfBirth: {
                type: String,
                required: true
            }
        }),
        required: true
    },

    contact: {
        type: new mongoose.Schema({
            address: {
                type: new mongoose.Schema({
                    office: {
                        type: String,
                        required: true
                    },
                    city: {
                        type: String,
                        required: true
                    },
                    state: {
                        type: String,
                        required: true
                    },
                    country: {
                        type: String,
                        required: true
                    }
                }),
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            }
        }),
        required: true
    },

    academic: {
        type: new mongoose.Schema({
            highestEducation: {
                type: new mongoose.Schema({
                    degree: {
                        type: String,
                        required: true
                    },
                    institute: {
                        type: String,
                        required: true
                    },
                    year: {
                        type: Number,
                        required: true
                    }
                }),
                required: true
            }
        }),
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

employeeSchema.methods.generateAuthToken = function () {
    return token = jwt.sign({
        ID: this._id,
        EmployeeType: this.type,
        Personal: this.personal,
        Contact: this.contact,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
}

function isValidEmployee(body) {
    const schema = Joi.object({
        type: Joi.string().required(),
        personal: Joi.object({
            name: Joi.string().required(),
            gender: Joi.string().required(),
            dateOfBirth: Joi.string().required()
        }),
        contact: Joi.object({
            address: Joi.object({
                office: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                country: Joi.string().required()
            }),
            phone: Joi.number().required(),
            email: Joi.string().required()
        }),
        academic: Joi.object({
            highestEducation: Joi.object({
                degree: Joi.string().required(),
                institute: Joi.string().required(),
                year: Joi.number().required()
            })
        }),
        password: Joi.string().min(8).required(),
        isAdmin: Joi.boolean().required()
    });

    return schema.validate(body);
}

const Employee = mongoose.model("Employee", employeeSchema);

exports.Employee = Employee;
exports.isValidEmployee = isValidEmployee;