require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const Blockchain = require("./Blockchain");
const Transaction = require("./Transaction");

const connectDB = require("./config/db");
const BlockchainModel = require("./models/BlockchainModel");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

let peerCount = 0;
io.on("connection", (socket) => {

  peerCount++;

  console.log(
    "Peer connected:",
    socket.id
  );

  io.emit(
    "peerCount",
    peerCount
  );

  socket.on(
    "disconnect",
    () => {

      peerCount--;

      console.log(
        "Peer disconnected:",
        socket.id
      );

      io.emit(
        "peerCount",
        peerCount
      );

    }
  );

});

let manCoin;

// Initialize Blockchain
const initializeBlockchain = async () => {
  await connectDB();

  let blockchainData = await BlockchainModel.findOne();

  if (!blockchainData) {
    manCoin = new Blockchain();

    blockchainData = new BlockchainModel({
      chain: manCoin.chain,
      difficulty: manCoin.difficulty,
      pendingTransactions: manCoin.pendingTransactions,
      miningReward: manCoin.miningReward,
    });

    await blockchainData.save();

    console.log("New blockchain created");
  } else {
    manCoin = Object.assign(new Blockchain(), blockchainData.toObject());

    console.log("Blockchain loaded from MongoDB");
  }
};

// Save Blockchain
const saveBlockchain = async () => {
  await BlockchainModel.findOneAndUpdate(
    {},
    {
      chain: manCoin.chain,

      difficulty: manCoin.difficulty,

      pendingTransactions: manCoin.pendingTransactions,

      miningReward: manCoin.miningReward,
    },
    {
      upsert: true,
    },
  );
};

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to ManCoin");
});

// View Blockchain
app.get("/blocks", (req, res) => {
  res.json(manCoin);
});

// Wallet Balance
app.get("/balance/:address", (req, res) => {
  const balance = manCoin.getBalanceOfAddress(req.params.address);

  res.json({
    address: req.params.address,
    balance,
  });
});

// Create Signed Transaction
app.post("/transaction", async (req, res) => {
  try {
    const { fromAddress, toAddress, amount, signature } = req.body;

    if (!fromAddress || !toAddress || !amount || !signature) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const transaction = new Transaction(fromAddress, toAddress, Number(amount));

    transaction.signature = signature;

    manCoin.createTransaction(transaction);

    await saveBlockchain();

    io.emit("receiveTransaction", transaction);

    res.json({
      success: true,
      message: "Signed transaction added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Mine Block
app.post("/mine", async (req, res) => {
  try {
    const { minerAddress } = req.body;

    manCoin.minePendingTransactions(minerAddress);

    await saveBlockchain();

io.emit(
    "receiveBlock",
    manCoin.getLatestBlock()
);

res.json({
    success: true,
    message:
        "Block mined successfully"
});
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/transactions/:address", (req, res) => {
  const address = req.params.address;

  const transactions = [];

  for (const block of manCoin.chain) {
    if (!Array.isArray(block.data)) continue;

    for (const tx of block.data) {
      if (tx.fromAddress === address || tx.toAddress === address) {
        transactions.push({
          block: block.index,
          ...tx,
        });
      }
    }
  }

  res.json(transactions);
});

app.get("/validate", (req, res) => {
  try {
    const isValid = manCoin.isChainValid();

    res.json({
      valid: isValid,
      message: isValid ? "Blockchain is valid" : "Blockchain is corrupted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      valid: false,
      message: "Validation failed",
    });
  }
});

app.get("/pending", (req, res) => {

  res.json({
    count: manCoin.pendingTransactions.length,
    transactions: manCoin.pendingTransactions
  });

});

app.get("/peers", (req, res) => {

  res.json({
    peers: peerCount
  });

});

// Start Server
initializeBlockchain().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(
  "P2P Node running on port 5000"
);
  });
});
