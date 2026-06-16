import { useState } from "react";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

function WalletGenerator() {

  const [privateKey, setPrivateKey] =
    useState("");

  const [publicKey, setPublicKey] =
    useState("");

  const generateWallet = () => {

    const keyPair =
      ec.genKeyPair();

    const privateKey =
      keyPair.getPrivate("hex");

    const publicKey =
      keyPair.getPublic("hex");

    setPrivateKey(privateKey);
    setPublicKey(publicKey);

  };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        🔐 Wallet Generator
      </h1>

      <button
        onClick={generateWallet}
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

      {privateKey && (

        <div className="mt-8 space-y-6">

          <div className="bg-slate-800 p-4 rounded-xl">

            <h2 className="font-bold mb-2">
              Private Key
            </h2>

            <p className="break-all text-sm">
              {privateKey}
            </p>

          </div>

          <div className="bg-slate-800 p-4 rounded-xl">

            <h2 className="font-bold mb-2">
              Public Key
            </h2>

            <p className="break-all text-sm">
              {publicKey}
            </p>

          </div>

          <div className="bg-slate-800 p-4 rounded-xl">

            <h2 className="font-bold mb-2">
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