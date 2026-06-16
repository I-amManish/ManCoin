import {
  FaChartPie,
  FaCube,
  FaHammer,
  FaExchangeAlt
} from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 p-6">

      <h1 className="text-2xl font-bold mb-10">
        🚀 ManCoin
      </h1>

      <ul className="space-y-6">

        <li>
          <Link
            to="/"
            className="flex items-center gap-3 hover:text-blue-400 transition"
          >
            <FaChartPie />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/explorer"
            className="flex items-center gap-3 hover:text-blue-400 transition"
          >
            <FaCube />
            Explorer
          </Link>
        </li>

        <li>
          <Link
            to="/mine"
            className="flex items-center gap-3 hover:text-blue-400 transition"
          >
            <FaHammer />
            Mine
          </Link>
        </li>

        <li>
          <Link
            to="/transaction"
            className="flex items-center gap-3 hover:text-blue-400 transition"
          >
            <FaExchangeAlt />
            Transaction
          </Link>
        </li>
        <li>
          <Link
            to="/wallet"
            className="flex items-center gap-3"
          >
            <FaWallet />
            Wallet
          </Link>
        </li>

        <li>
  <Link
    to="/wallet-generator"
    className="flex items-center gap-3"
  >
    <FaKey />
    Wallet Generator
  </Link>
</li>

      </ul>

    </div>
  );
}

export default Sidebar;