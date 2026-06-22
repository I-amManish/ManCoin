import { useState } from "react";
import axios from "axios";

function Mine() {

  const currentWallet =
    localStorage.getItem(
      "publicKey"
    ) || "";

  const [minerAddress, setMinerAddress] =
    useState(currentWallet);

  const [message, setMessage] =
    useState("");

  const handleMine = async () => {

    try {

      if (!minerAddress.trim()) {

        setMessage(
          "Miner address is required."
        );

        return;

      }

      const res = await axios.post(
        "http://localhost:5000/mine",
        {
          minerAddress
        }
      );

      setMessage(
        res.data.message
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Mining failed"
      );

    }

  };

  const copyAddress = () => {

    navigator.clipboard.writeText(
      minerAddress
    );

    alert(
      "Address copied!"
    );

  };

  const useCurrentWallet = () => {

    setMinerAddress(
      currentWallet
    );

  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        ⛏️ Mine Block
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-3xl">

        <label className="block mb-2 font-semibold">
          Miner Address
        </label>

        <input
          type="text"
          placeholder="Enter wallet address"
          value={minerAddress}
          onChange={(e) =>
            setMinerAddress(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-700
            outline-none
            mb-4
          "
        />

        <div className="flex gap-3 flex-wrap">

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

          <button
            onClick={useCurrentWallet}
            className="
              bg-purple-600
              hover:bg-purple-700
              px-4
              py-2
              rounded-lg
            "
          >
            🔑 Use My Wallet
          </button>

          <button
            onClick={handleMine}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-2
              rounded-lg
              font-semibold
            "
          >
            ⛏️ Mine Block
          </button>

        </div>

        {message && (

          <div className="mt-6 bg-slate-700 p-4 rounded-lg">

            <p className="text-green-400">
              {message}
            </p>

          </div>

        )}

        <div className="mt-6 bg-slate-700 p-4 rounded-lg">

          <h2 className="font-bold mb-2">
            Current Wallet
          </h2>

          <p className="break-all text-sm">
            {currentWallet || "No wallet generated"}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Mine;