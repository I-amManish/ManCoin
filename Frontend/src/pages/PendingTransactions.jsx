import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function PendingTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get("http://localhost:5000/pending");

      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Could not load pending transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();

    socket.on("receiveTransaction", fetchPending);
    socket.on("receiveBlock", fetchPending);

    return () => {
      socket.off("receiveTransaction", fetchPending);
      socket.off("receiveBlock", fetchPending);
    };
  }, []);

  const shortAddress = (address) => {
    if (!address) return "Mining Reward";

    return `${address.slice(0, 14)}...${address.slice(-8)}`;
  };

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            📋 Pending Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Transactions waiting to be included in the next mined block.
          </p>
        </div>

        <button
          onClick={fetchPending}
          disabled={loading}
          className="
            rounded-lg
            bg-blue-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-red-600 p-3 text-white">
          {message}
        </div>
      )}

      <div className="mb-6 rounded-xl bg-white p-5 shadow-md dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total Pending
        </p>

        <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
          {loading ? "..." : transactions.length}
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-6 text-slate-600 shadow-md dark:bg-slate-800 dark:text-slate-300">
          Loading pending transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-slate-600 shadow-md dark:bg-slate-800 dark:text-slate-300">
          No pending transactions. The mempool is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, index) => {
            const isMiningReward = tx.fromAddress === null;

            return (
              <div
                key={tx.txId || index}
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
                {isMiningReward ? (
                  <div className="font-bold text-green-600 dark:text-green-400">
                    ⛏️ Mining Reward: +{tx.amount} MC
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-lg font-bold">
                        💸 Pending Transfer
                      </h2>

                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {tx.amount} MC
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-700">
                      <p className="break-all">
                        <strong>From:</strong> {shortAddress(tx.fromAddress)}
                      </p>

                      <p className="break-all">
                        <strong>To:</strong> {shortAddress(tx.toAddress)}
                      </p>

                      <p className="text-yellow-700 dark:text-yellow-400">
                        <strong>💰 Fee:</strong> {tx.fee ?? 0} MC
                      </p>

                      {tx.txId && (
                        <p className="break-all text-xs text-slate-500 dark:text-slate-400">
                          <strong>Tx ID:</strong> {shortAddress(tx.txId)}
                        </p>
                      )}

                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ Digitally signed and waiting for mining
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PendingTransactions;