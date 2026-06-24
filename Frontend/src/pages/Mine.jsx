import { useState } from "react";
import axios from "axios";

function Mine() {
  const currentWallet = localStorage.getItem("publicKey") || "";

  const [minerAddress, setMinerAddress] = useState(currentWallet);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMine = async () => {
    if (!minerAddress.trim()) {
      setMessage("Miner address is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/mine", {
        minerAddress: minerAddress.trim(),
      });

      setMessage(res.data.message);

      // Remove address after successful mining
      setMinerAddress("");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message || "Mining failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!minerAddress.trim()) {
      setMessage("No miner address available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(minerAddress);
      setMessage("Miner address copied!");
    } catch {
      setMessage("Could not copy the address.");
    }
  };

  const useCurrentWallet = () => {
    if (!currentWallet) {
      setMessage("No wallet generated. Create a wallet first.");
      return;
    }

    setMinerAddress(currentWallet);
    setMessage("");
  };

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        ⛏️ Mine Block
      </h1>

      <div
        className="
          max-w-3xl
          rounded-xl
          bg-white
          p-4
          shadow-md
          dark:bg-slate-800
          md:p-6
        "
      >
        <label className="mb-2 block font-semibold">
          Miner Address
        </label>

        <input
          type="text"
          placeholder="Enter wallet address"
          value={minerAddress}
          disabled={loading}
          onChange={(e) => setMinerAddress(e.target.value)}
          className="
            mb-4
            w-full
            rounded-lg
            border
            border-slate-300
            bg-slate-100
            p-3
            text-slate-900
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
          "
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyAddress}
            disabled={loading}
            className="
              rounded-lg
              bg-green-600
              px-4
              py-2
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            📋 Copy
          </button>

          <button
            onClick={useCurrentWallet}
            disabled={loading}
            className="
              rounded-lg
              bg-purple-600
              px-4
              py-2
              text-white
              transition
              hover:bg-purple-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            🔑 Use My Wallet
          </button>

          <button
            onClick={handleMine}
            disabled={loading}
            className="
              rounded-lg
              bg-blue-600
              px-6
              py-2
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "⛏️ Mining..." : "⛏️ Mine Block"}
          </button>
        </div>

        {message && (
          <div
            className="
              mt-6
              rounded-lg
              border
              border-blue-300
              bg-blue-50
              p-4
              text-blue-800
              dark:border-slate-600
              dark:bg-slate-700
              dark:text-green-400
            "
          >
            {message}
          </div>
        )}

        <div
          className="
            mt-6
            rounded-lg
            bg-slate-100
            p-4
            dark:bg-slate-700
          "
        >
          <h2 className="mb-2 font-bold">
            Current Wallet
          </h2>

          <p className="break-all text-sm text-slate-700 dark:text-slate-300">
            {currentWallet || "No wallet generated"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mine;