const express = require('express');

const home = require('../routes/home');
const auth = require('../routes/auth');
const employee = require('../routes/employee');
const faculty = require('../routes/faculty');
const staff = require('../routes/staff');
const department = require('../routes/department')
const leave = require('../routes/leave');
const record = require('../routes/leaveRecord');
const mail = require('../routes/mail');
const notice = require('../routes/notice');

function routes(http) {
    http.use(express.json());

    http.use("/", home.router);
    http.use("/api/auth", auth.router);
    http.use("/api/faculty", faculty.router);
    http.use("/api/staff", staff.router);
    http.use("/api/employee", employee.router);
    http.use("/api/department", department.router);
    http.use("/api/leave", leave.router);
    http.use("/api/record", record.router);
    http.use("/send_mail", mail.router);
    http.use("/api/notice", notice.router);
}

exports.routes = routes;