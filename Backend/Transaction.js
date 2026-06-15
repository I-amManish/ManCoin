const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = null;
    }

    calculateHash() {
        return require("crypto-js/sha256")(
            this.fromAddress +
            this.toAddress +
            this.amount
        ).toString();
    }

    signTransaction(signingKey) {

        const hashTx = this.calculateHash();

        const sig = signingKey.sign(
            hashTx,
            "base64"
        );

        this.signature = sig.toDER("hex");
    }

    isValid() {

        if (this.fromAddress === null) {
            return true;
        }

        if (!this.signature || this.signature.length === 0) {
            return false;
        }

        const publicKey = ec.keyFromPublic(
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