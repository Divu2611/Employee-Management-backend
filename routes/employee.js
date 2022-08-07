const express = require('express');
const bcrypt = require('bcrypt');

const router = express();

const { Employee } = require("../models/employee");
const { Faculty } = require("../models/faculty");
const { Staff } = require("../models/staff");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", [auth.auth, admin.admin], async (req, res) => {

    const newEmployee = new Employee({
        type: req.body.type,
        personal: {
            name: req.body.personal.name,
            gender: req.body.personal.gender,
            dateOfBirth: req.body.personal.dateOfBirth
        },
        contact: {
            address: {
                office: req.body.contact.address.office,
                city: req.body.contact.address.city,
                state: req.body.contact.address.state,
                country: req.body.contact.address.country
            },
            email: req.body.contact.email,
            phone: req.body.contact.phone
        },
        academic: {
            highestEducation: {
                degree: req.body.academic.highestEducation.degree,
                institute: req.body.academic.highestEducation.institute,
                year: req.body.academic.highestEducation.year
            }
        },
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    const salt = await bcrypt.genSalt(10);
    newEmployee.password = await bcrypt.hash(newEmployee.password, salt);

    const result = await newEmployee.save();

    let newEmployeeType = null;

    if (req.body.type === "Staff") {

        newEmployeeType = new Staff({
            employeeId: result._id,
            designation: req.body.designation,
            department: req.body.department
        });
    } else {

        newEmployeeType = new Faculty({
            employeeId: result._id,
            designation: req.body.designation,
            department: req.body.department,
            researchArea: req.body.researchArea
        });

        result.researchArea = req.body.researchArea;
    }

    result.designation = req.body.designation;
    result.department = req.body.department;

    await newEmployeeType.save();

    res
        .header("x-authToken", newEmployee.generateAuthToken())
        .header("x-typeToken", newEmployeeType.generateTypeToken())
        .header("access-control-expose-headers", "x-authToken")
        .header("access-control-expose-headers", "x-typeToken")
        .send(result);
});

router.get("/:id", [auth.auth], async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
        return res.status(404).send("Employee not found...");
    }

    res.send(employee);
});

router.put("/:id", [auth.auth, admin.admin], async (req, res) => {

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
            $set: {
                password,
            }
        }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).send("Employee not found...");
        }

        return res.send(updatedEmployee);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
        $set: {
            personal: {
                name: req.body.personal.name,
                dateOfBirth: req.body.personal.dateOfBirth
            },
            contact: {
                address: {
                    office: req.body.contact.address.office,
                    city: req.body.contact.address.city,
                    state: req.body.contact.address.state,
                    country: req.body.contact.address.country
                },
                email: req.body.contact.email,
                phone: req.body.contact.phone
            }
        }
    }, { new: true });

    if (req.body.type === "Faculty") {
        await Faculty.findOneAndUpdate({ employeeId: updatedEmployee._id }, {
            designation: req.body.designation,
            department: req.body.department,
            researchArea: req.body.researchArea
        }, { new: true });
    } else {
        await Staff.findOneAndUpdate({ employeeId: updatedEmployee._id }, {
            designation: req.body.designation,
            department: req.body.department
        }, { new: true });
    }

    if (!updatedEmployee) {
        return res.status(404).send("Employee not found...");
    }

    res.send(updatedEmployee);
});

router.delete("/:id", [auth.auth, admin.admin], async (req, res) => {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
        return res.status(404).send("Employee not found...");
    }

    if (deletedEmployee.type === "Faculty") {
        await Faculty.findOneAndDelete({ employeeId: deletedEmployee._id });
    } else {
        await Staff.findOneAndDelete({ employeeId: deletedEmployee._id });
    }

    res.send(deletedEmployee);
});

exports.router = router

