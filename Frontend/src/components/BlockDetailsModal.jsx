import React from "react";

function BlockDetailsModal({ block, onClose }) {
  if (!block) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/70
        flex items-center
        justify-center
        z-50
      "
      onClick={onClose}
    >
      <div
        className="
          bg-slate-900
          text-white
          p-6
          rounded-xl
          w-[90%]
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">📦 Block #{block.index}</h2>

          <button
            onClick={onClose}
            className="
    bg-red-600
    hover:bg-red-700
    active:scale-95
    hover:scale-105
    transition-all
    duration-200
    px-4
    py-2
    rounded-lg
    font-medium
    shadow-md
    hover:shadow-red-500/30
  "
          >
            ✕ Close
          </button>
        </div>

        <div className="space-y-4">
          <p>
            <strong>Hash:</strong>
          </p>
          <p className="break-all text-green-400">{block.hash}</p>

          <p>
            <strong>Previous Hash:</strong>
          </p>
          <p className="break-all text-yellow-400">{block.previousHash}</p>

          <p>
            <strong>Timestamp:</strong> {block.timestamp}
          </p>

          <p>
            <strong>Nonce:</strong> {block.nonce}
          </p>

          <p>
            <strong>Transactions:</strong>{" "}
            {Array.isArray(block.data) ? block.data.length : 0}
          </p>
        </div>

        <hr className="my-6" />

        <h3 className="text-2xl font-bold mb-4">Transactions</h3>

        {Array.isArray(block.data) &&
          block.data.map((tx, index) => (
            <div
              key={index}
              className="
                  bg-slate-800
                  p-4
                  rounded-lg
                  mb-3
                "
            >
              {tx.fromAddress === null ? (
                <div className="text-green-400">
                  ⛏️ Mining Reward: +{tx.amount} MC
                </div>
              ) : (
                <>
                  <p>
                    <strong>From:</strong> {tx.fromAddress}
                  </p>

                  <p>
                    <strong>To:</strong> {tx.toAddress}
                  </p>

                  <p>
                    <strong>Amount:</strong> {tx.amount} MC
                  </p>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default BlockDetailsModal;
