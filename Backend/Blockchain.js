const Block = require("./Block");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 1;
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

    // Check block linkage

    if (
      currentBlock.previousHash !==
      previousBlock.hash
    ) {
      return false;
    }

    // Check hash exists

    if (
      !currentBlock.hash ||
      currentBlock.hash.length === 0
    ) {
      return false;
    }

    // Validate transactions

    if (
      Array.isArray(
        currentBlock.data
      )
    ) {

      for (
        const tx of currentBlock.data
      ) {

        // Skip mining rewards

        if (
          tx.fromAddress === null
        ) {
          continue;
        }

        // Required fields

        if (
          !tx.fromAddress ||
          !tx.toAddress ||
          !tx.amount
        ) {
          return false;
        }

        // Address format check

        if (
          tx.fromAddress.length < 66 ||
          tx.toAddress.length < 66
        ) {
          return false;
        }

      }

    }

  }

  return true;
}

  createTransaction(
    transaction
  ) {

    if (
      !transaction.fromAddress ||
      !transaction.toAddress
    ) {
      throw new Error(
        "Transaction must include sender and receiver"
      );
    }

    // Address validation

    if (
      transaction.fromAddress.length < 66 ||
      transaction.toAddress.length < 66
    ) {
      throw new Error(
        "Invalid wallet address"
      );
    }

    // Self-transfer prevention

    if (
      transaction.fromAddress ===
      transaction.toAddress
    ) {
      throw new Error(
        "Cannot send to same wallet"
      );
    }

    // Signature validation

    if (
      !transaction.isValid()
    ) {
      throw new Error(
        "Invalid transaction signature"
      );
    }

    // Duplicate transaction check

    const duplicate =
      this.pendingTransactions.some(
        tx =>
          tx.txId ===
          transaction.txId
      );

    if (duplicate) {
      throw new Error(
        "Duplicate transaction detected"
      );
    }

    const senderBalance =
      this.getBalanceOfAddress(
        transaction.fromAddress
      );

    const totalCost =
      transaction.amount +
      (transaction.fee || 0);

    if (
      senderBalance <
      totalCost
    ) {
      throw new Error(
        `Insufficient balance. Available: ${senderBalance} ManCoin`
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

    let totalFees = 0;

    for (
      const tx of this.pendingTransactions
    ) {
      totalFees += Number(
        tx.fee || 0
      );
    }

    this.pendingTransactions.push({
      fromAddress: null,
      toAddress: miningRewardAddress,
      amount:
        this.miningReward +
        totalFees,
    });

    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions
    );

    this.addBlock(block);

    this.pendingTransactions = [];

    // Optional difficulty increase

    if (
      this.chain.length % 5 === 0
    ) {
      this.difficulty++;
    }
  }

  getBalanceOfAddress(
    address
  ) {

    let balance = 0;

    for (
      const block of this.chain
    ) {

      if (
        !Array.isArray(
          block.data
        )
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

          if (
            transaction.fee
          ) {
            balance -= Number(
              transaction.fee
            );
          }
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