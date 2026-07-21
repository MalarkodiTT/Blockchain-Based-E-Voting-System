const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    voterId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    hasVoted: { type: Boolean, default: false },
    role: { type: String, enum: ['voter', 'admin'], default: 'voter' }
});

module.exports = mongoose.model('User', userSchema);