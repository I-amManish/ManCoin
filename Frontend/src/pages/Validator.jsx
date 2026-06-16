import { useState } from "react";
import axios from "axios";

function Validator() {

  const [result, setResult] =
    useState(null);

  const validateChain =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/validate"
          );

        setResult(res.data);

      } catch (error) {

        console.log(error);

      }

    };

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        🔐 Blockchain Validator
      </h1>

      <button
        onClick={validateChain}
        className="
          bg-green-600
          hover:bg-green-700
          px-6
          py-3
          rounded-lg
          font-semibold
        "
      >
        Validate Blockchain
      </button>

      {result && (

        <div
          className={`
            mt-6
            p-6
            rounded-xl
            ${
              result.valid
                ? "bg-green-700"
                : "bg-red-700"
            }
          `}
        >

          <h2 className="text-2xl font-bold">
            {result.valid
              ? "✅ Blockchain Valid"
              : "❌ Blockchain Invalid"}
          </h2>

          <p className="mt-2">
            {result.message}
          </p>

        </div>

      )}

    </div>
  );
}

export default Validator;