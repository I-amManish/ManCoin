const Blockchain = require("./Blockchain");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Load Blockchain From File
let manCoin;

if (fs.existsSync("blockchain.json")) {

    const data = fs.readFileSync(
        "blockchain.json",
        "utf8"
    );

    if (
        data &&
        data.trim() !== "" &&
        data.trim() !== "{}"
    ) {

        const savedBlockchain =
            JSON.parse(data);

        manCoin = Object.assign(
            new Blockchain(),
            savedBlockchain
        );

    } else {

        manCoin = new Blockchain();

    }

} else {

    manCoin = new Blockchain();

}

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

    const balance =
        manCoin.getBalanceOfAddress(
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

    if (
        !fromAddress ||
        !toAddress ||
        !amount
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    manCoin.pendingTransactions.push({
        fromAddress,
        toAddress,
        amount: Number(amount)
    });

    fs.writeFileSync(
        "blockchain.json",
        JSON.stringify(
            manCoin,
            null,
            2
        )
    );

    res.json({
        success: true,
        message:
            "Transaction added successfully"
    });

});

// Mine Block
app.post("/mine", (req, res) => {

    try {

        const { minerAddress } =
            req.body;

        if (
            !minerAddress ||
            minerAddress.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Miner address is required"
            });
        }

        if (
            manCoin.pendingTransactions.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "No pending transactions to mine"
            });
        }

        manCoin.minePendingTransactions(
            minerAddress
        );

        fs.writeFileSync(
            "blockchain.json",
            JSON.stringify(
                manCoin,
                null,
                2
            )
        );

        res.json({
            success: true,
            message:
                "Block mined successfully",
            minerAddress
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// Start Server
app.listen(5000, () => {
    console.log(
        "Server running on port 5000"
    );
});