import { useState } from "react";
import axios from "axios";

function Mine() {
  const currentWallet =
    localStorage.getItem("publicKey") || "";

  const [minerAddress, setMinerAddress] =
    useState(currentWallet);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  const handleMine = async () => {
    if (!minerAddress.trim()) {
      setIsSuccess(false);
      setMessage("Miner address is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/mine",
        {
          minerAddress: minerAddress.trim(),
        }
      );

      setIsSuccess(true);
      setMessage(res.data.message);

      // Clear address after successful mining
      setMinerAddress("");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setIsSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Mining failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!minerAddress.trim()) {
      setIsSuccess(false);
      setMessage("Enter a miner address to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        minerAddress
      );

      setIsSuccess(true);
      setMessage("Address copied!");
    } catch {
      setIsSuccess(false);
      setMessage("Could not copy address.");
    }
  };

  const useCurrentWallet = () => {
    setMinerAddress(currentWallet);
    setMessage("");
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        ⛏️ Mine Block
      </h1>

      <div className="bg-slate-800 p-4 md:p-6 rounded-xl max-w-3xl">
        <label className="block mb-2 font-semibold">
          Miner Address
        </label>

        <input
          type="text"
          placeholder="Enter wallet address"
          value={minerAddress}
          onChange={(e) =>
            setMinerAddress(e.target.value)
          }
          disabled={loading}
          className="w-full p-3 rounded-lg bg-slate-700 outline-none mb-4 disabled:opacity-50"
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={copyAddress}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg active:scale-95 transition"
          >
            📋 Copy
          </button>

          <button
            onClick={useCurrentWallet}
            disabled={loading || !currentWallet}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg active:scale-95 transition"
          >
            🔑 Use My Wallet
          </button>

          <button
            onClick={handleMine}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold active:scale-95 transition"
          >
            {loading
              ? "Mining..."
              : "⛏️ Mine Block"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isSuccess
                ? "bg-green-900/40 border border-green-500"
                : "bg-red-900/40 border border-red-500"
            }`}
          >
            <p
              className={
                isSuccess
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {message}
            </p>
          </div>
        )}

        <div className="mt-6 bg-slate-700 p-4 rounded-lg">
          <h2 className="font-bold mb-2">
            Current Wallet
          </h2>

          <p className="break-all text-sm">
            {currentWallet ||
              "No wallet generated"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mine;