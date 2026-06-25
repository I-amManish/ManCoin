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
  const [stats, setStats] = useState({
    blocks: 0,
    transactions: 0,
    pending: 0,
    reward: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get("http://127.0.0.1:5000/blocks");

      const blockchain = res.data;

      const blocks = blockchain.chain?.length || 0;
      const pending = blockchain.pendingTransactions?.length || 0;
      const reward = blockchain.miningReward || 0;

      let transactions = 0;
      const chart = [];

      blockchain.chain?.forEach((block, index) => {
        const txCount = Array.isArray(block.data)
          ? block.data.length
          : 0;

        transactions += txCount;

        chart.push({
          name: `Block ${index}`,
          transactions: txCount,
        });
      });

      setStats({
        blocks,
        transactions,
        pending,
        reward,
      });

      setChartData(chart);
    } catch (error) {
      console.error("Dashboard data error:", error);

      setMessage(
        error.response?.data?.message ||
          "Could not load blockchain dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("receiveTransaction", fetchData);
    socket.on("receiveBlock", fetchData);

    return () => {
      socket.off("receiveTransaction", fetchData);
      socket.off("receiveBlock", fetchData);
    };
  }, []);

  const dashboardCards = [
    {
      title: "Blocks",
      value: stats.blocks,
      icon: "📦",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Transactions",
      value: stats.transactions,
      icon: "💸",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏳",
      valueColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Mining Reward",
      value: `${stats.reward} MC`,
      icon: "⛏️",
      valueColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="p-4 text-slate-900 dark:text-white md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h1 className="text-2xl font-bold md:text-4xl">
            🚀 ManCoin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Live blockchain statistics and transaction activity.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
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
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-red-600 p-3 text-white">
          {message}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 md:mb-10">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className="
              rounded-xl
              bg-white
              p-5
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-lg
              dark:bg-slate-800
              md:p-6
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-slate-600 dark:text-slate-300 md:text-xl">
                {card.title}
              </h2>

              <span className="text-2xl">{card.icon}</span>
            </div>

            <p className={`mt-3 text-3xl font-bold ${card.valueColor}`}>
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-800 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Transactions Per Block
          </h2>

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Live Chart
          </span>
        </div>

        <div className="h-70 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#60a5fa",
                }}
                cursor={{
                  fill: "rgba(59, 130, 246, 0.15)",
                }}
              />

              <Bar
                dataKey="transactions"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!loading && chartData.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No blocks are available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;