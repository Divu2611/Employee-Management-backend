const mongoose = require('mongoose');

const Leave = mongoose.model("Leave", mongoose.Schema({
    type: {
        type: String,
        required: true,
    }
}));

exports.Leave = Leave;