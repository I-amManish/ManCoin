import { useEffect, useState } from "react";
import axios from "axios";
import ExportBlockchain from "../components/ExportBlockchain";

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

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/blocks"
      );

      const blockchain = res.data;

      const blocks = blockchain.chain?.length || 0;

      const pending =
        blockchain.pendingTransactions?.length || 0;

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
    }
  };

  useEffect(() => {
    fetchData();

    const refreshDashboard = () => {
      fetchData();
    };

    socket.on("receiveTransaction", refreshDashboard);
    socket.on("receiveBlock", refreshDashboard);

    return () => {
      socket.off("receiveTransaction", refreshDashboard);
      socket.off("receiveBlock", refreshDashboard);
    };
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        🚀 ManCoin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-slate-800 p-5 md:p-6 rounded-xl">
          <h2 className="text-lg md:text-xl">Blocks</h2>

          <p className="text-3xl font-bold mt-2">
            {stats.blocks}
          </p>
        </div>

        <div className="bg-slate-800 p-5 md:p-6 rounded-xl">
          <h2 className="text-lg md:text-xl">
            Transactions
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.transactions}
          </p>
        </div>

        <div className="bg-slate-800 p-5 md:p-6 rounded-xl">
          <h2 className="text-lg md:text-xl">Pending</h2>

          <p className="text-3xl font-bold mt-2">
            {stats.pending}
          </p>
        </div>

        <div className="bg-slate-800 p-5 md:p-6 rounded-xl">
          <h2 className="text-lg md:text-xl">Mining Reward</h2>

          <p className="text-3xl font-bold mt-2">
            {stats.reward} MC
          </p>
        </div>
      </div>

      <div className="bg-slate-800 p-4 md:p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Transactions Per Block
        </h2>

        <div className="h-[280px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
              />

              <YAxis
                tick={{ fill: "#cbd5e1", fontSize: 12 }}
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
      </div>

      <div className="mt-8">
        <ExportBlockchain />
      </div>
    </div>
  );
}

export default Dashboard;