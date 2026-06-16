import { useState } from "react";
import axios from "axios";

function Wallet() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);

  const checkBalance = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/balance/${address}`
      );

      setBalance(
        res.data.balance
      );

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        💰 Wallet Balance
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-xl">

        <input
          type="text"
          placeholder="Wallet Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-700
            mb-4
          "
        />

        <button
          onClick={checkBalance}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-6
            py-3
            rounded-lg
          "
        >
          Check Balance
        </button>

        {balance !== null && (

          <div className="mt-6">

            <h2 className="text-2xl font-bold">
              {balance} MC
            </h2>

          </div>

        )}

      </div>

    </div>
  );
}

export default Wallet;