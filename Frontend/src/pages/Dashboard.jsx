import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import socket from "../services/socket";

function Dashboard() {

  const [stats, setStats] =
    useState({
      blocks: 0,
      transactions: 0,
      pending: 0,
      reward: 0,
    });

  const [chartData, setChartData] =
    useState([]);

  const fetchData =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/blocks"
          );

        const blockchain =
          res.data;

        const blocks =
          blockchain.chain.length;

        const pending =
          blockchain.pendingTransactions.length;

        const reward =
          blockchain.miningReward;

        let transactions = 0;

        const chart = [];

        blockchain.chain.forEach(
          (block, index) => {

            let txCount = 0;

            if (
              Array.isArray(
                block.data
              )
            ) {

              txCount =
                block.data.length;

              transactions +=
                txCount;

            }

            chart.push({
              name:
                "Block " + index,
              transactions:
                txCount,
            });

          }
        );

        setStats({
          blocks,
          transactions,
          pending,
          reward,
        });

        setChartData(chart);

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchData();

    socket.on(
      "receiveTransaction",
      () => {

        fetchData();

      }
    );

    socket.on(
      "receiveBlock",
      () => {

        fetchData();

      }
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
        🚀 ManCoin Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl">
            Blocks
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.blocks}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl">
            Transactions
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.transactions}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl">
            Pending
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.pending}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-xl">

          <h2 className="text-xl">
            Reward
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.reward}
          </p>

        </div>

      </div>

      <div className="bg-slate-800 p-4 rounded-xl">

        <h2 className="text-xl font-bold mb-4">
          Transactions Per Block
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={chartData}
          >

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="transactions"
              fill="#3B82F6"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Dashboard;