import { useState, useEffect } from "react";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function WalletGenerator() {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPrivateKey = localStorage.getItem("privateKey");
    const savedPublicKey = localStorage.getItem("publicKey");

    setUsername(savedUsername || "");

    if (savedPrivateKey && savedPublicKey) {
      setPrivateKey(savedPrivateKey);
      setPublicKey(savedPublicKey);
    }
  }, []);

  const showMessage = (text, success = true) => {
    setMessage(text);
    setIsSuccess(success);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const generateWallet = () => {
    if (!username.trim()) {
      showMessage("Please enter a username first.", false);
      return;
    }

    const confirmGenerate = window.confirm(
      "Generating a new wallet will replace your current wallet. Continue?"
    );

    if (!confirmGenerate) return;

    const keyPair = ec.genKeyPair();

    const newPrivateKey = keyPair.getPrivate("hex");
    const newPublicKey = keyPair.getPublic("hex");

    setPrivateKey(newPrivateKey);
    setPublicKey(newPublicKey);

    localStorage.setItem("username", username.trim());
    localStorage.setItem("privateKey", newPrivateKey);
    localStorage.setItem("publicKey", newPublicKey);

    showMessage("New wallet generated successfully!");
  };

  const updateUsername = () => {
    if (!username.trim()) {
      showMessage("Please enter a username.", false);
      return;
    }

    localStorage.setItem("username", username.trim());

    showMessage("Username updated successfully!");
  };

  const clearWallet = () => {
    const confirmDelete = window.confirm(
      "Delete wallet and username? This cannot be undone."
    );

    if (!confirmDelete) return;

    localStorage.removeItem("username");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("publicKey");

    setUsername("");
    setPrivateKey("");
    setPublicKey("");

    showMessage("Wallet cleared.");
  };

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      showMessage(`${label} copied!`);
    } catch {
      showMessage(`Could not copy ${label}.`, false);
    }
  };

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        🔐 Wallet Generator
      </h1>

      <div className="max-w-3xl rounded-xl bg-white p-4 shadow-md dark:bg-slate-800 md:p-6">
        <label className="mb-2 block font-semibold">
          Username
        </label>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            dark:border-slate-600
            dark:bg-slate-700
            dark:text-white
          "
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateWallet}
            className="
              rounded-lg
              bg-green-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-green-700
              active:scale-95
            "
          >
            Generate Wallet
          </button>

          <button
            onClick={updateUsername}
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              active:scale-95
            "
          >
            Update Username
          </button>

          <button
            onClick={clearWallet}
            className="
              rounded-lg
              bg-red-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              active:scale-95
            "
          >
            Clear Wallet
          </button>
        </div>

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

      {privateKey && (
        <div className="mt-8 max-w-3xl space-y-5">
          <WalletInfoCard
            title="Username"
            value={`👤 ${username}`}
            titleColor="text-purple-600 dark:text-purple-400"
          />

          <WalletInfoCard
            title="Private Key"
            value={privateKey}
            titleColor="text-green-600 dark:text-green-400"
            copy={() => copyToClipboard(privateKey, "Private key")}
          />

          <WalletInfoCard
            title="Public Key"
            value={publicKey}
            titleColor="text-blue-600 dark:text-blue-400"
            copy={() => copyToClipboard(publicKey, "Public key")}
          />

          <WalletInfoCard
            title="Wallet Address"
            value={publicKey}
            titleColor="text-yellow-600 dark:text-yellow-400"
            copy={() => copyToClipboard(publicKey, "Wallet address")}
          />

          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            <strong>⚠️ Important:</strong> Your private key is used to sign
            transactions. Do not share it with anyone.
          </div>
        </div>
      )}
    </div>
  );
}

function WalletInfoCard({ title, value, titleColor, copy }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-800">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className={`font-bold ${titleColor}`}>
          {title}
        </h2>

        {copy && (
          <button
            onClick={copy}
            className="
              rounded-lg
              bg-slate-200
              px-3
              py-1
              text-sm
              text-slate-800
              transition
              hover:bg-slate-300
              dark:bg-slate-700
              dark:text-white
              dark:hover:bg-slate-600
            "
          >
            📋 Copy
          </button>
        )}
      </div>

      <p className="break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default WalletGenerator;