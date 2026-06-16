import { useState } from "react";
import axios from "axios";

function Transaction() {

  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTransaction = async () => {

    if (
      !fromAddress ||
      !toAddress ||
      !amount
    ) {
      setMessage(
        "Please fill all fields"
      );
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/transaction",
        {
          fromAddress,
          toAddress,
          amount: Number(amount)
        }
      );

      setMessage(
        res.data.message
      );

      setFromAddress("");
      setToAddress("");
      setAmount("");

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Transaction failed"
      );

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        💸 Create Transaction
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl max-w-xl">

        <input
          type="text"
          placeholder="From Address"
          value={fromAddress}
          onChange={(e) =>
            setFromAddress(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <input
          type="text"
          placeholder="To Address"
          value={toAddress}
          onChange={(e) =>
            setToAddress(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <button
          onClick={handleTransaction}
          className="
            bg-green-600
            hover:bg-green-700
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Send Transaction
        </button>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Transaction;