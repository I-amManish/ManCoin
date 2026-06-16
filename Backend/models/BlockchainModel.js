const mongoose = require("mongoose");

const BlockchainSchema =
new mongoose.Schema({

    chain: {
        type: Array,
        default: []
    },

    difficulty: Number,

    pendingTransactions: {
        type: Array,
        default: []
    },

    miningReward: Number

});

module.exports =
mongoose.model(
    "Blockchain",
    BlockchainSchema
);