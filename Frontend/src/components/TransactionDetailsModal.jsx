import { useState } from "react";

function TransactionDetailsModal({ transaction, onClose }) {
  const [copied, setCopied] = useState("");

  if (!transaction) return null;

  const copyText = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value || "");
      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setCopied("Copy failed");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not available";

    return new Date(Number(timestamp)).toLocaleString();
  };

  const isMiningReward = transaction.fromAddress === null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-slate-800 p-5 md:p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-xl md:text-2xl font-bold">
            {isMiningReward
              ? "⛏️ Mining Reward Details"
              : "💸 Transaction Details"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-slate-400">Amount</p>
            <p className="text-xl font-bold text-green-400">
              {transaction.amount} MC
            </p>
          </div>

          {!isMiningReward && (
            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-slate-400">Transaction Fee</p>
              <p className="font-semibold text-yellow-400">
                {transaction.fee ?? 0} MC
              </p>
            </div>
          )}

          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-slate-400 mb-1">Sender</p>
            <p className="break-all">{transaction.fromAddress || "System mining reward"}</p>

            {transaction.fromAddress && (
              <button
                onClick={() => copyText("Sender address copied", transaction.fromAddress)}
                className="mt-3 rounded bg-blue-600 px-3 py-2 text-xs hover:bg-blue-700 transition"
              >
                📋 Copy Sender
              </button>
            )}
          </div>

          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-slate-400 mb-1">Receiver</p>
            <p className="break-all">{transaction.toAddress || "Not available"}</p>

            <button
              onClick={() => copyText("Receiver address copied", transaction.toAddress)}
              className="mt-3 rounded bg-blue-600 px-3 py-2 text-xs hover:bg-blue-700 transition"
            >
              📋 Copy Receiver
            </button>
          </div>

          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-slate-400">Transaction ID</p>
            <p className="break-all">
              {transaction.txId || "Not available for older transactions"}
            </p>

            {transaction.txId && (
              <button
                onClick={() => copyText("Transaction ID copied", transaction.txId)}
                className="mt-3 rounded bg-blue-600 px-3 py-2 text-xs hover:bg-blue-700 transition"
              >
                📋 Copy Transaction ID
              </button>
            )}
          </div>

          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-slate-400">Timestamp</p>
            <p>{formatDate(transaction.timestamp)}</p>
          </div>

          {!isMiningReward && (
            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-slate-400">Signature Status</p>
              <p className={transaction.signature ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                {transaction.signature ? "✓ Signed transaction" : "✕ Signature missing"}
              </p>
            </div>
          )}

          {transaction.message && (
            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-slate-400">Message</p>
              <p className="break-words">{transaction.message}</p>
            </div>
          )}

          {copied && (
            <div className="rounded-lg bg-green-900/40 border border-green-500 p-3 text-green-400">
              {copied}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;