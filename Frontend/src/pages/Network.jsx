import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function Network() {
  const [networkData, setNetworkData] = useState({
    peers: 0,
    blocks: 0,
    pending: 0,
    reward: 0,
    latestBlock: "-",
    valid: false,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [blocksRes, validateRes, peerRes] = await Promise.all([
        axios.get("http://localhost:5000/blocks"),
        axios.get("http://localhost:5000/validate"),
        axios.get("http://localhost:5000/peers"),
      ]);

      const blockchain = blocksRes.data;
      const latestBlock =
        blockchain.chain?.[blockchain.chain.length - 1];

      setNetworkData({
        peers: peerRes.data.peers ?? 0,
        blocks: blockchain.chain?.length ?? 0,
        pending: blockchain.pendingTransactions?.length ?? 0,
        reward: blockchain.miningReward ?? 0,
        latestBlock: latestBlock?.index ?? "-",
        valid: validateRes.data.valid ?? false,
      });
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Could not load network information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();

    socket.on("receiveTransaction", fetchNetworkData);
    socket.on("receiveBlock", fetchNetworkData);

    socket.on("peerCount", (count) => {
      setNetworkData((previous) => ({
        ...previous,
        peers: count,
      }));
    });

    return () => {
      socket.off("receiveTransaction", fetchNetworkData);
      socket.off("receiveBlock", fetchNetworkData);
      socket.off("peerCount");
    };
  }, []);

  const cards = [
    {
      title: "Connected Peers",
      value: networkData.peers,
      icon: "🔗",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Blocks",
      value: networkData.blocks,
      icon: "📦",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Transactions",
      value: networkData.pending,
      icon: "⏳",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Mining Reward",
      value: `${networkData.reward} MC`,
      icon: "⛏️",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Latest Block",
      value: `#${networkData.latestBlock}`,
      icon: "🧱",
      color: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            🌐 Network Monitor
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Live ManCoin blockchain network status.
          </p>
        </div>

        <button
          onClick={fetchNetworkData}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
        >
          {loading ? "Refreshing..." : "↻ Refresh Network"}
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-red-600 p-3 text-white">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 md:text-base">
                {card.title}
              </h2>

              <span className="text-2xl">{card.icon}</span>
            </div>

            <p className={`mt-4 text-3xl font-bold ${card.color}`}>
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}

        <div className="rounded-xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 md:text-base">
              Chain Status
            </h2>

            <span className="text-2xl">
              {networkData.valid ? "🛡️" : "⚠️"}
            </span>
          </div>

          <p
            className={`mt-4 text-2xl font-bold ${
              networkData.valid
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {loading
              ? "Checking..."
              : networkData.valid
              ? "✅ Valid"
              : "❌ Invalid"}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
        <strong>Live updates:</strong> This page refreshes automatically when a
        transaction is added, a block is mined, or a peer connects/disconnects.
      </div>
    </div>
  );
}

export default Network;