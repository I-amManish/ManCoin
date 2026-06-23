# 🚀 ManCoin - Public Blockchain System

## 📖 Overview

ManCoin is a blockchain-based cryptocurrency platform developed as an M.Tech Computer Science project. The system demonstrates the core principles of blockchain technology including decentralized ledgers, proof-of-work mining, digital signatures, transaction validation, blockchain exploration, and wallet management.

The project provides a complete blockchain ecosystem with a React frontend and Node.js backend, enabling users to create wallets, send transactions, mine blocks, validate the blockchain, and monitor network activity in real time.

---

# 🎯 Objectives

* Understand blockchain architecture and operation.
* Implement a public blockchain using JavaScript.
* Demonstrate Proof of Work (PoW) consensus.
* Secure transactions using Elliptic Curve Cryptography (ECC).
* Develop a blockchain explorer for monitoring network activity.
* Provide a user-friendly interface for blockchain interactions.

---

# 🏗️ System Architecture

Frontend (React + Vite)

⬇

REST API + Socket.IO

⬇

Backend (Node.js + Express)

⬇

Blockchain Core

⬇

MongoDB Persistence

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client
* Recharts
* React Icons

## Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose
* Crypto-JS
* Elliptic (secp256k1)

---

# 🔐 Security Features

## Digital Signatures

Every transaction is signed using the sender's private key and verified using the corresponding public key.

## Elliptic Curve Cryptography (ECC)

The project uses:

secp256k1

The same elliptic curve used in Bitcoin.

## SHA-256 Hashing

Each block hash is generated using SHA-256 cryptographic hashing.

## Transaction Validation

* Signature verification
* Sender balance verification
* Wallet address validation
* Self-transfer prevention

## Duplicate Transaction Protection

The blockchain prevents duplicate transactions from being added to the pending transaction pool.

## Transaction ID (TxID)

Every transaction is assigned a unique transaction hash for tracking and verification.

---

# ⚙️ Core Features

## Blockchain

* Genesis Block
* Block Creation
* Block Hashing
* Blockchain Validation
* Proof of Work Mining
* Mining Rewards
* Dynamic Difficulty Adjustment

## Transactions

* Signed Transactions
* Transaction Fees
* Transaction IDs (TxID)
* Balance Verification
* Transaction History

## Wallet System

* Wallet Generation
* Public/Private Key Pair Creation
* Wallet Balance Tracking

## Blockchain Explorer

* Search Blocks
* Search Wallet Addresses
* Search Hashes
* View Transactions
* Block Details Modal
* Real-Time Blockchain Updates

## Network Monitoring

* Connected Peer Count
* Live Network Status
* Pending Transaction Tracking

## Dashboard

* Total Blocks
* Total Transactions
* Pending Transactions
* Mining Reward Statistics
* Transaction Analytics Chart

---

# 📂 Project Structure

Backend/

├── Blockchain.js

├── Block.js

├── Transaction.js

├── Wallet.js

├── index.js

├── config/

│ └── db.js

├── models/

│ └── BlockchainModel.js

└── package.json

Frontend/

├── src/

│ ├── pages/

│ │ ├── Dashboard.jsx

│ │ ├── Explorer.jsx

│ │ ├── Mine.jsx

│ │ ├── Transaction.jsx

│ │ ├── Wallet.jsx

│ │ ├── Validator.jsx

│ │ ├── Network.jsx

│ │ └── PendingTransactions.jsx

│ ├── components/

│ │ ├── Sidebar.jsx

│ │ └── BlockDetailsModal.jsx

│ └── services/

│ └── socket.js

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
cd ManCoin
```

## Backend Setup

```bash
cd Backend

npm install

npm start
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 📡 API Endpoints

## Blockchain

GET /blocks

GET /validate

## Wallet

GET /balance/:address

GET /transactions/:address

## Transactions

POST /transaction

## Mining

POST /mine

## Network

GET /pending

GET /peers

---

# 📱 Responsive Design

The application supports:

* Desktop Devices
* Tablets
* Mobile Devices
* Hamburger Navigation Menu
* Responsive Dashboard
* Responsive Blockchain Explorer

---

# 🔄 Workflow

1. Generate Wallet
2. Mine Initial Coins
3. Create Transaction
4. Sign Transaction
5. Broadcast Transaction
6. Mine Pending Transactions
7. Add New Block
8. Update Blockchain
9. View Results in Explorer

---

# 📊 Future Enhancements

* Peer-to-Peer Node Discovery
* Smart Contracts
* Multi-Signature Wallets
* IPFS Integration
* Proof of Stake (PoS)
* Blockchain Analytics Dashboard

---

# 🎓 Academic Significance

This project demonstrates:

* Blockchain Fundamentals
* Cryptography
* Distributed Systems
* Consensus Algorithms
* Secure Transaction Processing
* Web-Based Blockchain Applications

---

# 👨‍💻 Author

Manish Kumar

M.Tech (Computer Science)

Govind Ballabh Pant University of Technology

---

# 📜 License

This project is developed for academic and educational purposes.
