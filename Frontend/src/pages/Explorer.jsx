import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import BlockDetailsModal from "../components/BlockDetailsModal";
import TransactionDetailsModal from "../components/TransactionDetailsModal";

function Explorer() {
  const [blocks, setBlocks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchBlocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/blocks");
      setBlocks(res.data.chain || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlocks();

    socket.on("receiveBlock", fetchBlocks);
    socket.on("receiveTransaction", fetchBlocks);

    return () => {
      socket.off("receiveBlock", fetchBlocks);
      socket.off("receiveTransaction", fetchBlocks);
    };
  }, []);

  const filteredBlocks = blocks.filter((block) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    return (
      block.index?.toString().includes(query) ||
      block.hash?.toLowerCase().includes(query) ||
      block.previousHash?.toLowerCase().includes(query) ||
      (Array.isArray(block.data) &&
        block.data.some(
          (tx) =>
            tx.fromAddress?.toLowerCase().includes(query) ||
            tx.toAddress?.toLowerCase().includes(query) ||
            tx.txId?.toLowerCase().includes(query)
        ))
    );
  });

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        📦 Blockchain Explorer
      </h1>

      <input
        type="text"
        placeholder="Search Block #, Hash, Wallet Address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          mb-6
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          p-3
          text-slate-900
          placeholder:text-slate-500
          outline-none
          transition-all
          focus:border-cyan-500
          focus:ring-2
          focus:ring-cyan-500
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
          dark:placeholder:text-slate-400
        "
      />

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Found {filteredBlocks.length} block(s)
      </p>

      <div className="space-y-6">
        {filteredBlocks.map((block) => (
          <div
            key={block.index}
            onClick={() => setSelectedBlock(block)}
            className="
              cursor-pointer
              rounded-xl
              bg-white
              p-4
              shadow-md
              transition-all
              duration-200
              hover:scale-[1.01]
              hover:shadow-lg
              active:scale-[0.99]
              dark:bg-slate-800
              md:p-6
            "
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold md:text-2xl">
                Block #{block.index}
              </h2>

              <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">
                {Array.isArray(block.data) ? block.data.length : 0} Tx
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p className="break-all">
                🔗 <strong>Hash:</strong> {block.hash?.slice(0, 20)}...
              </p>

              <p className="break-all">
                🔙 <strong>Previous:</strong>{" "}
                {block.previousHash?.slice(0, 20)}...
              </p>

              <p>
                ⚙️ <strong>Nonce:</strong> {block.nonce}
              </p>
            </div>

            {Array.isArray(block.data) && block.data.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold">
                  Transactions
                </h3>

                <div className="space-y-3">
                  {block.data.map((tx, index) => (
                    <div
                      key={tx.txId || index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(tx);
                      }}
                      className="
                        cursor-pointer
                        rounded-lg
                        bg-slate-100
                        p-4
                        transition-all
                        hover:scale-[1.01]
                        hover:bg-slate-200
                        active:scale-[0.99]
                        dark:bg-slate-700
                        dark:hover:bg-slate-600
                      "
                    >
                      {tx.fromAddress === null ? (
                        <div className="font-bold text-green-600 dark:text-green-400">
                          ⛏️ Mining Reward
                          <br />
                          +{tx.amount} MC
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold">
                            💸 {tx.amount} MC
                          </p>

                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            💰 Fee: {tx.fee ?? 0} MC
                          </p>

                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            From: {tx.fromAddress?.slice(0, 12)}...
                          </p>

                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            To: {tx.toAddress?.slice(0, 12)}...
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredBlocks.length === 0 && (
          <div className="rounded-xl bg-white p-6 text-center text-slate-600 shadow-md dark:bg-slate-800 dark:text-slate-400">
            No blocks found for this search.
          </div>
        )}
      </div>

      <BlockDetailsModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
      />

      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

export default Explorer;