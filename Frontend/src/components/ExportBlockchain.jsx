import { useState } from "react";
import axios from "axios";

function ExportBlockchain() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const exportBlockchain = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        "http://127.0.0.1:5000/blocks"
      );

      const blockchainData = {
        project: "ManCoin Public Blockchain",
        exportedAt: new Date().toISOString(),
        data: res.data,
      };

      const jsonData = JSON.stringify(
        blockchainData,
        null,
        2
      );

      const blob = new Blob(
        [jsonData],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `mancoin-blockchain-${Date.now()}.json`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setMessage("Blockchain data exported successfully.");
    } catch (error) {
      console.error(error);

      setMessage("Could not export blockchain data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-2">
        📤 Export Blockchain
      </h2>

      <p className="text-slate-400 text-sm mb-4">
        Download the current blockchain, blocks, transactions, fees, and mining rewards as a JSON file.
      </p>

      <button
        onClick={exportBlockchain}
        disabled={loading}
        className="
          bg-cyan-600
          hover:bg-cyan-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          active:scale-95
          transition-all
          px-5
          py-3
          rounded-lg
          font-semibold
          w-full
          sm:w-auto
        "
      >
        {loading
          ? "Preparing Export..."
          : "⬇️ Export Blockchain JSON"}
      </button>

      {message && (
        <p className="mt-4 text-sm text-green-400">
          {message}
        </p>
      )}
    </div>
  );
}

export default ExportBlockchain;