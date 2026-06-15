import { FaCube, FaCoins } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">
        🚀 ManCoin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <FaCube size={30} />

          <h2 className="text-xl mt-4">
            Total Blocks
          </h2>

          <p className="text-3xl font-bold mt-2">
            5
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <FaCoins size={30} />

          <h2 className="text-xl mt-4">
            Mining Rewards
          </h2>

          <p className="text-3xl font-bold mt-2">
            400
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;