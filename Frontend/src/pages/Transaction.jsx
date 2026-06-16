import { useState } from "react";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function Transaction() {

  const [fromAddress, setFromAddress] =
    useState("");

  const [toAddress, setToAddress] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [privateKey, setPrivateKey] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleTransaction = async () => {

    if (
      !fromAddress ||
      !toAddress ||
      !amount ||
      !privateKey
    ) {
      setMessage(
        "Please fill all fields"
      );
      return;
    }

    try {

      const key =
        ec.keyFromPrivate(
          privateKey
        );

      const publicKey =
        key.getPublic("hex");

      if (
        publicKey !== fromAddress
      ) {
        setMessage(
          "Private key does not match From Address"
        );
        return;
      }

      const hashTx =
        SHA256(
          fromAddress +
          toAddress +
          Number(amount)
        ).toString();

      const signature =
        key
          .sign(hashTx, "base64")
          .toDER("hex");

      const res =
        await axios.post(
          "http://localhost:5000/transaction",
          {
            fromAddress,
            toAddress,
            amount:
              Number(amount),
            signature
          }
        );

      setMessage(
        res.data.message
      );

      setFromAddress("");
      setToAddress("");
      setAmount("");
      setPrivateKey("");

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
            setFromAddress(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <input
          type="text"
          placeholder="To Address"
          value={toAddress}
          onChange={(e) =>
            setToAddress(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <input
          type="text"
          placeholder="Private Key"
          value={privateKey}
          onChange={(e) =>
            setPrivateKey(
              e.target.value
            )
          }
          className="w-full p-3 rounded-lg bg-slate-700 mb-4"
        />

        <button
          onClick={
            handleTransaction
          }
          className="
            bg-green-600
            hover:bg-green-700
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Send Signed Transaction
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