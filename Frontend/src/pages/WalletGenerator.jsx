import { useState, useEffect } from "react";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function WalletGenerator() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  // Load saved wallet on page load
  useEffect(() => {
    const savedPrivateKey = localStorage.getItem("privateKey");
    const savedPublicKey = localStorage.getItem("publicKey");

    if (savedPrivateKey && savedPublicKey) {
      setPrivateKey(savedPrivateKey);
      setPublicKey(savedPublicKey);
    }
  }, []);

  const generateWallet = () => {
    const keyPair = ec.genKeyPair();

    const newPrivateKey = keyPair.getPrivate("hex");
    const newPublicKey = keyPair.getPublic("hex");

    setPrivateKey(newPrivateKey);
    setPublicKey(newPublicKey);

    // Save to localStorage
    localStorage.setItem("privateKey", newPrivateKey);
    localStorage.setItem("publicKey", newPublicKey);
  };

  const clearWallet = () => {
    localStorage.removeItem("privateKey");
    localStorage.removeItem("publicKey");

    setPrivateKey("");
    setPublicKey("");
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        🔐 Wallet Generator
      </h1>

      <div className="flex gap-4">
        <button
          onClick={generateWallet}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
        >
          Generate Wallet
        </button>

        <button
          onClick={clearWallet}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
        >
          Clear Wallet
        </button>
      </div>

      {privateKey && (
        <div className="mt-8 space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="font-bold mb-2 text-green-400">
              Private Key
            </h2>

            <p className="break-all text-sm">
              {privateKey}
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="font-bold mb-2 text-blue-400">
              Public Key
            </h2>

            <p className="break-all text-sm">
              {publicKey}
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="font-bold mb-2 text-yellow-400">
              Wallet Address
            </h2>

            <p className="break-all text-sm">
              {publicKey}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletGenerator;