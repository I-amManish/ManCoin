import { useState } from "react";
import axios from "axios";

function Mine() {

  const [minerAddress, setMinerAddress] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleMine = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/mine",
        {
          minerAddress
        }
      );

      setMessage(
        res.data.message
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Mining failed"
      );

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        ⛏️ Mine Block
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-xl">

        <label className="block mb-2">
          Miner Address
        </label>

        <input
          type="text"
          placeholder="Enter miner address"
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

        <button
          onClick={handleMine}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Mine Block
        </button>

        {message && (
          <p className="mt-4 text-green-400">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Mine;