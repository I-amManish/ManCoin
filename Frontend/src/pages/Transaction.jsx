import { useState } from "react";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");
const TRANSACTION_FEE = 1;

function Transaction() {
  const [fromAddress] = useState(
    localStorage.getItem("publicKey") || ""
  );

  const [privateKey] = useState(
    localStorage.getItem("privateKey") || ""
  );

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTransaction = async () => {
    if (!fromAddress || !privateKey) {
      setIsSuccess(false);
      setMessage("Please generate a wallet first.");
      return;
    }

    if (!toAddress.trim() || !amount) {
      setIsSuccess(false);
      setMessage("Please enter receiver address and amount.");
      return;
    }

    if (fromAddress.trim() === toAddress.trim()) {
      setIsSuccess(false);
      setMessage("You cannot send coins to yourself.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setIsSuccess(false);
      setMessage("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const key = ec.keyFromPrivate(privateKey);
      const publicKey = key.getPublic("hex");

      if (publicKey.trim() !== fromAddress.trim()) {
        setIsSuccess(false);
        setMessage("Private key does not match wallet address.");
        return;
      }

      // Must match Transaction.js exactly
      const transactionMessage = "";
      const timestamp = Date.now();

      const txId = SHA256(
        fromAddress +
          toAddress.trim() +
          numericAmount +
          transactionMessage +
          TRANSACTION_FEE +
          timestamp
      ).toString();

      const hashTx = SHA256(
        fromAddress +
          toAddress.trim() +
          numericAmount +
          transactionMessage +
          TRANSACTION_FEE +
          timestamp +
          txId
      ).toString();

      const signature = key
        .sign(hashTx, "base64")
        .toDER("hex");

      const res = await axios.post(
        "http://127.0.0.1:5000/transaction",
        {
          fromAddress,
          toAddress: toAddress.trim(),
          amount: numericAmount,
          message: transactionMessage,
          fee: TRANSACTION_FEE,
          timestamp,
          txId,
          signature,
        }
      );

      setIsSuccess(true);
      setMessage(res.data.message);

      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error(error);

      setIsSuccess(false);
      setMessage(
        error.response?.data?.message || "Transaction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalCost = (Number(amount) || 0) + TRANSACTION_FEE;

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        💸 Create Transaction
      </h1>

      <div
        className="
          w-full
          max-w-2xl
          rounded-xl
          bg-white
          p-4
          shadow-md
          dark:bg-slate-800
          md:p-6
        "
      >
        {/* Sender wallet */}
        <div className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sender Wallet
          </p>

          <p className="break-all text-sm text-slate-900 dark:text-white md:text-base">
            {fromAddress
              ? `${fromAddress.slice(0, 20)}...${fromAddress.slice(-10)}`
              : "No Wallet Found"}
          </p>
        </div>

        {/* Receiver address */}
        <input
          type="text"
          placeholder="Receiver Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          disabled={loading}
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
            disabled:opacity-50
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
          "
        />

        {/* Amount */}
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
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
            disabled:opacity-50
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
          "
        />

        {/* Transaction preview */}
        <div className="mb-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-700">
          <h2 className="mb-3 font-bold">
            Transaction Preview
          </h2>

          <div className="space-y-2">
            <p>
              💸 Amount:
              <strong> {amount || 0} MC</strong>
            </p>

            <p>
              💰 Fee:
              <strong> {TRANSACTION_FEE} MC</strong>
            </p>

            <p>
              📊 Total Cost:
              <strong className="text-yellow-600 dark:text-yellow-400">
                {" "}
                {totalCost} MC
              </strong>
            </p>

            <p className="break-all text-sm md:text-base">
              📍 To:
              {toAddress
                ? ` ${toAddress.slice(0, 20)}...`
                : " No receiver selected"}
            </p>
          </div>
        </div>

        {/* Fee information */}
        <div
          className="
            mb-4
            rounded-lg
            border
            border-yellow-400
            bg-yellow-50
            p-3
            text-sm
            text-yellow-900
            dark:bg-yellow-900/20
            dark:text-yellow-100
          "
        >
          💰 Network Fee:
          <strong> {TRANSACTION_FEE} MC</strong>
          <br />
          This fee is rewarded to the miner.
        </div>

        <button
          disabled={loading}
          onClick={handleTransaction}
          className="
            w-full
            rounded-lg
            bg-green-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-green-700
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
            md:w-auto
          "
        >
          {loading ? "Sending..." : "Send Signed Transaction"}
        </button>

        {message && (
          <div
            className={`mt-4 rounded-lg p-3 text-white ${
              isSuccess ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaction;