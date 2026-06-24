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

  console.log("Peer connected:", socket.id);

  io.emit("peerCount", peerCount);

  socket.on("disconnect", () => {
    peerCount = Math.max(0, peerCount - 1);

    console.log("Peer disconnected:", socket.id);

    io.emit("peerCount", peerCount);
  });
});

let manCoin;

const initializeBlockchain = async () => {
  await connectDB();

  const blockchainData = await BlockchainModel.findOne();

  if (!blockchainData) {
    manCoin = new Blockchain();

    await BlockchainModel.create({
      chain: manCoin.chain,
      difficulty: manCoin.difficulty,
      pendingTransactions: manCoin.pendingTransactions,
      miningReward: manCoin.miningReward,
    });

    console.log("New blockchain created");
    return;
  }

  manCoin = Object.assign(
    new Blockchain(),
    blockchainData.toObject()
  );

  console.log("Blockchain loaded from MongoDB");
};

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
      returnDocument: "after",
    }
  );
};

app.get("/", (req, res) => {
  res.send("Welcome to ManCoin");
});

app.get("/blocks", (req, res) => {
  res.json(manCoin);
});

app.get("/balance/:address", (req, res) => {
  const balance = manCoin.getBalanceOfAddress(
    req.params.address
  );

  res.json({
    address: req.params.address,
    balance,
  });
});

app.post("/transaction", async (req, res) => {
  try {
    const {
      fromAddress,
      toAddress,
      amount,
      message = "",
      fee,
      timestamp,
      txId,
      signature,
    } = req.body;

    const numericAmount = Number(amount);
    const numericFee = Number(fee ?? 1);
    const numericTimestamp = Number(timestamp);

    if (
      !fromAddress ||
      !toAddress ||
      !signature ||
      !txId ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !Number.isFinite(numericFee) ||
      numericFee < 0 ||
      !Number.isFinite(numericTimestamp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction details",
      });
    }

    const transaction = new Transaction(
      fromAddress.trim(),
      toAddress.trim(),
      numericAmount,
      message,
      numericFee
    );

    transaction.timestamp = numericTimestamp;
    transaction.txId = txId;
    transaction.signature = signature;

    manCoin.createTransaction(transaction);

    await saveBlockchain();

    io.emit("receiveTransaction", transaction);

    res.json({
      success: true,
      message: "Signed transaction added successfully",
    });
  } catch (error) {
    console.error("Transaction error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Transaction failed",
    });
  }
});

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
      message: "Block mined successfully",
    });
  } catch (error) {
    console.error("Mining error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Mining failed",
    });
  }
});

app.post("/transaction", async (req, res) => {
  try {
    const {
      fromAddress,
      toAddress,
      amount,
      message,
      fee,
      timestamp,
      txId,
      signature,
    } = req.body;

    const numericAmount = Number(amount);
    const numericFee = Number(fee ?? 1);
    const numericTimestamp = Number(timestamp);

    if (
      !fromAddress ||
      !toAddress ||
      !signature ||
      !txId ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !Number.isFinite(numericFee) ||
      numericFee < 0 ||
      !Number.isFinite(numericTimestamp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction details",
      });
    }

    const transaction = new Transaction(
      fromAddress.trim(),
      toAddress.trim(),
      numericAmount,
      message || "",
      numericFee
    );

    // Important: use the exact values that were signed in the frontend
    transaction.timestamp = numericTimestamp;
    transaction.txId = txId;
    transaction.signature = signature;

    manCoin.createTransaction(transaction);

    await saveBlockchain();

    io.emit("receiveTransaction", transaction);

    res.json({
      success: true,
      message: "Signed transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Transaction error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/validate", (req, res) => {
  try {
    const isValid = manCoin.isChainValid();

    res.json({
      valid: isValid,
      message: isValid
        ? "Blockchain is valid"
        : "Blockchain is corrupted",
    });
  } catch (error) {
    console.error("Validation error:", error.message);

    res.status(500).json({
      valid: false,
      message: "Validation failed",
    });
  }
});

app.get("/pending", (req, res) => {
  res.json({
    count: manCoin.pendingTransactions.length,
    transactions: manCoin.pendingTransactions,
  });
});

app.get("/peers", (req, res) => {
  res.json({
    peers: peerCount,
  });
});

initializeBlockchain()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log("P2P Node running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });