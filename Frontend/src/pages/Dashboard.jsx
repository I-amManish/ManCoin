import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Block 1",
    transactions: 2,
  },
  {
    name: "Block 2",
    transactions: 2,
  },
  {
    name: "Block 3",
    transactions: 1,
  },
];

function Dashboard() {

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
            4
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Transactions
          </h2>

          <p className="text-3xl font-bold mt-2">
            5
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Pending
          </h2>

          <p className="text-3xl font-bold mt-2">
            1
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl">
            Reward
          </h2>

          <p className="text-3xl font-bold mt-2">
            100
          </p>
        </div>

      </div>

      <div className="bg-slate-800 p-4 rounded-xl">

        <h2 className="text-xl font-bold mb-4">
          Transactions Per Block
        </h2>

        <ResponsiveContainer
          width="90%"
          height={250}
        >

          <BarChart data={data}>

            <XAxis dataKey="name" />

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