import {
  FaChartPie,
  FaCube,
  FaHammer,
  FaExchangeAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 p-6">

      <h1 className="text-2xl font-bold mb-10">
        🚀 ManCoin
      </h1>

      <ul className="space-y-6">

        <li className="flex items-center gap-3 cursor-pointer">
          <FaChartPie />
          Dashboard
        </li>

        <li className="flex items-center gap-3 cursor-pointer">
          <FaCube />
          Explorer
        </li>

        <li className="flex items-center gap-3 cursor-pointer">
          <FaHammer />
          Mine
        </li>

        <li className="flex items-center gap-3 cursor-pointer">
          <FaExchangeAlt />
          Transaction
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;