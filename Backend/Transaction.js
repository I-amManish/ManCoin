const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");

const ec = new EC("secp256k1");

class Transaction {

    constructor(
        fromAddress,
        toAddress,
        amount,
        message = "",
        fee = 1
    ) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

        // Optional transaction note
        this.message = message;

        // Transaction fee
        this.fee = fee;

        // Timestamp
        this.timestamp = Date.now();

        // Unique Transaction ID
        this.txId = SHA256(
            fromAddress +
            toAddress +
            amount +
            message +
            fee +
            this.timestamp
        ).toString();

        this.signature = null;
    }

    calculateHash() {
        return SHA256(
            this.fromAddress +
            this.toAddress +
            this.amount +
            this.message +
            this.fee +
            this.timestamp +
            this.txId
        ).toString();
    }

    signTransaction(signingKey) {

        if (
            signingKey.getPublic("hex") !==
            this.fromAddress
        ) {
            throw new Error(
                "You cannot sign transactions for other wallets"
            );
        }

        const hashTx =
            this.calculateHash();

        const sig =
            signingKey.sign(
                hashTx,
                "base64"
            );

        this.signature =
            sig.toDER("hex");
    }

    isValid() {

        // Mining reward transaction
        if (
            this.fromAddress === null
        ) {
            return true;
        }

        if (
            !this.signature ||
            this.signature.length === 0
        ) {
            throw new Error(
                "No signature in this transaction"
            );
        }

        const publicKey =
            ec.keyFromPublic(
                this.fromAddress,
                "hex"
            );

        return publicKey.verify(
            this.calculateHash(),
            this.signature
        );
    }
}

module.exports = Transaction;