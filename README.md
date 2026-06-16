# 🚀 ManCoin - Public Blockchain System

## 📖 Overview

ManCoin is a blockchain-based cryptocurrency system developed using the MERN stack and JavaScript. The project demonstrates the fundamental concepts of a public blockchain, including block creation, transaction management, proof-of-work mining, digital signatures, wallet generation, mining rewards, and blockchain validation.

The goal of this project is to provide a simplified implementation of a public blockchain similar to Bitcoin while offering a modern web-based dashboard for interaction and visualization.

---

# 🎯 Objectives

* Understand blockchain architecture and operation.
* Implement a decentralized ledger system.
* Demonstrate Proof of Work (PoW) consensus.
* Secure transactions using cryptographic signatures.
* Create wallet generation and balance management features.
* Develop REST APIs for blockchain operations.
* Provide a user-friendly dashboard for blockchain interaction.

---

# 🛠️ Technologies Used

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Icons
* Recharts

## Backend

* Node.js
* Express.js
* CORS
* Crypto-JS
* Elliptic Curve Cryptography

---

# 🔗 Core Blockchain Features

### 1. Block Creation

Each block contains:

* Index
* Timestamp
* Transaction Data
* Previous Block Hash
* Nonce
* Current Hash

### 2. Blockchain Validation

The system verifies:

* Block hash integrity
* Previous hash linkage
* Chain consistency

### 3. Proof of Work (PoW)

Mining requires finding a hash that satisfies a predefined difficulty level.

Example:

0007ed8b1e43b38cde6e0253d3e2f70696db9c0077df8780170e28379b5c2206

### 4. Transactions

Transactions include:

* Sender Address
* Receiver Address
* Amount

### 5. Wallet Generation

Each wallet contains:

* Private Key
* Public Key
* Wallet Address

### 6. Digital Signatures

Transactions are signed using elliptic curve cryptography to ensure authenticity and prevent unauthorized spending.

### 7. Mining Rewards

Miners receive rewards for successfully mining new blocks.

Current reward:

100 ManCoins

### 8. Balance Calculation

Wallet balances are calculated from the complete blockchain transaction history.

---

# 🌐 REST API Endpoints

## Home

GET /

Returns application status.

---

## View Blockchain

GET /blocks

Returns the complete blockchain.

---

## Check Wallet Balance

GET /balance/:address

Returns wallet balance.

Example:

GET /balance/miner-address

---

## Create Transaction

POST /transaction

Request Body:

{
"fromAddress": "wallet1",
"toAddress": "wallet2",
"amount": 50
}

---

## Mine Pending Transactions

POST /mine

Request Body:

{
"minerAddress": "miner-address"
}

---

# 📂 Project Structure

ManCoin/

├── Backend/

│   ├── Block.js

│   ├── Blockchain.js

│   ├── Transaction.js

│   ├── Wallet.js

│   ├── index.js

│   └── package.json

│

└── Frontend/

```
├── src/

│   ├── components/

│   ├── pages/

│   ├── App.jsx

│   └── main.jsx

│

└── package.json
```

---

# 🚀 Installation

## Clone Repository

git clone <repository-url>

cd ManCoin

---

## Backend Setup

cd Backend

npm install

node index.js

Backend runs on:

http://localhost:5000

---

## Frontend Setup

cd Frontend

npm install

npm run dev

Frontend runs on:

http://localhost:5173

---

# 📊 Dashboard Features

* Blockchain Explorer
* Wallet Balance Checker
* Transaction Creation
* Block Mining Interface
* Blockchain Statistics Visualization
* Responsive User Interface

---

# 🔒 Security Features

* SHA-256 Hashing
* Elliptic Curve Cryptography
* Digital Signature Verification
* Blockchain Integrity Validation
* Proof of Work Mining

---

# 📈 Future Enhancements

* MongoDB Persistence
* Peer-to-Peer Network
* Multi-Node Synchronization
* Smart Contracts
* Wallet Management System
* User Authentication
* Real-Time Blockchain Updates
* Advanced Analytics Dashboard

---

# 🎓 Academic Relevance

This project demonstrates practical implementation of:

* Blockchain Technology
* Cryptography
* Distributed Systems
* Web Development
* RESTful APIs
* Secure Transaction Processing

---

# 👨‍💻 Developer

Manish Kumar

ManCoin Blockchain Project

Built for academic learning and blockchain technology exploration.
