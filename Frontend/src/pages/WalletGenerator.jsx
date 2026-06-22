import { useState, useEffect } from "react";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function WalletGenerator() {
  const [username, setUsername] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const savedUsername =
      localStorage.getItem("username");

    const savedPrivateKey =
      localStorage.getItem("privateKey");

    const savedPublicKey =
      localStorage.getItem("publicKey");

    setUsername(savedUsername || "");

    if (
      savedPrivateKey &&
      savedPublicKey
    ) {
      setPrivateKey(savedPrivateKey);
      setPublicKey(savedPublicKey);
    }
  }, []);

  const generateWallet = () => {
    if (!username.trim()) {
      alert(
        "Please enter a username first."
      );
      return;
    }

    const confirmGenerate =
      window.confirm(
        "Generating a new wallet will replace your current wallet. Continue?"
      );

    if (!confirmGenerate) return;

    const keyPair =
      ec.genKeyPair();

    const newPrivateKey =
      keyPair.getPrivate("hex");

    const newPublicKey =
      keyPair.getPublic("hex");

    setPrivateKey(newPrivateKey);
    setPublicKey(newPublicKey);

    localStorage.setItem(
      "username",
      username
    );

    localStorage.setItem(
      "privateKey",
      newPrivateKey
    );

    localStorage.setItem(
      "publicKey",
      newPublicKey
    );

    alert(
      "New wallet generated successfully!"
    );
  };

  const updateUsername = () => {
    if (!username.trim()) {
      alert(
        "Please enter a username."
      );
      return;
    }

    localStorage.setItem(
      "username",
      username
    );

    alert(
      "Username updated successfully!"
    );
  };

  const clearWallet = () => {
    const confirmDelete =
      window.confirm(
        "Delete wallet and username?"
      );

    if (!confirmDelete) return;

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "privateKey"
    );

    localStorage.removeItem(
      "publicKey"
    );

    setUsername("");
    setPrivateKey("");
    setPublicKey("");

    alert("Wallet cleared.");
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        🔐 Wallet Generator
      </h1>

      <div className="max-w-3xl">
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-slate-800
            mb-4
          "
        />

        <div className="flex flex-wrap gap-4">
          <button
            onClick={
              generateWallet
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
            Generate Wallet
          </button>

          <button
            onClick={
              updateUsername
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            Update Username
          </button>

          <button
            onClick={
              clearWallet
            }
            className="
              bg-red-600
              hover:bg-red-700
              px-6
              py-3
              rounded-lg
              font-semibold
            "
          >
            Clear Wallet
          </button>
        </div>
      </div>

      {privateKey && (
        <div className="mt-8 space-y-6">

          <div className="bg-slate-800 p-4 rounded-xl">
            <h2 className="font-bold mb-2 text-purple-400">
              Username
            </h2>

            <p>
              👤 {username}
            </p>
          </div>

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