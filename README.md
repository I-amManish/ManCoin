# 🚀 ManCoin - Public Blockchain System

## 📖 Overview

ManCoin is a blockchain-based cryptocurrency system built using JavaScript, React, Node.js, Express, MongoDB, and Socket.IO. The project demonstrates the core concepts of a public blockchain, including Proof of Work (PoW) mining, digital signatures, wallet generation, transaction management, blockchain validation, peer-to-peer communication, and real-time blockchain monitoring.

The system provides a modern web dashboard where users can generate wallets, mine blocks, create transactions, validate the blockchain, monitor network activity, and explore blockchain data in real time.

---

# 🎯 Objectives

* Understand blockchain architecture and operation.
* Implement a decentralized ledger system.
* Demonstrate Proof of Work (PoW) consensus.
* Secure transactions using digital signatures.
* Create wallet generation and balance management features.
* Develop REST APIs for blockchain operations.
* Implement real-time blockchain updates.
* Provide a user-friendly dashboard for blockchain interaction.

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Icons
* Recharts
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* CORS
* dotenv

## Blockchain & Security

* Crypto-JS (SHA-256 Hashing)
* Elliptic Curve Cryptography (secp256k1)
* Digital Signatures
* Proof of Work (PoW)

---

# 🔗 Core Blockchain Features

## 1. Block Creation

Each block contains:

* Block Index
* Timestamp
* Transaction Data
* Previous Hash
* Current Hash
* Nonce

---

## 2. Blockchain Validation

The validator checks:

* Block integrity
* Previous hash linkage
* Transaction consistency
* Chain validity

---

## 3. Proof of Work (PoW)

Mining requires solving a cryptographic puzzle by generating a hash that satisfies the configured difficulty level.

Example:

0002f87af0c64ef8ba8196ec780b364d3da70a36bcd73636d46bdfef058d8164

---

## 4. Transactions

Transactions contain:

* Sender Address
* Receiver Address
* Amount
* Digital Signature

---

## 5. Wallet Generator

Users can generate:

* Username
* Private Key
* Public Key
* Wallet Address

Wallet data is stored locally in browser localStorage.

---

## 6. Digital Signatures

Transactions are cryptographically signed using elliptic curve cryptography.

Benefits:

* Authentication
* Integrity
* Non-repudiation

---

## 7. Mining Rewards

Miners receive ManCoin rewards after successfully mining blocks.

Current reward:

1 ManCoin per block

---

## 8. Balance Calculation

Balances are calculated dynamically by scanning the entire blockchain transaction history.

---

# 🌐 REST API Endpoints

## Home

GET /

Returns application status.

---

## View Blockchain

GET /blocks

Returns complete blockchain data.

---

## Check Wallet Balance

GET /balance/:address

Example:

GET /balance/04ab12cd...

---

## Create Transaction

POST /transaction

Request Body:

```json
{
  "fromAddress": "wallet1",
  "toAddress": "wallet2",
  "amount": 10,
  "signature": "signature"
}
```

---

## Mine Block

POST /mine

Request Body:

```json
{
  "minerAddress": "wallet-address"
}
```

---

## Transaction History

GET /transactions/:address

Returns all transactions related to a wallet.

---

## Validate Blockchain

GET /validate

Returns blockchain validation status.

---

## Peer Information

GET /peers

Returns connected peer count.

---

# ⚡ Real-Time Features

Socket.IO Events:

## receiveTransaction

Broadcasts new transactions to connected clients.

## receiveBlock

Broadcasts newly mined blocks to connected clients.

Used by:

* Dashboard
* Explorer
* Network Monitor

---

# 📊 Dashboard Features

* Total Blocks
* Total Transactions
* Pending Transactions
* Mining Reward Display
* Transaction Analytics Chart
* Real-Time Updates

---

# 📦 Blockchain Explorer

Features:

* View All Blocks
* Search Blocks
* Search Wallet Addresses
* Search Transaction Data
* View Mining Rewards
* Real-Time Block Updates

---

# 💰 Wallet Features

* Wallet Generator
* Username Support
* Wallet Balance
* Sent Amount Statistics
* Received Amount Statistics
* Transaction History
* Copy Wallet Address

---

# 🌐 Network Monitor

Displays:

* Connected Peers
* Total Blocks
* Pending Transactions
* Mining Reward
* Latest Block
* Blockchain Status

---

# 🔐 Blockchain Validator

Checks:

* Blockchain Integrity
* Block Linking
* Transaction Structure
* Chain Consistency

---

# 📂 Project Structure

```text
ManCoin/

├── Backend/
│
├── Blockchain.js
├── Block.js
├── Transaction.js
├── Wallet.js
├── index.js
│
├── models/
├── config/
│
└── package.json

Frontend/

├── src/
│
├── components/
│   └── Sidebar.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Explorer.jsx
│   ├── Mine.jsx
│   ├── Transaction.jsx
│   ├── Wallet.jsx
│   ├── WalletGenerator.jsx
│   ├── Validator.jsx
│   └── Network.jsx
│
├── services/
│   └── socket.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
cd ManCoin
```

---

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

---

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

# 🔒 Security Features

* SHA-256 Hashing
* Proof of Work Mining
* Digital Signatures
* Elliptic Curve Cryptography
* Blockchain Validation
* Wallet Address Verification

---

# 📈 Future Enhancements

* Multi-Node Synchronization
* Smart Contracts
* Wallet Import / Export
* Block Detail Modals
* Activity Feed
* Wallet Leaderboard
* Dynamic Difficulty Adjustment
* Transaction Fees
* Mempool Monitoring
* Advanced Blockchain Analytics

---

# 🎓 Academic Relevance

This project demonstrates practical implementation of:

* Blockchain Technology
* Cryptography
* Distributed Systems
* Peer-to-Peer Communication
* Secure Transactions
* REST APIs
* MERN Stack Development
* Real-Time Web Applications

---

# 👨‍💻 Developer

**Manish Kumar**

M.Tech (Computer Science)

ManCoin Blockchain Project

Built for academic learning, blockchain research, and decentralized systems exploration.
