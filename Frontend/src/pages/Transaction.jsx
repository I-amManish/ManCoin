import { useState } from "react";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");
const TRANSACTION_FEE = 1;

function Transaction() {
  const [fromAddress] = useState(localStorage.getItem("publicKey") || "");

  const [privateKey] = useState(localStorage.getItem("privateKey") || "");

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

      // Keep this hash aligned with your current backend Transaction.calculateHash()
      const message = "";
      const timestamp = Date.now();

      const txId = SHA256(
        fromAddress +
          toAddress.trim() +
          numericAmount +
          message +
          TRANSACTION_FEE +
          timestamp,
      ).toString();

      const hashTx = SHA256(
        fromAddress +
          toAddress.trim() +
          numericAmount +
          message +
          TRANSACTION_FEE +
          timestamp +
          txId,
      ).toString();

      const signature = key.sign(hashTx, "base64").toDER("hex");

      const res = await axios.post("http://localhost:5000/transaction", {
        fromAddress,
        toAddress: toAddress.trim(),
        amount: numericAmount,
        message,
        fee: TRANSACTION_FEE,
        timestamp,
        txId,
        signature,
      });

      setIsSuccess(true);
      setMessage(res.data.message);

      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error(error);

      setIsSuccess(false);
      setMessage(error.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const totalCost = (Number(amount) || 0) + TRANSACTION_FEE;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        💸 Create Transaction
      </h1>

      <div className="bg-slate-800 p-4 md:p-6 rounded-xl max-w-2xl w-full">
        <div className="bg-slate-700 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-400">Sender Wallet</p>

          <p className="break-all text-sm md:text-base">
            {fromAddress
              ? `${fromAddress.slice(0, 20)}...${fromAddress.slice(-10)}`
              : "No Wallet Found"}
          </p>
        </div>

        <input
          type="text"
          placeholder="Receiver Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 disabled:opacity-50"
        />

        <input
          type="number"
          min="0"
          step="any"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 disabled:opacity-50"
        />

        <div className="bg-slate-700 p-4 rounded-lg mb-4">
          <h2 className="font-bold mb-3">Transaction Preview</h2>

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
              <strong className="text-yellow-400"> {totalCost} MC</strong>
            </p>

            <p className="break-all text-sm md:text-base">
              📍 To:
              {toAddress
                ? ` ${toAddress.slice(0, 20)}...`
                : " No receiver selected"}
            </p>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 p-3 rounded-lg mb-4 text-sm">
          💰 Network Fee:
          <strong> {TRANSACTION_FEE} MC</strong>
          <br />
          This fee is rewarded to the miner.
        </div>

        <button
          disabled={loading}
          onClick={handleTransaction}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200 shadow-lg px-6 py-3 rounded-lg font-semibold w-full md:w-auto"
        >
          {loading ? "Sending..." : "Send Signed Transaction"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg ${
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
