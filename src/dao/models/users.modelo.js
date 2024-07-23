const mongoose = require("mongoose")


const usersColl = "users"
const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, unique: true},
    password: { type: String,},
    role: { type: String },
    lastConnection: { type: Date, default: Date.now }
}, { timestamps: true, strict: false});

const userModel = mongoose.model(usersColl, userSchema)

module.exports = {userModel}