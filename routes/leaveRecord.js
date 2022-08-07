const express = require('express');
const router = express();

const { LeaveRecords } = require('../models/leaveRecord');
const { Employee } = require('../models/employee');
const { Faculty } = require('../models/faculty');
const { Staff } = require('../models/staff');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post("/", [auth.auth], async (req, res) => {
    const employee = await Employee.findById(req.body.employeeId);
    if (!employee) {
        return res.status(404).send("Employee not found...");
    }

    const type = employee.type;
    let empType = null;
    if (type === "Faculty") {
        empType = await Faculty.findOne({
            employee: {
                email: employee.contact.email
            }
        });
    } else {
        empType = await Staff.findOne({
            employee: {
                email: employee.contact.email
            }
        });
    }

    const newRecord = new LeaveRecords({
        employee: {
            id: employee._id,
            type: employee.type,
            name: employee.personal.name,
            email: employee.contact.email,
            phone: employee.contact.phone,
            department: employee.isAdmin ? empType.department[1] : empType.department[0]
        },

        leave: req.body.leave,

        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reason: req.body.reason,
        status: req.body.status
    });

    try {
        const result = await newRecord.save();
        return res.send(result);
    } catch (exception) {
        for (error in exception.errors) {
            res.send(exception.errors[error].message);
        }
    }
});

router.get("/", [auth.auth], async (req, res) => {
    const records = await LeaveRecords.find();
    res.send(records);
});

router.put("/:id", [auth.auth, admin.admin], async (req, res) => {
    const updatedRecord = await LeaveRecords.findByIdAndUpdate(req.params.id, {
        $set: {
            status: req.body.status
        }
    }, { new: true });

    if (!updatedRecord) {
        return res.status(404).send("Record not found...");
    }

    res.send(updatedRecord);
});

router.delete("/:id", [auth.auth, admin.admin], async (req, res) => {
    const deletedRecord = await LeaveRecords.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
        return res.status(404).send("Record not found...");
    }

    res.send(deletedRecord);
});

exports.router = router;