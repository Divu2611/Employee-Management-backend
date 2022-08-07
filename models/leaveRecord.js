const mongoose = require('mongoose');
const Joi = require('joi');

const LeaveRecords = mongoose.model("LeaveRecord", mongoose.Schema({
    employee: {
        type: new mongoose.Schema({
            id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            department: {
                type: String,
                required: true
            }
        }),
        required: true
    },

    leave: {
        type: String,
        required: true
    },

    startDate: {
        type: String,
        required: true
    },

    endDate: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        required: function () {
            const leave = this.leave.type;
            return leave === 'Unpaid Leave' || leave === 'Priviledged Leave';
        }
    },

    status: {
        type: String,
        default: "Pending",
        required: function () {
            const leave = this.leave.type;
            return leave === 'Unpaid Leave' || leave === 'Priviledged Leave';
        }
    }
}));

function isValidRecord(body) {
    const schema = Joi.object().keys({
        employee: Joi.object({
            id: Joi.string().required(),
            type: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            department: Joi.string().required()
        }),
        leave: Joi.string().required().valid("Sick Leave", "Annual Leave", "Paternal Leave", "Study Leave"),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        reason: Joi.alternatives().conditional('leave', { is: "Sick Leave", then: Joi.string().required() }),
        status: Joi.alternatives().required().default("Pending")
    });

    return schema.validate(body);
}

exports.LeaveRecords = LeaveRecords;
exports.isValidRecord = isValidRecord;