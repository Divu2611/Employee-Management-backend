const mongoose = require('mongoose');

const Department = mongoose.model("Department", mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}));

exports.Department = Department;