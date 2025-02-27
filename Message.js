const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    name: {type: String, required: true},
    msg: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Message", MessageSchema);