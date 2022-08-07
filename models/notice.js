const mongoose = require("mongoose");
const Joi = require('joi');


const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },
});

function isValidNotice(body) {
    const schema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        author: Joi.string().required(),
        date: Joi.string().required()
    });

    return schema.validate(body);
}

const Notice = mongoose.model("Notice", noticeSchema);

exports.Notice = Notice;
exports.isValidNotice = isValidNotice;