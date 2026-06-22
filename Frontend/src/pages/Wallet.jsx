import { useEffect, useState } from "react";
import axios from "axios";

function Wallet() {

  const [username, setUsername] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [balance, setBalance] =
    useState(0);

  const [transactions, setTransactions] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const fetchWalletData =
    async () => {

      try {

        const walletAddress =
          localStorage.getItem(
            "publicKey"
          );

        const savedUsername =
          localStorage.getItem(
            "username"
          );

        setUsername(
          savedUsername ||
          "Unknown User"
        );

        if (!walletAddress) {

          setMessage(
            "No wallet found. Generate a wallet first."
          );

          return;

        }

        setAddress(
          walletAddress
        );

        const balanceRes =
          await axios.get(
            `http://localhost:5000/balance/${walletAddress}`
          );

        setBalance(
          balanceRes.data.balance
        );

        const txRes =
          await axios.get(
            `http://localhost:5000/transactions/${walletAddress}`
          );

        setTransactions(
          txRes.data.reverse()
        );

        setMessage("");

      } catch (error) {

        console.error(
          error
        );

        setMessage(
          error.response?.data?.message ||
          error.message
        );

      }

    };

  useEffect(() => {

    fetchWalletData();

  }, []);

  const copyAddress = () => {

    navigator.clipboard.writeText(
      address
    );

    alert(
      "Wallet address copied!"
    );

  };

  const shortAddress =
    (addr) => {

      if (!addr)
        return "Mining Reward";

      return `${addr.slice(
        0,
        10
      )}...${addr.slice(-8)}`;

    };

  const receivedAmount =
    transactions
      .filter(
        (tx) =>
          tx.toAddress ===
          address
      )
      .reduce(
        (sum, tx) =>
          sum +
          Number(
            tx.amount
          ),
        0
      );

  const sentAmount =
    transactions
      .filter(
        (tx) =>
          tx.fromAddress ===
          address
      )
      .reduce(
        (sum, tx) =>
          sum +
          Number(
            tx.amount
          ),
        0
      );

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        💰 Wallet
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl">

        {/* Username */}

        <div className="bg-slate-700 p-4 rounded-lg mb-6">

          <h2 className="text-gray-400">
            Username
          </h2>

          <p className="text-2xl font-bold text-purple-400">
            👤 {username}
          </p>

        </div>

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-bold">
            Wallet Address
          </h2>

          <button
            onClick={copyAddress}
            className="
              bg-green-600
              hover:bg-green-700
              px-4
              py-2
              rounded-lg
            "
          >
            📋 Copy
          </button>

        </div>

        <p className="break-all text-sm bg-slate-700 p-3 rounded-lg mt-4">
          {address
            ? shortAddress(
                address
              )
            : "No wallet generated"}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-slate-700 p-4 rounded-lg">

            <p className="text-gray-400">
              Balance
            </p>

            <p className="text-3xl font-bold text-green-400">
              {balance} MC
            </p>

          </div>

          <div className="bg-slate-700 p-4 rounded-lg">

            <p className="text-gray-400">
              Received
            </p>

            <p className="text-3xl font-bold text-green-400">
              {receivedAmount} MC
            </p>

          </div>

          <div className="bg-slate-700 p-4 rounded-lg">

            <p className="text-gray-400">
              Sent
            </p>

            <p className="text-3xl font-bold text-red-400">
              {sentAmount} MC
            </p>

          </div>

        </div>

        <button
          onClick={fetchWalletData}
          className="
            mt-6
            bg-blue-600
            hover:bg-blue-700
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Refresh Wallet
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

        {transactions.length === 0 ? (

          <div className="bg-slate-800 p-4 rounded-xl">
            No transactions found
          </div>

        ) : (

          <div className="space-y-4">

            {transactions.map(
              (tx, index) => {

                const isReceived =
                  tx.toAddress ===
                  address;

                return (

                  <div
                    key={index}
                    className="
                      bg-slate-800
                      p-5
                      rounded-xl
                    "
                  >

                    <div className="flex justify-between items-center">

                      <div>

                        <h3 className="font-bold text-lg">

                          {tx.fromAddress === null
                            ? "⛏️ Mining Reward"
                            : isReceived
                            ? "⬇️ Received"
                            : "⬆️ Sent"}

                        </h3>

                        <p className="text-gray-400">
                          Block #{tx.block}
                        </p>

                      </div>

                      <div
                        className={
                          isReceived
                            ? "text-green-400 text-2xl font-bold"
                            : "text-red-400 text-2xl font-bold"
                        }
                      >
                        {isReceived
                          ? "+"
                          : "-"}
                        {tx.amount} MC
                      </div>

                    </div>

                    <div className="mt-3 text-sm space-y-1">

                      {tx.fromAddress && (

                        <p>
                          From:{" "}
                          {tx.fromAddress === address
                            ? `👤 ${username}`
                            : shortAddress(
                                tx.fromAddress
                              )}
                        </p>

                      )}

                      <p>
                        To:{" "}
                        {tx.toAddress === address
                          ? `👤 ${username}`
                          : shortAddress(
                              tx.toAddress
                            )}
                      </p>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Wallet;