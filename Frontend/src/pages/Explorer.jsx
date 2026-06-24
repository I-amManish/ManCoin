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

      setBlocks(res.data.chain);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlocks();

    socket.on("receiveBlock", fetchBlocks);

    socket.on("receiveTransaction", fetchBlocks);

    return () => {
      socket.off("receiveBlock");
      socket.off("receiveTransaction");
    };
  }, []);

  const filteredBlocks = blocks.filter((block) => {
    if (!search) return true;

    const query = search.toLowerCase();

    if (block.index?.toString().includes(query)) {
      return true;
    }

    if (block.hash?.toLowerCase().includes(query)) {
      return true;
    }

    if (block.previousHash?.toLowerCase().includes(query)) {
      return true;
    }

    if (Array.isArray(block.data)) {
      return block.data.some(
        (tx) =>
          tx.fromAddress?.toLowerCase().includes(query) ||
          tx.toAddress?.toLowerCase().includes(query),
      );
    }

    return false;
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">📦 Blockchain Explorer</h1>

      <input
        type="text"
        placeholder="Search Block #, Hash, Wallet Address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
              w-full
              p-3
              rounded-lg
              bg-slate-800
              text-white
              mb-6
              border
              border-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
              focus:border-cyan-500
              transition-all
            "
      />

      <p className="text-slate-400 mb-6">
        Found {filteredBlocks.length} block(s)
      </p>

      <div className="space-y-6">
        {filteredBlocks.map((block) => (
          <div
            key={block.index}
            onClick={() => setSelectedBlock(block)}
            className="
                bg-slate-800
                rounded-xl
                p-6
                shadow-lg
                cursor-pointer
                hover:bg-slate-700
                hover:scale-[1.02]
                active:scale-[0.98]
                hover:shadow-cyan-500/20
                transition-all
                duration-200
              "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Block #{block.index}</h2>

              <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm">
                {Array.isArray(block.data) ? block.data.length : 0} Tx
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                🔗 <strong>Hash:</strong> {block.hash?.slice(0, 20)}...
              </p>

              <p>
                🔙 <strong>Previous:</strong> {block.previousHash?.slice(0, 20)}
                ...
              </p>

              <p>
                ⚙️ <strong>Nonce:</strong> {block.nonce}
              </p>
            </div>

            {Array.isArray(block.data) && block.data.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Transactions</h3>

                <div className="space-y-3">
                  {block.data.map((tx, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(tx);
                      }}
                      className="
                        bg-slate-700
                        p-4
                        rounded-lg
                        cursor-pointer
                        hover:bg-slate-600
                        hover:scale-[1.01]
                        active:scale-[0.99]
                        transition-all
                      "
                    >
                      {tx.fromAddress === null ? (
                        <div className="text-green-400 font-bold">
                          ⛏️ Mining Reward
                          <br />+{tx.amount} MC
                        </div>
                      ) : (
                        <>
                          <p>💸 {tx.amount} MC</p>
                          <p className="text-sm text-yellow-400">
                            💰 Fee: {tx.fee ?? 0} MC
                          </p>

                          <p className="text-xs text-slate-300 mt-1">
                            From: {tx.fromAddress?.slice(0, 12)}
                            ...
                          </p>

                          <p className="text-xs text-slate-300">
                            To: {tx.toAddress?.slice(0, 12)}
                            ...
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
