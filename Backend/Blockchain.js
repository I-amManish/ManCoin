const Block = require("./Block");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(
      0,
      Date.now(),
      "Genesis Block",
      "0"
    );
  }

  getLatestBlock() {
    return this.chain[
      this.chain.length - 1
    ];
  }

  addBlock(newBlock) {

    newBlock.previousHash =
      this.getLatestBlock().hash;

    newBlock.mineBlock(
      this.difficulty
    );

    this.chain.push(newBlock);
  }

  isChainValid() {

    for (
      let i = 1;
      i < this.chain.length;
      i++
    ) {

      const currentBlock =
        this.chain[i];

      const previousBlock =
        this.chain[i - 1];

      if (
        currentBlock.hash !==
        currentBlock.calculateHash()
      ) {
        return false;
      }

      if (
        currentBlock.previousHash !==
        previousBlock.hash
      ) {
        return false;
      }

    }

    return true;
  }

  createTransaction(transaction) {

    if (
      !transaction.fromAddress ||
      !transaction.toAddress
    ) {
      throw new Error(
        "Transaction must include from and to address"
      );
    }

    if (
      !transaction.isValid()
    ) {
      throw new Error(
        "Invalid transaction signature"
      );
    }

    this.pendingTransactions.push(
      transaction
    );
  }

  minePendingTransactions(
    miningRewardAddress
  ) {

    if (
      !miningRewardAddress ||
      miningRewardAddress.trim() === ""
    ) {
      throw new Error(
        "Miner address is required"
      );
    }

    if (
      this.pendingTransactions.length === 0
    ) {
      throw new Error(
        "No pending transactions to mine"
      );
    }

    // Validate every transaction
    for (
      const tx of this.pendingTransactions
    ) {

      if (
        tx.fromAddress !== null &&
        typeof tx.isValid === "function"
      ) {

        if (!tx.isValid()) {

          throw new Error(
            "Invalid transaction found in block"
          );

        }

      }

    }

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions
    );

    this.addBlock(block);

    this.pendingTransactions = [
      {
        fromAddress: null,
        toAddress:
          miningRewardAddress,
        amount:
          this.miningReward,
      },
    ];
  }

  getBalanceOfAddress(
    address
  ) {

    let balance = 0;

    for (
      const block of this.chain
    ) {

      if (
        !Array.isArray(block.data)
      ) {
        continue;
      }

      for (
        const transaction of block.data
      ) {

        const amount =
          Number(
            transaction.amount
          );

        if (
          transaction.fromAddress ===
          address
        ) {
          balance -= amount;
        }

        if (
          transaction.toAddress ===
          address
        ) {
          balance += amount;
        }

      }

    }

    return balance;
  }

}

module.exports = Blockchain;