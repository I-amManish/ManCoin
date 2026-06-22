import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function Network() {

  const [networkData, setNetworkData] =
    useState({
      peers: 0,
      blocks: 0,
      pending: 0,
      reward: 0,
      latestBlock: "-",
      valid: false,
    });

  const fetchNetworkData =
    async () => {

      try {

        const blocksRes =
          await axios.get(
            "http://localhost:5000/blocks"
          );

        const validateRes =
          await axios.get(
            "http://localhost:5000/validate"
          );

        const peerRes =
          await axios.get(
            "http://localhost:5000/peers"
          );

        const blockchain =
          blocksRes.data;

        setNetworkData({
          peers:
            peerRes.data.peers,

          blocks:
            blockchain.chain.length,

          pending:
            blockchain.pendingTransactions.length,

          reward:
            blockchain.miningReward,

          latestBlock:
            blockchain.chain[
              blockchain.chain.length - 1
            ].index,

          valid:
            validateRes.data.valid,
        });

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchNetworkData();

    socket.on(
      "receiveTransaction",
      fetchNetworkData
    );

    socket.on(
      "receiveBlock",
      fetchNetworkData
    );

    socket.on(
      "peerCount",
      (count) => {

        setNetworkData(
          (prev) => ({
            ...prev,
            peers: count,
          })
        );

      }
    );

    return () => {

      socket.off(
        "receiveTransaction"
      );

      socket.off(
        "receiveBlock"
      );

      socket.off(
        "peerCount"
      );

    };

  }, []);

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        🌐 Network Monitor
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Connected Peers
          </h2>

          <p className="text-3xl font-bold mt-2">
            {networkData.peers}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Total Blocks
          </h2>

          <p className="text-3xl font-bold mt-2">
            {networkData.blocks}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Pending Transactions
          </h2>

          <p className="text-3xl font-bold mt-2">
            {networkData.pending}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Mining Reward
          </h2>

          <p className="text-3xl font-bold mt-2">
            {networkData.reward}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Latest Block
          </h2>

          <p className="text-3xl font-bold mt-2">
            #{networkData.latestBlock}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Chain Status
          </h2>

          <p
            className={`text-2xl font-bold mt-2 ${
              networkData.valid
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {networkData.valid
              ? "✅ Valid"
              : "❌ Invalid"}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Network;