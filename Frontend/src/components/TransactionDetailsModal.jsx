import { useState } from "react";

function TransactionDetailsModal({ transaction, onClose }) {
  const [copied, setCopied] = useState("");

  if (!transaction) return null;

  const isMiningReward = transaction.fromAddress === null;

  const copyText = async (label, value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setCopied("Copy failed");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Not available for older transactions";
    }

    return new Date(Number(timestamp)).toLocaleString();
  };

  const shortValue = (value, start = 18, end = 12) => {
    if (!value) return "Not available";

    if (value.length <= start + end) return value;

    return `${value.slice(0, start)}...${value.slice(-end)}`;
  };

  const DetailCard = ({
    title,
    value,
    buttonText,
    copyLabel,
    accentClass = "text-white",
  }) => (
    <div className="rounded-xl border border-slate-600 bg-slate-700/80 p-4">
      <p className="mb-2 text-sm text-slate-400">{title}</p>

      <p className={`break-all text-sm font-medium ${accentClass}`}>
        {value || "Not available"}
      </p>

      {value && buttonText && (
        <button
          type="button"
          onClick={() => copyText(copyLabel, value)}
          className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition"
        >
          {copied === copyLabel ? "✓ Copied" : buttonText}
        </button>
      )}
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-700 bg-slate-900 p-5">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">
              {isMiningReward
                ? "⛏️ Mining Reward Details"
                : "💸 Transaction Details"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {isMiningReward
                ? "Reward created after successful mining"
                : "Secure transaction signed using secp256k1"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close transaction details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow-lg hover:bg-red-700 active:scale-95 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5 pb-24">
          <div
            className={`rounded-2xl border p-5 ${
              isMiningReward
                ? "border-green-500/30 bg-green-500/10"
                : "border-blue-500/30 bg-blue-500/10"
            }`}
          >
            <p className="text-sm text-slate-400">
              {isMiningReward ? "Mining Reward" : "Transfer Amount"}
            </p>

            <p
              className={`mt-2 text-3xl font-bold md:text-4xl ${
                isMiningReward ? "text-green-400" : "text-blue-400"
              }`}
            >
              {isMiningReward ? "+" : ""}
              {transaction.amount} MC
            </p>

            {!isMiningReward && (
              <p className="mt-2 text-sm text-yellow-400">
                💰 Network Fee: {transaction.fee ?? 0} MC
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Transaction Type</p>

              <p className="mt-2 font-bold">
                {isMiningReward
                  ? "⛏️ Mining Reward"
                  : "🔐 Signed Transfer"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Signature Status</p>

              <p
                className={`mt-2 font-bold ${
                  isMiningReward || transaction.signature
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {isMiningReward
                  ? "✓ System Generated"
                  : transaction.signature
                  ? "✓ Digitally Signed"
                  : "✕ Signature Missing"}
              </p>
            </div>
          </div>

          {!isMiningReward && (
            <DetailCard
              title="Sender Wallet"
              value={transaction.fromAddress}
              buttonText="📋 Copy Sender"
              copyLabel="Sender copied"
              accentClass="text-cyan-300"
            />
          )}

          <DetailCard
            title={
              isMiningReward
                ? "Reward Receiver Wallet"
                : "Receiver Wallet"
            }
            value={transaction.toAddress}
            buttonText="📋 Copy Receiver"
            copyLabel="Receiver copied"
            accentClass="text-purple-300"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-600 bg-slate-700/80 p-4">
              <p className="mb-2 text-sm text-slate-400">
                Transaction ID
              </p>

              <p className="break-all text-sm font-medium text-yellow-300">
                {transaction.txId
                  ? shortValue(transaction.txId)
                  : "Not available for older transactions"}
              </p>

              {transaction.txId && (
                <button
                  type="button"
                  onClick={() =>
                    copyText("Transaction ID copied", transaction.txId)
                  }
                  className="mt-3 rounded-lg bg-yellow-600 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-700 active:scale-95 transition"
                >
                  {copied === "Transaction ID copied"
                    ? "✓ Copied"
                    : "📋 Copy Transaction ID"}
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-700/80 p-4">
              <p className="mb-2 text-sm text-slate-400">Timestamp</p>

              <p className="text-sm font-medium">
                {formatDate(transaction.timestamp)}
              </p>

              {transaction.timestamp && (
                <p className="mt-3 break-all text-xs text-slate-400">
                  Unix: {transaction.timestamp}
                </p>
              )}
            </div>
          </div>

          {!isMiningReward && (
            <DetailCard
              title="Digital Signature"
              value={transaction.signature}
              buttonText="📋 Copy Signature"
              copyLabel="Signature copied"
              accentClass="text-green-300"
            />
          )}

          {transaction.message && (
            <div className="rounded-xl border border-slate-600 bg-slate-700/80 p-4">
              <p className="mb-2 text-sm text-slate-400">
                Transaction Message
              </p>

              <p className="break-words text-sm">
                {transaction.message}
              </p>
            </div>
          )}

          {copied && (
            <div
              className={`rounded-xl border p-3 text-sm ${
                copied === "Copy failed"
                  ? "border-red-500 bg-red-900/40 text-red-300"
                  : "border-green-500 bg-green-900/40 text-green-300"
              }`}
            >
              {copied === "Copy failed" ? "✕ Copy failed" : `✓ ${copied}`}
            </div>
          )}
        </div>

        {/* Sticky bottom close button */}
        <div className="sticky bottom-0 z-20 border-t border-slate-700 bg-slate-900 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg hover:bg-red-700 active:scale-[0.99] transition"
          >
            ✕ Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;