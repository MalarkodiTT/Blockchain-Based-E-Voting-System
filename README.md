
# 🛡️ Secure Blockchain-Based E-Voting System

An advanced, highly secure electronic voting platform powered by custom **Blockchain technology**, cryptographic **SHA-256 hashing**, and real-time **2FA (Two-Factor Authentication)**. Designed with a futuristic dark-mode UI/UX to ensure seamless and transparent democratic elections.

---

Live Link : https://blockchain-based-e-voting-system-1uvi.onrender.com/

----------------------------------------------------------------------------------

## 🌟 Key Features

* **⛓️ Immutable Blockchain Ledger:** Every cast vote is bundled into a cryptographic block secured via SHA-256 hashes, ensuring records cannot be altered or deleted.
* **⚡ Live Tamper Detection:** Built-in evaluation tool allowing administrators to simulate blockchain tampering and instantly spot integrity breaches.
* **✉️ Secure 2FA Authentication:** Generates a secure OTP displayed in a dedicated live inbox simulation panel for manual 2FA verification.
* **🛡️ Comprehensive Admin Portal:** 
  * Add and remove candidates dynamically.
  * Real-time tracking of voter participation history (`Voted` vs `Not Voted`).
  * Live blockchain ledger viewer with block hashes and validation status badges.
* **✨ Modern Cyber-Futuristic UI:** Built with sleek glassmorphism design, ambient glowing effects, and responsive cards.

---

## 📁 Project Folder Structure

```text
blockchain-evoting/
│
├── models/
│   ├── User.js            # Mongoose schema for user credentials & voting status
│   └── Candidate.js       # Mongoose schema for candidate details & vote counts
│
├── public/
│   ├── index.html         # Futuristic login & registration portal
│   ├── otp.html           # 2FA mail inbox & manual OTP entry interface
│   ├── dashboard.html     # Voter portal with candidate listing & tamper station
│   └── admin.html         # Admin control panel, candidate manager & ledger modals
│
├── blockchain.js          # Core blockchain logic (Block creation, hashing, validation)
├── server.js              # Express backend server linking routes, DB, and logic
├── package.json           # Node.js dependencies and scripts
└── .env                   # Environment configuration (MongoDB URI, Port)

+-------------------------------------------------------------------------+
|                         1. Authentication Flow                          |
|   [User / Voter] ---> Register / Login ---> 2FA Inbox ---> OTP Verify   |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                            2. Voting Flow                               |
|   [Dashboard] ---> Select Candidate ---> Cast Vote Request              |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                         3. Blockchain Processing                        |
|   [blockchain.js] ---> Create Block ---> Compute SHA-256 Hash           |
|                 ---> Link to Previous Hash ---> Save to Ledger          |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                        4. Admin Audit & Security                        |
|   [Admin Panel] ---> View Voter History & Remove Candidates             |
|                 ---> Audit Blockchain Ledger & Detect Tampering         |
+-------------------------------------------------------------------------+

🛠️ Built With

Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Security & Cryptography: Custom JavaScript Blockchain (SHA-256 implementation)

Frontend: HTML5, CSS3 (Glassmorphism & Custom Flex/Grid Design), Vanilla JavaScript
