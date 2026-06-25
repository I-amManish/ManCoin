````md
# 🚀 ManCoin

ManCoin is a full-stack public blockchain simulation project built for an M.Tech demonstration.

It allows users to generate wallets, create digitally signed transactions, mine blocks using Proof of Work, earn mining rewards and transaction fees, explore blockchain records, validate the chain, and monitor network activity in real time.

---

## 📌 Features

- 🔐 Wallet generation using secp256k1 elliptic curve cryptography
- 👤 Username support for wallet users
- 💸 Digitally signed transactions
- ✅ Signature verification before accepting transactions
- 📋 Pending transaction pool
- ⛏️ Proof of Work mining
- 💰 Mining rewards
- 💵 Transaction fees rewarded to miners
- 📦 Blockchain explorer
- 🔎 Search blocks, hashes, and wallet addresses
- 📜 Transaction details modal
- 🧾 Transaction ID and timestamp tracking
- 💼 Wallet balance and transaction history
- 📊 Dashboard with transaction chart
- 🌐 Network monitor and peer counter
- 🔍 Blockchain validation
- ⚡ Real-time updates using Socket.IO
- 💾 MongoDB blockchain persistence
- 🌙 Dark and light mode UI
- 📥 Blockchain data export

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client
- Recharts
- React Icons
- Elliptic
- Crypto-JS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Elliptic Curve Cryptography
- Crypto-JS
- dotenv
- CORS

---

## 📁 Project Structure

```text
ManCoin/
│
├── Backend/
│   ├── Block.js
│   ├── Blockchain.js
│   ├── Transaction.js
│   ├── index.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── BlockchainModel.js
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BlockDetailsModal.jsx
│   │   │   ├── TransactionDetailsModal.jsx
│   │   │   └── ExportBlockchain.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explorer.jsx
│   │   │   ├── Mine.jsx
│   │   │   ├── Transaction.jsx
│   │   │   ├── Wallet.jsx
│   │   │   ├── WalletGenerator.jsx
│   │   │   ├── Validator.jsx
│   │   │   ├── Network.jsx
│   │   │   └── PendingTransactions.jsx
│   │   │
│   │   ├── services/
│   │   │   └── socket.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
````

---

## 🔐 Wallet Generation

ManCoin creates wallets using the `secp256k1` elliptic curve.

Each wallet contains:

| Item           | Description                          |
| -------------- | ------------------------------------ |
| Username       | User name stored locally in browser  |
| Private Key    | Secret key used to sign transactions |
| Public Key     | Public wallet address                |
| Wallet Address | Same as public key in this project   |

> Important: Never share a private key in a real blockchain application.

For this academic project, wallet data is stored in browser local storage.

---

## ✍️ Digital Signature Process

ManCoin uses Elliptic Curve Digital Signature Algorithm (ECDSA).

Transaction process:

```text
Sender enters receiver address and amount
                ↓
Transaction hash is created
                ↓
Private key signs the hash
                ↓
Digital signature is generated
                ↓
Backend verifies signature using sender public key
                ↓
Transaction is accepted or rejected
```

This ensures that only the owner of a wallet can send coins from that wallet.

---

## 💸 Transaction Structure

Each normal transaction contains:

```text
fromAddress
toAddress
amount
fee
message
timestamp
txId
signature
```

Example:

```text
Sender sends: 10 MC
Transaction fee: 1 MC

Sender balance decreases by: 11 MC
Receiver balance increases by: 10 MC
Miner receives fee: 1 MC
```

Transactions are first added to the pending transaction pool.

---

## ⛏️ Mining Process

Mining converts pending transactions into a block.

Mining flow:

```text
Pending Transactions
        ↓
Calculate Transaction Fees
        ↓
Create Mining Reward Transaction
        ↓
Create New Block
        ↓
Proof of Work Mining
        ↓
Add Block to Blockchain
        ↓
Clear Pending Transactions
```

Miner reward calculation:

```text
Miner Reward = Mining Reward + Total Transaction Fees
```

Example:

```text
Mining Reward = 1 MC
Total Transaction Fees = 3 MC

Miner receives = 4 MC
```

---

## 🧱 Block Structure

Each block contains:

```text
index
timestamp
data
previousHash
hash
nonce
```

Example:

```text
Block #5
Hash: 0000ef266739fe9146d914ff7ca43eb738daceb2d4b13bbfa4abc9ce999ca856
Previous Hash: 00001b9ae5bb3a007c3231302beafaf12a95ce9e8783cbfcfcd3a0c8a5682cb6
Nonce: 12453
Transactions: 3
```

Every block stores the hash of the previous block.

```text
Genesis Block → Block 1 → Block 2 → Block 3 → Block 4
```

Changing old block data changes its hash and makes the blockchain invalid.

---

## ⚙️ Proof of Work

ManCoin uses Proof of Work mining.

A valid block hash must start with a number of zeros based on mining difficulty.

Example valid hash:

```text
0007c47d9137bca1caed36c6845cd41ef039563ad1819f9ee5e595cbc40f1a78
```

Default difficulty:

```js
difficulty = 3;
```

Difficulty increases after every 5 blocks:

```js
if (this.chain.length % 5 === 0) {
  this.difficulty++;
}
```

---

## 📡 Real-Time Updates

ManCoin uses Socket.IO for real-time updates.

When a transaction is created:

```js
io.emit("receiveTransaction", transaction);
```

When a block is mined:

```js
io.emit("receiveBlock", manCoin.getLatestBlock());
```

These events automatically update:

* Dashboard
* Explorer
* Wallet
* Pending Transactions
* Network Monitor

---

## 💾 MongoDB Persistence

MongoDB stores blockchain data so it remains available after restarting the backend.

Saved data:

```text
chain
difficulty
pendingTransactions
miningReward
```

Example backend output:

```text
MongoDB Connected
Blockchain loaded from MongoDB
P2P Node running on port 5000
```

---

## 🌐 API Endpoints

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/`                      | Welcome route                  |
| GET    | `/blocks`                | Get complete blockchain        |
| GET    | `/balance/:address`      | Get wallet balance             |
| POST   | `/transaction`           | Create signed transaction      |
| POST   | `/mine`                  | Mine pending transactions      |
| GET    | `/transactions/:address` | Get wallet transaction history |
| GET    | `/pending`               | Get pending transactions       |
| GET    | `/validate`              | Validate blockchain            |
| GET    | `/peers`                 | Get connected peer count       |

---

## 🖥️ Main Pages

| Page                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| Dashboard            | Shows blockchain statistics and transaction chart |
| Explorer             | Shows blocks and transactions                     |
| Mine                 | Mines pending transactions                        |
| Transaction          | Creates signed transactions                       |
| Wallet               | Shows balance and transaction history             |
| Wallet Generator     | Generates wallet keys                             |
| Validator            | Checks blockchain validity                        |
| Network              | Shows peer count and network status               |
| Pending Transactions | Shows transactions waiting for mining             |

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ManCoin.git
```

```bash
cd ManCoin
```

---

### 2. Backend Setup

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend:

```bash
npm start
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

---

## 🧪 How to Test ManCoin

1. Open the Wallet Generator page.
2. Enter a username.
3. Generate a wallet.
4. Mine one block using your wallet address.
5. Copy your wallet address.
6. Create another wallet in another browser.
7. Send ManCoin from the first wallet to the second wallet.
8. Open Pending Transactions.
9. Mine the pending transaction.
10. Check Wallet and Explorer pages.
11. Open Validator page and verify blockchain status.

---

## 🔒 Security Notes

This is an academic blockchain project.

Current security features:

* secp256k1 wallet keys
* ECDSA transaction signatures
* Signature verification
* Sender balance validation
* Self-transfer prevention
* Duplicate transaction prevention
* Transaction fee support
* Blockchain validation
* Proof of Work mining

For production use, additional security would be required:

* Password-protected wallet encryption
* Secure private key storage
* Authentication and authorization
* Rate limiting
* HTTPS
* Multiple independent blockchain nodes
* Peer discovery
* Consensus between nodes
* Smart contract support
* Database backup and recovery

---

## 🎓 Academic Objective

ManCoin demonstrates the working principles of a public blockchain:

* Decentralized transaction records
* Public wallet addresses
* Digital signatures
* Proof of Work consensus
* Mining rewards
* Transaction fees
* Immutable block chaining
* Real-time blockchain explorer
* Persistent blockchain storage

---

## 👨‍💻 Author

**Manish Kumar**
M.Tech Computer Science Student

---

## 📄 License

This project is created for educational and academic purposes.

```
```
