const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

class Wallet {

    static createWallet() {

        const keyPair = ec.genKeyPair();

        return {
            privateKey: keyPair.getPrivate("hex"),
            publicKey: keyPair.getPublic("hex")
        };
    }

}

module.exports = Wallet;