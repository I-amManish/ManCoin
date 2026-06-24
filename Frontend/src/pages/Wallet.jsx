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
      setTransactions([...txRes.data].reverse());
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
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        💰 Wallet
      </h1>

      {/* Wallet summary */}
      <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-800 md:p-6">
        {/* Username */}
        <div className="mb-6 rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
          <h2 className="text-slate-500 dark:text-slate-400">
            Username
          </h2>

          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 md:text-2xl">
            👤 {username}
          </p>
        </div>

        {/* Address header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">
            Wallet Address
          </h2>

          <button
            onClick={copyAddress}
            disabled={!address}
            className="
              rounded-lg
              bg-green-600
              px-4
              py-2
              text-white
              transition
              hover:bg-green-700
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>

        <p className="mt-4 break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
          {address ? shortAddress(address) : "No wallet generated"}
        </p>

        {/* Balance cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              Balance
            </p>

            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {balance} MC
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              Received
            </p>

            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {receivedAmount} MC
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              Sent + Fees
            </p>

            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {sentAmount} MC
            </p>
          </div>
        </div>

        <button
          onClick={fetchWalletData}
          disabled={loading}
          className="
            mt-6
            w-full
            rounded-lg
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          {loading ? "Refreshing..." : "Refresh Wallet"}
        </button>

        {message && (
          <div className="mt-4 rounded-lg bg-red-600 p-3 text-white">
            {message}
          </div>
        )}
      </div>

      {/* Transaction history */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">
          📜 Transaction History
        </h2>

        {loading ? (
          <div className="rounded-xl bg-white p-4 text-slate-600 shadow-md dark:bg-slate-800 dark:text-slate-300">
            Loading wallet activity...
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-xl bg-white p-4 text-slate-600 shadow-md dark:bg-slate-800 dark:text-slate-300">
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
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400";

              return (
                <div
                  key={tx.txId || `${tx.block}-${index}`}
                  className="
                    rounded-xl
                    bg-white
                    p-4
                    shadow-md
                    transition
                    hover:shadow-lg
                    dark:bg-slate-800
                    md:p-5
                  "
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        {title}
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Block #{tx.block} • {formatDate(tx.timestamp)}
                      </p>
                    </div>

                    <div className={`${amountStyle} text-2xl font-bold`}>
                      {isMiningReward || isReceived ? "+" : "-"}
                      {tx.amount} MC
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-700">
                    {!isMiningReward && (
                      <p className="text-yellow-700 dark:text-yellow-400">
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
                      <p className="break-all text-xs text-slate-500 dark:text-slate-400">
                        Tx ID: {shortAddress(tx.txId)}
                      </p>
                    )}

                    {!isMiningReward && (
                      <p className="text-xs text-green-600 dark:text-green-400">
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