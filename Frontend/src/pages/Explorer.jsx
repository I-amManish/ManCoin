import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function Explorer() {

  const [blocks, setBlocks] =
    useState([]);

  const fetchBlocks =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/blocks"
          );

        setBlocks(
          res.data.chain
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchBlocks();

    socket.on(
      "receiveBlock",
      fetchBlocks
    );

    socket.on(
      "receiveTransaction",
      fetchBlocks
    );

    return () => {

      socket.off(
        "receiveBlock"
      );

      socket.off(
        "receiveTransaction"
      );

    };

  }, []);

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        📦 Blockchain Explorer
      </h1>

      <div className="space-y-6">

        {blocks.map((block) => (

          <div
            key={block.index}
            className="
              bg-slate-800
              rounded-xl
              p-6
              shadow-lg
            "
          >

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold">
                Block #{block.index}
              </h2>

              <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm">
                {Array.isArray(block.data)
                  ? block.data.length
                  : 0} Tx
              </span>

            </div>

            <div className="space-y-2 text-sm">

              <p>
                🔗 <strong>Hash:</strong>
                {" "}
                {block.hash?.slice(0, 20)}...
              </p>

              <p>
                🔙 <strong>Previous:</strong>
                {" "}
                {block.previousHash?.slice(0, 20)}...
              </p>

              <p>
                ⚙️ <strong>Nonce:</strong>
                {" "}
                {block.nonce}
              </p>

            </div>

            {Array.isArray(block.data) &&
              block.data.length > 0 && (

              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">
                  Transactions
                </h3>

                <div className="space-y-3">

                  {block.data.map(
                    (tx, index) => (

                      <div
                        key={index}
                        className="
                          bg-slate-700
                          p-4
                          rounded-lg
                        "
                      >

                        {tx.fromAddress === null ? (

                          <div className="text-green-400 font-bold">
                            ⛏️ Mining Reward
                            <br />
                            +{tx.amount} MC
                          </div>

                        ) : (

                          <>
                            <p>
                              💸
                              {" "}
                              {tx.amount}
                              {" "}
                              MC
                            </p>

                            <p className="text-xs text-slate-300 mt-1">
                              From:
                              {" "}
                              {tx.fromAddress.slice(0, 12)}
                              ...
                            </p>

                            <p className="text-xs text-slate-300">
                              To:
                              {" "}
                              {tx.toAddress.slice(0, 12)}
                              ...
                            </p>
                          </>

                        )}

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Explorer;