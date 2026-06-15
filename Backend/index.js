const Blockchain = require("./Blockchain");
const Transaction = require("./Transaction");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Create blockchain instance
const manCoin = new Blockchain();

// Initial mining so miner has some balance
// manCoin.minePendingTransactions("miner-address");
// manCoin.minePendingTransactions("miner-address");

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to ManCoin");
});

// View Complete Blockchain
app.get("/blocks", (req, res) => {
    res.json(manCoin);
});

// Check Wallet Balance
app.get("/balance/:address", (req, res) => {

    const balance = manCoin.getBalanceOfAddress(
        req.params.address
    );

    res.json({
        address: req.params.address,
        balance
    });
});

// Create Transaction
app.post("/transaction", (req, res) => {

    const {
        fromAddress,
        toAddress,
        amount
    } = req.body;

    // Demo version (without signature validation)
    manCoin.pendingTransactions.push({
        fromAddress,
        toAddress,
        amount
    });

    res.json({
        message: "Transaction added successfully",
        transaction: {
            fromAddress,
            toAddress,
            amount
        }
    });
});

// Mine Pending Transactions
app.post("/mine", (req, res) => {

    const { minerAddress } = req.body;

    console.log(
        "Mining Transactions:",
        manCoin.pendingTransactions
    );

    manCoin.minePendingTransactions(
        minerAddress
    );

    res.json({
        message: "Block mined successfully",
        minerAddress
    });
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});