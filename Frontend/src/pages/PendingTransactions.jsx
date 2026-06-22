import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

function PendingTransactions() {

  const [transactions, setTransactions] =
    useState([]);

  const fetchPending =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/pending"
          );

        setTransactions(
          res.data.transactions
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchPending();

    socket.on(
      "receiveTransaction",
      fetchPending
    );

    socket.on(
      "receiveBlock",
      fetchPending
    );

    return () => {

      socket.off(
        "receiveTransaction"
      );

      socket.off(
        "receiveBlock"
      );

    };

  }, []);

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        📋 Pending Transactions
      </h1>

      <div className="bg-slate-800 p-4 rounded-xl mb-6">

        <h2 className="text-xl">
          Total Pending:
          {" "}
          {transactions.length}
        </h2>

      </div>

      {transactions.length === 0 ? (

        <div className="bg-slate-800 p-6 rounded-xl">
          No Pending Transactions
        </div>

      ) : (

        <div className="space-y-4">

          {transactions.map(
            (tx, index) => (

              <div
                key={index}
                className="
                  bg-slate-800
                  p-5
                  rounded-xl
                "
              >

                {tx.fromAddress === null ? (

                  <p className="text-green-400 font-bold">
                    ⛏️ Mining Reward
                    {" "}
                    {tx.amount}
                    {" "}
                    MC
                  </p>

                ) : (

                  <>
                    <p>
                      <strong>From:</strong>
                      {" "}
                      {tx.fromAddress.slice(0, 20)}
                      ...
                    </p>

                    <p>
                      <strong>To:</strong>
                      {" "}
                      {tx.toAddress.slice(0, 20)}
                      ...
                    </p>

                    <p>
                      <strong>Amount:</strong>
                      {" "}
                      {tx.amount}
                      {" "}
                      MC
                    </p>
                  </>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default PendingTransactions;