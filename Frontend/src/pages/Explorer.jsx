import { useEffect, useState } from "react";
import axios from "axios";

function Explorer() {

  const [blocks, setBlocks] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:5000/blocks")
      .then((res) => {
        setBlocks(res.data.chain);
      })
      .catch(console.error);

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

            <h2 className="text-2xl font-bold mb-4">
              Block #{block.index}
            </h2>

            <p>
              <strong>Hash:</strong>{" "}
              {block.hash?.slice(0, 25)}...
            </p>

            <p>
              <strong>Previous:</strong>{" "}
              {block.previousHash?.slice(0, 25)}...
            </p>

            <p>
              <strong>Nonce:</strong>{" "}
              {block.nonce}
            </p>

            <p>
              <strong>Transactions:</strong>{" "}
              {Array.isArray(block.data)
                ? block.data.length
                : 0}
            </p>

            {Array.isArray(block.data) &&
              block.data.length > 0 && (

              <div className="mt-4">

                <h3 className="font-bold mb-3 text-lg">
                  Transaction Details
                </h3>

                {block.data.map((tx, index) => (

                  <div
                    key={index}
                    className="
                      bg-slate-700
                      p-4
                      rounded-lg
                      mb-3
                    "
                  >

                    {tx.fromAddress === null ? (

                      <p className="text-green-400 font-semibold">
                        ⛏️ Mining Reward: {tx.amount} MC
                      </p>

                    ) : (

                      <>
                        <p>
                          <strong>From:</strong>{" "}
                          {tx.fromAddress}
                        </p>

                        <p>
                          <strong>To:</strong>{" "}
                          {tx.toAddress}
                        </p>

                        <p>
                          <strong>Amount:</strong>{" "}
                          {tx.amount} MC
                        </p>
                      </>

                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Explorer;