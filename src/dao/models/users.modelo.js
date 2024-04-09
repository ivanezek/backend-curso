const mongoose = require("mongoose")


const usersColl = "users"
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, required: true },
}, { timestamps: true });

const userModel = mongoose.model(usersColl, userSchema)

module.exports = {userModel}