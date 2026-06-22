# 🚀 ManCoin - Public Blockchain System

## 📖 Overview

ManCoin is a blockchain-based cryptocurrency system developed using React.js, Node.js, Express.js, MongoDB, and Socket.IO. The project demonstrates the core concepts of a public blockchain, including block creation, transaction management, Proof of Work (PoW) mining, digital signatures, wallet generation, mining rewards, blockchain validation, real-time updates, and blockchain persistence.

The system provides a modern web-based dashboard that allows users to generate wallets, create signed transactions, mine blocks, monitor network activity, and explore blockchain data.

---

# 🎯 Objectives

* Understand blockchain architecture and operation.
* Implement a decentralized ledger system.
* Demonstrate Proof of Work (PoW) consensus.
* Secure transactions using cryptographic signatures.
* Create wallet generation and balance management features.
* Develop REST APIs for blockchain operations.
* Store blockchain data persistently using MongoDB.
* Enable real-time blockchain synchronization using Socket.IO.
* Provide a user-friendly dashboard for blockchain interaction.

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
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
* Crypto-JS
* Elliptic Curve Cryptography

---

# 🔗 Core Blockchain Features

## 1. Block Creation

Each block contains:

* Index
* Timestamp
* Transaction Data
* Previous Block Hash
* Nonce
* Current Hash

---

## 2. Blockchain Validation

The validator verifies:

* Previous Hash linkage
* Blockchain integrity
* Block consistency
* Transaction structure validation

---

## 3. Proof of Work (PoW)

Mining requires finding a valid hash that satisfies the blockchain difficulty level.

Example:

0007ed8b1e43b38cde6e0253d3e2f70696db9c0077df8780170e28379b5c2206

---

## 4. Transactions

Each transaction contains:

* Sender Address
* Receiver Address
* Amount
* Digital Signature

---

## 5. Wallet Generation

Wallets are generated using Elliptic Curve Cryptography (ECC).

Each wallet contains:

* Private Key
* Public Key
* Wallet Address

Wallet data is stored locally in the browser.

---

## 6. Digital Signatures

Transactions are signed using the sender's private key.

The blockchain verifies:

* Transaction authenticity
* Ownership of funds
* Signature validity

---

## 7. Mining Rewards

Miners receive rewards for successfully mining blocks.

Current Reward:

10 ManCoins

---

## 8. Balance Calculation

Balances are calculated dynamically by scanning all blockchain transactions.

---

## 9. MongoDB Persistence

The complete blockchain is stored inside MongoDB.

Benefits:

* Data survives server restarts
* Blockchain state remains persistent
* Faster blockchain recovery

---

## 10. Real-Time Updates

Socket.IO provides real-time synchronization between connected clients.

Updates include:

* New Transactions
* New Blocks
* Wallet Updates
* Dashboard Updates

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

## Wallet Balance

GET /balance/:address

Returns wallet balance.

Example:

GET /balance/wallet-address

---

## Create Transaction

POST /transaction

Request:

{
"fromAddress": "wallet1",
"toAddress": "wallet2",
"amount": 50,
"signature": "signature"
}

---

## Mine Block

POST /mine

Request:

{
"minerAddress": "wallet-address"
}

---

## Transaction History

GET /transactions/:address

Returns transaction history of a wallet.

---

## Validate Blockchain

GET /validate

Returns blockchain validation status.

---

# 📊 Dashboard Features

* Blockchain Statistics
* Total Blocks
* Transaction Count
* Pending Transactions
* Mining Reward Display
* Transactions Per Block Chart
* Real-Time Updates

---

# 📦 Explorer Features

* View All Blocks
* Block Hash Display
* Previous Hash Display
* Nonce Display
* Transaction Details
* Mining Reward Visualization
* Real-Time Blockchain Updates

---

# 💰 Wallet Features

* Wallet Address Display
* Balance Checker
* Transaction History
* Auto Refresh Updates

---

# 🔐 Validator Features

* Blockchain Validation
* Integrity Verification
* Chain Status Monitoring

---

# 🌐 Network Monitor

Displays:

* Connected Network Status
* Total Blocks
* Pending Transactions
* Mining Reward
* Latest Block
* Blockchain Status

---

# 📂 Project Structure

ManCoin/

├── Backend/

│ ├── Block.js

│ ├── Blockchain.js

│ ├── Transaction.js

│ ├── config/

│ ├── models/

│ ├── index.js

│ └── package.json

│

└── Frontend/

├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ ├── App.jsx

│ └── main.jsx

│

└── package.json

---

# 🚀 Installation

## Backend

cd Backend

npm install

npm start

Backend URL:

http://localhost:5000

---

## Frontend

cd Frontend

npm install

npm run dev

Frontend URL:

http://localhost:5173

---

# 🔒 Security Features

* SHA-256 Hashing
* Elliptic Curve Cryptography (ECC)
* Digital Signature Verification
* Blockchain Validation
* Proof of Work Mining
* Transaction Integrity Checks

---

# 📈 Future Enhancements

* True Multi-Node Blockchain Network
* Peer Discovery System
* Smart Contracts
* Token Economy
* User Authentication
* Mobile Wallet
* Explorer Search
* Activity Feed
* Advanced Blockchain Analytics

---

# 🎓 Academic Relevance

This project demonstrates practical implementation of:

* Blockchain Technology
* Cryptography
* Distributed Systems
* Web Development
* RESTful APIs
* Secure Transaction Processing
* Real-Time Communication

---

# 👨‍💻 Developer

Manish Kumar

M.Tech (Computer Science)

Govind Ballabh Pant University of Technology

ManCoin Blockchain Project

Built for academic learning and blockchain technology exploration.
