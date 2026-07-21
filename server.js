const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Blockchain = require('./blockchain');
const User = require('./models/User');
const Candidate = require('./models/Candidate');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const votingChain = new Blockchain();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/evoting_db';

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MongoDB Connection Error: ", err));

const otpStore = {};

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { voterId, password, email } = req.body;
        const role = voterId === 'admin123' ? 'admin' : 'voter';
        const newUser = new User({ voterId, password, email, role });
        await newUser.save();
        res.json({ success: true, message: "Registered successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Voter ID or Email already exists!" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { voterId, password } = req.body;
        const user = await User.findOne({ voterId, password });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStore[voterId] = { otp, email: user.email || `${voterId}@securevote.com` };
            res.json({ success: true, role: user.role, hasVoted: user.hasVoted, voterId: user.voterId, email: otpStore[voterId].email, otp });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Verify OTP Route
app.post('/api/verify-otp', (req, res) => {
    const { voterId, otp } = req.body;
    if (otpStore[voterId] && otpStore[voterId].otp === otp) {
        delete otpStore[voterId];
        res.json({ success: true, message: "OTP Verified Successfully!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP!" });
    }
});

// Add Candidate Route
app.post('/api/candidate', async (req, res) => {
    try {
        const { candidateId, name, party } = req.body;
        const newCandidate = new Candidate({ candidateId, name, party });
        await newCandidate.save();
        res.json({ success: true, message: "Candidate added successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Candidate ID already exists!" });
    }
});

// Remove Candidate Route
app.delete('/api/candidate/:id', async (req, res) => {
    try {
        await Candidate.findOneAndDelete({ candidateId: req.params.id });
        res.json({ success: true, message: "Candidate removed successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to remove candidate" });
    }
});

// Get Candidates Route
app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json({ success: true, candidates });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Cast Vote Route
app.post('/api/vote', async (req, res) => {
    try {
        const { voterId, candidateId } = req.body;
        
        const user = await User.findOne({ voterId });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.hasVoted) return res.status(400).json({ success: false, message: "You have already voted!" });

        const candidate = await Candidate.findOne({ candidateId });
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        votingChain.addBlock({ voterId, candidateId });

        user.hasVoted = true;
        await user.save();

        candidate.voteCount += 1;
        await candidate.save();

        res.json({ success: true, message: "Vote recorded successfully on Blockchain!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Voting failed" });
    }
});

// Get Voter History Route
app.get('/api/voter-history', async (req, res) => {
    try {
        const voters = await User.find({ role: 'voter' }, { voterId: 1, email: 1, hasVoted: 1 });
        res.json({ success: true, voters });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get Blockchain Chain Route
app.get('/api/chain', (req, res) => {
    res.json({ success: true, chain: votingChain.chain, isValid: votingChain.isChainValid() });
});

// Tamper Blockchain Route
app.post('/api/tamper', (req, res) => {
    if (votingChain.chain.length > 1) {
        votingChain.chain[1].voteData = { voterId: "HACKED_USER", candidateId: "FAKE_ID" };
        res.json({ success: true, message: "Blockchain successfully tampered!" });
    } else {
        res.status(400).json({ success: false, message: "Not enough blocks to tamper yet!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});