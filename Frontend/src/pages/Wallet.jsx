import { useEffect, useState } from "react";
import axios from "axios";

function Wallet() {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const walletAddress = localStorage.getItem("publicKey");
      const savedUsername = localStorage.getItem("username");

      setUsername(savedUsername || "Unknown User");

      if (!walletAddress) {
        setMessage("No wallet found. Generate a wallet first.");
        setAddress("");
        setBalance(0);
        setTransactions([]);
        return;
      }

      setAddress(walletAddress);

      const [balanceRes, txRes] = await Promise.all([
        axios.get(`http://localhost:5000/balance/${walletAddress}`),
        axios.get(`http://localhost:5000/transactions/${walletAddress}`),
      ]);

      setBalance(balanceRes.data.balance);

      const latestFirst = [...txRes.data].reverse();
      setTransactions(latestFirst);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Could not load wallet data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const copyAddress = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setMessage("Could not copy wallet address.");
    }
  };

  const shortAddress = (addr) => {
    if (!addr) return "Mining Reward";

    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Older transaction";

    return new Date(Number(timestamp)).toLocaleString();
  };

  const receivedAmount = transactions
    .filter((tx) => tx.toAddress === address)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const sentAmount = transactions
    .filter((tx) => tx.fromAddress === address)
    .reduce(
      (sum, tx) =>
        sum +
        Number(tx.amount || 0) +
        Number(tx.fee || 0),
      0
    );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        💰 Wallet
      </h1>

      <div className="bg-slate-800 p-4 md:p-6 rounded-xl">
        <div className="bg-slate-700 p-4 rounded-lg mb-6">
          <h2 className="text-gray-400">Username</h2>

          <p className="text-xl md:text-2xl font-bold text-purple-400">
            👤 {username}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl font-bold">Wallet Address</h2>

          <button
            onClick={copyAddress}
            disabled={!address}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition px-4 py-2 rounded-lg"
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>

        <p className="break-all text-sm bg-slate-700 p-3 rounded-lg mt-4">
          {address ? shortAddress(address) : "No wallet generated"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400">Balance</p>

            <p className="text-3xl font-bold text-green-400">
              {balance} MC
            </p>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400">Received</p>

            <p className="text-3xl font-bold text-green-400">
              {receivedAmount} MC
            </p>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400">Sent + Fees</p>

            <p className="text-3xl font-bold text-red-400">
              {sentAmount} MC
            </p>
          </div>
        </div>

        <button
          onClick={fetchWalletData}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition px-6 py-3 rounded-lg font-semibold w-full sm:w-auto"
        >
          {loading ? "Refreshing..." : "Refresh Wallet"}
        </button>

        {message && (
          <div className="mt-4 bg-red-600 p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          📜 Transaction History
        </h2>

        {loading ? (
          <div className="bg-slate-800 p-4 rounded-xl text-slate-300">
            Loading wallet activity...
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-slate-800 p-4 rounded-xl">
            No transactions found
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => {
              const isMiningReward = tx.fromAddress === null;
              const isReceived = tx.toAddress === address;

              const title = isMiningReward
                ? "⛏️ Mining Reward"
                : isReceived
                ? "⬇️ Received"
                : "⬆️ Sent";

              const amountStyle =
                isMiningReward || isReceived
                  ? "text-green-400"
                  : "text-red-400";

              return (
                <div
                  key={tx.txId || `${tx.block}-${index}`}
                  className="bg-slate-800 p-4 md:p-5 rounded-xl hover:bg-slate-750 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{title}</h3>

                      <p className="text-gray-400 text-sm">
                        Block #{tx.block} • {formatDate(tx.timestamp)}
                      </p>
                    </div>

                    <div
                      className={`${amountStyle} text-2xl font-bold`}
                    >
                      {isMiningReward || isReceived ? "+" : "-"}
                      {tx.amount} MC
                    </div>
                  </div>

                  <div className="mt-4 text-sm space-y-2 bg-slate-700/60 p-3 rounded-lg">
                    {!isMiningReward && (
                      <p className="text-yellow-400">
                        💰 Fee: {tx.fee ?? 0} MC
                      </p>
                    )}

                    {tx.fromAddress && (
                      <p className="break-all">
                        From:{" "}
                        {tx.fromAddress === address
                          ? `👤 ${username}`
                          : shortAddress(tx.fromAddress)}
                      </p>
                    )}

                    <p className="break-all">
                      To:{" "}
                      {tx.toAddress === address
                        ? `👤 ${username}`
                        : shortAddress(tx.toAddress)}
                    </p>

                    {tx.txId && (
                      <p className="break-all text-xs text-slate-400">
                        Tx ID: {shortAddress(tx.txId)}
                      </p>
                    )}

                    {!isMiningReward && (
                      <p className="text-green-400 text-xs">
                        ✓ Digitally signed transaction
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;