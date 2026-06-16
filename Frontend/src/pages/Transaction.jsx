import { useState } from "react";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function Transaction() {

  const [fromAddress] = useState(
    localStorage.getItem("publicKey") || ""
  );

  const [privateKey] = useState(
    localStorage.getItem("privateKey") || ""
  );

  const [toAddress, setToAddress] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const handleTransaction = async () => {

    if (
      !fromAddress ||
      !privateKey
    ) {
      setIsSuccess(false);

      setMessage(
        "Please generate a wallet first."
      );

      return;
    }

    if (
      !toAddress ||
      !amount
    ) {
      setIsSuccess(false);

      setMessage(
        "Please enter receiver address and amount."
      );

      return;
    }

    if (
      fromAddress.trim() ===
      toAddress.trim()
    ) {
      setIsSuccess(false);

      setMessage(
        "You cannot send coins to yourself."
      );

      return;
    }

    if (
      Number(amount) <= 0
    ) {
      setIsSuccess(false);

      setMessage(
        "Amount must be greater than 0."
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
        publicKey.trim() !==
        fromAddress.trim()
      ) {
        setIsSuccess(false);

        setMessage(
          "Private key does not match wallet address."
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
            signature,
          }
        );

      setIsSuccess(true);

      setMessage(
        res.data.message
      );

      setToAddress("");
      setAmount("");

    } catch (error) {

      console.error(error);

      setIsSuccess(false);

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

      <div className="bg-slate-800 p-6 rounded-xl max-w-2xl">

        {/* Sender Wallet */}

        <div className="bg-slate-700 p-3 rounded-lg mb-4">

          <p className="text-sm text-gray-400">
            Sender Wallet
          </p>

          <p className="break-all">
            {fromAddress
              ? `${fromAddress.slice(
                  0,
                  20
                )}...${fromAddress.slice(
                  -10
                )}`
              : "No Wallet Found"}
          </p>

        </div>

        {/* Receiver Address */}

        <input
          type="text"
          placeholder="Receiver Address"
          value={toAddress}
          onChange={(e) =>
            setToAddress(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-700
            mb-4
          "
        />

        {/* Amount */}

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-700
            mb-4
          "
        />

        {/* Transaction Preview */}

        <div className="bg-slate-700 p-4 rounded-lg mb-4">

          <h2 className="font-bold mb-2">
            Transaction Preview
          </h2>

          <p>
            Sending:
            <strong>
              {" "}
              {amount || 0} MC
            </strong>
          </p>

          <p className="break-all">
            To:
            {toAddress
              ? ` ${toAddress.slice(
                  0,
                  20
                )}...`
              : " No receiver selected"}
          </p>

        </div>

        {/* Button */}

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
            transition
          "
        >
          Send Signed Transaction
        </button>

        {/* Message */}

        {message && (

          <div
            className={`
              mt-4
              p-3
              rounded-lg
              ${
                isSuccess
                  ? "bg-green-600"
                  : "bg-red-600"
              }
            `}
          >
            {message}
          </div>

        )}

      </div>

    </div>
  );
}

export default Transaction;