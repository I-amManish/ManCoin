require("dotenv").config();

const express = require("express");
const cors = require("cors");

const Blockchain = require("./Blockchain");
const Transaction = require("./Transaction");

const connectDB = require("./config/db");
const BlockchainModel =
    require("./models/BlockchainModel");

const app = express();

app.use(cors());
app.use(express.json());

let manCoin;

// Initialize Blockchain
const initializeBlockchain = async () => {

    await connectDB();

    let blockchainData =
        await BlockchainModel.findOne();

    if (!blockchainData) {

        manCoin =
            new Blockchain();

        blockchainData =
            new BlockchainModel({
                chain:
                    manCoin.chain,
                difficulty:
                    manCoin.difficulty,
                pendingTransactions:
                    manCoin.pendingTransactions,
                miningReward:
                    manCoin.miningReward
            });

        await blockchainData.save();

        console.log(
            "New blockchain created"
        );

    } else {

        manCoin =
            Object.assign(
                new Blockchain(),
                blockchainData.toObject()
            );

        console.log(
            "Blockchain loaded from MongoDB"
        );

    }

};

// Save Blockchain
const saveBlockchain = async () => {

    await BlockchainModel.findOneAndUpdate(
        {},
        {
            chain:
                manCoin.chain,

            difficulty:
                manCoin.difficulty,

            pendingTransactions:
                manCoin.pendingTransactions,

            miningReward:
                manCoin.miningReward
        },
        {
            upsert: true
        }
    );

};

// Home Route
app.get("/", (req, res) => {

    res.send(
        "Welcome to ManCoin"
    );

});

// View Blockchain
app.get("/blocks", (req, res) => {

    res.json(manCoin);

});

// Wallet Balance
app.get("/balance/:address", (req, res) => {

    const balance =
        manCoin.getBalanceOfAddress(
            req.params.address
        );

    res.json({
        address:
            req.params.address,
        balance
    });

});

// Create Signed Transaction
app.post("/transaction", async (req, res) => {

    try {

        const {
            fromAddress,
            toAddress,
            amount,
            signature
        } = req.body;

        if (
            !fromAddress ||
            !toAddress ||
            !amount ||
            !signature
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All fields are required"
            });

        }

        const transaction =
            new Transaction(
                fromAddress,
                toAddress,
                Number(amount)
            );

        transaction.signature =
            signature;

        manCoin.createTransaction(
            transaction
        );

        await saveBlockchain();

        res.json({
            success: true,
            message:
                "Signed transaction added successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message
        });

    }

});

// Mine Block
app.post("/mine", async (req, res) => {

    try {

        const {
            minerAddress
        } = req.body;

        manCoin
            .minePendingTransactions(
                minerAddress
            );

        await saveBlockchain();

        res.json({
            success: true,
            message:
                "Block mined successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message
        });

    }

});

// Start Server
initializeBlockchain()
    .then(() => {

        app.listen(
            process.env.PORT || 5000,
            () => {

                console.log(
                    "Server running on port 5000"
                );

            }
        );

    });